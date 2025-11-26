import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Composable for syncing filter state with URL query parameters.
 *
 * Provides utilities for:
 * - Checking if URL has filter params
 * - Updating URL from store state
 * - Clearing URL params
 *
 * @example
 * ```typescript
 * const { hasUrlParams, syncToUrl, clearUrl } = useFilterUrlSync()
 *
 * // Check if should restore from URL or storage
 * onMounted(() => {
 *   if (hasUrlParams.value) {
 *     store.setFromUrlQuery(route.query)
 *   }
 * })
 *
 * // Sync store changes to URL
 * watch(() => store.toUrlQuery, (query) => {
 *   syncToUrl(query)
 * }, { deep: true })
 * ```
 */
export function useFilterUrlSync() {
  const route = useRoute()
  const router = useRouter()

  /** Whether the current URL has any query parameters */
  const hasUrlParams = computed(() => {
    return Object.keys(route.query).length > 0
  })

  /**
   * Update URL with the given query object.
   * Empty/null values are filtered out.
   * Uses replace() to avoid polluting browser history.
   */
  const syncToUrl = (query: Record<string, string | string[] | null | undefined>) => {
    const cleanQuery: Record<string, string | string[]> = {}

    for (const [key, value] of Object.entries(query)) {
      // Skip null, undefined, empty strings, empty arrays
      if (value === null || value === undefined) continue
      if (value === '') continue
      if (Array.isArray(value) && value.length === 0) continue

      cleanQuery[key] = value
    }

    router.replace({ query: cleanQuery })
  }

  /** Clear all URL query parameters */
  const clearUrl = () => {
    router.replace({ query: {} })
  }

  return {
    hasUrlParams,
    syncToUrl,
    clearUrl
  }
}
