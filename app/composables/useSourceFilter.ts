import { ref, computed } from 'vue'
import type { Source } from '~/types'

/**
 * Composable for managing source filter state and options.
 *
 * Provides:
 * - selectedSources ref (initialized from route query)
 * - sourceOptions computed (for UiFilterMultiSelect)
 * - getSourceName helper (for filter chips)
 * - sources ref (raw data)
 *
 * @example
 * ```typescript
 * const { selectedSources, sourceOptions, getSourceName, sources } = useSourceFilter()
 *
 * // Use in useMeilisearchFilters:
 * useMeilisearchFilters([
 *   { ref: selectedSources, field: 'source_codes', type: 'in' }
 * ])
 *
 * // Use in template:
 * <UiFilterMultiSelect v-model="selectedSources" :options="sourceOptions" />
 * ```
 *
 * @param options.transform - Optional transform function to filter sources
 */
export function useSourceFilter(options?: {
  transform?: (sources: Source[]) => Source[]
}) {
  const route = useRoute()

  // Initialize from route query
  const selectedSources = ref<string[]>(
    route.query.source
      ? (Array.isArray(route.query.source)
          ? route.query.source
          : [route.query.source]) as string[]
      : []
  )

  // Fetch sources from API
  const { data: sources } = useReferenceData<Source>('/sources', {
    transform: options?.transform
  })

  // Computed options for UiFilterMultiSelect
  const sourceOptions = computed(() => {
    if (!sources.value) return []
    return sources.value.map(source => ({
      label: source.name,
      value: source.code
    }))
  })

  // Helper to get source name by code (for filter chips)
  const getSourceName = (code: string): string => {
    return sources.value?.find(s => s.code === code)?.name || code
  }

  // Clear function
  const clearSources = () => {
    selectedSources.value = []
  }

  return {
    selectedSources,
    sourceOptions,
    getSourceName,
    sources,
    clearSources
  }
}
