<script setup lang="ts">
import { computed } from 'vue'
import type { DamageType } from '~/types'

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
  endpoint: '/damage-types',
  cacheKey: 'damage-types-list',
  queryBuilder: computed(() => ({})), // No custom filters
  noPagination: true, // Small dataset, no pagination needed
  seo: {
    title: 'Damage Types - D&D 5e Compendium',
    description: 'Browse all D&D 5e damage types including Fire, Cold, Lightning, and more.'
  }
})

const damageTypes = computed(() => data.value as DamageType[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/damage-types"
      list-label="Damage Types"
      class="mb-6"
    />

    <!-- Header -->
    <UiListPageHeader
      title="Damage Types"
      :total="totalResults"
      description="Browse D&D 5e damage types"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <!-- Search -->
    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search damage types..."
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
      :empty="damageTypes.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="damage type"
      entity-name-plural="Damage Types"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <DamageTypeCard
          v-for="damageType in damageTypes"
          :key="damageType.id"
          :damage-type="damageType"
        />
      </template>
    </UiListStates>

    <!-- Back to Home -->
    <UiBackLink />

    <!-- JSON Debug Panel -->
    <JsonDebugPanel
      :data="{ damageTypes, total: totalResults }"
      title="Damage Types Data"
    />
  </div>
</template>
