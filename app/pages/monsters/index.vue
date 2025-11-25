<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Monster } from '~/types'

const route = useRoute()

// Custom filter state
// Note: UiFilterMultiSelect works with strings, so we store as strings and convert to numbers for filtering
const selectedCRs = ref<string[]>(
  route.query.cr ? (Array.isArray(route.query.cr) ? route.query.cr.map(String) : [String(route.query.cr)]) : []
)
const selectedType = ref(route.query.type ? String(route.query.type) : null)
const isLegendary = ref<string | null>((route.query.is_legendary as string) || null)

// CR multiselect options (common D&D 5e CR values)
const crOptions = [
  { label: 'CR 0', value: '0' },
  { label: 'CR 1/8', value: '0.125' },
  { label: 'CR 1/4', value: '0.25' },
  { label: 'CR 1/2', value: '0.5' },
  { label: 'CR 1', value: '1' },
  { label: 'CR 2', value: '2' },
  { label: 'CR 3', value: '3' },
  { label: 'CR 4', value: '4' },
  { label: 'CR 5', value: '5' },
  { label: 'CR 6', value: '6' },
  { label: 'CR 7', value: '7' },
  { label: 'CR 8', value: '8' },
  { label: 'CR 9', value: '9' },
  { label: 'CR 10', value: '10' },
  { label: 'CR 11', value: '11' },
  { label: 'CR 12', value: '12' },
  { label: 'CR 13', value: '13' },
  { label: 'CR 14', value: '14' },
  { label: 'CR 15', value: '15' },
  { label: 'CR 16', value: '16' },
  { label: 'CR 17', value: '17' },
  { label: 'CR 18', value: '18' },
  { label: 'CR 19', value: '19' },
  { label: 'CR 20', value: '20' },
  { label: 'CR 21', value: '21' },
  { label: 'CR 22', value: '22' },
  { label: 'CR 23', value: '23' },
  { label: 'CR 24', value: '24' },
  { label: 'CR 25', value: '25' },
  { label: 'CR 26', value: '26' },
  { label: 'CR 27', value: '27' },
  { label: 'CR 28', value: '28' },
  { label: 'CR 29', value: '29' },
  { label: 'CR 30', value: '30' }
]

// Type options
const typeOptions = [
  { label: 'All Types', value: null },
  { label: 'Aberration', value: 'aberration' },
  { label: 'Beast', value: 'beast' },
  { label: 'Celestial', value: 'celestial' },
  { label: 'Construct', value: 'construct' },
  { label: 'Dragon', value: 'dragon' },
  { label: 'Elemental', value: 'elemental' },
  { label: 'Fey', value: 'fey' },
  { label: 'Fiend', value: 'fiend' },
  { label: 'Giant', value: 'giant' },
  { label: 'Humanoid', value: 'humanoid' },
  { label: 'Monstrosity', value: 'monstrosity' },
  { label: 'Ooze', value: 'ooze' },
  { label: 'Plant', value: 'plant' },
  { label: 'Undead', value: 'undead' }
]

// Query builder (using composable for all filters)
const { queryParams: filterParams } = useMeilisearchFilters([
  // CR multiselect filter (convert strings to numbers for API)
  {
    ref: selectedCRs,
    field: 'challenge_rating',
    type: 'in',
    transform: (crs) => crs.map(Number)
  },
  { ref: selectedType, field: 'type' },
  { ref: isLegendary, field: 'is_legendary', type: 'boolean' }
])

const queryBuilder = computed(() => filterParams.value)

// Use entity list composable
const {
  searchQuery,
  currentPage,
  data,
  meta,
  totalResults,
  loading,
  error,
  refresh,
  clearFilters: clearBaseFilters,
  hasActiveFilters
} = useEntityList({
  endpoint: '/monsters',
  cacheKey: 'monsters-list',
  queryBuilder,
  seo: {
    title: 'Monsters - D&D 5e Compendium',
    description: 'Browse D&D 5e monsters with stats, abilities, and lore. Filter by Challenge Rating and creature type.'
  }
})

const monsters = computed(() => data.value as Monster[])

// Clear all filters
const clearFilters = () => {
  clearBaseFilters()
  selectedCRs.value = []
  selectedType.value = null
  isLegendary.value = null
}

// Helper functions for filter chips
const getCRLabel = (cr: string) => {
  // Convert back to display format (e.g., "0.125" → "CR 1/8", "5" → "CR 5")
  return crOptions.find(o => o.value === cr)?.label || `CR ${cr}`
}

// Get CR filter display text for chips
const getCRFilterText = computed(() => {
  if (selectedCRs.value.length === 0) return null

  const labels = selectedCRs.value
    .sort((a, b) => Number(a) - Number(b))
    .map(cr => getCRLabel(cr).replace('CR ', '')) // Remove "CR " prefix for compactness

  const prefix = selectedCRs.value.length === 1 ? 'CR' : 'CRs'
  return `${prefix}: ${labels.join(', ')}`
})

const clearCRFilter = () => {
  selectedCRs.value = []
}

const getTypeLabel = (type: string) => {
  return typeOptions.find(o => o.value === type)?.label || type
}

// Filter collapse state
const filtersOpen = ref(false)

// Active filter count for badge
const activeFilterCount = useFilterCount(selectedCRs, selectedType, isLegendary)

const perPage = 24
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <UiListPageHeader
      title="Monsters"
      :total="totalResults"
      description="Browse D&D 5e monsters with stats, abilities, and lore"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <!-- Filters -->
    <div class="mb-6">
      <UiFilterCollapse
        v-model="filtersOpen"
        label="Filters"
        :badge-count="activeFilterCount"
      >
        <template #search>
          <UInput
            v-model="searchQuery"
            placeholder="Search monsters..."
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

        <UiFilterLayout>
          <!-- Primary Filters: Most frequently used (CR, Type) -->
          <template #primary>
            <!-- CR Filter Multiselect -->
            <UiFilterMultiSelect
              v-model="selectedCRs"
              data-testid="cr-filter-multiselect"
              :options="crOptions"
              placeholder="All CRs"
              color="primary"
              class="w-full sm:w-48"
            />

            <!-- Type Filter -->
            <USelectMenu
              v-model="selectedType"
              :items="typeOptions"
              value-key="value"
              text-key="label"
              placeholder="All Types"
              size="md"
              class="w-full sm:w-48"
            />
          </template>

          <!-- Quick Toggles: Binary filters (Legendary) -->
          <template #quick>
            <UiFilterToggle
              v-model="isLegendary"
              label="Legendary"
              color="error"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />
          </template>

          <!-- Advanced Filters: Empty (no advanced filters yet) -->
          <template #advanced />

          <!-- Actions: Empty (Clear Filters moved to chips row) -->
          <template #actions />
        </UiFilterLayout>
      </UiFilterCollapse>

      <!-- Active Filter Chips -->
      <div
        v-if="hasActiveFilters"
        class="flex flex-wrap items-center justify-between gap-2 pt-2"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-if="activeFilterCount > 0 || searchQuery"
            class="text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            Active filters:
          </span>
          <UButton
            v-if="getCRFilterText"
            data-testid="cr-filter-chip"
            size="xs"
            color="primary"
            variant="soft"
            @click="clearCRFilter"
          >
            {{ getCRFilterText }} ✕
          </UButton>
          <UButton
            v-if="selectedType !== null"
            size="xs"
            color="info"
            variant="soft"
            @click="selectedType = null"
          >
            {{ getTypeLabel(selectedType) }} ✕
          </UButton>
          <UButton
            v-if="isLegendary !== null"
            size="xs"
            color="error"
            variant="soft"
            @click="isLegendary = null"
          >
            Legendary: {{ isLegendary === '1' ? 'Yes' : 'No' }} ✕
          </UButton>
          <UButton
            v-if="searchQuery"
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
      entity-name="Monsters"
      @retry="refresh"
    />

    <!-- Empty State -->
    <UiListEmptyState
      v-else-if="monsters.length === 0"
      entity-name="monsters"
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
        entity-name="monster"
      />

      <!-- Monsters Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MonsterCard
          v-for="monster in monsters"
          :key="monster.id"
          :monster="monster"
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
