// app/middleware/wizard-step.ts
// Route guard that prevents access to conditional wizard steps when conditions aren't met
import { stepRegistry } from '~/composables/useWizardSteps'

/**
 * Check if a step is accessible
 * Exported for testing purposes
 */
export function isStepAccessible(stepName: string): boolean {
  const step = stepRegistry.find(s => s.name === stepName)
  // Step exists AND is currently visible
  return !!step && step.visible()
}

export default defineNuxtRouteMiddleware((to) => {
  const stepName = to.params.step as string
  const characterId = to.params.id

  if (!isStepAccessible(stepName)) {
    return navigateTo(`/characters/${characterId}/edit/name`)
  }

  // Step exists and is visible - allow navigation
})
