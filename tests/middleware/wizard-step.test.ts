import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock the step registry with controllable visibility and skip functions
// Note: Languages and Proficiencies are now always visible, but use shouldSkip for auto-navigation
const mockStepVisibility: Record<string, boolean> = {
  sourcebooks: true,
  name: true,
  race: true,
  subrace: false, // Only visible when race has subraces
  class: true,
  abilities: true,
  background: true,
  languages: true, // Always visible (uses shouldSkip instead)
  proficiencies: true, // Always visible (uses shouldSkip instead)
  equipment: true,
  spells: false, // Only visible for casters
  review: true
}

const mockStepShouldSkip: Record<string, boolean> = {
  languages: true, // Skip when no language choices
  proficiencies: true // Skip when no proficiency choices
}

vi.mock('~/composables/useWizardSteps', () => ({
  stepRegistry: [
    { name: 'sourcebooks', label: 'Sourcebooks', icon: 'i-heroicons-book-open', visible: () => mockStepVisibility.sourcebooks },
    { name: 'name', label: 'Name', icon: 'i-heroicons-user', visible: () => mockStepVisibility.name },
    { name: 'race', label: 'Race', icon: 'i-heroicons-globe-alt', visible: () => mockStepVisibility.race },
    { name: 'subrace', label: 'Subrace', icon: 'i-heroicons-sparkles', visible: () => mockStepVisibility.subrace },
    { name: 'class', label: 'Class', icon: 'i-heroicons-shield-check', visible: () => mockStepVisibility.class },
    { name: 'abilities', label: 'Abilities', icon: 'i-heroicons-chart-bar', visible: () => mockStepVisibility.abilities },
    { name: 'background', label: 'Background', icon: 'i-heroicons-book-open', visible: () => mockStepVisibility.background },
    { name: 'languages', label: 'Languages', icon: 'i-heroicons-language', visible: () => mockStepVisibility.languages, shouldSkip: () => mockStepShouldSkip.languages },
    { name: 'proficiencies', label: 'Proficiencies', icon: 'i-heroicons-academic-cap', visible: () => mockStepVisibility.proficiencies, shouldSkip: () => mockStepShouldSkip.proficiencies },
    { name: 'equipment', label: 'Equipment', icon: 'i-heroicons-briefcase', visible: () => mockStepVisibility.equipment },
    { name: 'spells', label: 'Spells', icon: 'i-heroicons-sparkles', visible: () => mockStepVisibility.spells },
    { name: 'review', label: 'Review', icon: 'i-heroicons-check-circle', visible: () => mockStepVisibility.review }
  ]
}))

// Mock Nuxt's auto-imports
vi.mock('#app', () => ({
  defineNuxtRouteMiddleware: (fn: any) => fn,
  navigateTo: vi.fn()
}))

describe('wizard-step middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    // Reset all step visibility to defaults
    mockStepVisibility.sourcebooks = true
    mockStepVisibility.name = true
    mockStepVisibility.race = true
    mockStepVisibility.subrace = false // Only visible when race has subraces
    mockStepVisibility.class = true
    mockStepVisibility.abilities = true
    mockStepVisibility.background = true
    mockStepVisibility.languages = true // Always visible (uses shouldSkip)
    mockStepVisibility.proficiencies = true // Always visible (uses shouldSkip)
    mockStepVisibility.equipment = true
    mockStepVisibility.spells = false // Only visible for casters
    mockStepVisibility.review = true

    // Reset shouldSkip to defaults
    mockStepShouldSkip.languages = true // Skip when no language choices
    mockStepShouldSkip.proficiencies = true // Skip when no proficiency choices
  })

  describe('isStepAccessible', () => {
    describe('always-visible steps', () => {
      it('returns true for sourcebooks step', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('sourcebooks')).toBe(true)
      })

      it('returns true for name step', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('name')).toBe(true)
      })

      it('returns true for race step', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('race')).toBe(true)
      })

      it('returns true for class step', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('class')).toBe(true)
      })

      it('returns true for abilities step', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('abilities')).toBe(true)
      })

      it('returns true for background step', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('background')).toBe(true)
      })

      it('returns true for equipment step', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('equipment')).toBe(true)
      })

      it('returns true for review step', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('review')).toBe(true)
      })
    })

    describe('conditional spells step', () => {
      it('returns false when not a caster', async () => {
        mockStepVisibility.spells = false
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('spells')).toBe(false)
      })

      it('returns true when character is a caster', async () => {
        mockStepVisibility.spells = true
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('spells')).toBe(true)
      })
    })

    describe('always-visible languages step', () => {
      it('returns true for languages step (always visible, uses shouldSkip for navigation)', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('languages')).toBe(true)
      })
    })

    describe('always-visible proficiencies step', () => {
      it('returns true for proficiencies step (always visible, uses shouldSkip for navigation)', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('proficiencies')).toBe(true)
      })
    })

    describe('conditional subrace step', () => {
      it('returns false when race does not need subrace', async () => {
        mockStepVisibility.subrace = false
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('subrace')).toBe(false)
      })

      it('returns true when race needs subrace', async () => {
        mockStepVisibility.subrace = true
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('subrace')).toBe(true)
      })
    })

    describe('unknown steps', () => {
      it('returns false for unknown step name', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('unknown-step')).toBe(false)
      })

      it('returns false for empty step name', async () => {
        const { isStepAccessible } = await import('~/middleware/wizard-step')
        expect(isStepAccessible('')).toBe(false)
      })
    })
  })
})
