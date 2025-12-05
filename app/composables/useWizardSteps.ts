// app/composables/useWizardSteps.ts
import { useCharacterBuilderStore } from '~/stores/characterBuilder'

export interface WizardStep {
  name: string
  label: string
  icon: string
  visible: () => boolean
}

/**
 * Step registry - single source of truth for wizard steps
 * Order matters: steps appear in this order in the wizard
 *
 * Note: Uses functions for visibility checks so they're evaluated
 * at runtime based on current store state
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
    visible: () => {
      const store = useCharacterBuilderStore()
      return store.hasLanguageChoices
    }
  },
  {
    name: 'proficiencies',
    label: 'Proficiencies',
    icon: 'i-heroicons-academic-cap',
    visible: () => {
      const store = useCharacterBuilderStore()
      return store.hasPendingChoices
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

  // Navigation functions
  /**
   * Navigate to the next step in the wizard.
   *
   * Uses stepRegistry order (not activeSteps) to find the next visible step.
   * This handles the edge case where the current step becomes invisible
   * after saving (e.g., proficiency choices completed → step hidden).
   *
   * When currentStepIndex is -1 (step not in activeSteps), we fall back
   * to finding the current step in stepRegistry and look for the next
   * visible step from there.
   */
  async function nextStep() {
    // If current step is in activeSteps, use the simple path
    if (currentStepIndex.value >= 0) {
      const nextIndex = currentStepIndex.value + 1
      const next = activeSteps.value[nextIndex]
      if (next) {
        await navigateTo(`/characters/${store.characterId}/edit/${next.name}`)
        return
      }
    }

    // Fallback: current step is not in activeSteps (became invisible after save)
    // Find current step in full registry and get next visible step
    const currentName = currentStepName.value
    const registryIndex = stepRegistry.findIndex(s => s.name === currentName)

    if (registryIndex >= 0) {
      // Look for the next visible step after current position in registry
      for (let i = registryIndex + 1; i < stepRegistry.length; i++) {
        const step = stepRegistry[i]
        if (step && step.visible()) {
          await navigateTo(`/characters/${store.characterId}/edit/${step.name}`)
          return
        }
      }
    }
  }

  /**
   * Navigate to the previous step in the wizard.
   *
   * Uses stepRegistry order to handle edge cases where current step
   * is not in activeSteps.
   */
  async function previousStep() {
    // If current step is in activeSteps, use the simple path
    if (currentStepIndex.value >= 0) {
      const prevIndex = currentStepIndex.value - 1
      const prev = activeSteps.value[prevIndex]
      if (prev) {
        await navigateTo(`/characters/${store.characterId}/edit/${prev.name}`)
        return
      }
    }

    // Fallback: find previous visible step in registry
    const currentName = currentStepName.value
    const registryIndex = stepRegistry.findIndex(s => s.name === currentName)

    if (registryIndex > 0) {
      // Look for the previous visible step before current position
      for (let i = registryIndex - 1; i >= 0; i--) {
        const step = stepRegistry[i]
        if (step && step.visible()) {
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
