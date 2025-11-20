import { ref } from 'vue'
import type { SearchResult, EntityType, SearchOptions } from '~/types/search'

/**
 * Composable for searching D&D 5e entities
 *
 * Provides reactive state management for search operations including
 * loading states, error handling, and result caching
 *
 * @example
 * const { search, results, loading, error } = useSearch()
 * await search('fireball', { limit: 5 })
 */
export const useSearch = () => {
  const config = useRuntimeConfig()
  const results = ref<SearchResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Perform a search query against the D&D 5e API
   *
   * @param query - The search term (minimum 1 character after trimming)
   * @param options - Optional search parameters (entity types, result limit)
   */
  const search = async (
    query: string,
    options?: SearchOptions
  ): Promise<void> => {
    const trimmedQuery = query.trim()

    // Clear results if query is empty
    if (!trimmedQuery) {
      results.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      // Build query parameters
      const params: Record<string, any> = { q: trimmedQuery }

      if (options?.types) {
        params.types = options.types
      }

      if (options?.limit) {
        params.limit = options.limit
      }

      // Fetch results from API
      const data = await $fetch<SearchResult>(`${config.public.apiBase}/search`, {
        query: params,
      })

      results.value = data
    } catch (err: any) {
      error.value = err.message || 'Search failed'
      results.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear all search results and errors
   */
  const clearResults = () => {
    results.value = null
    error.value = null
  }

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  }
}
