// app/composables/useWizardSteps.ts
import { useCharacterBuilderStore } from '~/stores/characterBuilder'

export interface WizardStep {
  name: string
  label: string
  icon: string
  /**
   * Whether this step should appear in the wizard navigation.
   * Use for "fundamentally conditional" steps (e.g., subrace only if race has subraces).
   */
  visible: () => boolean
  /**
   * Whether this step should be auto-skipped during navigation.
   * Use for steps that may have no work to do (e.g., no language choices to make).
   * When true, nextStep/previousStep will skip over this step.
   */
  shouldSkip?: () => boolean
}

/**
 * Step registry - single source of truth for wizard steps
 * Order matters: steps appear in this order in the wizard
 *
 * Architecture notes:
 * - `visible`: Controls if step appears in the wizard (true = always show)
 * - `shouldSkip`: Controls auto-skip during navigation (true = skip to next)
 *
 * Two types of conditional steps:
 * 1. "Fundamentally conditional" (subrace, spells): Use visible()
 *    - Only show when conceptually applicable
 * 2. "Sometimes empty" (languages, proficiencies): Use shouldSkip()
 *    - Always visible, but skip if no choices to make
 */
export const stepRegistry: WizardStep[] = [
  {
    name: 'sourcebooks',
    label: 'Sourcebooks',
    icon: 'i-heroicons-book-open',
    visible: () => true
  },
  {
    name: 'name',
    label: 'Name',
    icon: 'i-heroicons-user',
    visible: () => true
  },
  {
    name: 'race',
    label: 'Race',
    icon: 'i-heroicons-globe-alt',
    visible: () => true
  },
  {
    name: 'subrace',
    label: 'Subrace',
    icon: 'i-heroicons-sparkles',
    // Only visible when race has subraces (fundamentally conditional)
    visible: () => {
      const store = useCharacterBuilderStore()
      return store.needsSubrace
    }
  },
  {
    name: 'class',
    label: 'Class',
    icon: 'i-heroicons-shield-check',
    visible: () => true
  },
  {
    name: 'abilities',
    label: 'Abilities',
    icon: 'i-heroicons-chart-bar',
    visible: () => true
  },
  {
    name: 'background',
    label: 'Background',
    icon: 'i-heroicons-book-open',
    visible: () => true
  },
  {
    name: 'languages',
    label: 'Languages',
    icon: 'i-heroicons-language',
    // Always visible in wizard
    visible: () => true,
    // Skip during navigation if no choices to make
    shouldSkip: () => {
      const store = useCharacterBuilderStore()
      return !store.hasLanguageChoices
    }
  },
  {
    name: 'proficiencies',
    label: 'Proficiencies',
    icon: 'i-heroicons-academic-cap',
    // Always visible in wizard
    visible: () => true,
    // Skip during navigation if no choices to make
    shouldSkip: () => {
      const store = useCharacterBuilderStore()
      return !store.hasPendingChoices
    }
  },
  {
    name: 'equipment',
    label: 'Equipment',
    icon: 'i-heroicons-briefcase',
    visible: () => true
  },
  {
    name: 'spells',
    label: 'Spells',
    icon: 'i-heroicons-sparkles',
    // Only visible for casters (fundamentally conditional)
    visible: () => {
      const store = useCharacterBuilderStore()
      return store.isCaster
    }
  },
  {
    name: 'review',
    label: 'Review',
    icon: 'i-heroicons-check-circle',
    visible: () => true
  }
]

/**
 * Extract step name from route path
 * Handles both /characters/42/edit/race and /characters/42/edit/race?query=param
 * Returns 'sourcebooks' as default if no step found (first step)
 */
function extractStepFromPath(path: string): string {
  // Match pattern: /characters/{id}/edit/{step}
  const match = path.match(/\/characters\/\d+\/edit\/([^/?]+)/)
  return match?.[1] || 'sourcebooks'
}

/**
 * Composable for wizard navigation
 * Uses route path to track current step instead of store state
 *
 * This composable should be used in the wizard parent layout to manage
 * navigation between steps. Each step becomes a nested route.
 */
export function useWizardNavigation() {
  const route = useRoute()
  const store = useCharacterBuilderStore()

  // Filter registry to only visible steps (computed so it reacts to store changes)
  const activeSteps = computed(() =>
    stepRegistry.filter(step => step.visible())
  )

  // Current step name extracted from route path (not params)
  // This works with static nested route files like edit/race.vue, edit/name.vue
  const currentStepName = computed(() =>
    extractStepFromPath(route.path)
  )

  // Current step index within active steps
  const currentStepIndex = computed(() =>
    activeSteps.value.findIndex(s => s.name === currentStepName.value)
  )

  // Current step object
  const currentStep = computed(() =>
    activeSteps.value[currentStepIndex.value]
  )

  // Navigation helpers
  const totalSteps = computed(() => activeSteps.value.length)
  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(() => currentStepIndex.value === totalSteps.value - 1)

  /**
   * Check if a step should be navigated to.
   * A step is navigable if it's visible AND not marked for skipping.
   */
  function isStepNavigable(step: WizardStep): boolean {
    return step.visible() && !(step.shouldSkip?.() ?? false)
  }

  // Navigation functions
  /**
   * Navigate to the next step in the wizard.
   *
   * Finds the next step that is both visible AND not shouldSkip.
   * This handles:
   * - Steps that should be auto-skipped (e.g., no language choices)
   * - Edge cases where current step became invisible after save
   */
  async function nextStep() {
    const currentName = currentStepName.value
    const registryIndex = stepRegistry.findIndex(s => s.name === currentName)

    if (registryIndex >= 0) {
      // Look for the next navigable step after current position
      for (let i = registryIndex + 1; i < stepRegistry.length; i++) {
        const step = stepRegistry[i]
        if (step && isStepNavigable(step)) {
          await navigateTo(`/characters/${store.characterId}/edit/${step.name}`)
          return
        }
      }
    }
  }

  /**
   * Navigate to the previous step in the wizard.
   *
   * Finds the previous step that is both visible AND not shouldSkip.
   */
  async function previousStep() {
    const currentName = currentStepName.value
    const registryIndex = stepRegistry.findIndex(s => s.name === currentName)

    if (registryIndex > 0) {
      // Look for the previous navigable step before current position
      for (let i = registryIndex - 1; i >= 0; i--) {
        const step = stepRegistry[i]
        if (step && isStepNavigable(step)) {
          await navigateTo(`/characters/${store.characterId}/edit/${step.name}`)
          return
        }
      }
    }
  }

  async function goToStep(stepName: string) {
    const step = activeSteps.value.find(s => s.name === stepName)
    if (step) {
      await navigateTo(`/characters/${store.characterId}/edit/${stepName}`)
    }
  }

  return {
    stepRegistry,
    activeSteps,
    currentStep,
    currentStepName,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    goToStep
  }
}
