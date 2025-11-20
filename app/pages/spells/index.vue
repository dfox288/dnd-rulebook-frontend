<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Page configuration
const config = useRuntimeConfig()

// Reactive filters
const searchQuery = ref('')
const selectedLevel = ref<number | null>(null)
const selectedSchool = ref<number | null>(null)
const currentPage = ref(1)
const perPage = 24

// Fetch spell schools for filter options
const { data: spellSchools } = await useAsyncData('spell-schools', async () => {
  const response = await $fetch(`${config.public.apiBase}/spell-schools`)
  return response.data
})

// Computed query params for API
const queryParams = computed(() => {
  const params: Record<string, any> = {
    per_page: perPage,
    page: currentPage.value,
  }

  if (searchQuery.value.trim()) {
    params.q = searchQuery.value.trim()
  }

  if (selectedLevel.value !== null) {
    params.level = selectedLevel.value
  }

  if (selectedSchool.value !== null) {
    params.school = selectedSchool.value
  }

  return params
})

// Fetch spells with reactive filters
const { data: spellsResponse, pending: loading, error, refresh } = await useAsyncData(
  'spells-list',
  async () => {
    const response = await $fetch(`${config.public.apiBase}/spells`, {
      query: queryParams.value
    })
    return response
  },
  {
    watch: [queryParams]
  }
)

// Computed values
const spells = computed(() => spellsResponse.value?.data || [])
const meta = computed(() => spellsResponse.value?.meta || null)
const totalResults = computed(() => meta.value?.total || 0)
const lastPage = computed(() => meta.value?.last_page || 1)

// Spell level options (0 = Cantrip, 1-9 = Spell levels)
const levelOptions = [
  { label: 'All Levels', value: null },
  { label: 'Cantrip', value: 0 },
  { label: '1st Level', value: 1 },
  { label: '2nd Level', value: 2 },
  { label: '3rd Level', value: 3 },
  { label: '4th Level', value: 4 },
  { label: '5th Level', value: 5 },
  { label: '6th Level', value: 6 },
  { label: '7th Level', value: 7 },
  { label: '8th Level', value: 8 },
  { label: '9th Level', value: 9 },
]

// School filter options
const schoolOptions = computed(() => {
  const options = [{ label: 'All Schools', value: null }]
  if (spellSchools.value) {
    options.push(...spellSchools.value.map((school: any) => ({
      label: school.name,
      value: school.id
    })))
  }
  return options
})

// Clear all filters
const clearFilters = () => {
  searchQuery.value = ''
  selectedLevel.value = null
  selectedSchool.value = null
  currentPage.value = 1
}

// Reset to page 1 when filters change
watch([searchQuery, selectedLevel, selectedSchool], () => {
  currentPage.value = 1
})

// SEO meta tags
useSeoMeta({
  title: 'Spells - D&D 5e Compendium',
  description: 'Browse all D&D 5e spells. Filter by level, school, and search for specific spells.',
})

useHead({
  title: 'Spells - D&D 5e Compendium',
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Spells
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Browse all {{ totalResults }} D&D 5e spells
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-6 space-y-4">
      <!-- Search input -->
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        size="lg"
        placeholder="Search spells..."
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
        <!-- Level filter -->
        <USelectMenu
          v-model="selectedLevel"
          :options="levelOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Select level"
        >
          <template #label>
            <span v-if="selectedLevel === null">All Levels</span>
            <span v-else-if="selectedLevel === 0">Cantrip</span>
            <span v-else>Level {{ selectedLevel }}</span>
          </template>
        </USelectMenu>

        <!-- School filter -->
        <USelectMenu
          v-model="selectedSchool"
          :options="schoolOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Select school"
        >
          <template #label>
            <span v-if="selectedSchool === null">All Schools</span>
            <span v-else>{{ spellSchools?.find((s: any) => s.id === selectedSchool)?.name }}</span>
          </template>
        </USelectMenu>

        <!-- Clear filters button -->
        <UButton
          v-if="searchQuery || selectedLevel !== null || selectedSchool !== null"
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
        <p class="text-gray-600 dark:text-gray-400">Loading spells...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12">
      <UCard>
        <div class="text-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Spells
          </h2>
          <p class="text-gray-600 dark:text-gray-400">{{ error.message }}</p>
          <UButton color="primary" class="mt-4" @click="refresh">
            Try Again
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div v-else-if="spells.length === 0" class="py-12">
      <UCard>
        <div class="text-center">
          <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Spells Found
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
        Showing {{ meta?.from || 0 }}-{{ meta?.to || 0 }} of {{ totalResults }} spells
      </div>

      <!-- Spells Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SearchResultCard
          v-for="spell in spells"
          :key="spell.id"
          :result="spell"
          type="spell"
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
