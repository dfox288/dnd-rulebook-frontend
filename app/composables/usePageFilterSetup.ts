import type { LocationQuery } from 'vue-router'

/**
 * Interface for filter stores compatible with this composable.
 * All entity filter stores created by createEntityFilterStore satisfy this interface.
 */
export interface FilterStore {
  /** Computed query object for URL sync */
  toUrlQuery: Record<string, string | string[]>
  /** Action to populate store from URL query */
  setFromUrlQuery: (query: LocationQuery) => void
  /** Action to reset all filters to defaults */
  clearAll: () => void
}

/**
 * Composable that handles page-level filter setup with URL synchronization.
 *
 * This composable:
 * 1. On mount: Restores filter state from URL params (if present)
 * 2. Watches store changes and syncs to URL (debounced 300ms)
 * 3. Provides clearFilters function for resetting state and URL
 *
 * @param store - A filter store with toUrlQuery, setFromUrlQuery, and clearAll
 * @returns { clearFilters } - Function to clear all filters and URL
 *
 * @example
 * ```typescript
 * const store = useSpellFiltersStore()
 * const { clearFilters } = usePageFilterSetup(store)
 * ```
 */
export function usePageFilterSetup(store: FilterStore) {
  const route = useRoute()
  const { hasUrlParams, syncToUrl, clearUrl } = useFilterUrlSync()

  // On mount: URL params override persisted state
  onMounted(() => {
    if (hasUrlParams.value) {
      store.setFromUrlQuery(route.query)
    }
  })

  // Sync store changes to URL (debounced 300ms)
  let urlSyncTimeout: ReturnType<typeof setTimeout> | null = null
  watch(
    () => store.toUrlQuery,
    (query) => {
      if (urlSyncTimeout) clearTimeout(urlSyncTimeout)
      urlSyncTimeout = setTimeout(() => {
        syncToUrl(query)
      }, 300)
    },
    { deep: true }
  )

  // Clear filters action - resets store and URL
  const clearFilters = () => {
    store.clearAll()
    clearUrl()
  }

  return { clearFilters }
}
