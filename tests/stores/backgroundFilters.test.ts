import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBackgroundFiltersStore } from '~/stores/backgroundFilters'

describe('useBackgroundFiltersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('initializes with default values', () => {
      const store = useBackgroundFiltersStore()

      expect(store.searchQuery).toBe('')
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('asc')
      expect(store.selectedSources).toEqual([])
      expect(store.selectedSkills).toEqual([])
      expect(store.selectedToolTypes).toEqual([])
      expect(store.languageChoiceFilter).toBeNull()
      expect(store.filtersOpen).toBe(false)
    })
  })

  describe('hasActiveFilters getter', () => {
    it('returns false when no filters active', () => {
      const store = useBackgroundFiltersStore()
      expect(store.hasActiveFilters).toBe(false)
    })

    it('returns true when searchQuery has value', () => {
      const store = useBackgroundFiltersStore()
      store.searchQuery = 'acolyte'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when languageChoiceFilter is set', () => {
      const store = useBackgroundFiltersStore()
      store.languageChoiceFilter = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedSources has values', () => {
      const store = useBackgroundFiltersStore()
      store.selectedSources = ['PHB']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedSkills has values', () => {
      const store = useBackgroundFiltersStore()
      store.selectedSkills = ['athletics']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedToolTypes has values', () => {
      const store = useBackgroundFiltersStore()
      store.selectedToolTypes = ['artisan-tools']
      expect(store.hasActiveFilters).toBe(true)
    })
  })

  describe('activeFilterCount getter', () => {
    it('returns 0 when no filters active', () => {
      const store = useBackgroundFiltersStore()
      expect(store.activeFilterCount).toBe(0)
    })

    it('counts each active filter', () => {
      const store = useBackgroundFiltersStore()
      store.languageChoiceFilter = '1'
      store.selectedSources = ['PHB', 'ERLW']
      store.selectedSkills = ['athletics', 'acrobatics']
      store.selectedToolTypes = ['artisan-tools']

      // languageChoiceFilter (1) + sources (2) + skills (2) + toolTypes (1) = 6
      expect(store.activeFilterCount).toBe(6)
    })

    it('does not count searchQuery in filter count', () => {
      const store = useBackgroundFiltersStore()
      store.searchQuery = 'acolyte'
      expect(store.activeFilterCount).toBe(0)
    })
  })

  describe('clearAll action', () => {
    it('resets all filters to defaults', () => {
      const store = useBackgroundFiltersStore()

      // Set various filters
      store.searchQuery = 'acolyte'
      store.sortBy = 'level'
      store.sortDirection = 'desc'
      store.selectedSources = ['PHB']
      store.selectedSkills = ['athletics']
      store.selectedToolTypes = ['artisan-tools']
      store.languageChoiceFilter = '1'
      store.filtersOpen = true

      store.clearAll()

      expect(store.searchQuery).toBe('')
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('asc')
      expect(store.selectedSources).toEqual([])
      expect(store.selectedSkills).toEqual([])
      expect(store.selectedToolTypes).toEqual([])
      expect(store.languageChoiceFilter).toBeNull()
      // filtersOpen should NOT be reset (UI preference)
      expect(store.filtersOpen).toBe(true)
    })
  })

  describe('setFromUrlQuery action', () => {
    it('sets filters from URL query object', () => {
      const store = useBackgroundFiltersStore()

      store.setFromUrlQuery({
        skill: ['athletics', 'acrobatics'],
        tool_type: 'artisan-tools',
        grants_language_choice: '1',
        source: 'PHB',
        sort_by: 'name',
        sort_direction: 'desc'
      })

      expect(store.selectedSkills).toEqual(['athletics', 'acrobatics'])
      expect(store.selectedToolTypes).toEqual(['artisan-tools'])
      expect(store.languageChoiceFilter).toBe('1')
      expect(store.selectedSources).toEqual(['PHB'])
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('desc')
    })

    it('handles array vs string query params', () => {
      const store = useBackgroundFiltersStore()

      // Single value as string
      store.setFromUrlQuery({ skill: 'athletics' })
      expect(store.selectedSkills).toEqual(['athletics'])

      // Multiple values as array
      store.setFromUrlQuery({ skill: ['athletics', 'acrobatics'] })
      expect(store.selectedSkills).toEqual(['athletics', 'acrobatics'])
    })
  })

  describe('toUrlQuery getter', () => {
    it('returns empty object when no filters active', () => {
      const store = useBackgroundFiltersStore()
      expect(store.toUrlQuery).toEqual({})
    })

    it('returns query object with active filters', () => {
      const store = useBackgroundFiltersStore()
      store.languageChoiceFilter = '1'
      store.selectedSources = ['PHB']
      store.sortDirection = 'desc'

      expect(store.toUrlQuery).toEqual({
        grants_language_choice: '1',
        source: ['PHB'],
        sort_direction: 'desc'
      })
    })

    it('excludes default sort values', () => {
      const store = useBackgroundFiltersStore()
      // Default sort - should not appear in URL
      expect(store.toUrlQuery).toEqual({})

      // Non-default sort - should appear
      store.sortBy = 'level'
      expect(store.toUrlQuery).toEqual({ sort_by: 'level' })
    })

    it('includes array filters in query', () => {
      const store = useBackgroundFiltersStore()
      store.selectedSkills = ['athletics', 'acrobatics']
      store.selectedToolTypes = ['artisan-tools', 'musical-instruments']

      expect(store.toUrlQuery).toEqual({
        skill: ['athletics', 'acrobatics'],
        tool_type: ['artisan-tools', 'musical-instruments']
      })
    })
  })
})
