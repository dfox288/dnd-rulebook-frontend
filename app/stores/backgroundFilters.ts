import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'
import { idbStorage } from '~/utils/idbStorage'
import { STORE_KEYS } from './types'

export interface BackgroundFiltersState {
  // Search & Sort
  searchQuery: string
  sortBy: string
  sortDirection: 'asc' | 'desc'

  // Common filters
  selectedSources: string[]

  // Entity-specific filters
  selectedSkills: string[]
  selectedToolTypes: string[]
  languageChoiceFilter: string | null

  // UI state (persisted for convenience)
  filtersOpen: boolean
}

const DEFAULT_STATE: BackgroundFiltersState = {
  searchQuery: '',
  sortBy: 'name',
  sortDirection: 'asc',
  selectedSources: [],
  selectedSkills: [],
  selectedToolTypes: [],
  languageChoiceFilter: null,
  filtersOpen: false
}

export const useBackgroundFiltersStore = defineStore('backgroundFilters', {
  state: (): BackgroundFiltersState => ({ ...DEFAULT_STATE }),

  getters: {
    hasActiveFilters(state): boolean {
      return (
        state.searchQuery !== '' ||
        state.selectedSources.length > 0 ||
        state.selectedSkills.length > 0 ||
        state.selectedToolTypes.length > 0 ||
        state.languageChoiceFilter !== null
      )
    },

    activeFilterCount(state): number {
      let count = 0
      // Don't count searchQuery - it's shown separately
      count += state.selectedSources.length
      count += state.selectedSkills.length
      count += state.selectedToolTypes.length
      if (state.languageChoiceFilter !== null) count++
      return count
    },

    toUrlQuery(state): Record<string, string | string[]> {
      const query: Record<string, string | string[]> = {}

      if (state.languageChoiceFilter !== null) {
        query.grants_language_choice = state.languageChoiceFilter
      }
      if (state.selectedSkills.length > 0) {
        query.skill = state.selectedSkills
      }
      if (state.selectedToolTypes.length > 0) {
        query.tool_type = state.selectedToolTypes
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
      if (query.grants_language_choice) {
        this.languageChoiceFilter = String(query.grants_language_choice)
      }
      if (query.skill) {
        this.selectedSkills = Array.isArray(query.skill)
          ? query.skill.map(String)
          : [String(query.skill)]
      }
      if (query.tool_type) {
        this.selectedToolTypes = Array.isArray(query.tool_type)
          ? query.tool_type.map(String)
          : [String(query.tool_type)]
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
    key: STORE_KEYS.backgrounds,
    storage: idbStorage,
    // Don't persist searchQuery - usually not wanted on reload
    paths: [
      'sortBy',
      'sortDirection',
      'selectedSources',
      'selectedSkills',
      'selectedToolTypes',
      'languageChoiceFilter',
      'filtersOpen'
    ]
  } as any
})
