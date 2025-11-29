<script setup lang="ts">
import { computed } from 'vue'
import type { AbilityScore } from '~/types'

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
  endpoint: '/ability-scores',
  cacheKey: 'ability-scores-list',
  queryBuilder: computed(() => ({})), // No custom filters
  noPagination: true, // Small dataset, no pagination needed
  seo: {
    title: 'Ability Scores - D&D 5e Compendium',
    description: 'Browse all D&D 5e ability scores (STR, DEX, CON, INT, WIS, CHA).'
  }
})

const abilityScores = computed(() => data.value as AbilityScore[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/ability-scores"
      list-label="Ability Scores"
      class="mb-6"
    />

    <!-- Header -->
    <UiListPageHeader
      title="Ability Scores"
      :total="totalResults"
      description="Browse D&D 5e ability scores"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <!-- Search -->
    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search ability scores..."
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
      :empty="abilityScores.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="ability score"
      entity-name-plural="Ability Scores"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <AbilityScoreCard
          v-for="abilityScore in abilityScores"
          :key="abilityScore.id"
          :ability-score="abilityScore"
        />
      </template>
    </UiListStates>

    <!-- Back to Home -->
    <UiBackLink />

    <!-- JSON Debug Panel -->
    <JsonDebugPanel
      :data="{ abilityScores, total: totalResults }"
      title="Ability Scores Data"
    />
  </div>
</template>
