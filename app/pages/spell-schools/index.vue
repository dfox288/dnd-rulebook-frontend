<script setup lang="ts">
import { computed } from 'vue'
import type { SpellSchool } from '~/types'

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
  endpoint: '/spell-schools',
  cacheKey: 'spell-schools-list',
  queryBuilder: computed(() => ({})), // No custom filters
  noPagination: true, // Small dataset, no pagination needed
  seo: {
    title: 'Spell Schools - D&D 5e Compendium',
    description: 'Browse all D&D 5e schools of magic: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, and Transmutation.'
  }
})

const spellSchools = computed(() => data.value as SpellSchool[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/spell-schools"
      list-label="Spell Schools"
      class="mb-6"
    />

    <UiListPageHeader
      title="Spell Schools"
      :total="totalResults"
      description="Browse D&D 5e schools of magic"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search spell schools..."
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
      :empty="spellSchools.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="spell school"
      entity-name-plural="Spell Schools"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <SpellSchoolCard
          v-for="spellSchool in spellSchools"
          :key="spellSchool.id"
          :spell-school="spellSchool"
        />
      </template>
    </UiListStates>

    <UiBackLink />
    <JsonDebugPanel
      :data="{ spellSchools, total: totalResults }"
      title="Spell Schools Data"
    />
  </div>
</template>
