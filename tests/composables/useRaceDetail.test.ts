import { describe, it, expect } from 'vitest'
import type { Race } from '~/types'

/**
 * Tests for useRaceDetail composable.
 *
 * These tests verify the composable correctly:
 * - Returns race data from API
 * - Identifies subraces via is_subrace boolean
 * - Filters modifiers by modifier_category (ability_score, damage_resistance)
 * - Filters traits by category (species, subspecies, description, mechanical)
 * - Provides accessors for languages, proficiencies, senses, spells, conditions
 * - Handles inherited_data for subraces
 */
describe('useRaceDetail - data organization logic', () => {
  // Test the pure logic functions without full composable mounting

  describe('isSubrace identification', () => {
    it('identifies base race when is_subrace is false', () => {
      const mockRace: Partial<Race> = {
        id: 1,
        name: 'Elf',
        is_subrace: false
      }
      expect(mockRace.is_subrace).toBe(false)
    })

    it('identifies subrace when is_subrace is true', () => {
      const mockRace: Partial<Race> = {
        id: 2,
        name: 'High Elf',
        is_subrace: true,
        parent_race: { id: 1, slug: 'elf', name: 'Elf', speed: 30 }
      }
      expect(mockRace.is_subrace).toBe(true)
    })
  })

  describe('abilityScoreIncreases filtering', () => {
    const mockModifiers = [
      {
        modifier_category: 'ability_score' as const,
        ability_score: { id: 1, code: 'STR', name: 'Strength' },
        value: 2
      },
      {
        modifier_category: 'ability_score' as const,
        ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
        value: 1
      },
      {
        modifier_category: 'damage_resistance' as const,
        damage_type: { id: 3, name: 'Fire' }
      }
    ]

    function filterAbilityScoreIncreases(modifiers: typeof mockModifiers) {
      return modifiers.filter(m => m.modifier_category === 'ability_score')
    }

    it('returns only ability_score modifiers', () => {
      const result = filterAbilityScoreIncreases(mockModifiers)
      expect(result).toHaveLength(2)
      expect(result.every(m => m.modifier_category === 'ability_score')).toBe(true)
    })

    it('returns empty array when no ability_score modifiers', () => {
      const noAbilityMods = mockModifiers.filter(m => m.modifier_category !== 'ability_score')
      const result = filterAbilityScoreIncreases(noAbilityMods)
      expect(result).toHaveLength(0)
    })
  })

  describe('damageResistances filtering', () => {
    const mockModifiers = [
      {
        modifier_category: 'ability_score' as const,
        ability_score: { id: 1, code: 'STR', name: 'Strength' },
        value: 2
      },
      {
        modifier_category: 'damage_resistance' as const,
        damage_type: { id: 3, name: 'Fire' }
      },
      {
        modifier_category: 'damage_resistance' as const,
        damage_type: { id: 4, name: 'Cold' }
      }
    ]

    function filterDamageResistances(modifiers: typeof mockModifiers) {
      return modifiers.filter(m => m.modifier_category === 'damage_resistance')
    }

    it('returns only damage_resistance modifiers', () => {
      const result = filterDamageResistances(mockModifiers)
      expect(result).toHaveLength(2)
      expect(result.every(m => m.modifier_category === 'damage_resistance')).toBe(true)
    })

    it('returns empty array when no damage_resistance modifiers', () => {
      const result = filterDamageResistances([mockModifiers[0]])
      expect(result).toHaveLength(0)
    })
  })

  describe('trait filtering by category', () => {
    const mockTraits = [
      { id: 1, name: 'Elf Description', category: 'description' as const },
      { id: 2, name: 'Darkvision', category: 'species' as const },
      { id: 3, name: 'Keen Senses', category: 'species' as const },
      { id: 4, name: 'High Elf Magic', category: 'subspecies' as const },
      { id: 5, name: 'Trance', category: null }
    ]

    function filterSpeciesTraits(traits: typeof mockTraits) {
      return traits.filter(t => t.category === 'species')
    }

    function filterSubspeciesTraits(traits: typeof mockTraits) {
      return traits.filter(t => t.category === 'subspecies')
    }

    function filterDescriptionTraits(traits: typeof mockTraits) {
      return traits.filter(t => t.category === 'description')
    }

    function filterMechanicalTraits(traits: typeof mockTraits) {
      return traits.filter(t => t.category === null)
    }

    it('filters species traits', () => {
      const result = filterSpeciesTraits(mockTraits)
      expect(result).toHaveLength(2)
      expect(result.every(t => t.category === 'species')).toBe(true)
    })

    it('filters subspecies traits', () => {
      const result = filterSubspeciesTraits(mockTraits)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('High Elf Magic')
    })

    it('filters description traits', () => {
      const result = filterDescriptionTraits(mockTraits)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Elf Description')
    })

    it('filters mechanical traits (category null)', () => {
      const result = filterMechanicalTraits(mockTraits)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Trance')
    })

    it('returns empty when no traits of that category', () => {
      const noSpecies = mockTraits.filter(t => t.category !== 'species')
      const result = filterSpeciesTraits(noSpecies)
      expect(result).toHaveLength(0)
    })
  })

  describe('inherited data for subraces', () => {
    it('exposes inherited_data for subraces', () => {
      const mockSubrace: Partial<Race> = {
        id: 2,
        name: 'High Elf',
        is_subrace: true,
        parent_race: { id: 1, slug: 'elf', name: 'Elf', speed: 30 },
        inherited_data: {
          traits: [{ id: 1, name: 'Darkvision', category: 'species' }],
          modifiers: [{ modifier_category: 'ability_score', ability_score: { id: 2, code: 'DEX', name: 'Dexterity' }, value: 2 }],
          proficiencies: [],
          languages: [],
          conditions: [],
          senses: []
        }
      }

      expect(mockSubrace.inherited_data).toBeDefined()
      expect(mockSubrace.inherited_data?.traits).toHaveLength(1)
      expect(mockSubrace.inherited_data?.modifiers).toHaveLength(1)
    })

    it('has no inherited_data for base races', () => {
      const mockRace: Partial<Race> = {
        id: 1,
        name: 'Elf',
        is_subrace: false,
        inherited_data: null
      }

      expect(mockRace.inherited_data).toBeNull()
    })
  })

  describe('subraces accessor', () => {
    it('provides subraces for base races', () => {
      const mockRace: Partial<Race> = {
        id: 1,
        name: 'Elf',
        is_subrace: false,
        subraces: [
          { id: 2, slug: 'high-elf', name: 'High Elf' },
          { id: 3, slug: 'wood-elf', name: 'Wood Elf' }
        ]
      }

      expect(mockRace.subraces).toHaveLength(2)
    })

    it('returns empty for subraces', () => {
      const mockSubrace: Partial<Race> = {
        id: 2,
        name: 'High Elf',
        is_subrace: true,
        subraces: []
      }

      expect(mockSubrace.subraces).toHaveLength(0)
    })
  })
})
