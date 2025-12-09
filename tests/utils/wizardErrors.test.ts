import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleWizardError, wizardErrors } from '~/utils/wizardErrors'

// Mock the logger
vi.mock('~/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  }
}))

// Import the mocked logger
import { logger } from '~/utils/logger'

describe('wizardErrors', () => {
  let mockToast: ReturnType<typeof useToast>

  beforeEach(() => {
    vi.clearAllMocks()
    mockToast = {
      add: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      toasts: { value: [] }
    } as unknown as ReturnType<typeof useToast>
  })

  describe('handleWizardError', () => {
    it('logs error with default context', () => {
      const error = new Error('Test error')

      handleWizardError(error, mockToast)

      expect(logger.error).toHaveBeenCalledWith('Wizard error:', error)
    })

    it('logs error with custom context', () => {
      const error = new Error('Test error')

      handleWizardError(error, mockToast, { logContext: 'Custom context' })

      expect(logger.error).toHaveBeenCalledWith('Custom context:', error)
    })

    it('shows toast with default title and description', () => {
      handleWizardError(new Error('Test'), mockToast)

      expect(mockToast.add).toHaveBeenCalledWith({
        title: 'Save Failed',
        description: 'Unable to save your selection. Please try again.',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      })
    })

    it('shows toast with custom title and description', () => {
      handleWizardError(new Error('Test'), mockToast, {
        title: 'Custom Title',
        description: 'Custom description'
      })

      expect(mockToast.add).toHaveBeenCalledWith({
        title: 'Custom Title',
        description: 'Custom description',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      })
    })

    it('handles non-Error objects', () => {
      const error = { message: 'String error' }

      handleWizardError(error, mockToast)

      expect(logger.error).toHaveBeenCalledWith('Wizard error:', error)
      expect(mockToast.add).toHaveBeenCalled()
    })

    it('handles string errors', () => {
      handleWizardError('String error', mockToast)

      expect(logger.error).toHaveBeenCalledWith('Wizard error:', 'String error')
      expect(mockToast.add).toHaveBeenCalled()
    })
  })

  describe('wizardErrors.saveFailed', () => {
    it('logs with save-specific context', () => {
      const error = new Error('Save failed')

      wizardErrors.saveFailed(error, mockToast)

      expect(logger.error).toHaveBeenCalledWith('Failed to save selection:', error)
    })

    it('shows default save failed toast', () => {
      wizardErrors.saveFailed(new Error('Test'), mockToast)

      expect(mockToast.add).toHaveBeenCalledWith({
        title: 'Save Failed',
        description: 'Unable to save your selection. Please try again.',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      })
    })
  })

  describe('wizardErrors.loadFailed', () => {
    it('logs with entity-specific context', () => {
      const error = new Error('Load failed')

      wizardErrors.loadFailed(error, mockToast, 'races')

      expect(logger.error).toHaveBeenCalledWith('Failed to load races:', error)
    })

    it('shows entity-specific load failed toast', () => {
      wizardErrors.loadFailed(new Error('Test'), mockToast, 'classes')

      expect(mockToast.add).toHaveBeenCalledWith({
        title: 'Failed to load classes',
        description: 'Please try again or refresh the page.',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      })
    })

    it('handles different entity names', () => {
      wizardErrors.loadFailed(new Error('Test'), mockToast, 'backgrounds')

      expect(mockToast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Failed to load backgrounds'
        })
      )
    })
  })

  describe('wizardErrors.choiceResolveFailed', () => {
    it('logs with choice-specific context', () => {
      const error = new Error('Choice failed')

      wizardErrors.choiceResolveFailed(error, mockToast, 'proficiency')

      expect(logger.error).toHaveBeenCalledWith('Failed to resolve proficiency choice:', error)
    })

    it('shows choice-specific failed toast', () => {
      wizardErrors.choiceResolveFailed(new Error('Test'), mockToast, 'language')

      expect(mockToast.add).toHaveBeenCalledWith({
        title: 'Failed to save language',
        description: 'Please try again.',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      })
    })

    it('handles different choice types', () => {
      wizardErrors.choiceResolveFailed(new Error('Test'), mockToast, 'equipment')

      expect(mockToast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Failed to save equipment'
        })
      )
    })
  })
})
