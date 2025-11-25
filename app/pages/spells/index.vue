<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SpellSchool, Spell, CharacterClass, DamageType, AbilityScore } from '~/types'

const route = useRoute()
// Note: useApi no longer needed for reference fetches (handled by useReferenceData)

// Filter collapse state
const filtersOpen = ref(false)

// Custom filter state (entity-specific)
const selectedLevel = ref(route.query.level ? Number(route.query.level) : null)
const selectedSchool = ref(route.query.school ? Number(route.query.school) : null)
const selectedClass = ref<string | null>((route.query.class as string) || null)
const concentrationFilter = ref<string | null>((route.query.concentration as string) || null)
const ritualFilter = ref<string | null>((route.query.ritual as string) || null)

// Phase 1: Multi-select filters
const selectedDamageTypes = ref<string[]>(
  route.query.damage_type ? (Array.isArray(route.query.damage_type) ? route.query.damage_type : [route.query.damage_type]) as string[] : []
)
const selectedSavingThrows = ref<string[]>(
  route.query.saving_throw ? (Array.isArray(route.query.saving_throw) ? route.query.saving_throw : [route.query.saving_throw]) as string[] : []
)

// Phase 2: Component flag filters
const verbalFilter = ref<string | null>((route.query.has_verbal as string) || null)
const somaticFilter = ref<string | null>((route.query.has_somatic as string) || null)
const materialFilter = ref<string | null>((route.query.has_material as string) || null)

// Phase 3: Removed unsupported filters (not indexed in Meilisearch):
// - higherLevelsFilter (has_higher_levels not filterable)
// - castingTimeFilter (casting_time not filterable)
// - rangeFilter (range not filterable)
// - durationFilter (duration not filterable)

// Fetch reference data for filter options (using composable)
const { data: spellSchools } = useReferenceData<SpellSchool>('/spell-schools')

const { data: classes } = useReferenceData<CharacterClass>('/classes', {
  pages: 2,
  transform: (data) => data.filter(c => c.is_base_class === true)
})

const { data: damageTypes } = useReferenceData<DamageType>('/damage-types')

const { data: abilityScores } = useReferenceData<AbilityScore>('/ability-scores')

// Spell level options (0 = Cantrip, 1-9 = Spell levels)
const levelOptions = [
  { label: 'All Levels', value: null },
  { label: 'Cantrip', value: 0 },
  { label: '1st Level', value: 1 },
  { label: '2nd Level', value: 2 },
  { label: '3rd Level', value: 3 },
  { label: '4th Level', value: 4 },
  { label: '5th Level', value: 5 },
  { label: '6th Level', value: 6 },
  { label: '7th Level', value: 7 },
  { label: '8th Level', value: 8 },
  { label: '9th Level', value: 9 }
]

// School filter options
const schoolOptions = computed(() => {
  const options: Array<{ label: string, value: number | null }> = [{ label: 'All Schools', value: null }]
  if (spellSchools.value) {
    options.push(...spellSchools.value.map(school => ({
      label: school.name,
      value: school.id
    })))
  }
  return options
})

// Class filter options (already filtered to base classes, just sort)
const classOptions = computed(() => {
  const options: Array<{ label: string, value: string | null }> = [{ label: 'All Classes', value: null }]
  if (classes.value) {
    // Create a copy before sorting to avoid mutating the reactive array
    const sortedClasses = [...classes.value].sort((a, b) => a.name.localeCompare(b.name))

    options.push(...sortedClasses.map(cls => ({
      label: cls.name,
      value: cls.slug
    })))
  }
  return options
})

// Phase 1: Damage type filter options
const damageTypeOptions = computed(() => {
  if (!damageTypes.value) return []
  return damageTypes.value.map(dt => ({
    label: dt.name,
    value: dt.code
  }))
})

// Phase 1: Saving throw filter options (use ability score codes)
const savingThrowOptions = computed(() => {
  if (!abilityScores.value) return []
  return abilityScores.value.map(ab => ({
    label: ab.code, // Display just "STR", "DEX", etc.
    value: ab.code
  }))
})

// Phase 3: Removed unsupported filter options (not indexed in Meilisearch)
// - castingTimeOptions (casting_time not filterable)
// - rangeOptions (range not filterable)
// - durationOptions (duration not filterable)
// Users can search for these values using full-text search (?q=1 action)

// Query builder for custom filters (using composable)
const { queryParams } = useMeilisearchFilters([
  { ref: selectedLevel, field: 'level' },
  {
    ref: selectedSchool,
    field: 'school_code',
    transform: (id) => spellSchools.value?.find(s => s.id === id)?.code || null
  },
  { ref: selectedClass, field: 'class_slugs', type: 'in' },
  { ref: concentrationFilter, field: 'concentration', type: 'boolean' },
  { ref: ritualFilter, field: 'ritual', type: 'boolean' },
  { ref: selectedDamageTypes, field: 'damage_types', type: 'in' },
  { ref: selectedSavingThrows, field: 'saving_throws', type: 'in' },
  { ref: verbalFilter, field: 'requires_verbal', type: 'boolean' },
  { ref: somaticFilter, field: 'requires_somatic', type: 'boolean' },
  { ref: materialFilter, field: 'requires_material', type: 'boolean' }
])

// Use entity list composable for all shared logic
const {
  searchQuery,
  currentPage,
  data: spellsData,
  meta,
  totalResults,
  loading,
  error,
  refresh,
  clearFilters: clearBaseFilters,
  hasActiveFilters
} = useEntityList({
  endpoint: '/spells',
  cacheKey: 'spells-list',
  queryBuilder: queryParams,
  seo: {
    title: 'Spells - D&D 5e Compendium',
    description: 'Browse all D&D 5e spells. Filter by level, school, and search for specific spells.'
  }
})

const spells = computed(() => spellsData.value as Spell[])

// Clear all filters (base + custom)
const clearFilters = () => {
  clearBaseFilters()
  selectedLevel.value = null
  selectedSchool.value = null
  selectedClass.value = null
  concentrationFilter.value = null
  ritualFilter.value = null
  // Phase 1: Clear multi-select filters
  selectedDamageTypes.value = []
  selectedSavingThrows.value = []
  // Phase 2: Clear component flag filters
  verbalFilter.value = null
  somaticFilter.value = null
  materialFilter.value = null
  // Phase 3: Removed unsupported filters (already removed from refs)
}

// Get school name by ID for filter chips
const getSchoolName = (schoolId: number) => {
  return spellSchools.value?.find(s => s.id === schoolId)?.name || 'Unknown'
}

// Get class name by slug for filter chips
const getClassName = (classSlug: string) => {
  return classes.value?.find(c => c.slug === classSlug)?.name || 'Unknown'
}

// Phase 1: Get damage type name by code for filter chips
const getDamageTypeName = (code: string) => {
  return damageTypes.value?.find(dt => dt.code === code)?.name || code
}

// Phase 1: Get ability score name by code for filter chips (just return code for compactness)
const getSavingThrowName = (code: string) => {
  return code // Display "STR", "DEX", etc.
}

// Pagination settings
const perPage = 24

// Count active filters (excluding search) for collapse badge (using composable)
const activeFilterCount = useFilterCount(
  selectedLevel,
  selectedSchool,
  selectedClass,
  concentrationFilter,
  ritualFilter,
  selectedDamageTypes,
  selectedSavingThrows,
  verbalFilter,
  somaticFilter,
  materialFilter
)
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <UiListPageHeader
      title="Spells"
      :total="totalResults"
      description="Browse and search D&D 5e spells"
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
          <UInput
            v-model="searchQuery"
            placeholder="Search spells..."
            class="flex-1"
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
        </template>

        <!-- Filter Content -->
        <UiFilterLayout>
          <!-- Primary Filters: Most frequently used (Level, School, Class) -->
          <template #primary>
            <USelectMenu
              v-model="selectedLevel"
              :items="levelOptions"
              value-key="value"
              placeholder="All Levels"
              size="md"
              class="w-full sm:w-48"
            />

            <USelectMenu
              v-model="selectedSchool"
              :items="schoolOptions"
              value-key="value"
              placeholder="All Schools"
              size="md"
              class="w-full sm:w-48"
            />

            <USelectMenu
              v-model="selectedClass"
              :items="classOptions"
              value-key="value"
              placeholder="All Classes"
              size="md"
              class="w-full sm:w-48"
            />
          </template>

          <!-- Quick Toggles: Binary filters (Concentration, Ritual, Components) -->
          <template #quick>
            <UiFilterToggle
              v-model="concentrationFilter"
              label="Concentration"
              color="primary"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />

            <UiFilterToggle
              v-model="ritualFilter"
              label="Ritual"
              color="primary"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />

            <UiFilterToggle
              v-model="verbalFilter"
              label="Verbal"
              color="primary"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />

            <UiFilterToggle
              v-model="somaticFilter"
              label="Somatic"
              color="primary"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />

            <UiFilterToggle
              v-model="materialFilter"
              label="Material"
              color="primary"
              :options="[
                { value: null, label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]"
            />
          </template>

          <!-- Advanced Filters: Less frequently used (Damage Types, Saving Throws) -->
          <template #advanced>
            <UiFilterMultiSelect
              v-model="selectedDamageTypes"
              :options="damageTypeOptions"
              label="Damage Types"
              placeholder="All Damage Types"
              color="primary"
              class="w-full sm:w-48"
            />

            <UiFilterMultiSelect
              v-model="selectedSavingThrows"
              :options="savingThrowOptions"
              label="Saving Throws"
              placeholder="All Saving Throws"
              color="primary"
              class="w-full sm:w-48"
            />
          </template>

          <!-- Actions: Clear filters button -->
          <template #actions>
            <UButton
              v-if="hasActiveFilters"
              color="neutral"
              variant="soft"
              @click="clearFilters"
            >
              Clear Filters
            </UButton>
          </template>
        </UiFilterLayout>
      </UiFilterCollapse>

      <!-- Active Filter Chips -->
      <div
        v-if="hasActiveFilters"
        class="flex flex-wrap items-center gap-2 pt-2"
      >
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Active:</span>
        <UButton
          v-if="selectedLevel !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="selectedLevel = null"
        >
          Level {{ selectedLevel === 0 ? 'Cantrip' : selectedLevel }} ✕
        </UButton>
        <UButton
          v-if="selectedSchool !== null"
          size="xs"
          color="info"
          variant="soft"
          @click="selectedSchool = null"
        >
          {{ getSchoolName(selectedSchool) }} ✕
        </UButton>
        <UButton
          v-if="selectedClass !== null"
          size="xs"
          color="class"
          variant="soft"
          @click="selectedClass = null"
        >
          {{ getClassName(selectedClass) }} ✕
        </UButton>
        <UButton
          v-if="searchQuery"
          size="xs"
          color="neutral"
          variant="soft"
          @click="searchQuery = ''"
        >
          "{{ searchQuery }}" ✕
        </UButton>
        <UButton
          v-if="concentrationFilter !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="concentrationFilter = null"
        >
          Concentration: {{ concentrationFilter === '1' ? 'Yes' : 'No' }} ✕
        </UButton>
        <UButton
          v-if="ritualFilter !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="ritualFilter = null"
        >
          Ritual: {{ ritualFilter === '1' ? 'Yes' : 'No' }} ✕
        </UButton>
        <!-- Phase 1: Damage type chips -->
        <UButton
          v-for="damageType in selectedDamageTypes"
          :key="damageType"
          size="xs"
          color="error"
          variant="soft"
          @click="selectedDamageTypes = selectedDamageTypes.filter(dt => dt !== damageType)"
        >
          {{ getDamageTypeName(damageType) }} ✕
        </UButton>
        <!-- Phase 1: Saving throw chips -->
        <UButton
          v-for="savingThrow in selectedSavingThrows"
          :key="savingThrow"
          size="xs"
          color="info"
          variant="soft"
          @click="selectedSavingThrows = selectedSavingThrows.filter(st => st !== savingThrow)"
        >
          {{ getSavingThrowName(savingThrow) }} Save ✕
        </UButton>
        <!-- Phase 2: Component flag chips -->
        <UButton
          v-if="verbalFilter !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="verbalFilter = null"
        >
          Verbal: {{ verbalFilter === '1' ? 'Yes' : 'No' }} ✕
        </UButton>
        <UButton
          v-if="somaticFilter !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="somaticFilter = null"
        >
          Somatic: {{ somaticFilter === '1' ? 'Yes' : 'No' }} ✕
        </UButton>
        <UButton
          v-if="materialFilter !== null"
          size="xs"
          color="primary"
          variant="soft"
          @click="materialFilter = null"
        >
          Material: {{ materialFilter === '1' ? 'Yes' : 'No' }} ✕
        </UButton>
        <!-- Removed: Filter chips for unsupported filters (higherLevels, castingTime, range, duration) -->
      </div>
    </div>

    <!-- Loading State (Skeleton Cards) -->
    <UiListSkeletonCards v-if="loading" />

    <!-- Error State -->
    <UiListErrorState
      v-else-if="error"
      :error="error"
      entity-name="Spells"
      @retry="refresh"
    />

    <!-- Empty State -->
    <UiListEmptyState
      v-else-if="spells.length === 0"
      entity-name="spells"
      :has-filters="hasActiveFilters"
      @clear-filters="clearFilters"
    />

    <!-- Results -->
    <div v-else>
      <!-- Results count -->
      <UiListResultsCount
        :from="meta?.from || 0"
        :to="meta?.to || 0"
        :total="totalResults"
        entity-name="spell"
      />

      <!-- Spells Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SpellCard
          v-for="spell in spells"
          :key="spell.id"
          :spell="spell"
        />
      </div>

      <!-- Pagination -->
      <UiListPagination
        v-model="currentPage"
        :total="totalResults"
        :items-per-page="perPage"
      />
    </div>

    <!-- Back to Home -->
    <UiBackLink />
  </div>
</template>
