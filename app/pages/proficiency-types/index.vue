<script setup lang="ts">
import { computed } from 'vue'
import type { ProficiencyType } from '~/types'

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
  endpoint: '/proficiency-types',
  cacheKey: 'proficiency-types-list',
  queryBuilder: computed(() => ({})), // No custom filters
  noPagination: true, // Small dataset, no pagination needed
  seo: {
    title: 'Proficiency Types - D&D 5e Compendium',
    description: 'Browse all D&D 5e proficiency categories including armor, weapons, tools, and skills.'
  }
})

const proficiencyTypes = computed(() => data.value as ProficiencyType[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/proficiency-types"
      list-label="Proficiency Types"
      class="mb-6"
    />

    <UiListPageHeader
      title="Proficiency Types"
      :total="totalResults"
      description="Browse D&D 5e proficiency categories"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search proficiency types..."
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
      :empty="proficiencyTypes.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="proficiency type"
      entity-name-plural="Proficiency Types"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <ProficiencyTypeCard
          v-for="proficiencyType in proficiencyTypes"
          :key="proficiencyType.id"
          :proficiency-type="proficiencyType"
        />
      </template>
    </UiListStates>

    <UiBackLink />
    <JsonDebugPanel
      :data="{ proficiencyTypes, total: totalResults }"
      title="Proficiency Types Data"
    />
  </div>
</template>
