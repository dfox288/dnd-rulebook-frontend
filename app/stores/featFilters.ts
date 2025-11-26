import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'
import { idbStorage } from '~/utils/idbStorage'
import { STORE_KEYS } from './types'

export interface FeatFiltersState {
  // Search & Sort
  searchQuery: string
  sortBy: string
  sortDirection: 'asc' | 'desc'

  // Common filters
  selectedSources: string[]

  // Entity-specific filters
  hasPrerequisites: string | null
  grantsProficiencies: string | null
  selectedImprovedAbilities: string[]
  selectedPrerequisiteTypes: string[]

  // UI state (persisted for convenience)
  filtersOpen: boolean
}

const DEFAULT_STATE: FeatFiltersState = {
  searchQuery: '',
  sortBy: 'name',
  sortDirection: 'asc',
  selectedSources: [],
  hasPrerequisites: null,
  grantsProficiencies: null,
  selectedImprovedAbilities: [],
  selectedPrerequisiteTypes: [],
  filtersOpen: false
}

export const useFeatFiltersStore = defineStore('featFilters', {
  state: (): FeatFiltersState => ({ ...DEFAULT_STATE }),

  getters: {
    hasActiveFilters: (state): boolean => {
      return (
        state.searchQuery !== '' ||
        state.selectedSources.length > 0 ||
        state.hasPrerequisites !== null ||
        state.grantsProficiencies !== null ||
        state.selectedImprovedAbilities.length > 0 ||
        state.selectedPrerequisiteTypes.length > 0
      )
    },

    activeFilterCount: (state): number => {
      let count = 0
      // Don't count searchQuery - it's shown separately
      count += state.selectedSources.length
      if (state.hasPrerequisites !== null) count++
      if (state.grantsProficiencies !== null) count++
      count += state.selectedImprovedAbilities.length
      count += state.selectedPrerequisiteTypes.length
      return count
    },

    toUrlQuery: (state): Record<string, string | string[]> => {
      const query: Record<string, string | string[]> = {}

      if (state.hasPrerequisites !== null) {
        query.has_prerequisites = state.hasPrerequisites
      }
      if (state.grantsProficiencies !== null) {
        query.grants_proficiencies = state.grantsProficiencies
      }
      if (state.selectedImprovedAbilities.length > 0) {
        query.improved_ability = state.selectedImprovedAbilities
      }
      if (state.selectedPrerequisiteTypes.length > 0) {
        query.prerequisite_type = state.selectedPrerequisiteTypes
      }
      if (state.selectedSources.length > 0) {
        query.source = state.selectedSources
      }
      // Only include sort if non-default
      if (state.sortBy !== 'name') {
        query.sort_by = state.sortBy
      }
      if (state.sortDirection !== 'asc') {
        query.sort_direction = state.sortDirection
      }

      return query
    }
  },

  actions: {
    clearAll() {
      // Reset all except filtersOpen (UI preference)
      const filtersOpen = this.filtersOpen
      this.$reset()
      this.filtersOpen = filtersOpen
    },

    setFromUrlQuery(query: LocationQuery) {
      // Parse URL query params into store state
      if (query.has_prerequisites) {
        this.hasPrerequisites = String(query.has_prerequisites)
      }
      if (query.grants_proficiencies) {
        this.grantsProficiencies = String(query.grants_proficiencies)
      }
      if (query.improved_ability) {
        this.selectedImprovedAbilities = Array.isArray(query.improved_ability)
          ? query.improved_ability.map(String)
          : [String(query.improved_ability)]
      }
      if (query.prerequisite_type) {
        this.selectedPrerequisiteTypes = Array.isArray(query.prerequisite_type)
          ? query.prerequisite_type.map(String)
          : [String(query.prerequisite_type)]
      }
      if (query.source) {
        this.selectedSources = Array.isArray(query.source)
          ? query.source.map(String)
          : [String(query.source)]
      }
      if (query.sort_by) {
        this.sortBy = String(query.sort_by)
      }
      if (query.sort_direction) {
        this.sortDirection = query.sort_direction as 'asc' | 'desc'
      }
    }
  },

  persist: {
    key: STORE_KEYS.feats,
    storage: idbStorage,
    // Don't persist searchQuery - usually not wanted on reload
    paths: [
      'sortBy',
      'sortDirection',
      'selectedSources',
      'hasPrerequisites',
      'grantsProficiencies',
      'selectedImprovedAbilities',
      'selectedPrerequisiteTypes',
      'filtersOpen'
    ]
  }
})
