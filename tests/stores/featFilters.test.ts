import { describe } from 'vitest'
import { usePiniaSetup } from '../helpers/storeSetup'
import {
  testInitialState,
  testHasActiveFilters,
  testActiveFilterCount,
  testClearAllAction,
  testSetFromUrlQuery,
  testToUrlQuery
} from '../helpers/filterStoreBehavior'
import { useFeatFiltersStore } from '~/stores/featFilters'

describe('useFeatFiltersStore', () => {
  usePiniaSetup()

  testInitialState(useFeatFiltersStore, {
    searchQuery: '',
    sortBy: 'name',
    sortDirection: 'asc',
    selectedSources: [],
    hasPrerequisites: null,
    grantsProficiencies: null,
    selectedImprovedAbilities: [],
    selectedPrerequisiteTypes: [],
    filtersOpen: false
  })

  testHasActiveFilters(useFeatFiltersStore, [
    { field: 'searchQuery', value: 'alert' },
    { field: 'hasPrerequisites', value: '1' },
    { field: 'selectedSources', value: ['PHB'] },
    { field: 'selectedImprovedAbilities', value: ['STR'] }
  ])

  testActiveFilterCount(useFeatFiltersStore, [
    {
      description: 'counts each active filter',
      setup: (store) => {
        store.hasPrerequisites = '1'
        store.grantsProficiencies = '0'
        store.selectedSources = ['PHB', 'XGTE']
        store.selectedImprovedAbilities = ['STR', 'DEX']
      },
      expectedCount: 6 // hasPrerequisites (1) + grantsProficiencies (1) + sources (2) + abilities (2) = 6
    },
    {
      description: 'does not count searchQuery in filter count',
      setup: (store) => {
        store.searchQuery = 'alert'
      },
      expectedCount: 0
    }
  ])

  testClearAllAction(useFeatFiltersStore, {
    setFilters: (store) => {
      store.searchQuery = 'alert'
      store.sortBy = 'level'
      store.sortDirection = 'desc'
      store.selectedSources = ['PHB']
      store.hasPrerequisites = '1'
      store.grantsProficiencies = '0'
      store.selectedImprovedAbilities = ['STR']
      store.selectedPrerequisiteTypes = ['Race']
      store.filtersOpen = true
    },
    expectedDefaults: {
      searchQuery: '',
      sortBy: 'name',
      sortDirection: 'asc',
      selectedSources: [],
      hasPrerequisites: null,
      grantsProficiencies: null,
      selectedImprovedAbilities: [],
      selectedPrerequisiteTypes: []
    },
    preservedFields: [{ field: 'filtersOpen', value: true }]
  })

  testSetFromUrlQuery(useFeatFiltersStore, [
    {
      name: 'sets filters from URL query object',
      query: {
        has_prerequisites: '1',
        grants_proficiencies: '0',
        improved_ability: ['STR', 'DEX'],
        prerequisite_type: 'Race',
        source: 'PHB',
        sort_by: 'name',
        sort_direction: 'desc'
      },
      expectedState: {
        hasPrerequisites: '1',
        grantsProficiencies: '0',
        selectedImprovedAbilities: ['STR', 'DEX'],
        selectedPrerequisiteTypes: ['Race'],
        selectedSources: ['PHB'],
        sortBy: 'name',
        sortDirection: 'desc'
      }
    },
    {
      name: 'array vs string query params (single value)',
      query: { improved_ability: 'STR' },
      expectedState: { selectedImprovedAbilities: ['STR'] }
    },
    {
      name: 'array vs string query params (multiple values)',
      query: { improved_ability: ['STR', 'DEX'] },
      expectedState: { selectedImprovedAbilities: ['STR', 'DEX'] }
    }
  ])

  testToUrlQuery(useFeatFiltersStore, [
    {
      name: 'returns empty object when no filters active',
      setup: () => {},
      expectedQuery: {}
    },
    {
      name: 'returns query object with active filters',
      setup: (store) => {
        store.hasPrerequisites = '1'
        store.selectedSources = ['PHB']
        store.sortDirection = 'desc'
      },
      expectedQuery: {
        has_prerequisites: '1',
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
      expectedQuery: { sort_by: 'level' }
    }
  ])
})
