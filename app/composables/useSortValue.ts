import { computed, type Ref } from 'vue'

/**
 * Composable for managing sort value as a combined "field:direction" string.
 *
 * This is used by USelectMenu components that need a single value binding
 * but we want to track sortBy and sortDirection separately.
 *
 * @example
 * ```typescript
 * const sortBy = ref('name')
 * const sortDirection = ref<'asc' | 'desc'>('asc')
 * const sortValue = useSortValue(sortBy, sortDirection)
 *
 * // In template:
 * <USelectMenu v-model="sortValue" :items="sortOptions" />
 * ```
 */
export function useSortValue(
  sortBy: Ref<string>,
  sortDirection: Ref<'asc' | 'desc'>
) {
  return computed({
    get: () => `${sortBy.value}:${sortDirection.value}`,
    set: (value: string) => {
      const [newSortBy, newSortDirection] = value.split(':')
      if (newSortBy) sortBy.value = newSortBy
      if (newSortDirection) sortDirection.value = newSortDirection as 'asc' | 'desc'
    }
  })
}
