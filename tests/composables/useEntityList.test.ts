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
  it('sets per_page to 9999 when noPagination is true', async () => {
    const { result } = await mountComposable(() =>
      useEntityList({
        endpoint: '/test',
        cacheKey: 'test',
        queryBuilder: computed(() => ({})),
        noPagination: true,
        seo: { title: 'Test', description: 'Test' }
      })
    )

    // Assert query params include per_page: 9999
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/test',
      expect.objectContaining({
        query: expect.objectContaining({ per_page: 9999 })
      })
    )
  })

  it('still applies search filter with noPagination', async () => {
    const { result } = await mountComposable(() =>
      useEntityList({
        endpoint: '/test',
        cacheKey: 'test',
        queryBuilder: computed(() => ({})),
        noPagination: true,
        seo: { title: 'Test', description: 'Test' }
      })
    )

    result.searchQuery.value = 'test query'
    await nextTick()

    expect(mockApiFetch).toHaveBeenCalledWith(
      '/test',
      expect.objectContaining({
        query: expect.objectContaining({
          q: 'test query',
          per_page: 9999
        })
      })
    )
  })

  it('hasActiveFilters works with noPagination', async () => {
    const { result } = await mountComposable(() =>
      useEntityList({
        endpoint: '/test',
        cacheKey: 'test',
        queryBuilder: computed(() => ({})),
        noPagination: true,
        seo: { title: 'Test', description: 'Test' }
      })
    )

    expect(result.hasActiveFilters.value).toBe(false)

    result.searchQuery.value = 'test'
    await nextTick()

    expect(result.hasActiveFilters.value).toBe(true)
  })
})
