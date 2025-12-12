<script setup lang="ts">
import { computed } from 'vue'

interface CreatureType {
  id: number
  name: string
  slug: string
  description: string
  typically_immune_to_poison: boolean
  typically_immune_to_charmed: boolean
  typically_immune_to_frightened: boolean
  typically_immune_to_exhaustion: boolean
  requires_sustenance: boolean
  requires_sleep: boolean
}

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
  endpoint: '/creature-types',
  cacheKey: 'creature-types-list',
  queryBuilder: computed(() => ({})), // No custom filters
  noPagination: true, // Small dataset, no pagination needed
  seo: {
    title: 'Creature Types - D&D 5e Compendium',
    description: 'Browse all D&D 5e creature types including aberrations, beasts, dragons, and more.'
  }
})

const creatureTypes = computed(() => data.value as CreatureType[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/creature-types"
      list-label="Creature Types"
      class="mb-6"
    />

    <UiListPageHeader
      title="Creature Types"
      :total="totalResults"
      description="Browse D&D 5e creature types"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search creature types..."
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
      :empty="creatureTypes.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="creature type"
      entity-name-plural="Creature Types"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <CreatureTypeCard
          v-for="creatureType in creatureTypes"
          :key="creatureType.id"
          :creature-type="creatureType"
        />
      </template>
    </UiListStates>

    <UiBackLink />
    <JsonDebugPanel
      :data="{ creatureTypes, total: totalResults }"
      title="Creature Types Data"
    />
  </div>
</template>
