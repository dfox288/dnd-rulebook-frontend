import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useItemFiltersStore } from '~/stores/itemFilters'

describe('useItemFiltersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('initializes with default values', () => {
      const store = useItemFiltersStore()

      // Search & Sort
      expect(store.searchQuery).toBe('')
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('asc')

      // Common filters
      expect(store.selectedSources).toEqual([])

      // Entity-specific filters - Primary
      expect(store.selectedType).toBeNull()
      expect(store.selectedRarity).toBeNull()
      expect(store.selectedMagic).toBeNull()

      // Quick toggles
      expect(store.hasCharges).toBeNull()
      expect(store.requiresAttunement).toBeNull()
      expect(store.stealthDisadvantage).toBeNull()

      // Advanced filters - arrays
      expect(store.selectedProperties).toEqual([])
      expect(store.selectedDamageTypes).toEqual([])
      expect(store.selectedDamageDice).toEqual([])
      expect(store.selectedVersatileDamage).toEqual([])
      expect(store.selectedRechargeTiming).toEqual([])

      // Advanced filters - singles
      expect(store.selectedStrengthReq).toBeNull()
      expect(store.selectedRange).toBeNull()
      expect(store.selectedCostRange).toBeNull()
      expect(store.selectedACRange).toBeNull()

      // UI state
      expect(store.filtersOpen).toBe(false)
    })
  })

  describe('hasActiveFilters getter', () => {
    it('returns false when no filters are active', () => {
      const store = useItemFiltersStore()
      expect(store.hasActiveFilters).toBe(false)
    })

    it('returns true when searchQuery is set', () => {
      const store = useItemFiltersStore()
      store.searchQuery = 'sword'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedSources has items', () => {
      const store = useItemFiltersStore()
      store.selectedSources = ['phb']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedType is set', () => {
      const store = useItemFiltersStore()
      store.selectedType = 1
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedRarity is set', () => {
      const store = useItemFiltersStore()
      store.selectedRarity = 'rare'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedMagic is set', () => {
      const store = useItemFiltersStore()
      store.selectedMagic = 'true'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when hasCharges is set', () => {
      const store = useItemFiltersStore()
      store.hasCharges = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when requiresAttunement is set', () => {
      const store = useItemFiltersStore()
      store.requiresAttunement = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when stealthDisadvantage is set', () => {
      const store = useItemFiltersStore()
      store.stealthDisadvantage = '1'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedProperties has items', () => {
      const store = useItemFiltersStore()
      store.selectedProperties = ['finesse']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedDamageTypes has items', () => {
      const store = useItemFiltersStore()
      store.selectedDamageTypes = ['slashing']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedDamageDice has items', () => {
      const store = useItemFiltersStore()
      store.selectedDamageDice = ['1d8']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedVersatileDamage has items', () => {
      const store = useItemFiltersStore()
      store.selectedVersatileDamage = ['1d10']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedRechargeTiming has items', () => {
      const store = useItemFiltersStore()
      store.selectedRechargeTiming = ['dawn']
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedStrengthReq is set', () => {
      const store = useItemFiltersStore()
      store.selectedStrengthReq = '13'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedRange is set', () => {
      const store = useItemFiltersStore()
      store.selectedRange = 'under-30'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedCostRange is set', () => {
      const store = useItemFiltersStore()
      store.selectedCostRange = 'under-100'
      expect(store.hasActiveFilters).toBe(true)
    })

    it('returns true when selectedACRange is set', () => {
      const store = useItemFiltersStore()
      store.selectedACRange = '11-14'
      expect(store.hasActiveFilters).toBe(true)
    })
  })

  describe('activeFilterCount getter', () => {
    it('returns 0 when no filters are active', () => {
      const store = useItemFiltersStore()
      expect(store.activeFilterCount).toBe(0)
    })

    it('does not count searchQuery', () => {
      const store = useItemFiltersStore()
      store.searchQuery = 'sword'
      expect(store.activeFilterCount).toBe(0)
    })

    it('counts selectedSources items individually', () => {
      const store = useItemFiltersStore()
      store.selectedSources = ['phb', 'dmg']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedType as 1', () => {
      const store = useItemFiltersStore()
      store.selectedType = 1
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedRarity as 1', () => {
      const store = useItemFiltersStore()
      store.selectedRarity = 'rare'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedMagic as 1', () => {
      const store = useItemFiltersStore()
      store.selectedMagic = 'true'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts hasCharges as 1', () => {
      const store = useItemFiltersStore()
      store.hasCharges = '1'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts requiresAttunement as 1', () => {
      const store = useItemFiltersStore()
      store.requiresAttunement = '1'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts stealthDisadvantage as 1', () => {
      const store = useItemFiltersStore()
      store.stealthDisadvantage = '1'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedProperties items individually', () => {
      const store = useItemFiltersStore()
      store.selectedProperties = ['finesse', 'versatile']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedDamageTypes items individually', () => {
      const store = useItemFiltersStore()
      store.selectedDamageTypes = ['slashing', 'piercing']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedDamageDice items individually', () => {
      const store = useItemFiltersStore()
      store.selectedDamageDice = ['1d6', '1d8']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedVersatileDamage items individually', () => {
      const store = useItemFiltersStore()
      store.selectedVersatileDamage = ['1d8', '1d10']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedRechargeTiming items individually', () => {
      const store = useItemFiltersStore()
      store.selectedRechargeTiming = ['dawn', 'dusk']
      expect(store.activeFilterCount).toBe(2)
    })

    it('counts selectedStrengthReq as 1', () => {
      const store = useItemFiltersStore()
      store.selectedStrengthReq = '13'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedRange as 1', () => {
      const store = useItemFiltersStore()
      store.selectedRange = 'under-30'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedCostRange as 1', () => {
      const store = useItemFiltersStore()
      store.selectedCostRange = 'under-100'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts selectedACRange as 1', () => {
      const store = useItemFiltersStore()
      store.selectedACRange = '11-14'
      expect(store.activeFilterCount).toBe(1)
    })

    it('counts multiple filters correctly', () => {
      const store = useItemFiltersStore()
      store.selectedType = 1
      store.selectedRarity = 'rare'
      store.selectedSources = ['phb', 'dmg']
      store.hasCharges = '1'
      store.selectedProperties = ['finesse', 'versatile']
      // 1 (type) + 1 (rarity) + 2 (sources) + 1 (charges) + 2 (properties) = 7
      expect(store.activeFilterCount).toBe(7)
    })
  })

  describe('clearAll action', () => {
    it('resets all filter values to defaults', () => {
      const store = useItemFiltersStore()

      // Set all filters
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

      // Clear all
      store.clearAll()

      // Verify all filters reset (except filtersOpen)
      expect(store.searchQuery).toBe('')
      expect(store.sortBy).toBe('name')
      expect(store.sortDirection).toBe('asc')
      expect(store.selectedSources).toEqual([])
      expect(store.selectedType).toBeNull()
      expect(store.selectedRarity).toBeNull()
      expect(store.selectedMagic).toBeNull()
      expect(store.hasCharges).toBeNull()
      expect(store.requiresAttunement).toBeNull()
      expect(store.stealthDisadvantage).toBeNull()
      expect(store.selectedProperties).toEqual([])
      expect(store.selectedDamageTypes).toEqual([])
      expect(store.selectedDamageDice).toEqual([])
      expect(store.selectedVersatileDamage).toEqual([])
      expect(store.selectedRechargeTiming).toEqual([])
      expect(store.selectedStrengthReq).toBeNull()
      expect(store.selectedRange).toBeNull()
      expect(store.selectedCostRange).toBeNull()
      expect(store.selectedACRange).toBeNull()
      expect(store.filtersOpen).toBe(true) // Preserved
    })

    it('preserves filtersOpen state', () => {
      const store = useItemFiltersStore()
      store.filtersOpen = true
      store.clearAll()
      expect(store.filtersOpen).toBe(true)
    })
  })

  describe('setFromUrlQuery action', () => {
    it('parses single string values correctly', () => {
      const store = useItemFiltersStore()
      store.setFromUrlQuery({
        rarity: 'rare',
        is_magic: 'true',
        has_charges: '1',
        requires_attunement: '0',
        stealth_disadvantage: '1',
        strength_req: '13',
        range: 'under-30',
        cost: 'under-100',
        ac: '11-14'
      })

      expect(store.selectedRarity).toBe('rare')
      expect(store.selectedMagic).toBe('true')
      expect(store.hasCharges).toBe('1')
      expect(store.requiresAttunement).toBe('0')
      expect(store.stealthDisadvantage).toBe('1')
      expect(store.selectedStrengthReq).toBe('13')
      expect(store.selectedRange).toBe('under-30')
      expect(store.selectedCostRange).toBe('under-100')
      expect(store.selectedACRange).toBe('11-14')
    })

    it('parses type as number', () => {
      const store = useItemFiltersStore()
      store.setFromUrlQuery({ type: '5' })
      expect(store.selectedType).toBe(5)
    })

    it('parses array values correctly', () => {
      const store = useItemFiltersStore()
      store.setFromUrlQuery({
        source: ['phb', 'dmg'],
        property: ['finesse', 'versatile'],
        damage_type: ['slashing', 'piercing'],
        damage_dice: ['1d6', '1d8'],
        versatile_damage: ['1d8', '1d10'],
        recharge_timing: ['dawn', 'dusk']
      })

      expect(store.selectedSources).toEqual(['phb', 'dmg'])
      expect(store.selectedProperties).toEqual(['finesse', 'versatile'])
      expect(store.selectedDamageTypes).toEqual(['slashing', 'piercing'])
      expect(store.selectedDamageDice).toEqual(['1d6', '1d8'])
      expect(store.selectedVersatileDamage).toEqual(['1d8', '1d10'])
      expect(store.selectedRechargeTiming).toEqual(['dawn', 'dusk'])
    })

    it('parses single-item arrays correctly', () => {
      const store = useItemFiltersStore()
      store.setFromUrlQuery({
        source: 'phb',
        property: 'finesse',
        damage_type: 'slashing'
      })

      expect(store.selectedSources).toEqual(['phb'])
      expect(store.selectedProperties).toEqual(['finesse'])
      expect(store.selectedDamageTypes).toEqual(['slashing'])
    })

    it('parses sort parameters', () => {
      const store = useItemFiltersStore()
      store.setFromUrlQuery({
        sort_by: 'rarity',
        sort_direction: 'desc'
      })

      expect(store.sortBy).toBe('rarity')
      expect(store.sortDirection).toBe('desc')
    })

    it('handles empty query gracefully', () => {
      const store = useItemFiltersStore()
      store.setFromUrlQuery({})
      expect(store.hasActiveFilters).toBe(false)
    })
  })

  describe('toUrlQuery getter', () => {
    it('returns empty object when no filters are active', () => {
      const store = useItemFiltersStore()
      expect(store.toUrlQuery).toEqual({})
    })

    it('includes string filter values', () => {
      const store = useItemFiltersStore()
      store.selectedRarity = 'rare'
      store.selectedMagic = 'true'

      const query = store.toUrlQuery
      expect(query.rarity).toBe('rare')
      expect(query.is_magic).toBe('true')
    })

    it('includes number filter values', () => {
      const store = useItemFiltersStore()
      store.selectedType = 5

      const query = store.toUrlQuery
      expect(query.type).toBe('5')
    })

    it('includes boolean toggle values', () => {
      const store = useItemFiltersStore()
      store.hasCharges = '1'
      store.requiresAttunement = '0'
      store.stealthDisadvantage = '1'

      const query = store.toUrlQuery
      expect(query.has_charges).toBe('1')
      expect(query.requires_attunement).toBe('0')
      expect(query.stealth_disadvantage).toBe('1')
    })

    it('includes array filter values', () => {
      const store = useItemFiltersStore()
      store.selectedSources = ['phb', 'dmg']
      store.selectedProperties = ['finesse', 'versatile']
      store.selectedDamageTypes = ['slashing']

      const query = store.toUrlQuery
      expect(query.source).toEqual(['phb', 'dmg'])
      expect(query.property).toEqual(['finesse', 'versatile'])
      expect(query.damage_type).toEqual(['slashing'])
    })

    it('includes range filter values', () => {
      const store = useItemFiltersStore()
      store.selectedStrengthReq = '13'
      store.selectedRange = 'under-30'
      store.selectedCostRange = 'under-100'
      store.selectedACRange = '11-14'

      const query = store.toUrlQuery
      expect(query.strength_req).toBe('13')
      expect(query.range).toBe('under-30')
      expect(query.cost).toBe('under-100')
      expect(query.ac).toBe('11-14')
    })

    it('only includes sort_by if non-default', () => {
      const store = useItemFiltersStore()
      expect(store.toUrlQuery.sort_by).toBeUndefined()

      store.sortBy = 'rarity'
      expect(store.toUrlQuery.sort_by).toBe('rarity')
    })

    it('only includes sort_direction if non-default', () => {
      const store = useItemFiltersStore()
      expect(store.toUrlQuery.sort_direction).toBeUndefined()

      store.sortDirection = 'desc'
      expect(store.toUrlQuery.sort_direction).toBe('desc')
    })

    it('skips empty arrays', () => {
      const store = useItemFiltersStore()
      store.selectedSources = []
      store.selectedProperties = []

      const query = store.toUrlQuery
      expect(query.source).toBeUndefined()
      expect(query.property).toBeUndefined()
    })
  })
})
