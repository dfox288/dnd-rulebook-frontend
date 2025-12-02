// tests/components/character/builder/StepClass.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import StepClass from '~/components/character/builder/StepClass.vue'
import type { CharacterClass } from '~/types'
import { createMockClass } from '../../../helpers/mockFactories'

// Create mock data
const mockClasses: CharacterClass[] = [
  createMockClass({
    id: 1,
    name: 'Fighter',
    slug: 'fighter',
    hit_die: 10,
    primary_ability: { id: 1, code: 'STR', name: 'Strength' },
    spellcasting_ability: null
  }),
  createMockClass({
    id: 2,
    name: 'Wizard',
    slug: 'wizard',
    hit_die: 6,
    primary_ability: { id: 4, code: 'INT', name: 'Intelligence' },
    spellcasting_ability: { id: 4, code: 'INT', name: 'Intelligence' }
  })
]

// Mock the API fetch function
const mockApiFetch = vi.fn(() => Promise.resolve({ data: mockClasses }))

// Mock useApi composable
mockNuxtImport('useApi', () => {
  return () => ({
    apiFetch: mockApiFetch
  })
})

describe('StepClass', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockApiFetch.mockClear()
  })

  it('renders the step title', async () => {
    const wrapper = await mountSuspended(StepClass)
    expect(wrapper.text()).toContain('Choose Your Class')
  })

  it('renders class picker cards', async () => {
    const wrapper = await mountSuspended(StepClass)
    expect(wrapper.text()).toContain('Fighter')
    expect(wrapper.text()).toContain('Wizard')
  })

  it('shows hit die on cards', async () => {
    const wrapper = await mountSuspended(StepClass)
    expect(wrapper.text()).toContain('d10')
    expect(wrapper.text()).toContain('d6')
  })

  it('filters classes by search query', async () => {
    const wrapper = await mountSuspended(StepClass)
    const searchInput = wrapper.find('input[type="text"]')

    if (searchInput.exists()) {
      await searchInput.setValue('Fighter')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Fighter')
    }
  })
})
