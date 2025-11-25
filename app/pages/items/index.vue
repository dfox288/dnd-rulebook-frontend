<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Item, ItemType } from '~/types'

const route = useRoute()
const { apiFetch } = useApi()

// Filter collapse state
const filtersOpen = ref(false)

// Custom filter state (entity-specific)
const selectedType = ref(route.query.type ? Number(route.query.type) : null)
const selectedRarity = ref((route.query.rarity as string) || null)
const selectedMagic = ref((route.query.is_magic as string) || null)
const hasCharges = ref<string | null>((route.query.has_charges as string) || null)
const hasPrerequisites = ref<string | null>((route.query.has_prerequisites as string) || null)

// Fetch item types for filter options
const { data: itemTypes } = await useAsyncData('item-types', async () => {
  const response = await apiFetch<{ data: ItemType[] }>('/item-types')
  return response?.data || []
})

// Rarity options from D&D rules
const rarityOptions = [
  { label: 'All Rarities', value: null },
  { label: 'Common', value: 'common' },
  { label: 'Uncommon', value: 'uncommon' },
  { label: 'Rare', value: 'rare' },
  { label: 'Very Rare', value: 'very rare' },
  { label: 'Legendary', value: 'legendary' },
  { label: 'Artifact', value: 'artifact' }
]

// Magic filter options
const magicOptions = [
  { label: 'All Items', value: null },
  { label: 'Magic Items', value: 'true' },
  { label: 'Non-Magic Items', value: 'false' }
]

// Item type filter options
const typeOptions = computed(() => {
  const options: Array<{ label: string, value: number | null }> = [{ label: 'All Types', value: null }]
  if (itemTypes.value) {
    options.push(...itemTypes.value.map((type: ItemType) => ({
      label: type.name,
      value: type.id
    })))
  }
  return options
})

// Query builder for custom filters (Meilisearch syntax)
const queryBuilder = computed(() => {
  const params: Record<string, unknown> = {}
  const meilisearchFilters: string[] = []

  // Type filter (use item_type_id for Meilisearch)
  if (selectedType.value !== null) {
    meilisearchFilters.push(`item_type_id = ${selectedType.value}`)
  }

  // Rarity filter (string value)
  if (selectedRarity.value !== null) {
    meilisearchFilters.push(`rarity = ${selectedRarity.value}`)
  }

  // is_magic filter (convert string to boolean)
  if (selectedMagic.value !== null) {
    const boolValue = selectedMagic.value === 'true' || selectedMagic.value === '1'
    meilisearchFilters.push(`is_magic = ${boolValue}`)
  }

  // has_charges filter (check if charges_max > 0)
  if (hasCharges.value !== null) {
    const hasCharge = hasCharges.value === '1' || hasCharges.value === 'true'
    if (hasCharge) {
      meilisearchFilters.push('charges_max > 0')
    } else {
      meilisearchFilters.push('charges_max = 0')
    }
  }

  // has_prerequisites filter (check if prerequisites field is not empty)
  if (hasPrerequisites.value !== null) {
    const hasPrereq = hasPrerequisites.value === '1' || hasPrerequisites.value === 'true'
    if (hasPrereq) {
      meilisearchFilters.push('prerequisites IS NOT EMPTY')
    } else {
      meilisearchFilters.push('prerequisites IS EMPTY')
    }
  }

  // Combine all filters with AND
  if (meilisearchFilters.length > 0) {
    params.filter = meilisearchFilters.join(' AND ')
  }

  return params
})

// Use entity list composable for all shared logic
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
  endpoint: '/items',
  cacheKey: 'items-list',
  queryBuilder,
  seo: {
    title: 'Items & Equipment - D&D 5e Compendium',
    description: 'Browse all D&D 5e items and equipment. Filter by type, rarity, and magic properties.'
  }
})

// Type the data array
const items = computed(() => data.value as Item[])

// Clear all filters (base + custom)
const clearFilters = () => {
  clearBaseFilters()
  selectedType.value = null
  selectedRarity.value = null
  selectedMagic.value = null
  hasCharges.value = null
  hasPrerequisites.value = null
}

// Get type name by ID for filter chips
const getTypeName = (typeId: number) => {
  return itemTypes.value?.find((t: ItemType) => t.id === typeId)?.name || 'Unknown'
}

// Pagination settings
const perPage = 24

// Count active filters (excluding search) for collapse badge
const activeFilterCount = computed(() => {
  let count = 0
  if (selectedType.value !== null) count++
  if (selectedRarity.value !== null) count++
  if (selectedMagic.value !== null) count++
  if (hasCharges.value !== null) count++
  if (hasPrerequisites.value !== null) count++
  return count
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <UiListPageHeader
      title="Items & Equipment"
      :total="totalResults"
      description="Browse D&D 5e items and equipment"
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
            placeholder="Search items..."
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

        <!-- Filter Content -->
        <div class="space-y-4">
          <!-- Dropdown Filters -->
          <div class="flex flex-wrap gap-2">
            <!-- Type filter -->
            <USelectMenu
              v-model="selectedType"
              :items="typeOptions"
              value-key="value"
              text-key="label"
              placeholder="Select type"
              class="w-48"
            />

            <!-- Rarity filter -->
            <USelectMenu
              v-model="selectedRarity"
              :items="rarityOptions"
              value-key="value"
              text-key="label"
              placeholder="Select rarity"
              class="w-44"
            />

            <!-- Magic filter -->
            <USelectMenu
              v-model="selectedMagic"
              :items="magicOptions"
              value-key="value"
              text-key="label"
              placeholder="Filter by magic"
              class="w-44"
            />
          </div>

          <!-- Quick Toggles -->
          <div class="flex flex-wrap gap-4">
            <!-- Has Charges filter -->
            <UiFilterToggle
              v-model="hasCharges"
              label="Has Charges"
              color="primary"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />

            <!-- Has Prerequisites filter -->
            <UiFilterToggle
              v-model="hasPrerequisites"
              label="Has Prerequisites"
              color="primary"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />
          </div>

          <!-- Clear filters button -->
          <div class="flex justify-end">
            <UButton
              v-if="hasActiveFilters"
              color="neutral"
              variant="soft"
              @click="clearFilters"
            >
              Clear Filters
            </UButton>
          </div>
        </div>
      </UiFilterCollapse>

      <!-- Active Filter Chips -->
      <div
        v-if="hasActiveFilters"
        class="flex flex-wrap items-center gap-2 pt-2"
      >
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Active:</span>
        <UButton
          v-if="selectedType !== null"
          size="xs"
          color="warning"
          variant="soft"
          @click="selectedType = null"
        >
          {{ getTypeName(selectedType) }} ✕
        </UButton>
        <UButton
          v-if="selectedRarity !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="selectedRarity = null"
        >
          {{ selectedRarity }} ✕
        </UButton>
        <UButton
          v-if="selectedMagic !== null"
          size="xs"
          color="info"
          variant="soft"
          @click="selectedMagic = null"
        >
          {{ selectedMagic === 'true' ? 'Magic' : 'Non-Magic' }} ✕
        </UButton>
        <UButton
          v-if="hasCharges !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="hasCharges = null"
        >
          Has Charges: {{ hasCharges === '1' ? 'Yes' : 'No' }} ✕
        </UButton>
        <UButton
          v-if="hasPrerequisites !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="hasPrerequisites = null"
        >
          Has Prerequisites: {{ hasPrerequisites === '1' ? 'Yes' : 'No' }} ✕
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
    </div>

    <!-- Loading State (Skeleton Cards) -->
    <UiListSkeletonCards v-if="loading" />

    <!-- Error State -->
    <UiListErrorState
      v-else-if="error"
      :error="error"
      entity-name="Items"
      @retry="refresh"
    />

    <!-- Empty State -->
    <UiListEmptyState
      v-else-if="items.length === 0"
      entity-name="items"
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
        entity-name="item"
      />

      <!-- Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <ItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
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
