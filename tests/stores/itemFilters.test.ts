import { describe } from 'vitest'
import { useItemFiltersStore } from '~/stores/itemFilters'
import { usePiniaSetup } from '../helpers/storeSetup'
import {
  testInitialState,
  testHasActiveFilters,
  testActiveFilterCount,
  testClearAllAction,
  testSetFromUrlQuery,
  testToUrlQuery,
  type FilterFieldTest,
  type ActiveFilterCountTest,
  type UrlQueryTestCase,
  type ToUrlQueryTestCase
} from '../helpers/filterStoreBehavior'

describe('useItemFiltersStore', () => {
  usePiniaSetup()

  testInitialState(useItemFiltersStore, {
    // Search & Sort
    searchQuery: '',
    sortBy: 'name',
    sortDirection: 'asc',

    // Common filters
    selectedSources: [],

    // Entity-specific filters - Primary
    selectedType: null,
    selectedRarity: null,
    selectedMagic: null,

    // Quick toggles
    hasCharges: null,
    requiresAttunement: null,
    stealthDisadvantage: null,

    // Advanced filters - arrays
    selectedProperties: [],
    selectedDamageTypes: [],
    selectedDamageDice: [],
    selectedVersatileDamage: [],
    selectedRechargeTiming: [],

    // Advanced filters - singles
    selectedStrengthReq: null,
    selectedRange: null,
    selectedCostRange: null,
    selectedACRange: null,

    // UI state
    filtersOpen: false
  })

  testHasActiveFilters(useItemFiltersStore, [
    { field: 'searchQuery', value: 'sword' },
    { field: 'selectedSources', value: ['phb'] },
    { field: 'selectedType', value: 1 },
    { field: 'selectedRarity', value: 'rare' },
    { field: 'selectedMagic', value: 'true' },
    { field: 'hasCharges', value: '1' },
    { field: 'requiresAttunement', value: '1' },
    { field: 'stealthDisadvantage', value: '1' },
    { field: 'selectedProperties', value: ['finesse'] },
    { field: 'selectedDamageTypes', value: ['slashing'] },
    { field: 'selectedDamageDice', value: ['1d8'] },
    { field: 'selectedVersatileDamage', value: ['1d10'] },
    { field: 'selectedRechargeTiming', value: ['dawn'] },
    { field: 'selectedStrengthReq', value: '13' },
    { field: 'selectedRange', value: 'under-30' },
    { field: 'selectedCostRange', value: 'under-100' },
    { field: 'selectedACRange', value: '11-14' }
  ] satisfies FilterFieldTest[])

  testActiveFilterCount(useItemFiltersStore, [
    {
      description: 'does not count searchQuery',
      setup: (store) => { store.searchQuery = 'sword' },
      expectedCount: 0
    },
    {
      description: 'counts selectedSources items individually',
      setup: (store) => { store.selectedSources = ['phb', 'dmg'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedType as 1',
      setup: (store) => { store.selectedType = 1 },
      expectedCount: 1
    },
    {
      description: 'counts selectedRarity as 1',
      setup: (store) => { store.selectedRarity = 'rare' },
      expectedCount: 1
    },
    {
      description: 'counts selectedMagic as 1',
      setup: (store) => { store.selectedMagic = 'true' },
      expectedCount: 1
    },
    {
      description: 'counts hasCharges as 1',
      setup: (store) => { store.hasCharges = '1' },
      expectedCount: 1
    },
    {
      description: 'counts requiresAttunement as 1',
      setup: (store) => { store.requiresAttunement = '1' },
      expectedCount: 1
    },
    {
      description: 'counts stealthDisadvantage as 1',
      setup: (store) => { store.stealthDisadvantage = '1' },
      expectedCount: 1
    },
    {
      description: 'counts selectedProperties items individually',
      setup: (store) => { store.selectedProperties = ['finesse', 'versatile'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedDamageTypes items individually',
      setup: (store) => { store.selectedDamageTypes = ['slashing', 'piercing'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedDamageDice items individually',
      setup: (store) => { store.selectedDamageDice = ['1d6', '1d8'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedVersatileDamage items individually',
      setup: (store) => { store.selectedVersatileDamage = ['1d8', '1d10'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedRechargeTiming items individually',
      setup: (store) => { store.selectedRechargeTiming = ['dawn', 'dusk'] },
      expectedCount: 2
    },
    {
      description: 'counts selectedStrengthReq as 1',
      setup: (store) => { store.selectedStrengthReq = '13' },
      expectedCount: 1
    },
    {
      description: 'counts selectedRange as 1',
      setup: (store) => { store.selectedRange = 'under-30' },
      expectedCount: 1
    },
    {
      description: 'counts selectedCostRange as 1',
      setup: (store) => { store.selectedCostRange = 'under-100' },
      expectedCount: 1
    },
    {
      description: 'counts selectedACRange as 1',
      setup: (store) => { store.selectedACRange = '11-14' },
      expectedCount: 1
    },
    {
      description: 'counts multiple filters correctly',
      setup: (store) => {
        store.selectedType = 1
        store.selectedRarity = 'rare'
        store.selectedSources = ['phb', 'dmg']
        store.hasCharges = '1'
        store.selectedProperties = ['finesse', 'versatile']
      },
      expectedCount: 7 // 1 + 1 + 2 + 1 + 2
    }
  ] satisfies ActiveFilterCountTest[])

  testClearAllAction(useItemFiltersStore, {
    setFilters: (store) => {
      store.searchQuery = 'sword'
      store.sortBy = 'rarity'
      store.sortDirection = 'desc'
      store.selectedSources = ['phb']
      store.selectedType = 1
      store.selectedRarity = 'rare'
      store.selectedMagic = 'true'
      store.hasCharges = '1'
      store.requiresAttunement = '1'
      store.stealthDisadvantage = '1'
      store.selectedProperties = ['finesse']
      store.selectedDamageTypes = ['slashing']
      store.selectedDamageDice = ['1d8']
      store.selectedVersatileDamage = ['1d10']
      store.selectedRechargeTiming = ['dawn']
      store.selectedStrengthReq = '13'
      store.selectedRange = 'under-30'
      store.selectedCostRange = 'under-100'
      store.selectedACRange = '11-14'
      store.filtersOpen = true
    },
    expectedDefaults: {
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
      selectedACRange: null
    },
    preservedFields: [{ field: 'filtersOpen', value: true }]
  })

  testSetFromUrlQuery(useItemFiltersStore, [
    {
      name: 'single string values',
      query: {
        rarity: 'rare',
        is_magic: 'true',
        has_charges: '1',
        requires_attunement: '0',
        stealth_disadvantage: '1',
        strength_req: '13',
        range: 'under-30',
        cost: 'under-100',
        ac: '11-14'
      },
      expectedState: {
        selectedRarity: 'rare',
        selectedMagic: 'true',
        hasCharges: '1',
        requiresAttunement: '0',
        stealthDisadvantage: '1',
        selectedStrengthReq: '13',
        selectedRange: 'under-30',
        selectedCostRange: 'under-100',
        selectedACRange: '11-14'
      }
    },
    {
      name: 'type as number',
      query: { type: '5' },
      expectedState: { selectedType: 5 }
    },
    {
      name: 'array values',
      query: {
        source: ['phb', 'dmg'],
        property: ['finesse', 'versatile'],
        damage_type: ['slashing', 'piercing'],
        damage_dice: ['1d6', '1d8'],
        versatile_damage: ['1d8', '1d10'],
        recharge_timing: ['dawn', 'dusk']
      },
      expectedState: {
        selectedSources: ['phb', 'dmg'],
        selectedProperties: ['finesse', 'versatile'],
        selectedDamageTypes: ['slashing', 'piercing'],
        selectedDamageDice: ['1d6', '1d8'],
        selectedVersatileDamage: ['1d8', '1d10'],
        selectedRechargeTiming: ['dawn', 'dusk']
      }
    },
    {
      name: 'single-item arrays',
      query: {
        source: 'phb',
        property: 'finesse',
        damage_type: 'slashing'
      },
      expectedState: {
        selectedSources: ['phb'],
        selectedProperties: ['finesse'],
        selectedDamageTypes: ['slashing']
      }
    },
    {
      name: 'sort parameters',
      query: {
        sort_by: 'rarity',
        sort_direction: 'desc'
      },
      expectedState: {
        sortBy: 'rarity',
        sortDirection: 'desc'
      }
    },
    {
      name: 'empty query gracefully',
      query: {},
      expectedState: {}
    }
  ] satisfies UrlQueryTestCase[])

  testToUrlQuery(useItemFiltersStore, [
    {
      name: 'returns empty object when no filters active',
      setup: () => {},
      expectedQuery: {}
    },
    {
      name: 'includes string filter values',
      setup: (store) => {
        store.selectedRarity = 'rare'
        store.selectedMagic = 'true'
      },
      expectedQuery: {
        rarity: 'rare',
        is_magic: 'true'
      }
    },
    {
      name: 'includes number filter values',
      setup: (store) => {
        store.selectedType = 5
      },
      expectedQuery: {
        type: '5'
      }
    },
    {
      name: 'includes boolean toggle values',
      setup: (store) => {
        store.hasCharges = '1'
        store.requiresAttunement = '0'
        store.stealthDisadvantage = '1'
      },
      expectedQuery: {
        has_charges: '1',
        requires_attunement: '0',
        stealth_disadvantage: '1'
      }
    },
    {
      name: 'includes array filter values',
      setup: (store) => {
        store.selectedSources = ['phb', 'dmg']
        store.selectedProperties = ['finesse', 'versatile']
        store.selectedDamageTypes = ['slashing']
      },
      expectedQuery: {
        source: ['phb', 'dmg'],
        property: ['finesse', 'versatile'],
        damage_type: ['slashing']
      }
    },
    {
      name: 'includes range filter values',
      setup: (store) => {
        store.selectedStrengthReq = '13'
        store.selectedRange = 'under-30'
        store.selectedCostRange = 'under-100'
        store.selectedACRange = '11-14'
      },
      expectedQuery: {
        strength_req: '13',
        range: 'under-30',
        cost: 'under-100',
        ac: '11-14'
      }
    },
    {
      name: 'only includes sort_by if non-default',
      setup: (store) => {
        store.sortBy = 'rarity'
      },
      expectedQuery: {
        sort_by: 'rarity'
      }
    },
    {
      name: 'only includes sort_direction if non-default',
      setup: (store) => {
        store.sortDirection = 'desc'
      },
      expectedQuery: {
        sort_direction: 'desc'
      }
    },
    {
      name: 'skips empty arrays',
      setup: (store) => {
        store.selectedSources = []
        store.selectedProperties = []
      },
      expectedQuery: {}
    }
  ] satisfies ToUrlQueryTestCase[])
})
