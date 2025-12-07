/**
 * Development-only logger utility
 *
 * Wraps console methods to only log in development mode.
 * In production, logs are silently suppressed to keep the console clean.
 *
 * @example
 * ```typescript
 * import { logger } from '~/utils/logger'
 *
 * logger.error('Failed to save:', err)
 * logger.warn('Collision detected, retrying...')
 * logger.info('Operation completed')
 * ```
 */

const isDev = import.meta.dev

export const logger = {
  /**
   * Log error messages (dev only)
   */
  error: (message: string, ...args: unknown[]): void => {
    if (isDev) console.error(message, ...args)
  },

  /**
   * Log warning messages (dev only)
   */
  warn: (message: string, ...args: unknown[]): void => {
    if (isDev) console.warn(message, ...args)
  },

  /**
   * Log info messages (dev only)
   */
  info: (message: string, ...args: unknown[]): void => {
    if (isDev) console.info(message, ...args)
  },

  /**
   * Log debug messages (dev only)
   */
  debug: (message: string, ...args: unknown[]): void => {
    if (isDev) console.debug(message, ...args)
  }
}
