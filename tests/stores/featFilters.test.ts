import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFeatFiltersStore } from '~/stores/featFilters'

describe('useFeatFiltersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('initializes with default values', () => {
      const store = useFeatFiltersStore()

      expect(store.searchQuery).toBe('')
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('asc')
      expect(store.selectedSources).toEqual([])
      expect(store.hasPrerequisites).toBeNull()
      expect(store.grantsProficiencies).toBeNull()
      expect(store.selectedImprovedAbilities).toEqual([])
      expect(store.selectedPrerequisiteTypes).toEqual([])
      expect(store.filtersOpen).toBe(false)
    })
  })

  describe('hasActiveFilters getter', () => {
    it('returns false when no filters active', () => {
      const store = useFeatFiltersStore()
      expect(store.hasActiveFilters).toBe(false)
    })

    it('returns true when searchQuery has value', () => {
      const store = useFeatFiltersStore()
      store.searchQuery = 'alert'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when hasPrerequisites is set', () => {
      const store = useFeatFiltersStore()
      store.hasPrerequisites = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedSources has values', () => {
      const store = useFeatFiltersStore()
      store.selectedSources = ['PHB']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedImprovedAbilities has values', () => {
      const store = useFeatFiltersStore()
      store.selectedImprovedAbilities = ['STR']
      expect(store.hasActiveFilters).toBe(true)
    })
  })

  describe('activeFilterCount getter', () => {
    it('returns 0 when no filters active', () => {
      const store = useFeatFiltersStore()
      expect(store.activeFilterCount).toBe(0)
    })

    it('counts each active filter', () => {
      const store = useFeatFiltersStore()
      store.hasPrerequisites = '1'
      store.grantsProficiencies = '0'
      store.selectedSources = ['PHB', 'XGTE']
      store.selectedImprovedAbilities = ['STR', 'DEX']

      // hasPrerequisites (1) + grantsProficiencies (1) + sources (2) + abilities (2) = 6
      expect(store.activeFilterCount).toBe(6)
    })

    it('does not count searchQuery in filter count', () => {
      const store = useFeatFiltersStore()
      store.searchQuery = 'alert'
      expect(store.activeFilterCount).toBe(0)
    })
  })

  describe('clearAll action', () => {
    it('resets all filters to defaults', () => {
      const store = useFeatFiltersStore()

      // Set various filters
      store.searchQuery = 'alert'
      store.sortBy = 'level'
      store.sortDirection = 'desc'
      store.selectedSources = ['PHB']
      store.hasPrerequisites = '1'
      store.grantsProficiencies = '0'
      store.selectedImprovedAbilities = ['STR']
      store.selectedPrerequisiteTypes = ['Race']
      store.filtersOpen = true

      store.clearAll()

      expect(store.searchQuery).toBe('')
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('asc')
      expect(store.selectedSources).toEqual([])
      expect(store.hasPrerequisites).toBeNull()
      expect(store.grantsProficiencies).toBeNull()
      expect(store.selectedImprovedAbilities).toEqual([])
      expect(store.selectedPrerequisiteTypes).toEqual([])
      // filtersOpen should NOT be reset (UI preference)
      expect(store.filtersOpen).toBe(true)
    })
  })

  describe('setFromUrlQuery action', () => {
    it('sets filters from URL query object', () => {
      const store = useFeatFiltersStore()

      store.setFromUrlQuery({
        has_prerequisites: '1',
        grants_proficiencies: '0',
        improved_ability: ['STR', 'DEX'],
        prerequisite_type: 'Race',
        source: 'PHB',
        sort_by: 'name',
        sort_direction: 'desc'
      })

      expect(store.hasPrerequisites).toBe('1')
      expect(store.grantsProficiencies).toBe('0')
      expect(store.selectedImprovedAbilities).toEqual(['STR', 'DEX'])
      expect(store.selectedPrerequisiteTypes).toEqual(['Race'])
      expect(store.selectedSources).toEqual(['PHB'])
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('desc')
    })

    it('handles array vs string query params', () => {
      const store = useFeatFiltersStore()

      // Single value as string
      store.setFromUrlQuery({ improved_ability: 'STR' })
      expect(store.selectedImprovedAbilities).toEqual(['STR'])

      // Multiple values as array
      store.setFromUrlQuery({ improved_ability: ['STR', 'DEX'] })
      expect(store.selectedImprovedAbilities).toEqual(['STR', 'DEX'])
    })
  })

  describe('toUrlQuery getter', () => {
    it('returns empty object when no filters active', () => {
      const store = useFeatFiltersStore()
      expect(store.toUrlQuery).toEqual({})
    })

    it('returns query object with active filters', () => {
      const store = useFeatFiltersStore()
      store.hasPrerequisites = '1'
      store.selectedSources = ['PHB']
      store.sortDirection = 'desc'

      expect(store.toUrlQuery).toEqual({
        has_prerequisites: '1',
        source: ['PHB'],
        sort_direction: 'desc'
      })
    })

    it('excludes default sort values', () => {
      const store = useFeatFiltersStore()
      // Default sort - should not appear in URL
      expect(store.toUrlQuery).toEqual({})

      // Non-default sort - should appear
      store.sortBy = 'level'
      expect(store.toUrlQuery).toEqual({ sort_by: 'level' })
    })
  })
})
