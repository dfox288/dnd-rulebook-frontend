import { logger } from '~/utils/logger'

interface WizardErrorOptions {
  title?: string
  description?: string
  logContext?: string
}

/**
 * Standard error handler for wizard operations
 * Logs error and shows toast notification
 *
 * @example
 * ```typescript
 * import { handleWizardError } from '~/utils/wizardErrors'
 *
 * try {
 *   await store.selectRace(race)
 * } catch (err) {
 *   handleWizardError(err, toast, { logContext: 'Failed to select race' })
 * }
 * ```
 */
export function handleWizardError(
  error: unknown,
  toast: ReturnType<typeof useToast>,
  options: WizardErrorOptions = {}
) {
  const {
    title = 'Save Failed',
    description = 'Unable to save your selection. Please try again.',
    logContext = 'Wizard error'
  } = options

  logger.error(`${logContext}:`, error)

  toast.add({
    title,
    description,
    color: 'error',
    icon: 'i-heroicons-exclamation-circle'
  })
}

/**
 * Pre-configured error handlers for common wizard operations
 *
 * @example
 * ```typescript
 * import { wizardErrors } from '~/utils/wizardErrors'
 *
 * // For save operations
 * catch (err) {
 *   wizardErrors.saveFailed(err, toast)
 * }
 *
 * // For load operations
 * catch (err) {
 *   wizardErrors.loadFailed(err, toast, 'races')
 * }
 *
 * // For choice resolution
 * catch (err) {
 *   wizardErrors.choiceResolveFailed(err, toast, 'proficiency')
 * }
 * ```
 */
export const wizardErrors = {
  /**
   * Handle save operation failures
   */
  saveFailed: (error: unknown, toast: ReturnType<typeof useToast>) =>
    handleWizardError(error, toast, { logContext: 'Failed to save selection' }),

  /**
   * Handle entity load failures
   */
  loadFailed: (error: unknown, toast: ReturnType<typeof useToast>, entity: string) =>
    handleWizardError(error, toast, {
      title: `Failed to load ${entity}`,
      description: 'Please try again or refresh the page.',
      logContext: `Failed to load ${entity}`
    }),

  /**
   * Handle choice resolution failures
   */
  choiceResolveFailed: (error: unknown, toast: ReturnType<typeof useToast>, choiceType: string) =>
    handleWizardError(error, toast, {
      title: `Failed to save ${choiceType}`,
      description: 'Please try again.',
      logContext: `Failed to resolve ${choiceType} choice`
    })
}
