// tests/composables/useLevelUpWizard.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'

// =============================================================================
// MOCK SETUP
// =============================================================================

const mockGoToStep = vi.fn()

// Create reactive refs that tests can modify
const mockLevelUpResult = ref<unknown>(null)
const mockNeedsClassSelection = ref(true)
const mockCurrentStepName = ref('class-selection')

vi.mock('~/stores/characterLevelUp', () => ({
  useCharacterLevelUpStore: vi.fn(() => ({
    // Return refs directly - Pinia stores expose refs that way
    get levelUpResult() { return mockLevelUpResult.value },
    get needsClassSelection() { return mockNeedsClassSelection.value },
    get currentStepName() { return mockCurrentStepName.value },
    goToStep: mockGoToStep
  }))
}))

// Import composable AFTER mocks
// eslint-disable-next-line import/first
import { useLevelUpWizard } from '~/composables/useLevelUpWizard'

// =============================================================================
// TESTS
// =============================================================================

describe('useLevelUpWizard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // Reset mock refs
    mockLevelUpResult.value = null
    mockNeedsClassSelection.value = true
    mockCurrentStepName.value = 'class-selection'
  })

  describe('stepRegistry', () => {
    it('provides step definitions', () => {
      const { stepRegistry } = useLevelUpWizard()

      expect(stepRegistry).toBeDefined()
      expect(stepRegistry.length).toBeGreaterThan(0)
    })

    it('has class-selection as first step', () => {
      const { stepRegistry } = useLevelUpWizard()

      expect(stepRegistry[0].name).toBe('class-selection')
    })

    it('has summary as last step', () => {
      const { stepRegistry } = useLevelUpWizard()

      const lastStep = stepRegistry[stepRegistry.length - 1]
      expect(lastStep.name).toBe('summary')
    })

    it('includes hit-points step', () => {
      const { stepRegistry } = useLevelUpWizard()

      const hpStep = stepRegistry.find(s => s.name === 'hit-points')
      expect(hpStep).toBeDefined()
      expect(hpStep?.label).toBe('Hit Points')
    })

    it('includes asi-feat step', () => {
      const { stepRegistry } = useLevelUpWizard()

      const asiStep = stepRegistry.find(s => s.name === 'asi-feat')
      expect(asiStep).toBeDefined()
      expect(asiStep?.label).toBe('ASI / Feat')
    })
  })

  describe('activeSteps', () => {
    it('filters steps by visibility', () => {
      mockNeedsClassSelection.value = true
      const { activeSteps } = useLevelUpWizard()

      // Class selection should be visible when needsClassSelection is true
      const classStep = activeSteps.value.find(s => s.name === 'class-selection')
      expect(classStep).toBeDefined()
    })

    it('excludes class-selection when not needed', () => {
      mockNeedsClassSelection.value = false
      const { activeSteps } = useLevelUpWizard()

      const classStep = activeSteps.value.find(s => s.name === 'class-selection')
      expect(classStep).toBeUndefined()
    })
  })

  describe('currentStepIndex', () => {
    it('returns correct index for current step', () => {
      mockNeedsClassSelection.value = true
      mockCurrentStepName.value = 'class-selection'
      const { currentStepIndex } = useLevelUpWizard()

      expect(currentStepIndex.value).toBe(0)
    })

    it('returns -1 for invalid step', () => {
      mockCurrentStepName.value = 'nonexistent-step'
      const { currentStepIndex } = useLevelUpWizard()

      expect(currentStepIndex.value).toBe(-1)
    })
  })

  describe('currentStep', () => {
    it('returns current step object', () => {
      mockNeedsClassSelection.value = true
      mockCurrentStepName.value = 'class-selection'
      const { currentStep } = useLevelUpWizard()

      expect(currentStep.value?.name).toBe('class-selection')
      expect(currentStep.value?.label).toBe('Class')
    })
  })

  describe('progress tracking', () => {
    it('calculates totalSteps correctly', () => {
      mockNeedsClassSelection.value = true
      const { totalSteps } = useLevelUpWizard()

      // Should have at least class-selection, hit-points, and summary
      expect(totalSteps.value).toBeGreaterThanOrEqual(3)
    })

    it('calculates progressPercent', () => {
      mockNeedsClassSelection.value = true
      mockCurrentStepName.value = 'class-selection'
      const { progressPercent } = useLevelUpWizard()

      // First step should be 0%
      expect(progressPercent.value).toBe(0)
    })

    it('isFirstStep returns true on first step', () => {
      mockNeedsClassSelection.value = true
      mockCurrentStepName.value = 'class-selection'
      const { isFirstStep } = useLevelUpWizard()

      expect(isFirstStep.value).toBe(true)
    })

    it('isLastStep returns true on summary step', () => {
      mockCurrentStepName.value = 'summary'
      const { isLastStep } = useLevelUpWizard()

      expect(isLastStep.value).toBe(true)
    })
  })

  describe('navigation', () => {
    it('nextStep calls goToStep with next step name', () => {
      mockNeedsClassSelection.value = true
      mockCurrentStepName.value = 'class-selection'
      const { nextStep } = useLevelUpWizard()

      nextStep()

      expect(mockGoToStep).toHaveBeenCalled()
    })

    it('previousStep calls goToStep with previous step name', () => {
      mockNeedsClassSelection.value = true
      mockCurrentStepName.value = 'hit-points'
      const { previousStep } = useLevelUpWizard()

      previousStep()

      expect(mockGoToStep).toHaveBeenCalled()
    })

    it('goToStep delegates to store', () => {
      const { goToStep } = useLevelUpWizard()

      goToStep('summary')

      expect(mockGoToStep).toHaveBeenCalledWith('summary')
    })
  })
})
