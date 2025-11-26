import { describe } from 'vitest'
import { useBackgroundFiltersStore } from '~/stores/backgroundFilters'
import { usePiniaSetup } from '../helpers/storeSetup'
import {
  testInitialState,
  testHasActiveFilters,
  testActiveFilterCount,
  testClearAllAction,
  testSetFromUrlQuery,
  testToUrlQuery
} from '../helpers/filterStoreBehavior'

describe('useBackgroundFiltersStore', () => {
  usePiniaSetup()

  testInitialState(useBackgroundFiltersStore, {
    searchQuery: '',
    sortBy: 'name',
    sortDirection: 'asc',
    selectedSources: [],
    selectedSkills: [],
    selectedToolTypes: [],
    languageChoiceFilter: null,
    filtersOpen: false
  })

  testHasActiveFilters(useBackgroundFiltersStore, [
    { field: 'searchQuery', value: 'acolyte' },
    { field: 'languageChoiceFilter', value: '1' },
    { field: 'selectedSources', value: ['PHB'] },
    { field: 'selectedSkills', value: ['athletics'] },
    { field: 'selectedToolTypes', value: ['artisan-tools'] }
  ])

  testActiveFilterCount(useBackgroundFiltersStore, [
    {
      description: 'counts each active filter',
      setup: (store) => {
        store.languageChoiceFilter = '1'
        store.selectedSources = ['PHB', 'ERLW']
        store.selectedSkills = ['athletics', 'acrobatics']
        store.selectedToolTypes = ['artisan-tools']
      },
      expectedCount: 6 // languageChoiceFilter (1) + sources (2) + skills (2) + toolTypes (1) = 6
    },
    {
      description: 'does not count searchQuery in filter count',
      setup: (store) => {
        store.searchQuery = 'acolyte'
      },
      expectedCount: 0
    }
  ])

  testClearAllAction(useBackgroundFiltersStore, {
    setFilters: (store) => {
      store.searchQuery = 'acolyte'
      store.sortBy = 'level'
      store.sortDirection = 'desc'
      store.selectedSources = ['PHB']
      store.selectedSkills = ['athletics']
      store.selectedToolTypes = ['artisan-tools']
      store.languageChoiceFilter = '1'
      store.filtersOpen = true
    },
    expectedDefaults: {
      searchQuery: '',
      sortBy: 'name',
      sortDirection: 'asc',
      selectedSources: [],
      selectedSkills: [],
      selectedToolTypes: [],
      languageChoiceFilter: null
    },
    preservedFields: [
      { field: 'filtersOpen', value: true }
    ]
  })

  testSetFromUrlQuery(useBackgroundFiltersStore, [
    {
      name: 'sets filters from URL query object',
      query: {
        skill: ['athletics', 'acrobatics'],
        tool_type: 'artisan-tools',
        grants_language_choice: '1',
        source: 'PHB',
        sort_by: 'name',
        sort_direction: 'desc'
      },
      expectedState: {
        selectedSkills: ['athletics', 'acrobatics'],
        selectedToolTypes: ['artisan-tools'],
        languageChoiceFilter: '1',
        selectedSources: ['PHB'],
        sortBy: 'name',
        sortDirection: 'desc'
      }
    },
    {
      name: 'array vs string query params (single value)',
      query: { skill: 'athletics' },
      expectedState: {
        selectedSkills: ['athletics']
      }
    },
    {
      name: 'array vs string query params (multiple values)',
      query: { skill: ['athletics', 'acrobatics'] },
      expectedState: {
        selectedSkills: ['athletics', 'acrobatics']
      }
    }
  ])

  testToUrlQuery(useBackgroundFiltersStore, [
    {
      name: 'returns empty object when no filters active',
      setup: () => {},
      expectedQuery: {}
    },
    {
      name: 'returns query object with active filters',
      setup: (store) => {
        store.languageChoiceFilter = '1'
        store.selectedSources = ['PHB']
        store.sortDirection = 'desc'
      },
      expectedQuery: {
        grants_language_choice: '1',
        source: ['PHB'],
        sort_direction: 'desc'
      }
    },
    {
      name: 'excludes default sort values',
      setup: () => {},
      expectedQuery: {}
    },
    {
      name: 'includes non-default sort values',
      setup: (store) => {
        store.sortBy = 'level'
      },
      expectedQuery: {
        sort_by: 'level'
      }
    },
    {
      name: 'includes array filters in query',
      setup: (store) => {
        store.selectedSkills = ['athletics', 'acrobatics']
        store.selectedToolTypes = ['artisan-tools', 'musical-instruments']
      },
      expectedQuery: {
        skill: ['athletics', 'acrobatics'],
        tool_type: ['artisan-tools', 'musical-instruments']
      }
    }
  ])
})
