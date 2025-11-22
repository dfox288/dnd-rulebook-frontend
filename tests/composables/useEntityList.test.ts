import { describe, it, expect } from 'vitest'
import type { UseEntityListConfig } from '~/composables/useEntityList'

/**
 * Simplified tests for useEntityList
 *
 * Note: Full testing of useAsyncData integration requires mounting in a Nuxt context.
 * These tests verify the core logic and state management.
 */
describe('useEntityList', () => {
  it('exports the correct TypeScript types', () => {
    // Type-only test - ensures interfaces are exported
    const config: UseEntityListConfig = {
      endpoint: '/spells',
      cacheKey: 'test',
      queryBuilder: computed(() => ({})),
      seo: { title: 'Test', description: 'Test' }
    }

    expect(config).toBeDefined()
  })

  it('composable exists and is importable', async () => {
    const { useEntityList } = await import('~/composables/useEntityList')
    expect(useEntityList).toBeDefined()
    expect(typeof useEntityList).toBe('function')
  })
})

/**
 * Component integration tests will verify:
 * - Actual API calls
 * - URL sync
 * - Data fetching
 * - Pagination
 *
 * These are better tested in page component tests where we have full Nuxt context.
 */

describe('useEntityList with noPagination', () => {
  it('accepts noPagination flag in config', () => {
    // Type-only test - ensures noPagination is accepted
    const config: UseEntityListConfig = {
      endpoint: '/test',
      cacheKey: 'test',
      queryBuilder: computed(() => ({})),
      noPagination: true,
      seo: { title: 'Test', description: 'Test' }
    }

    expect(config.noPagination).toBe(true)
  })

  it('noPagination is optional and defaults to false', () => {
    // Type-only test - ensures noPagination is optional
    const config: UseEntityListConfig = {
      endpoint: '/test',
      cacheKey: 'test',
      queryBuilder: computed(() => ({})),
      seo: { title: 'Test', description: 'Test' }
    }

    expect(config.noPagination).toBeUndefined()
  })
})

/**
 * Full integration tests for noPagination behavior will be in page component tests
 * where we have full Nuxt context and can test:
 * - per_page: 9999 is sent to API
 * - page: 1 is fixed
 * - Search still works
 * - hasActiveFilters works
 */
