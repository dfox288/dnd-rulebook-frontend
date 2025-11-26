import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMonsterFiltersStore } from '~/stores/monsterFilters'

describe('useMonsterFiltersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('initializes with default values', () => {
      const store = useMonsterFiltersStore()

      // Search & Sort
      expect(store.searchQuery).toBe('')
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('asc')

      // Common filters
      expect(store.selectedSources).toEqual([])

      // Entity-specific filters
      expect(store.selectedCRs).toEqual([])
      expect(store.selectedType).toBeNull()
      expect(store.isLegendary).toBeNull()
      expect(store.selectedSizes).toEqual([])
      expect(store.selectedAlignments).toEqual([])
      expect(store.selectedMovementTypes).toEqual([])
      expect(store.selectedArmorTypes).toEqual([])
      expect(store.canHover).toBeNull()
      expect(store.hasLairActions).toBeNull()
      expect(store.hasReactions).toBeNull()
      expect(store.isSpellcaster).toBeNull()
      expect(store.hasMagicResistance).toBeNull()
      expect(store.selectedACRange).toBeNull()
      expect(store.selectedHPRange).toBeNull()

      // UI state
      expect(store.filtersOpen).toBe(false)
    })
  })

  describe('hasActiveFilters getter', () => {
    it('returns false when no filters are set', () => {
      const store = useMonsterFiltersStore()
      expect(store.hasActiveFilters).toBe(false)
    })

    it('returns true when searchQuery is set', () => {
      const store = useMonsterFiltersStore()
      store.searchQuery = 'dragon'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedSources has items', () => {
      const store = useMonsterFiltersStore()
      store.selectedSources = ['phb']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedCRs has items', () => {
      const store = useMonsterFiltersStore()
      store.selectedCRs = ['1', '2']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedType is set', () => {
      const store = useMonsterFiltersStore()
      store.selectedType = 'dragon'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when isLegendary is set', () => {
      const store = useMonsterFiltersStore()
      store.isLegendary = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedSizes has items', () => {
      const store = useMonsterFiltersStore()
      store.selectedSizes = ['1', '2']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedAlignments has items', () => {
      const store = useMonsterFiltersStore()
      store.selectedAlignments = ['Lawful Good', 'Neutral']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedMovementTypes has items', () => {
      const store = useMonsterFiltersStore()
      store.selectedMovementTypes = ['fly', 'swim']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedArmorTypes has items', () => {
      const store = useMonsterFiltersStore()
      store.selectedArmorTypes = ['Natural Armor']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when canHover is set', () => {
      const store = useMonsterFiltersStore()
      store.canHover = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when hasLairActions is set', () => {
      const store = useMonsterFiltersStore()
      store.hasLairActions = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when hasReactions is set', () => {
      const store = useMonsterFiltersStore()
      store.hasReactions = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when isSpellcaster is set', () => {
      const store = useMonsterFiltersStore()
      store.isSpellcaster = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when hasMagicResistance is set', () => {
      const store = useMonsterFiltersStore()
      store.hasMagicResistance = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedACRange is set', () => {
      const store = useMonsterFiltersStore()
      store.selectedACRange = '15-17'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedHPRange is set', () => {
      const store = useMonsterFiltersStore()
      store.selectedHPRange = '51-150'
      expect(store.hasActiveFilters).toBe(true)
    })
  })

  describe('activeFilterCount getter', () => {
    it('returns 0 when no filters are set', () => {
      const store = useMonsterFiltersStore()
      expect(store.activeFilterCount).toBe(0)
    })

    it('does not count searchQuery', () => {
      const store = useMonsterFiltersStore()
      store.searchQuery = 'dragon'
      expect(store.activeFilterCount).toBe(0)
    })

    it('counts selectedSources', () => {
      const store = useMonsterFiltersStore()
      store.selectedSources = ['phb', 'mm']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedCRs', () => {
      const store = useMonsterFiltersStore()
      store.selectedCRs = ['1', '2', '3']
      expect(store.activeFilterCount).toBe(3)
    })

    it('counts selectedType as 1', () => {
      const store = useMonsterFiltersStore()
      store.selectedType = 'dragon'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts isLegendary as 1', () => {
      const store = useMonsterFiltersStore()
      store.isLegendary = '1'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedSizes', () => {
      const store = useMonsterFiltersStore()
      store.selectedSizes = ['1', '2']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedAlignments', () => {
      const store = useMonsterFiltersStore()
      store.selectedAlignments = ['Lawful Good']
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedMovementTypes', () => {
      const store = useMonsterFiltersStore()
      store.selectedMovementTypes = ['fly', 'swim']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedArmorTypes', () => {
      const store = useMonsterFiltersStore()
      store.selectedArmorTypes = ['Natural Armor', 'Plate']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts boolean filters as 1 each', () => {
      const store = useMonsterFiltersStore()
      store.canHover = '1'
      store.hasLairActions = '1'
      store.hasReactions = '1'
      store.isSpellcaster = '1'
      store.hasMagicResistance = '1'
      expect(store.activeFilterCount).toBe(5)
    })

    it('counts selectedACRange as 1', () => {
      const store = useMonsterFiltersStore()
      store.selectedACRange = '15-17'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedHPRange as 1', () => {
      const store = useMonsterFiltersStore()
      store.selectedHPRange = '51-150'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts all filters correctly', () => {
      const store = useMonsterFiltersStore()
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
      expect(store.activeFilterCount).toBe(17)
    })
  })

  describe('clearAll action', () => {
    it('resets all filters to default values', () => {
      const store = useMonsterFiltersStore()

      // Set all filters
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

      // Clear all
      store.clearAll()

      // Verify reset
      expect(store.searchQuery).toBe('')
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('asc')
      expect(store.selectedSources).toEqual([])
      expect(store.selectedCRs).toEqual([])
      expect(store.selectedType).toBeNull()
      expect(store.isLegendary).toBeNull()
      expect(store.selectedSizes).toEqual([])
      expect(store.selectedAlignments).toEqual([])
      expect(store.selectedMovementTypes).toEqual([])
      expect(store.selectedArmorTypes).toEqual([])
      expect(store.canHover).toBeNull()
      expect(store.hasLairActions).toBeNull()
      expect(store.hasReactions).toBeNull()
      expect(store.isSpellcaster).toBeNull()
      expect(store.hasMagicResistance).toBeNull()
      expect(store.selectedACRange).toBeNull()
      expect(store.selectedHPRange).toBeNull()
    })

    it('preserves filtersOpen state', () => {
      const store = useMonsterFiltersStore()
      store.filtersOpen = true
      store.selectedCRs = ['1', '2']

      store.clearAll()

      expect(store.filtersOpen).toBe(true)
      expect(store.selectedCRs).toEqual([])
    })
  })

  describe('setFromUrlQuery action', () => {
    it('sets string values from URL query', () => {
      const store = useMonsterFiltersStore()
      store.setFromUrlQuery({
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
      })

      expect(store.selectedType).toBe('dragon')
      expect(store.isLegendary).toBe('1')
      expect(store.canHover).toBe('1')
      expect(store.hasLairActions).toBe('1')
      expect(store.hasReactions).toBe('1')
      expect(store.isSpellcaster).toBe('1')
      expect(store.hasMagicResistance).toBe('1')
      expect(store.selectedACRange).toBe('15-17')
      expect(store.selectedHPRange).toBe('51-150')
      expect(store.sortBy).toBe('challenge_rating')
      expect(store.sortDirection).toBe('desc')
    })

    it('sets array values from URL query', () => {
      const store = useMonsterFiltersStore()
      store.setFromUrlQuery({
        cr: ['1', '2', '3'],
        size_id: ['1', '2'],
        alignment: ['Lawful Good', 'Neutral'],
        movement: ['fly', 'swim'],
        armor_type: ['Natural Armor', 'Plate'],
        source: ['phb', 'mm']
      })

      expect(store.selectedCRs).toEqual(['1', '2', '3'])
      expect(store.selectedSizes).toEqual(['1', '2'])
      expect(store.selectedAlignments).toEqual(['Lawful Good', 'Neutral'])
      expect(store.selectedMovementTypes).toEqual(['fly', 'swim'])
      expect(store.selectedArmorTypes).toEqual(['Natural Armor', 'Plate'])
      expect(store.selectedSources).toEqual(['phb', 'mm'])
    })

    it('converts single values to arrays', () => {
      const store = useMonsterFiltersStore()
      store.setFromUrlQuery({
        cr: '1',
        size_id: '2',
        alignment: 'Lawful Good',
        movement: 'fly',
        armor_type: 'Natural Armor',
        source: 'phb'
      })

      expect(store.selectedCRs).toEqual(['1'])
      expect(store.selectedSizes).toEqual(['2'])
      expect(store.selectedAlignments).toEqual(['Lawful Good'])
      expect(store.selectedMovementTypes).toEqual(['fly'])
      expect(store.selectedArmorTypes).toEqual(['Natural Armor'])
      expect(store.selectedSources).toEqual(['phb'])
    })

    it('ignores undefined query params', () => {
      const store = useMonsterFiltersStore()
      store.selectedCRs = ['1', '2']
      store.selectedType = 'dragon'

      store.setFromUrlQuery({
        type: undefined
      })

      expect(store.selectedCRs).toEqual(['1', '2'])
      expect(store.selectedType).toBe('dragon')
    })

    it('handles empty query object', () => {
      const store = useMonsterFiltersStore()
      store.selectedCRs = ['1']
      store.setFromUrlQuery({})

      expect(store.selectedCRs).toEqual(['1'])
    })
  })

  describe('toUrlQuery getter', () => {
    it('returns empty object when no filters are set', () => {
      const store = useMonsterFiltersStore()
      expect(store.toUrlQuery).toEqual({})
    })

    it('includes string filter values', () => {
      const store = useMonsterFiltersStore()
      store.selectedType = 'dragon'
      store.isLegendary = '1'
      store.canHover = '1'
      store.hasLairActions = '1'
      store.hasReactions = '1'
      store.isSpellcaster = '1'
      store.hasMagicResistance = '1'
      store.selectedACRange = '15-17'
      store.selectedHPRange = '51-150'

      const query = store.toUrlQuery
      expect(query.type).toBe('dragon')
      expect(query.is_legendary).toBe('1')
      expect(query.can_hover).toBe('1')
      expect(query.has_lair_actions).toBe('1')
      expect(query.has_reactions).toBe('1')
      expect(query.is_spellcaster).toBe('1')
      expect(query.has_magic_resistance).toBe('1')
      expect(query.ac_range).toBe('15-17')
      expect(query.hp_range).toBe('51-150')
    })

    it('includes array filter values', () => {
      const store = useMonsterFiltersStore()
      store.selectedCRs = ['1', '2', '3']
      store.selectedSizes = ['1', '2']
      store.selectedAlignments = ['Lawful Good', 'Neutral']
      store.selectedMovementTypes = ['fly', 'swim']
      store.selectedArmorTypes = ['Natural Armor', 'Plate']
      store.selectedSources = ['phb', 'mm']

      const query = store.toUrlQuery
      expect(query.cr).toEqual(['1', '2', '3'])
      expect(query.size_id).toEqual(['1', '2'])
      expect(query.alignment).toEqual(['Lawful Good', 'Neutral'])
      expect(query.movement).toEqual(['fly', 'swim'])
      expect(query.armor_type).toEqual(['Natural Armor', 'Plate'])
      expect(query.source).toEqual(['phb', 'mm'])
    })

    it('excludes default sort values', () => {
      const store = useMonsterFiltersStore()
      store.sortBy = 'name'
      store.sortDirection = 'asc'

      const query = store.toUrlQuery
      expect(query.sort_by).toBeUndefined()
      expect(query.sort_direction).toBeUndefined()
    })

    it('includes non-default sort values', () => {
      const store = useMonsterFiltersStore()
      store.sortBy = 'challenge_rating'
      store.sortDirection = 'desc'

      const query = store.toUrlQuery
      expect(query.sort_by).toBe('challenge_rating')
      expect(query.sort_direction).toBe('desc')
    })

    it('excludes null and empty array values', () => {
      const store = useMonsterFiltersStore()
      store.selectedType = null
      store.isLegendary = null
      store.selectedCRs = []
      store.selectedSources = []

      const query = store.toUrlQuery
      expect(query.type).toBeUndefined()
      expect(query.is_legendary).toBeUndefined()
      expect(query.cr).toBeUndefined()
      expect(query.source).toBeUndefined()
    })
  })
})
