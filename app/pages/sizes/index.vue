<script setup lang="ts">
import { computed } from 'vue'
import type { Size } from '~/types'

// Use entity list composable with noPagination
const {
  searchQuery,
  data,
  totalResults,
  loading,
  error,
  refresh,
  clearFilters,
  hasActiveFilters
} = useEntityList({
  endpoint: '/sizes',
  cacheKey: 'sizes-list',
  queryBuilder: computed(() => ({})), // No custom filters
  noPagination: true, // Small dataset, no pagination needed
  seo: {
    title: 'Creature Sizes - D&D 5e Compendium',
    description: 'Browse all D&D 5e creature size categories from Tiny to Gargantuan.'
  }
})

const sizes = computed(() => data.value as Size[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/sizes"
      list-label="Creature Sizes"
      class="mb-6"
    />

    <!-- Header -->
    <UiListPageHeader
      title="Creature Sizes"
      :total="totalResults"
      description="Browse D&D 5e creature size categories"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <!-- Search -->
    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search sizes..."
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
    </div>

    <UiListStates
      :loading="loading"
      :error="error"
      :empty="sizes.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="size"
      entity-name-plural="Sizes"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <SizeCard
          v-for="size in sizes"
          :key="size.id"
          :size="size"
        />
      </template>
    </UiListStates>

    <!-- Back to Home -->
    <UiBackLink />

    <!-- JSON Debug Panel -->
    <JsonDebugPanel
      :data="{ sizes, total: totalResults }"
      title="Sizes Data"
    />
  </div>
</template>
