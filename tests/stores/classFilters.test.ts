import { describe, it, expect } from 'vitest'
import { useClassFiltersStore } from '~/stores/classFilters'
import { usePiniaSetup } from '../helpers/storeSetup'
import {
  testInitialState,
  testHasActiveFilters,
  testActiveFilterCount,
  testClearAllAction,
  testSetFromUrlQuery,
  testToUrlQuery
} from '../helpers/filterStoreBehavior'

describe('useClassFiltersStore', () => {
  usePiniaSetup()

  testInitialState(useClassFiltersStore, {
    searchQuery: '',
    sortBy: 'name',
    sortDirection: 'asc',
    selectedSources: [],
    isBaseClass: null,
    isSpellcaster: null,
    selectedHitDice: [],
    selectedSpellcastingAbility: null,
    selectedParentClass: null,
    filtersOpen: false
  })

  testHasActiveFilters(useClassFiltersStore, [
    { field: 'searchQuery', value: 'wizard' },
    { field: 'isBaseClass', value: '1' },
    { field: 'isSpellcaster', value: '1' },
    { field: 'selectedSources', value: ['PHB'] },
    { field: 'selectedHitDice', value: [6] },
    { field: 'selectedSpellcastingAbility', value: 'INT' },
    { field: 'selectedParentClass', value: 'Fighter' }
  ])

  testActiveFilterCount(useClassFiltersStore, [
    {
      description: 'counts each active filter',
      setup: (store) => {
        store.isBaseClass = '1'
        store.isSpellcaster = '0'
        store.selectedSources = ['PHB', 'XGTE']
        store.selectedHitDice = [6, 8]
        store.selectedSpellcastingAbility = 'INT'
        store.selectedParentClass = 'Fighter'
      },
      expectedCount: 8 // isBaseClass (1) + isSpellcaster (1) + sources (2) + hitDice (2) + spellcastingAbility (1) + parentClass (1)
    },
    {
      description: 'does not count searchQuery in filter count',
      setup: (store) => {
        store.searchQuery = 'wizard'
      },
      expectedCount: 0
    }
  ])

  testClearAllAction(useClassFiltersStore, {
    setFilters: (store) => {
      store.searchQuery = 'wizard'
      store.sortBy = 'hit_die'
      store.sortDirection = 'desc'
      store.selectedSources = ['PHB']
      store.isBaseClass = '1'
      store.isSpellcaster = '0'
      store.selectedHitDice = [6]
      store.selectedSpellcastingAbility = 'INT'
      store.selectedParentClass = 'Fighter'
      store.filtersOpen = true
    },
    expectedDefaults: {
      searchQuery: '',
      sortBy: 'name',
      sortDirection: 'asc',
      selectedSources: [],
      isBaseClass: null,
      isSpellcaster: null,
      selectedHitDice: [],
      selectedSpellcastingAbility: null,
      selectedParentClass: null
    },
    preservedFields: [{ field: 'filtersOpen', value: true }]
  })

  testSetFromUrlQuery(useClassFiltersStore, [
    {
      name: 'sets filters from URL query object',
      query: {
        is_base_class: '1',
        is_spellcaster: '0',
        hit_die: ['6', '8'],
        spellcasting_ability: 'INT',
        parent_class_name: 'Fighter',
        source: 'PHB',
        sort_by: 'hit_die',
        sort_direction: 'desc'
      },
      expectedState: {
        isBaseClass: '1',
        isSpellcaster: '0',
        selectedHitDice: [6, 8],
        selectedSpellcastingAbility: 'INT',
        selectedParentClass: 'Fighter',
        selectedSources: ['PHB'],
        sortBy: 'hit_die',
        sortDirection: 'desc'
      }
    },
    {
      name: 'array vs string query params (single value)',
      query: { hit_die: '6' },
      expectedState: { selectedHitDice: [6] }
    },
    {
      name: 'array vs string query params (multiple values)',
      query: { hit_die: ['6', '8'] },
      expectedState: { selectedHitDice: [6, 8] }
    },
    {
      name: 'converts hit_die strings to numbers',
      query: { hit_die: ['6', '8', '10'] },
      expectedState: { selectedHitDice: [6, 8, 10] }
    }
  ])

  testToUrlQuery(useClassFiltersStore, [
    {
      name: 'returns empty object when no filters active',
      setup: () => {},
      expectedQuery: {}
    },
    {
      name: 'returns query object with active filters',
      setup: (store) => {
        store.isBaseClass = '1'
        store.selectedSources = ['PHB']
        store.sortDirection = 'desc'
      },
      expectedQuery: {
        is_base_class: '1',
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
        store.sortBy = 'hit_die'
      },
      expectedQuery: { sort_by: 'hit_die' }
    },
    {
      name: 'converts hit_die numbers to strings',
      setup: (store) => {
        store.selectedHitDice = [6, 8, 10]
      },
      expectedQuery: {
        hit_die: ['6', '8', '10']
      }
    }
  ])
})
