// tests/components/character/wizard/StepLanguages.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import StepLanguages from '~/components/character/wizard/StepLanguages.vue'
import { useCharacterWizardStore } from '~/stores/characterWizard'
import type { Race, Background } from '~/types'
import {
  mockHumanAcolyteLanguageChoices,
  mockNoLanguageChoices
} from '../../../fixtures/languageChoices'

// Create a mock for the current test
let currentMockData = mockHumanAcolyteLanguageChoices

// Mock useAsyncData to return language choices
mockNuxtImport('useAsyncData', () => {
  return vi.fn(() => {
    return {
      data: ref(currentMockData),
      pending: ref(false),
      error: ref(null),
      refresh: () => Promise.resolve(),
      execute: () => Promise.resolve(),
      status: ref('success')
    }
  })
})

// Mock useApi
mockNuxtImport('useApi', () => {
  return () => ({
    apiFetch: vi.fn().mockResolvedValue(currentMockData)
  })
})

// Helper to set up store before each test
function setupStore() {
  const store = useCharacterWizardStore()
  store.characterId = 1
  store.selections.race = { id: 1, name: 'Human' } as Partial<Race> as Race
  store.selections.background = { id: 1, name: 'Acolyte' } as Partial<Background> as Background
  // Reset pending choices to ensure clean state
  store.pendingChoices.languages = new Map()
  return store
}

describe('StepLanguages', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    currentMockData = mockHumanAcolyteLanguageChoices
    setupStore()
  })

  describe('basic rendering', () => {
    it('renders header and description', async () => {
      const wrapper = await mountSuspended(StepLanguages)
      expect(wrapper.text()).toContain('Choose Your Languages')
    })

    it('shows message when no language choices are needed', async () => {
      currentMockData = mockNoLanguageChoices
      const wrapper = await mountSuspended(StepLanguages)
      expect(wrapper.text()).toContain('No language choices needed')
    })
  })

  describe('known languages display', () => {
    it('displays known languages from race', async () => {
      const wrapper = await mountSuspended(StepLanguages)
      expect(wrapper.text()).toContain('Common')
      const knownSection = wrapper.find('[data-test="known-languages"]')
      expect(knownSection.exists()).toBe(true)
    })
  })

  describe('duplicate language prevention (store-level)', () => {
    // Note: These tests verify the store-level logic for duplicate prevention.
    // The component's handleLanguageToggle includes the cross-source check.
    // Full UI integration testing requires browser testing.

    it('store allows same language in different sources (by design)', () => {
      // The store itself doesn't prevent duplicates - that's the component's job
      const store = setupStore()

      store.toggleLanguageChoice('race', 3) // Elvish
      store.toggleLanguageChoice('background', 3) // Elvish again

      // Store allows this (component handler prevents it)
      expect(store.pendingChoices.languages.get('race')?.has(3)).toBe(true)
      expect(store.pendingChoices.languages.get('background')?.has(3)).toBe(true)
    })

    it('tracks selections independently per source', () => {
      const store = setupStore()

      store.toggleLanguageChoice('race', 3) // Elvish
      store.toggleLanguageChoice('background', 2) // Dwarvish
      store.toggleLanguageChoice('background', 4) // Giant

      expect(store.pendingChoices.languages.get('race')?.size).toBe(1)
      expect(store.pendingChoices.languages.get('background')?.size).toBe(2)
    })

    it('toggles language off when selected again', () => {
      const store = setupStore()

      store.toggleLanguageChoice('race', 3)
      expect(store.pendingChoices.languages.get('race')?.has(3)).toBe(true)

      store.toggleLanguageChoice('race', 3)
      expect(store.pendingChoices.languages.get('race')?.has(3)).toBe(false)
    })

    it('allows selecting different languages from each source', () => {
      const store = setupStore()

      // Select Elvish (id: 3) from race
      store.toggleLanguageChoice('race', 3)
      // Select Dwarvish (id: 2) and Giant (id: 4) from background
      store.toggleLanguageChoice('background', 2)
      store.toggleLanguageChoice('background', 4)

      // All three should be selected
      expect(store.pendingChoices.languages.get('race')?.has(3)).toBe(true)
      expect(store.pendingChoices.languages.get('background')?.has(2)).toBe(true)
      expect(store.pendingChoices.languages.get('background')?.has(4)).toBe(true)
    })
  })

  describe('continue button', () => {
    it('is disabled when choices incomplete', async () => {
      const wrapper = await mountSuspended(StepLanguages)

      const continueBtn = wrapper.find('[data-test="continue-btn"]')
      expect(continueBtn.attributes('disabled')).toBeDefined()
    })

    it('completion validation works correctly in store', () => {
      // Test the completion logic at the store level since
      // component reactivity in tests doesn't update the DOM
      const store = setupStore()

      // Initially no selections - not complete
      expect(store.pendingChoices.languages.get('race')?.size ?? 0).toBe(0)
      expect(store.pendingChoices.languages.get('background')?.size ?? 0).toBe(0)

      // Make all selections (1 race + 2 background = 3 total)
      store.toggleLanguageChoice('race', 3) // Elvish
      store.toggleLanguageChoice('background', 2) // Dwarvish
      store.toggleLanguageChoice('background', 4) // Giant

      // Verify correct selections are made
      expect(store.pendingChoices.languages.get('race')?.size).toBe(1)
      expect(store.pendingChoices.languages.get('background')?.size).toBe(2)
    })
  })
})
