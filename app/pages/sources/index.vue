<script setup lang="ts">
import { computed } from 'vue'
import type { Source } from '~/types'

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
  endpoint: '/sources',
  cacheKey: 'sources-list',
  queryBuilder: computed(() => ({})),
  noPagination: true,
  seo: {
    title: 'Source Books - D&D 5e Compendium',
    description: 'Browse all D&D 5e source books and official publications.'
  }
})

const sources = computed(() => data.value as Source[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/sources"
      list-label="Source Books"
      class="mb-6"
    />

    <!-- Header -->
    <UiListPageHeader
      title="Source Books"
      :total="totalResults"
      description="Browse D&D 5e official source books and publications"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <!-- Search -->
    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search source books..."
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
      :empty="sources.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="source book"
      entity-name-plural="Source Books"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <SourceCard
          v-for="source in sources"
          :key="source.id"
          :source="source"
        />
      </template>
    </UiListStates>

    <!-- Back to Home -->
    <UiBackLink />

    <!-- JSON Debug Panel -->
    <JsonDebugPanel
      :data="{ sources, total: totalResults }"
      title="Sources Data"
    />
  </div>
</template>
