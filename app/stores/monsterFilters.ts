import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'
import { idbStorage } from '~/utils/idbStorage'
import { STORE_KEYS } from './types'

export interface MonsterFiltersState {
  // Search & Sort
  searchQuery: string
  sortBy: string
  sortDirection: 'asc' | 'desc'

  // Common filters
  selectedSources: string[]

  // Entity-specific filters
  selectedCRs: string[]
  selectedType: string | null
  isLegendary: string | null
  selectedSizes: string[]
  selectedAlignments: string[]
  selectedMovementTypes: string[]
  selectedArmorTypes: string[]
  canHover: string | null
  hasLairActions: string | null
  hasReactions: string | null
  isSpellcaster: string | null
  hasMagicResistance: string | null
  selectedACRange: string | null
  selectedHPRange: string | null

  // UI state (persisted for convenience)
  filtersOpen: boolean
}

const DEFAULT_STATE: MonsterFiltersState = {
  searchQuery: '',
  sortBy: 'name',
  sortDirection: 'asc',
  selectedSources: [],
  selectedCRs: [],
  selectedType: null,
  isLegendary: null,
  selectedSizes: [],
  selectedAlignments: [],
  selectedMovementTypes: [],
  selectedArmorTypes: [],
  canHover: null,
  hasLairActions: null,
  hasReactions: null,
  isSpellcaster: null,
  hasMagicResistance: null,
  selectedACRange: null,
  selectedHPRange: null,
  filtersOpen: false
}

export const useMonsterFiltersStore = defineStore('monsterFilters', {
  state: (): MonsterFiltersState => ({ ...DEFAULT_STATE }),

  getters: {
    hasActiveFilters: (state): boolean => {
      return (
        state.searchQuery !== '' ||
        state.selectedSources.length > 0 ||
        state.selectedCRs.length > 0 ||
        state.selectedType !== null ||
        state.isLegendary !== null ||
        state.selectedSizes.length > 0 ||
        state.selectedAlignments.length > 0 ||
        state.selectedMovementTypes.length > 0 ||
        state.selectedArmorTypes.length > 0 ||
        state.canHover !== null ||
        state.hasLairActions !== null ||
        state.hasReactions !== null ||
        state.isSpellcaster !== null ||
        state.hasMagicResistance !== null ||
        state.selectedACRange !== null ||
        state.selectedHPRange !== null
      )
    },

    activeFilterCount: (state): number => {
      let count = 0
      // Don't count searchQuery - it's shown separately
      count += state.selectedSources.length
      count += state.selectedCRs.length
      if (state.selectedType !== null) count++
      if (state.isLegendary !== null) count++
      count += state.selectedSizes.length
      count += state.selectedAlignments.length
      count += state.selectedMovementTypes.length
      count += state.selectedArmorTypes.length
      if (state.canHover !== null) count++
      if (state.hasLairActions !== null) count++
      if (state.hasReactions !== null) count++
      if (state.isSpellcaster !== null) count++
      if (state.hasMagicResistance !== null) count++
      if (state.selectedACRange !== null) count++
      if (state.selectedHPRange !== null) count++
      return count
    },

    toUrlQuery: (state): Record<string, string | string[]> => {
      const query: Record<string, string | string[]> = {}

      if (state.selectedCRs.length > 0) {
        query.cr = state.selectedCRs
      }
      if (state.selectedType !== null) {
        query.type = state.selectedType
      }
      if (state.isLegendary !== null) {
        query.is_legendary = state.isLegendary
      }
      if (state.selectedSizes.length > 0) {
        query.size_id = state.selectedSizes
      }
      if (state.selectedAlignments.length > 0) {
        query.alignment = state.selectedAlignments
      }
      if (state.selectedMovementTypes.length > 0) {
        query.movement = state.selectedMovementTypes
      }
      if (state.selectedArmorTypes.length > 0) {
        query.armor_type = state.selectedArmorTypes
      }
      if (state.canHover !== null) {
        query.can_hover = state.canHover
      }
      if (state.hasLairActions !== null) {
        query.has_lair_actions = state.hasLairActions
      }
      if (state.hasReactions !== null) {
        query.has_reactions = state.hasReactions
      }
      if (state.isSpellcaster !== null) {
        query.is_spellcaster = state.isSpellcaster
      }
      if (state.hasMagicResistance !== null) {
        query.has_magic_resistance = state.hasMagicResistance
      }
      if (state.selectedACRange !== null) {
        query.ac_range = state.selectedACRange
      }
      if (state.selectedHPRange !== null) {
        query.hp_range = state.selectedHPRange
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
      if (query.cr) {
        this.selectedCRs = Array.isArray(query.cr)
          ? query.cr.map(String)
          : [String(query.cr)]
      }
      if (query.type) {
        this.selectedType = String(query.type)
      }
      if (query.is_legendary) {
        this.isLegendary = String(query.is_legendary)
      }
      if (query.size_id) {
        this.selectedSizes = Array.isArray(query.size_id)
          ? query.size_id.map(String)
          : [String(query.size_id)]
      }
      if (query.alignment) {
        this.selectedAlignments = Array.isArray(query.alignment)
          ? query.alignment.map(String)
          : [String(query.alignment)]
      }
      if (query.movement) {
        this.selectedMovementTypes = Array.isArray(query.movement)
          ? query.movement.map(String)
          : [String(query.movement)]
      }
      if (query.armor_type) {
        this.selectedArmorTypes = Array.isArray(query.armor_type)
          ? query.armor_type.map(String)
          : [String(query.armor_type)]
      }
      if (query.can_hover) {
        this.canHover = String(query.can_hover)
      }
      if (query.has_lair_actions) {
        this.hasLairActions = String(query.has_lair_actions)
      }
      if (query.has_reactions) {
        this.hasReactions = String(query.has_reactions)
      }
      if (query.is_spellcaster) {
        this.isSpellcaster = String(query.is_spellcaster)
      }
      if (query.has_magic_resistance) {
        this.hasMagicResistance = String(query.has_magic_resistance)
      }
      if (query.ac_range) {
        this.selectedACRange = String(query.ac_range)
      }
      if (query.hp_range) {
        this.selectedHPRange = String(query.hp_range)
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
    key: STORE_KEYS.monsters,
    storage: idbStorage,
    // Don't persist searchQuery - usually not wanted on reload
    paths: [
      'sortBy',
      'sortDirection',
      'selectedSources',
      'selectedCRs',
      'selectedType',
      'isLegendary',
      'selectedSizes',
      'selectedAlignments',
      'selectedMovementTypes',
      'selectedArmorTypes',
      'canHover',
      'hasLairActions',
      'hasReactions',
      'isSpellcaster',
      'hasMagicResistance',
      'selectedACRange',
      'selectedHPRange',
      'filtersOpen'
    ]
  }
})
