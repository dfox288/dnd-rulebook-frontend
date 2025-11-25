<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Background, Skill } from '~/types'

const route = useRoute()

// Filter collapse state
const filtersOpen = ref(false)

// Sorting state
const sortBy = ref<string>((route.query.sort_by as string) || 'name')
const sortDirection = ref<'asc' | 'desc'>((route.query.sort_direction as 'asc' | 'desc') || 'asc')
const sortValue = useSortValue(sortBy, sortDirection)

// Source filter (using composable) - filtered to only PHB, ERLW, WGTE
const { selectedSources, sourceOptions, getSourceName, clearSources } = useSourceFilter({
  transform: (data) => data.filter(s => ['PHB', 'ERLW', 'WGTE'].includes(s.code))
})

// Entity-specific filter state
const selectedSkills = ref<string[]>(
  route.query.skill ? (Array.isArray(route.query.skill) ? route.query.skill : [route.query.skill]) as string[] : []
)
const selectedToolTypes = ref<string[]>(
  route.query.tool_type ? (Array.isArray(route.query.tool_type) ? route.query.tool_type : [route.query.tool_type]) as string[] : []
)
const languageChoiceFilter = ref<string | null>((route.query.grants_language_choice as string) || null)

// Fetch reference data
const { data: skills } = useReferenceData<Skill>('/skills')

// Skill filter options
const skillOptions = computed(() => {
  if (!skills.value) return []
  return skills.value.map(skill => ({
    label: skill.name,
    value: skill.code
  }))
})

// Tool proficiency type options (hardcoded - stable categories)
const toolTypeOptions = [
  { label: 'Artisan Tools', value: 'artisan-tools' },
  { label: 'Musical Instruments', value: 'musical-instruments' },
  { label: 'Gaming Sets', value: 'gaming-sets' }
]

// Sort options
const sortOptions = [
  { label: 'Name (A-Z)', value: 'name:asc' },
  { label: 'Name (Z-A)', value: 'name:desc' }
]

// Query builder for filters
const { queryParams: filterParams } = useMeilisearchFilters([
  { ref: selectedSources, field: 'source_codes', type: 'in' },
  { ref: selectedSkills, field: 'skill_proficiencies', type: 'in' },
  { ref: selectedToolTypes, field: 'tool_proficiency_types', type: 'in' },
  { ref: languageChoiceFilter, field: 'grants_language_choice', type: 'boolean' }
])

// Combined query params (filters + sorting)
const queryParams = computed(() => ({
  ...filterParams.value,
  sort_by: sortBy.value,
  sort_direction: sortDirection.value
}))

// Use entity list composable
const {
  searchQuery,
  currentPage,
  data,
  meta,
  totalResults,
  loading,
  error,
  refresh,
  clearFilters: clearBaseFilters,
  hasActiveFilters
} = useEntityList({
  endpoint: '/backgrounds',
  cacheKey: 'backgrounds-list',
  queryBuilder: queryParams,
  seo: {
    title: 'Backgrounds - D&D 5e Compendium',
    description: 'Browse all D&D 5e character backgrounds.'
  }
})

const backgrounds = computed(() => data.value as Background[])

// Clear all filters
const clearFilters = () => {
  clearBaseFilters()
  clearSources()
  selectedSkills.value = []
  selectedToolTypes.value = []
  languageChoiceFilter.value = null
}

// Helper functions for filter chips
const getSkillName = (code: string) => skills.value?.find(s => s.code === code)?.name || code
const getToolTypeName = (value: string) => toolTypeOptions.find(t => t.value === value)?.label || value

// Active filter count
const activeFilterCount = useFilterCount(
  selectedSources,
  selectedSkills,
  selectedToolTypes,
  languageChoiceFilter
)

const perPage = 24
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <UiListPageHeader
      title="Backgrounds"
      :total="totalResults"
      description="Browse D&D 5e character backgrounds"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <!-- Search and Filters -->
    <div class="mb-6">
      <UiFilterCollapse
        v-model="filtersOpen"
        label="Filters"
        :badge-count="activeFilterCount"
      >
        <template #search>
          <UiEntitySearchRow
            v-model:search="searchQuery"
            v-model:sources="selectedSources"
            v-model:sort="sortValue"
            placeholder="Search backgrounds..."
            :source-options="sourceOptions"
            :sort-options="sortOptions"
            color="background"
          />
        </template>

        <!-- Filters: All in primary row to save space -->
        <UiFilterLayout>
          <template #primary>
            <UiFilterMultiSelect
              v-model="selectedSkills"
              :options="skillOptions"
              placeholder="All Skills"
              label="Skills"
              color="background"
              class="w-full sm:w-48"
            />

            <UiFilterMultiSelect
              v-model="selectedToolTypes"
              :options="toolTypeOptions"
              placeholder="All Tools"
              label="Tool Types"
              color="background"
              class="w-full sm:w-48"
            />

            <UiFilterToggle
              v-model="languageChoiceFilter"
              label="Language Choice"
              color="background"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />
          </template>
        </UiFilterLayout>
      </UiFilterCollapse>

      <!-- Active Filter Chips -->
      <UiFilterChips
        :visible="hasActiveFilters"
        :search-query="searchQuery"
        :active-count="activeFilterCount"
        @clear-search="searchQuery = ''"
        @clear-all="clearFilters"
      >
        <template #sources>
          <UiFilterChip
            v-for="source in selectedSources"
            :key="source"
            color="neutral"
            test-id="source-filter-chip"
            @remove="selectedSources = selectedSources.filter(s => s !== source)"
          >
            {{ getSourceName(source) }}
          </UiFilterChip>
        </template>

        <!-- Entity-specific chips -->
        <UiFilterChip
          v-for="skill in selectedSkills"
          :key="skill"
          color="background"
          test-id="skill-filter-chip"
          @remove="selectedSkills = selectedSkills.filter(s => s !== skill)"
        >
          Skill: {{ getSkillName(skill) }}
        </UiFilterChip>
        <UiFilterChip
          v-for="toolType in selectedToolTypes"
          :key="toolType"
          color="background"
          test-id="tool-type-filter-chip"
          @remove="selectedToolTypes = selectedToolTypes.filter(t => t !== toolType)"
        >
          Tool: {{ getToolTypeName(toolType) }}
        </UiFilterChip>

        <template #toggles>
          <UiFilterChip
            v-if="languageChoiceFilter !== null"
            color="primary"
            test-id="language-choice-filter-chip"
            @remove="languageChoiceFilter = null"
          >
            Language Choice: {{ languageChoiceFilter === '1' ? 'Yes' : 'No' }}
          </UiFilterChip>
        </template>
      </UiFilterChips>
    </div>

    <!-- List States (Loading/Error/Empty/Results) -->
    <UiListStates
      :loading="loading"
      :error="error"
      :empty="backgrounds.length === 0"
      :meta="meta"
      :total="totalResults"
      entity-name="background"
      entity-name-plural="Backgrounds"
      :has-filters="hasActiveFilters"
      :current-page="currentPage"
      :per-page="perPage"
      @retry="refresh"
      @clear-filters="clearFilters"
      @update:current-page="currentPage = $event"
    >
      <template #grid>
        <BackgroundCard
          v-for="background in backgrounds"
          :key="background.id"
          :background="background"
        />
      </template>
    </UiListStates>

    <!-- Back to Home -->
    <UiBackLink />
  </div>
</template>
