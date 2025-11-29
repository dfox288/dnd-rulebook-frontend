<script setup lang="ts">
import { computed } from 'vue'
import type { Language } from '~/types'

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
  endpoint: '/languages',
  cacheKey: 'languages-list',
  queryBuilder: computed(() => ({})), // No custom filters
  noPagination: true, // Small dataset, no pagination needed
  seo: {
    title: 'Languages - D&D 5e Compendium',
    description: 'Browse all D&D 5e languages including Common, Elvish, Dwarvish, and more.'
  }
})

const languages = computed(() => data.value as Language[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/languages"
      list-label="Languages"
      class="mb-6"
    />

    <!-- Header -->
    <UiListPageHeader
      title="Languages"
      :total="totalResults"
      description="Browse D&D 5e languages and scripts"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <!-- Search -->
    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search languages..."
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
      :empty="languages.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="language"
      entity-name-plural="Languages"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <LanguageCard
          v-for="language in languages"
          :key="language.id"
          :language="language"
        />
      </template>
    </UiListStates>

    <!-- Back to Home -->
    <UiBackLink />

    <!-- JSON Debug Panel -->
    <JsonDebugPanel
      :data="{ languages, total: totalResults }"
      title="Languages Data"
    />
  </div>
</template>
