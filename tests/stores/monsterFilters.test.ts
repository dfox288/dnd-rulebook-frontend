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
import { useMonsterFiltersStore } from '~/stores/monsterFilters'

describe('useMonsterFiltersStore', () => {
  usePiniaSetup()

  testInitialState(useMonsterFiltersStore, {
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
  })

  testHasActiveFilters(useMonsterFiltersStore, [
    { field: 'searchQuery', value: 'dragon' },
    { field: 'selectedSources', value: ['phb'] },
    { field: 'selectedCRs', value: ['1', '2'] },
    { field: 'selectedType', value: 'dragon' },
    { field: 'isLegendary', value: '1' },
    { field: 'selectedSizes', value: ['1', '2'] },
    { field: 'selectedAlignments', value: ['Lawful Good', 'Neutral'] },
    { field: 'selectedMovementTypes', value: ['fly', 'swim'] },
    { field: 'selectedArmorTypes', value: ['Natural Armor'] },
    { field: 'canHover', value: '1' },
    { field: 'hasLairActions', value: '1' },
    { field: 'hasReactions', value: '1' },
    { field: 'isSpellcaster', value: '1' },
    { field: 'hasMagicResistance', value: '1' },
    { field: 'selectedACRange', value: '15-17' },
    { field: 'selectedHPRange', value: '51-150' }
  ])

  testActiveFilterCount(useMonsterFiltersStore, [
    {
      description: 'does not count searchQuery',
      setup: (store) => { store.searchQuery = 'dragon' },
      expectedCount: 0
    },
    {
      description: 'counts selectedSources',
      setup: (store) => { store.selectedSources = ['phb', 'mm'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedCRs',
      setup: (store) => { store.selectedCRs = ['1', '2', '3'] },
      expectedCount: 3
    },
    {
      description: 'counts selectedType as 1',
      setup: (store) => { store.selectedType = 'dragon' },
      expectedCount: 1
    },
    {
      description: 'counts isLegendary as 1',
      setup: (store) => { store.isLegendary = '1' },
      expectedCount: 1
    },
    {
      description: 'counts selectedSizes',
      setup: (store) => { store.selectedSizes = ['1', '2'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedAlignments',
      setup: (store) => { store.selectedAlignments = ['Lawful Good'] },
      expectedCount: 1
    },
    {
      description: 'counts selectedMovementTypes',
      setup: (store) => { store.selectedMovementTypes = ['fly', 'swim'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedArmorTypes',
      setup: (store) => { store.selectedArmorTypes = ['Natural Armor', 'Plate'] },
      expectedCount: 2
    },
    {
      description: 'counts boolean filters as 1 each',
      setup: (store) => {
        store.canHover = '1'
        store.hasLairActions = '1'
        store.hasReactions = '1'
        store.isSpellcaster = '1'
        store.hasMagicResistance = '1'
      },
      expectedCount: 5
    },
    {
      description: 'counts selectedACRange as 1',
      setup: (store) => { store.selectedACRange = '15-17' },
      expectedCount: 1
    },
    {
      description: 'counts selectedHPRange as 1',
      setup: (store) => { store.selectedHPRange = '51-150' },
      expectedCount: 1
    },
    {
      description: 'counts all filters correctly',
      setup: (store) => {
        store.selectedSources = ['phb', 'mm'] // 2
        store.selectedCRs = ['1', '2'] // 2
        store.selectedType = 'dragon' // 1
        store.isLegendary = '1' // 1
        store.selectedSizes = ['1'] // 1
        store.selectedAlignments = ['Lawful Good'] // 1
        store.selectedMovementTypes = ['fly'] // 1
        store.selectedArmorTypes = ['Natural Armor'] // 1
        store.canHover = '1' // 1
        store.hasLairActions = '1' // 1
        store.hasReactions = '1' // 1
        store.isSpellcaster = '1' // 1
        store.hasMagicResistance = '1' // 1
        store.selectedACRange = '15-17' // 1
        store.selectedHPRange = '51-150' // 1
      },
      expectedCount: 17
    }
  ])

  testClearAllAction(useMonsterFiltersStore, {
    setFilters: (store) => {
      store.searchQuery = 'dragon'
      store.sortBy = 'challenge_rating'
      store.sortDirection = 'desc'
      store.selectedSources = ['phb']
      store.selectedCRs = ['1', '2']
      store.selectedType = 'dragon'
      store.isLegendary = '1'
      store.selectedSizes = ['1']
      store.selectedAlignments = ['Lawful Good']
      store.selectedMovementTypes = ['fly']
      store.selectedArmorTypes = ['Natural Armor']
      store.canHover = '1'
      store.hasLairActions = '1'
      store.hasReactions = '1'
      store.isSpellcaster = '1'
      store.hasMagicResistance = '1'
      store.selectedACRange = '15-17'
      store.selectedHPRange = '51-150'
    },
    expectedDefaults: {
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
      selectedHPRange: null
    },
    preservedFields: [{ field: 'filtersOpen', value: true }]
  })

  testSetFromUrlQuery(useMonsterFiltersStore, [
    {
      name: 'string values from URL query',
      query: {
        type: 'dragon',
        is_legendary: '1',
        can_hover: '1',
        has_lair_actions: '1',
        has_reactions: '1',
        is_spellcaster: '1',
        has_magic_resistance: '1',
        ac_range: '15-17',
        hp_range: '51-150',
        sort_by: 'challenge_rating',
        sort_direction: 'desc'
      },
      expectedState: {
        selectedType: 'dragon',
        isLegendary: '1',
        canHover: '1',
        hasLairActions: '1',
        hasReactions: '1',
        isSpellcaster: '1',
        hasMagicResistance: '1',
        selectedACRange: '15-17',
        selectedHPRange: '51-150',
        sortBy: 'challenge_rating',
        sortDirection: 'desc'
      }
    },
    {
      name: 'array values from URL query',
      query: {
        cr: ['1', '2', '3'],
        size_id: ['1', '2'],
        alignment: ['Lawful Good', 'Neutral'],
        movement: ['fly', 'swim'],
        armor_type: ['Natural Armor', 'Plate'],
        source: ['phb', 'mm']
      },
      expectedState: {
        selectedCRs: ['1', '2', '3'],
        selectedSizes: ['1', '2'],
        selectedAlignments: ['Lawful Good', 'Neutral'],
        selectedMovementTypes: ['fly', 'swim'],
        selectedArmorTypes: ['Natural Armor', 'Plate'],
        selectedSources: ['phb', 'mm']
      }
    },
    {
      name: 'single values converted to arrays',
      query: {
        cr: '1',
        size_id: '2',
        alignment: 'Lawful Good',
        movement: 'fly',
        armor_type: 'Natural Armor',
        source: 'phb'
      },
      expectedState: {
        selectedCRs: ['1'],
        selectedSizes: ['2'],
        selectedAlignments: ['Lawful Good'],
        selectedMovementTypes: ['fly'],
        selectedArmorTypes: ['Natural Armor'],
        selectedSources: ['phb']
      }
    },
    {
      name: 'undefined query params ignored',
      query: { type: undefined },
      expectedState: {}
    },
    {
      name: 'empty query object',
      query: {},
      expectedState: {}
    }
  ])

  testToUrlQuery(useMonsterFiltersStore, [
    {
      name: 'returns empty object when no filters are set',
      setup: () => {},
      expectedQuery: {}
    },
    {
      name: 'includes string filter values',
      setup: (store) => {
        store.selectedType = 'dragon'
        store.isLegendary = '1'
        store.canHover = '1'
        store.hasLairActions = '1'
        store.hasReactions = '1'
        store.isSpellcaster = '1'
        store.hasMagicResistance = '1'
        store.selectedACRange = '15-17'
        store.selectedHPRange = '51-150'
      },
      expectedQuery: {
        type: 'dragon',
        is_legendary: '1',
        can_hover: '1',
        has_lair_actions: '1',
        has_reactions: '1',
        is_spellcaster: '1',
        has_magic_resistance: '1',
        ac_range: '15-17',
        hp_range: '51-150'
      }
    },
    {
      name: 'includes array filter values',
      setup: (store) => {
        store.selectedCRs = ['1', '2', '3']
        store.selectedSizes = ['1', '2']
        store.selectedAlignments = ['Lawful Good', 'Neutral']
        store.selectedMovementTypes = ['fly', 'swim']
        store.selectedArmorTypes = ['Natural Armor', 'Plate']
        store.selectedSources = ['phb', 'mm']
      },
      expectedQuery: {
        cr: ['1', '2', '3'],
        size_id: ['1', '2'],
        alignment: ['Lawful Good', 'Neutral'],
        movement: ['fly', 'swim'],
        armor_type: ['Natural Armor', 'Plate'],
        source: ['phb', 'mm']
      }
    },
    {
      name: 'excludes default sort values',
      setup: (store) => {
        store.sortBy = 'name'
        store.sortDirection = 'asc'
      },
      expectedQuery: {}
    },
    {
      name: 'includes non-default sort values',
      setup: (store) => {
        store.sortBy = 'challenge_rating'
        store.sortDirection = 'desc'
      },
      expectedQuery: {
        sort_by: 'challenge_rating',
        sort_direction: 'desc'
      }
    },
    {
      name: 'excludes null and empty array values',
      setup: (store) => {
        store.selectedType = null
        store.isLegendary = null
        store.selectedCRs = []
        store.selectedSources = []
      },
      expectedQuery: {}
    }
  ])
})
