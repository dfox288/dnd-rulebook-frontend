import { describe } from 'vitest'
import { useRaceFiltersStore } from '~/stores/raceFilters'
import { usePiniaSetup } from '../helpers/storeSetup'
import {
  testInitialState,
  testHasActiveFilters,
  testActiveFilterCount,
  testClearAllAction,
  testSetFromUrlQuery,
  testToUrlQuery
} from '../helpers/filterStoreBehavior'

describe('useRaceFiltersStore', () => {
  usePiniaSetup()

  testInitialState(useRaceFiltersStore, {
    searchQuery: '',
    sortBy: 'name',
    sortDirection: 'asc',
    selectedSources: [],
    selectedSize: '',
    selectedSpeedRange: null,
    selectedParentRace: '',
    raceTypeFilter: null,
    hasInnateSpellsFilter: null,
    selectedAbilityBonuses: [],
    filtersOpen: false
  })

  testHasActiveFilters(useRaceFiltersStore, [
    { field: 'searchQuery', value: 'elf' },
    { field: 'selectedSize', value: 'M' },
    { field: 'selectedSpeedRange', value: '30' },
    { field: 'raceTypeFilter', value: '0' },
    { field: 'selectedSources', value: ['PHB'] },
    { field: 'selectedAbilityBonuses', value: ['STR'] }
  ])

  testActiveFilterCount(useRaceFiltersStore, [
    {
      description: 'counts each active filter',
      setup: (store) => {
        store.selectedSize = 'M'
        store.selectedSpeedRange = '30'
        store.raceTypeFilter = '0'
        store.hasInnateSpellsFilter = '1'
        store.selectedSources = ['PHB', 'VGTM']
        store.selectedAbilityBonuses = ['STR', 'DEX']
        store.selectedParentRace = 'Elf'
      },
      expectedCount: 9
    },
    {
      description: 'does not count searchQuery in filter count',
      setup: (store) => {
        store.searchQuery = 'elf'
      },
      expectedCount: 0
    },
    {
      description: 'does not count empty strings or null values',
      setup: (store) => {
        store.selectedSize = ''
        store.selectedSpeedRange = null
        store.selectedParentRace = ''
        store.raceTypeFilter = null
      },
      expectedCount: 0
    }
  ])

  testClearAllAction(useRaceFiltersStore, {
    setFilters: (store) => {
      store.searchQuery = 'elf'
      store.sortBy = 'speed'
      store.sortDirection = 'desc'
      store.selectedSources = ['PHB']
      store.selectedSize = 'M'
      store.selectedSpeedRange = '30'
      store.selectedParentRace = 'Elf'
      store.raceTypeFilter = '0'
      store.hasInnateSpellsFilter = '1'
      store.selectedAbilityBonuses = ['STR']
      store.filtersOpen = true
    },
    expectedDefaults: {
      searchQuery: '',
      sortBy: 'name',
      sortDirection: 'asc',
      selectedSources: [],
      selectedSize: '',
      selectedSpeedRange: null,
      selectedParentRace: '',
      raceTypeFilter: null,
      hasInnateSpellsFilter: null,
      selectedAbilityBonuses: []
    },
    preservedFields: [{ field: 'filtersOpen', value: true }]
  })

  testSetFromUrlQuery(useRaceFiltersStore, [
    {
      name: 'sets filters from URL query object',
      query: {
        size: 'M',
        speed: '30',
        parent_race: 'Elf',
        race_type: '0',
        has_innate_spells: '1',
        ability: ['STR', 'DEX'],
        source: 'PHB',
        sort_by: 'speed',
        sort_direction: 'desc'
      },
      expectedState: {
        selectedSize: 'M',
        selectedSpeedRange: '30',
        selectedParentRace: 'Elf',
        raceTypeFilter: '0',
        hasInnateSpellsFilter: '1',
        selectedAbilityBonuses: ['STR', 'DEX'],
        selectedSources: ['PHB'],
        sortBy: 'speed',
        sortDirection: 'desc'
      }
    },
    {
      name: 'array vs string query params (single value)',
      query: { ability: 'STR' },
      expectedState: { selectedAbilityBonuses: ['STR'] }
    },
    {
      name: 'array vs string query params (multiple values)',
      query: { ability: ['STR', 'DEX'] },
      expectedState: { selectedAbilityBonuses: ['STR', 'DEX'] }
    },
    {
      name: 'missing query params gracefully',
      query: { speed: '30' },
      expectedState: { selectedSpeedRange: '30' }
    }
  ])

  testToUrlQuery(useRaceFiltersStore, [
    {
      name: 'returns empty object when no filters active',
      setup: () => {},
      expectedQuery: {}
    },
    {
      name: 'returns query object with active filters',
      setup: (store) => {
        store.selectedSize = 'M'
        store.raceTypeFilter = '0'
        store.selectedSources = ['PHB']
        store.sortDirection = 'desc'
      },
      expectedQuery: {
        size: 'M',
        race_type: '0',
        source: ['PHB'],
        sort_direction: 'desc'
      }
    },
    {
      name: 'excludes default sort values',
      setup: (store) => {
        store.sortBy = 'speed'
      },
      expectedQuery: { sort_by: 'speed' }
    },
    {
      name: 'excludes empty strings and null values',
      setup: (store) => {
        store.selectedSize = ''
        store.selectedSpeedRange = null
        store.selectedParentRace = ''
        store.raceTypeFilter = null
      },
      expectedQuery: {}
    },
    {
      name: 'includes all active filters in URL format',
      setup: (store) => {
        store.selectedSize = 'M'
        store.selectedSpeedRange = '30'
        store.selectedParentRace = 'Elf'
        store.raceTypeFilter = '0'
        store.hasInnateSpellsFilter = '1'
        store.selectedAbilityBonuses = ['STR', 'DEX']
        store.selectedSources = ['PHB', 'VGTM']
      },
      expectedQuery: {
        size: 'M',
        speed: '30',
        parent_race: 'Elf',
        race_type: '0',
        has_innate_spells: '1',
        ability: ['STR', 'DEX'],
        source: ['PHB', 'VGTM']
      }
    }
  ])
})
