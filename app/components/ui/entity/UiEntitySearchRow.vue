<script setup lang="ts">
/**
 * Reusable search row component for entity list pages.
 *
 * Contains:
 * - Search input with clear button
 * - Source filter (optional)
 * - Sort dropdown
 *
 * @example
 * ```vue
 * <UiEntitySearchRow
 *   v-model:search="searchQuery"
 *   v-model:sources="selectedSources"
 *   v-model:sort="sortValue"
 *   placeholder="Search spells..."
 *   :source-options="sourceOptions"
 *   :sort-options="sortOptions"
 *   color="spell"
 * />
 * ```
 */

interface SortOption {
  label: string
  value: string
}

interface SourceOption {
  label: string
  value: string
}

interface Props {
  /** Search query (v-model:search) */
  search: string
  /** Selected sources array (v-model:sources) */
  sources?: string[]
  /** Sort value in "field:direction" format (v-model:sort) */
  sort: string
  /** Placeholder text for search input */
  placeholder?: string
  /** Source filter options */
  sourceOptions?: SourceOption[]
  /** Sort dropdown options */
  sortOptions: SortOption[]
  /** Entity semantic color for source filter (default: 'primary') */
  color?: string
  /** Hide source filter entirely */
  hideSourceFilter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  color: 'primary',
  hideSourceFilter: false,
  sources: () => [],
  sourceOptions: () => []
})

const emit = defineEmits<{
  'update:search': [value: string]
  'update:sources': [value: string[]]
  'update:sort': [value: string]
}>()

// Local refs for v-model binding
const searchModel = computed({
  get: () => props.search,
  set: (value: string) => emit('update:search', value)
})

const sourcesModel = computed({
  get: () => props.sources,
  set: (value: string[]) => emit('update:sources', value)
})

const sortModel = computed({
  get: () => props.sort,
  set: (value: string) => emit('update:sort', value)
})
</script>

<template>
  <div class="flex flex-wrap gap-2 w-full">
    <!-- Search Input -->
    <UInput
      v-model="searchModel"
      :placeholder="placeholder"
      class="flex-1 min-w-[200px]"
    >
      <template
        v-if="searchModel"
        #trailing
      >
        <UButton
          color="neutral"
          variant="link"
          :padded="false"
          @click="searchModel = ''"
        />
      </template>
    </UInput>

    <!-- Source Filter -->
    <UiFilterMultiSelect
      v-if="!hideSourceFilter && sourceOptions.length > 0"
      v-model="sourcesModel"
      :options="sourceOptions"
      placeholder="All Sources"
      :color="color"
      width-class="flex-1 min-w-[192px]"
      data-testid="source-filter"
    />

    <!-- Sort Dropdown -->
    <USelectMenu
      v-model="sortModel"
      :items="sortOptions"
      value-key="value"
      placeholder="Sort by..."
      size="md"
      class="flex-1 min-w-[192px]"
    />
  </div>
</template>
