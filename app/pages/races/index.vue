<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Race, Size } from '~/types'

const route = useRoute()

// Custom filter state (entity-specific)
const selectedSize = ref((route.query.size as string) || '')
// NOTE: hasDarkvision removed - not filterable in Meilisearch backend

// Fetch available sizes for filter options
const { data: sizes } = useReferenceData<Size>('/sizes', {
  cacheKey: 'sizes-for-races'
})

// Query builder for custom filters (using composable)
const { queryParams } = useMeilisearchFilters([
  { ref: selectedSize, field: 'size_code' }
])

// Use entity list composable for all shared logic
const {
  searchQuery,
  currentPage,
  data: racesData,
  meta,
  totalResults,
  loading,
  error,
  refresh,
  clearFilters: clearBaseFilters,
  hasActiveFilters
} = useEntityList({
  endpoint: '/races',
  cacheKey: 'races-list',
  queryBuilder: queryParams,
  seo: {
    title: 'Races - D&D 5e Compendium',
    description: 'Browse all D&D 5e player races and subraces.'
  }
})

const races = computed(() => racesData.value as Race[])

// Clear all filters (base + custom)
const clearFilters = () => {
  clearBaseFilters()
  selectedSize.value = ''
}

// Helper for filter chips
const getSizeName = (code: string) => {
  return sizes.value.find(s => s.code === code)?.name || code
}

// Filter collapse state
const filtersOpen = ref(false)

// Active filter count for badge
const activeFilterCount = useFilterCount(selectedSize)

// Pagination settings
const perPage = 24
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <UiListPageHeader
      title="Races"
      :total="totalResults"
      description="Browse D&D 5e races and subraces"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <!-- Search and Filters -->
    <div class="mb-6">
      <UiFilterCollapse
        v-model="filtersOpen"
        label="Filters"
        :badge-count="activeFilterCount"
      >
        <template #search>
          <UInput
            v-model="searchQuery"
            placeholder="Search races..."
            class="flex-1"
          >
            <template
              v-if="searchQuery"
              #trailing
            >
              <UButton
                color="neutral"
                variant="link"
                :padded="false"
                @click="searchQuery = ''"
              />
            </template>
          </UInput>
        </template>

        <div class="space-y-4">
          <!-- Size Filter -->
          <div
            data-testid="size-filter-buttons"
            class="flex gap-2 flex-wrap"
          >
            <UButton
              :color="selectedSize === '' ? 'primary' : 'neutral'"
              :variant="selectedSize === '' ? 'solid' : 'soft'"
              size="sm"
              @click="selectedSize = ''"
            >
              All
            </UButton>
            <UButton
              v-for="size in sizes"
              :key="size.id"
              :color="selectedSize === size.code ? 'primary' : 'neutral'"
              :variant="selectedSize === size.code ? 'solid' : 'soft'"
              size="sm"
              @click="selectedSize = size.code"
            >
              {{ size.name }}
            </UButton>
          </div>

          <!-- NOTE: Darkvision filter removed - not filterable in Meilisearch backend -->
        </div>
      </UiFilterCollapse>

      <!-- Active Filter Chips -->
      <div
        v-if="hasActiveFilters"
        data-testid="active-filters-row"
        class="flex flex-wrap items-center justify-between gap-2 pt-2"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span
            data-testid="active-filters-label"
            class="text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            Active filters:
          </span>
          <UButton
            v-if="selectedSize"
            data-testid="size-filter-chip"
            size="xs"
            color="primary"
            variant="soft"
            @click="selectedSize = ''"
          >
            {{ getSizeName(selectedSize) }} ✕
          </UButton>
          <UButton
            v-if="searchQuery"
            data-testid="search-query-chip"
            size="xs"
            color="neutral"
            variant="soft"
            @click="searchQuery = ''"
          >
            "{{ searchQuery }}" ✕
          </UButton>
        </div>

        <!-- Clear Filters Button (right-aligned) -->
        <UButton
          v-if="activeFilterCount > 0 || searchQuery"
          data-testid="clear-filters-button"
          color="neutral"
          variant="soft"
          size="sm"
          @click="clearFilters"
        >
          Clear filters
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <UiListSkeletonCards v-if="loading" />

    <!-- Error State -->
    <UiListErrorState
      v-else-if="error"
      :error="error"
      entity-name="Races"
      @retry="refresh"
    />

    <!-- Empty State -->
    <UiListEmptyState
      v-else-if="races.length === 0"
      entity-name="races"
      :has-filters="hasActiveFilters"
      @clear-filters="clearFilters"
    />

    <!-- Results -->
    <div v-else>
      <!-- Results count -->
      <UiListResultsCount
        :from="meta?.from || 0"
        :to="meta?.to || 0"
        :total="totalResults"
        entity-name="race"
      />

      <!-- Races Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <RaceCard
          v-for="race in races"
          :key="race.id"
          :race="race"
        />
      </div>

      <!-- Pagination -->
      <UiListPagination
        v-model="currentPage"
        :total="totalResults"
        :items-per-page="perPage"
      />
    </div>

    <!-- Back to Home -->
    <UiBackLink />
  </div>
</template>
