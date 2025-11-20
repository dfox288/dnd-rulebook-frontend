<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Page configuration
const config = useRuntimeConfig()

// Reactive filters
const searchQuery = ref('')
const selectedType = ref<number | null>(null)
const selectedRarity = ref<string | null>(null)
const selectedMagic = ref<string | null>(null)
const currentPage = ref(1)
const perPage = 24

// Fetch item types for filter options
const { data: itemTypes } = await useAsyncData('item-types', async () => {
  const response = await $fetch(`${config.public.apiBase}/item-types`)
  return response.data
})

// Rarity options from D&D rules
const rarityOptions = [
  { label: 'All Rarities', value: null },
  { label: 'Common', value: 'common' },
  { label: 'Uncommon', value: 'uncommon' },
  { label: 'Rare', value: 'rare' },
  { label: 'Very Rare', value: 'very rare' },
  { label: 'Legendary', value: 'legendary' },
  { label: 'Artifact', value: 'artifact' },
]

// Magic filter options
const magicOptions = [
  { label: 'All Items', value: null },
  { label: 'Magic Items', value: 'true' },
  { label: 'Non-Magic Items', value: 'false' },
]

// Computed query params for API
const queryParams = computed(() => {
  const params: Record<string, any> = {
    per_page: perPage,
    page: currentPage.value,
  }

  if (searchQuery.value.trim()) {
    params.q = searchQuery.value.trim()
  }

  if (selectedType.value !== null) {
    params.type = selectedType.value
  }

  if (selectedRarity.value !== null) {
    params.rarity = selectedRarity.value
  }

  if (selectedMagic.value !== null) {
    params.is_magic = selectedMagic.value
  }

  return params
})

// Fetch items with reactive filters
const { data: itemsResponse, pending: loading, error, refresh } = await useAsyncData(
  'items-list',
  async () => {
    const response = await $fetch(`${config.public.apiBase}/items`, {
      query: queryParams.value
    })
    return response
  },
  {
    watch: [queryParams]
  }
)

// Computed values
const items = computed(() => itemsResponse.value?.data || [])
const meta = computed(() => itemsResponse.value?.meta || null)
const totalResults = computed(() => meta.value?.total || 0)
const lastPage = computed(() => meta.value?.last_page || 1)

// Item type filter options
const typeOptions = computed(() => {
  const options = [{ label: 'All Types', value: null }]
  if (itemTypes.value) {
    options.push(...itemTypes.value.map((type: any) => ({
      label: type.name,
      value: type.id
    })))
  }
  return options
})

// Clear all filters
const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = null
  selectedRarity.value = null
  selectedMagic.value = null
  currentPage.value = 1
}

// Reset to page 1 when filters change
watch([searchQuery, selectedType, selectedRarity, selectedMagic], () => {
  currentPage.value = 1
})

// SEO meta tags
useSeoMeta({
  title: 'Items & Equipment - D&D 5e Compendium',
  description: 'Browse all D&D 5e items and equipment. Filter by type, rarity, and magic properties.',
})

useHead({
  title: 'Items & Equipment - D&D 5e Compendium',
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Items & Equipment
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Browse all {{ totalResults }} D&D 5e items
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-6 space-y-4">
      <!-- Search input -->
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        size="lg"
        placeholder="Search items..."
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template v-if="searchQuery" #trailing>
          <UButton
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="searchQuery = ''"
          />
        </template>
      </UInput>

      <!-- Filter chips -->
      <div class="flex flex-wrap gap-2">
        <!-- Type filter -->
        <USelectMenu
          v-model="selectedType"
          :options="typeOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Select type"
        >
          <template #label>
            <span v-if="selectedType === null">All Types</span>
            <span v-else>{{ itemTypes?.find((t: any) => t.id === selectedType)?.name }}</span>
          </template>
        </USelectMenu>

        <!-- Rarity filter -->
        <USelectMenu
          v-model="selectedRarity"
          :options="rarityOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Select rarity"
        >
          <template #label>
            <span v-if="selectedRarity === null">All Rarities</span>
            <span v-else class="capitalize">{{ selectedRarity }}</span>
          </template>
        </USelectMenu>

        <!-- Magic filter -->
        <USelectMenu
          v-model="selectedMagic"
          :options="magicOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Filter by magic"
        >
          <template #label>
            <span v-if="selectedMagic === null">All Items</span>
            <span v-else-if="selectedMagic === 'true'">Magic Items</span>
            <span v-else>Non-Magic Items</span>
          </template>
        </USelectMenu>

        <!-- Clear filters button -->
        <UButton
          v-if="searchQuery || selectedType !== null || selectedRarity !== null || selectedMagic !== null"
          color="gray"
          variant="soft"
          @click="clearFilters"
        >
          Clear Filters
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
        <p class="text-gray-600 dark:text-gray-400">Loading items...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12">
      <UCard>
        <div class="text-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Items
          </h2>
          <p class="text-gray-600 dark:text-gray-400">{{ error.message }}</p>
          <UButton color="primary" class="mt-4" @click="refresh">
            Try Again
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="py-12">
      <UCard>
        <div class="text-center">
          <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Items Found
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters or search query
          </p>
          <UButton color="gray" @click="clearFilters">
            Clear Filters
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Results -->
    <div v-else>
      <!-- Results count -->
      <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {{ meta?.from || 0 }}-{{ meta?.to || 0 }} of {{ totalResults }} items
      </div>

      <!-- Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SearchResultCard
          v-for="item in items"
          :key="item.id"
          :result="item"
          type="item"
        />
      </div>

      <!-- Pagination -->
      <div v-if="lastPage > 1" class="flex justify-center">
        <UPagination
          v-model="currentPage"
          :page-count="perPage"
          :total="totalResults"
          :max="7"
        />
      </div>
    </div>

    <!-- Back to Home -->
    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <NuxtLink to="/">
        <UButton color="gray" variant="soft" icon="i-heroicons-arrow-left">
          Back to Home
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>
