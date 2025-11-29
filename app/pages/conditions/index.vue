<script setup lang="ts">
import { computed } from 'vue'
import type { Condition } from '~/types'

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
  endpoint: '/conditions',
  cacheKey: 'conditions-list',
  queryBuilder: computed(() => ({})), // No custom filters
  noPagination: true, // Small dataset, no pagination needed
  seo: {
    title: 'Conditions - D&D 5e Compendium',
    description: 'Browse all D&D 5e conditions and status effects.'
  }
})

const conditions = computed(() => data.value as Condition[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/conditions"
      list-label="Conditions"
      class="mb-6"
    />

    <UiListPageHeader
      title="Conditions"
      :total="totalResults"
      description="Browse D&D 5e conditions"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search conditions..."
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
      :empty="conditions.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="condition"
      entity-name-plural="Conditions"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <ConditionCard
          v-for="condition in conditions"
          :key="condition.id"
          :condition="condition"
        />
      </template>
    </UiListStates>

    <UiBackLink />
    <JsonDebugPanel
      :data="{ conditions, total: totalResults }"
      title="Conditions Data"
    />
  </div>
</template>
