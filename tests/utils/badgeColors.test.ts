import { describe, it, expect } from 'vitest'
import {
  getSpellLevelColor,
  getSpellSchoolColor,
  getItemRarityColor,
  getItemTypeColor,
  getSizeColor
} from '~/utils/badgeColors'

describe('badgeColors', () => {
  describe('getSpellLevelColor', () => {
    it('returns primary for cantrips (level 0)', () => {
      expect(getSpellLevelColor(0)).toBe('primary')
    })

    it('returns info for low-level spells (1-3)', () => {
      expect(getSpellLevelColor(1)).toBe('info')
      expect(getSpellLevelColor(2)).toBe('info')
      expect(getSpellLevelColor(3)).toBe('info')
    })

    it('returns warning for mid-level spells (4-6)', () => {
      expect(getSpellLevelColor(4)).toBe('warning')
      expect(getSpellLevelColor(5)).toBe('warning')
      expect(getSpellLevelColor(6)).toBe('warning')
    })

    it('returns error for high-level spells (7-9)', () => {
      expect(getSpellLevelColor(7)).toBe('error')
      expect(getSpellLevelColor(8)).toBe('error')
      expect(getSpellLevelColor(9)).toBe('error')
    })
  })

  describe('getSpellSchoolColor', () => {
    it('returns correct colors for each school', () => {
      expect(getSpellSchoolColor('A')).toBe('info') // Abjuration
      expect(getSpellSchoolColor('C')).toBe('primary') // Conjuration
      expect(getSpellSchoolColor('D')).toBe('info') // Divination
      expect(getSpellSchoolColor('EN')).toBe('warning') // Enchantment
      expect(getSpellSchoolColor('EV')).toBe('error') // Evocation
      expect(getSpellSchoolColor('I')).toBe('primary') // Illusion
      expect(getSpellSchoolColor('N')).toBe('neutral') // Necromancy
      expect(getSpellSchoolColor('T')).toBe('success') // Transmutation
    })

    it('returns info for unknown schools', () => {
      expect(getSpellSchoolColor('UNKNOWN')).toBe('info')
      expect(getSpellSchoolColor('')).toBe('info')
    })
  })

  describe('getItemRarityColor', () => {
    it('returns correct colors for each rarity', () => {
      expect(getItemRarityColor('common')).toBe('neutral')
      expect(getItemRarityColor('uncommon')).toBe('success')
      expect(getItemRarityColor('rare')).toBe('info')
      expect(getItemRarityColor('very rare')).toBe('primary')
      expect(getItemRarityColor('legendary')).toBe('warning')
      expect(getItemRarityColor('artifact')).toBe('error')
    })

    it('is case-insensitive', () => {
      expect(getItemRarityColor('LEGENDARY')).toBe('warning')
      expect(getItemRarityColor('Rare')).toBe('info')
      expect(getItemRarityColor('VERY RARE')).toBe('primary')
    })

    it('returns neutral for unknown rarities', () => {
      expect(getItemRarityColor('ultra rare')).toBe('neutral')
      expect(getItemRarityColor('')).toBe('neutral')
    })
  })

  describe('getItemTypeColor', () => {
    it('returns error for weapons', () => {
      expect(getItemTypeColor('Longsword')).toBe('error')
      expect(getItemTypeColor('weapon')).toBe('error')
      expect(getItemTypeColor('Battle Axe')).toBe('error')
      expect(getItemTypeColor('Longbow')).toBe('error')
      expect(getItemTypeColor('Dagger')).toBe('error')
      expect(getItemTypeColor('War Hammer')).toBe('error')
    })

    it('returns info for armor and shields', () => {
      expect(getItemTypeColor('Plate Armor')).toBe('info')
      expect(getItemTypeColor('Shield')).toBe('info')
      expect(getItemTypeColor('Leather armor')).toBe('info')
    })

    it('returns warning for tools and equipment', () => {
      expect(getItemTypeColor('Thieves\' Tools')).toBe('warning')
      expect(getItemTypeColor('Artisan\'s Tools')).toBe('warning')
      expect(getItemTypeColor('Musical Instrument')).toBe('warning')
      expect(getItemTypeColor('Tool Kit')).toBe('warning')
    })

    it('returns success for potions and consumables', () => {
      expect(getItemTypeColor('Potion of Healing')).toBe('success')
      expect(getItemTypeColor('Scroll of Fireball')).toBe('success')
      expect(getItemTypeColor('Elixir')).toBe('success')
    })

    it('returns primary for wondrous and magical items', () => {
      expect(getItemTypeColor('Wondrous Item')).toBe('primary')
      expect(getItemTypeColor('Ring of Protection')).toBe('primary')
      expect(getItemTypeColor('Amulet of Health')).toBe('primary')
      expect(getItemTypeColor('Staff of Power')).toBe('primary')
      expect(getItemTypeColor('Rod of Absorption')).toBe('primary')
      expect(getItemTypeColor('Wand of Magic Missiles')).toBe('primary')
    })

    it('returns neutral for other types', () => {
      expect(getItemTypeColor('Backpack')).toBe('neutral')
      expect(getItemTypeColor('Food')).toBe('neutral')
      expect(getItemTypeColor('Clothing')).toBe('neutral')
      expect(getItemTypeColor('')).toBe('neutral')
    })

    it('is case-insensitive', () => {
      expect(getItemTypeColor('LONGSWORD')).toBe('error')
      expect(getItemTypeColor('Plate ARMOR')).toBe('info')
      expect(getItemTypeColor('POTION of healing')).toBe('success')
    })
  })

  describe('getSizeColor', () => {
    it('returns correct colors for each size', () => {
      expect(getSizeColor('T')).toBe('neutral') // Tiny
      expect(getSizeColor('S')).toBe('success') // Small
      expect(getSizeColor('M')).toBe('info') // Medium
      expect(getSizeColor('L')).toBe('warning') // Large
      expect(getSizeColor('H')).toBe('error') // Huge
      expect(getSizeColor('G')).toBe('error') // Gargantuan
    })

    it('returns info for unknown sizes', () => {
      expect(getSizeColor('X')).toBe('info')
      expect(getSizeColor('')).toBe('info')
    })
  })
})
