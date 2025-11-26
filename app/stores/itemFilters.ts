import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'
import { idbStorage } from '~/utils/idbStorage'
import { STORE_KEYS } from './types'

export interface ItemFiltersState {
  // Search & Sort
  searchQuery: string
  sortBy: string
  sortDirection: 'asc' | 'desc'

  // Common filters
  selectedSources: string[]

  // Entity-specific filters - Primary
  selectedType: number | null
  selectedRarity: string | null
  selectedMagic: string | null

  // Quick toggles
  hasCharges: string | null
  requiresAttunement: string | null
  stealthDisadvantage: string | null

  // Advanced filters - arrays
  selectedProperties: string[]
  selectedDamageTypes: string[]
  selectedDamageDice: string[]
  selectedVersatileDamage: string[]
  selectedRechargeTiming: string[]

  // Advanced filters - singles
  selectedStrengthReq: string | null
  selectedRange: string | null
  selectedCostRange: string | null
  selectedACRange: string | null

  // UI state (persisted for convenience)
  filtersOpen: boolean
}

const DEFAULT_STATE: ItemFiltersState = {
  searchQuery: '',
  sortBy: 'name',
  sortDirection: 'asc',
  selectedSources: [],
  selectedType: null,
  selectedRarity: null,
  selectedMagic: null,
  hasCharges: null,
  requiresAttunement: null,
  stealthDisadvantage: null,
  selectedProperties: [],
  selectedDamageTypes: [],
  selectedDamageDice: [],
  selectedVersatileDamage: [],
  selectedRechargeTiming: [],
  selectedStrengthReq: null,
  selectedRange: null,
  selectedCostRange: null,
  selectedACRange: null,
  filtersOpen: false
}

export const useItemFiltersStore = defineStore('itemFilters', {
  state: (): ItemFiltersState => ({ ...DEFAULT_STATE }),

  getters: {
    hasActiveFilters: (state): boolean => {
      return (
        state.searchQuery !== '' ||
        state.selectedSources.length > 0 ||
        state.selectedType !== null ||
        state.selectedRarity !== null ||
        state.selectedMagic !== null ||
        state.hasCharges !== null ||
        state.requiresAttunement !== null ||
        state.stealthDisadvantage !== null ||
        state.selectedProperties.length > 0 ||
        state.selectedDamageTypes.length > 0 ||
        state.selectedDamageDice.length > 0 ||
        state.selectedVersatileDamage.length > 0 ||
        state.selectedRechargeTiming.length > 0 ||
        state.selectedStrengthReq !== null ||
        state.selectedRange !== null ||
        state.selectedCostRange !== null ||
        state.selectedACRange !== null
      )
    },

    activeFilterCount: (state): number => {
      let count = 0
      // Don't count searchQuery - it's shown separately
      count += state.selectedSources.length
      if (state.selectedType !== null) count++
      if (state.selectedRarity !== null) count++
      if (state.selectedMagic !== null) count++
      if (state.hasCharges !== null) count++
      if (state.requiresAttunement !== null) count++
      if (state.stealthDisadvantage !== null) count++
      count += state.selectedProperties.length
      count += state.selectedDamageTypes.length
      count += state.selectedDamageDice.length
      count += state.selectedVersatileDamage.length
      count += state.selectedRechargeTiming.length
      if (state.selectedStrengthReq !== null) count++
      if (state.selectedRange !== null) count++
      if (state.selectedCostRange !== null) count++
      if (state.selectedACRange !== null) count++
      return count
    },

    toUrlQuery: (state): Record<string, string | string[]> => {
      const query: Record<string, string | string[]> = {}

      if (state.selectedType !== null) {
        query.type = String(state.selectedType)
      }
      if (state.selectedRarity !== null) {
        query.rarity = state.selectedRarity
      }
      if (state.selectedMagic !== null) {
        query.is_magic = state.selectedMagic
      }
      if (state.hasCharges !== null) {
        query.has_charges = state.hasCharges
      }
      if (state.requiresAttunement !== null) {
        query.requires_attunement = state.requiresAttunement
      }
      if (state.stealthDisadvantage !== null) {
        query.stealth_disadvantage = state.stealthDisadvantage
      }
      if (state.selectedProperties.length > 0) {
        query.property = state.selectedProperties
      }
      if (state.selectedDamageTypes.length > 0) {
        query.damage_type = state.selectedDamageTypes
      }
      if (state.selectedDamageDice.length > 0) {
        query.damage_dice = state.selectedDamageDice
      }
      if (state.selectedVersatileDamage.length > 0) {
        query.versatile_damage = state.selectedVersatileDamage
      }
      if (state.selectedRechargeTiming.length > 0) {
        query.recharge_timing = state.selectedRechargeTiming
      }
      if (state.selectedStrengthReq !== null) {
        query.strength_req = state.selectedStrengthReq
      }
      if (state.selectedRange !== null) {
        query.range = state.selectedRange
      }
      if (state.selectedCostRange !== null) {
        query.cost = state.selectedCostRange
      }
      if (state.selectedACRange !== null) {
        query.ac = state.selectedACRange
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
      if (query.type) {
        this.selectedType = Number(query.type)
      }
      if (query.rarity) {
        this.selectedRarity = String(query.rarity)
      }
      if (query.is_magic) {
        this.selectedMagic = String(query.is_magic)
      }
      if (query.has_charges) {
        this.hasCharges = String(query.has_charges)
      }
      if (query.requires_attunement) {
        this.requiresAttunement = String(query.requires_attunement)
      }
      if (query.stealth_disadvantage) {
        this.stealthDisadvantage = String(query.stealth_disadvantage)
      }
      if (query.property) {
        this.selectedProperties = Array.isArray(query.property)
          ? query.property.map(String)
          : [String(query.property)]
      }
      if (query.damage_type) {
        this.selectedDamageTypes = Array.isArray(query.damage_type)
          ? query.damage_type.map(String)
          : [String(query.damage_type)]
      }
      if (query.damage_dice) {
        this.selectedDamageDice = Array.isArray(query.damage_dice)
          ? query.damage_dice.map(String)
          : [String(query.damage_dice)]
      }
      if (query.versatile_damage) {
        this.selectedVersatileDamage = Array.isArray(query.versatile_damage)
          ? query.versatile_damage.map(String)
          : [String(query.versatile_damage)]
      }
      if (query.recharge_timing) {
        this.selectedRechargeTiming = Array.isArray(query.recharge_timing)
          ? query.recharge_timing.map(String)
          : [String(query.recharge_timing)]
      }
      if (query.strength_req) {
        this.selectedStrengthReq = String(query.strength_req)
      }
      if (query.range) {
        this.selectedRange = String(query.range)
      }
      if (query.cost) {
        this.selectedCostRange = String(query.cost)
      }
      if (query.ac) {
        this.selectedACRange = String(query.ac)
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
    key: STORE_KEYS.items,
    storage: idbStorage,
    // Don't persist searchQuery - usually not wanted on reload
    paths: [
      'sortBy',
      'sortDirection',
      'selectedSources',
      'selectedType',
      'selectedRarity',
      'selectedMagic',
      'hasCharges',
      'requiresAttunement',
      'stealthDisadvantage',
      'selectedProperties',
      'selectedDamageTypes',
      'selectedDamageDice',
      'selectedVersatileDamage',
      'selectedRechargeTiming',
      'selectedStrengthReq',
      'selectedRange',
      'selectedCostRange',
      'selectedACRange',
      'filtersOpen'
    ]
  }
})
