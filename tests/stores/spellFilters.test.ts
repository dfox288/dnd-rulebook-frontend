import { usePiniaSetup } from '../helpers/storeSetup'
import {
  testHasActiveFilters,
  testActiveFilterCount,
  testClearAllAction,
  testSetFromUrlQuery,
  testToUrlQuery,
  testInitialState
} from '../helpers/filterStoreBehavior'
import { useSpellFiltersStore } from '~/stores/spellFilters'

describe('useSpellFiltersStore', () => {
  usePiniaSetup()

  testInitialState(useSpellFiltersStore, {
    searchQuery: '',
    sortBy: 'name',
    sortDirection: 'asc',
    selectedSources: [],
    selectedLevels: [],
    selectedSchool: null,
    selectedClass: null,
    concentrationFilter: null,
    ritualFilter: null,
    selectedDamageTypes: [],
    selectedSavingThrows: [],
    selectedTags: [],
    verbalFilter: null,
    somaticFilter: null,
    materialFilter: null,
    filtersOpen: false
  })

  testHasActiveFilters(useSpellFiltersStore, [
    { field: 'searchQuery', value: 'fireball' },
    { field: 'selectedLevels', value: ['3'] },
    { field: 'selectedSchool', value: 5 },
    { field: 'selectedClass', value: 'wizard' },
    { field: 'concentrationFilter', value: '1' },
    { field: 'ritualFilter', value: '0' },
    { field: 'selectedDamageTypes', value: ['FIRE'] },
    { field: 'selectedSavingThrows', value: ['DEX'] },
    { field: 'selectedTags', value: ['ritual-caster'] },
    { field: 'verbalFilter', value: '1' },
    { field: 'somaticFilter', value: '1' },
    { field: 'materialFilter', value: '0' },
    { field: 'selectedSources', value: ['PHB'] }
  ])

  testActiveFilterCount(useSpellFiltersStore, [
    {
      description: 'counts each active filter',
      setup: (store) => {
        store.selectedLevels = ['3', '5']
        store.selectedSchool = 5
        store.selectedClass = 'wizard'
        store.concentrationFilter = '1'
        store.ritualFilter = '0'
        store.selectedDamageTypes = ['FIRE', 'COLD']
        store.selectedSavingThrows = ['DEX']
        store.selectedSources = ['PHB', 'XGTE']
        store.selectedTags = ['ritual-caster']
        store.verbalFilter = '1'
        store.somaticFilter = '1'
        store.materialFilter = '0'
      },
      expectedCount: 15
    },
    {
      description: 'does not count searchQuery in filter count',
      setup: (store) => {
        store.searchQuery = 'fireball'
      },
      expectedCount: 0
    }
  ])

  testClearAllAction(useSpellFiltersStore, {
    setFilters: (store) => {
      store.searchQuery = 'fireball'
      store.sortBy = 'level'
      store.sortDirection = 'desc'
      store.selectedSources = ['PHB']
      store.selectedLevels = ['3']
      store.selectedSchool = 5
      store.selectedClass = 'wizard'
      store.concentrationFilter = '1'
      store.ritualFilter = '0'
      store.selectedDamageTypes = ['FIRE']
      store.selectedSavingThrows = ['DEX']
      store.selectedTags = ['ritual-caster']
      store.verbalFilter = '1'
      store.somaticFilter = '1'
      store.materialFilter = '0'
      store.filtersOpen = true
    },
    expectedDefaults: {
      searchQuery: '',
      sortBy: 'name',
      sortDirection: 'asc',
      selectedSources: [],
      selectedLevels: [],
      selectedSchool: null,
      selectedClass: null,
      concentrationFilter: null,
      ritualFilter: null,
      selectedDamageTypes: [],
      selectedSavingThrows: [],
      selectedTags: [],
      verbalFilter: null,
      somaticFilter: null,
      materialFilter: null
    },
    preservedFields: [{ field: 'filtersOpen', value: true }]
  })

  testSetFromUrlQuery(useSpellFiltersStore, [
    {
      name: 'all filter types from URL query object',
      query: {
        level: ['3', '5'],
        school: '5',
        class: 'wizard',
        concentration: '1',
        ritual: '0',
        damage_type: ['FIRE', 'COLD'],
        saving_throw: 'DEX',
        source: 'PHB',
        tag: 'ritual-caster',
        has_verbal: '1',
        has_somatic: '1',
        has_material: '0',
        sort_by: 'level',
        sort_direction: 'desc'
      },
      expectedState: {
        selectedLevels: ['3', '5'],
        selectedSchool: 5,
        selectedClass: 'wizard',
        concentrationFilter: '1',
        ritualFilter: '0',
        selectedDamageTypes: ['FIRE', 'COLD'],
        selectedSavingThrows: ['DEX'],
        selectedSources: ['PHB'],
        selectedTags: ['ritual-caster'],
        verbalFilter: '1',
        somaticFilter: '1',
        materialFilter: '0',
        sortBy: 'level',
        sortDirection: 'desc'
      }
    },
    {
      name: 'array vs string query params for levels - single value',
      query: { level: '3' },
      expectedState: { selectedLevels: ['3'] }
    },
    {
      name: 'array vs string query params for levels - multiple values',
      query: { level: ['3', '5'] },
      expectedState: { selectedLevels: ['3', '5'] }
    },
    {
      name: 'array vs string query params for damage types - single value',
      query: { damage_type: 'FIRE' },
      expectedState: { selectedDamageTypes: ['FIRE'] }
    },
    {
      name: 'array vs string query params for damage types - multiple values',
      query: { damage_type: ['FIRE', 'COLD'] },
      expectedState: { selectedDamageTypes: ['FIRE', 'COLD'] }
    },
    {
      name: 'numeric values for school',
      query: { school: '5' },
      expectedState: { selectedSchool: 5 }
    }
  ])

  testToUrlQuery(useSpellFiltersStore, [
    {
      name: 'returns empty object when no filters active',
      setup: () => {},
      expectedQuery: {}
    },
    {
      name: 'returns query object with active filters',
      setup: (store) => {
        store.selectedLevels = ['3']
        store.selectedSchool = 5
        store.selectedClass = 'wizard'
        store.concentrationFilter = '1'
        store.selectedSources = ['PHB']
        store.sortDirection = 'desc'
      },
      expectedQuery: {
        level: ['3'],
        school: '5',
        class: 'wizard',
        concentration: '1',
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
      name: 'includes non-default sort by in URL query',
      setup: (store) => {
        store.sortBy = 'level'
      },
      expectedQuery: { sort_by: 'level' }
    },
    {
      name: 'includes all filter types in URL query',
      setup: (store) => {
        store.selectedLevels = ['3', '5']
        store.selectedSchool = 5
        store.selectedClass = 'wizard'
        store.concentrationFilter = '1'
        store.ritualFilter = '0'
        store.selectedDamageTypes = ['FIRE']
        store.selectedSavingThrows = ['DEX', 'WIS']
        store.selectedTags = ['ritual-caster']
        store.selectedSources = ['PHB']
        store.verbalFilter = '1'
        store.somaticFilter = '0'
        store.materialFilter = '1'
      },
      expectedQuery: {
        level: ['3', '5'],
        school: '5',
        class: 'wizard',
        concentration: '1',
        ritual: '0',
        damage_type: ['FIRE'],
        saving_throw: ['DEX', 'WIS'],
        tag: ['ritual-caster'],
        source: ['PHB'],
        has_verbal: '1',
        has_somatic: '0',
        has_material: '1'
      }
    }
  ])
})
