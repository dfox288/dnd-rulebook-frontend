import { describe, it, expect } from 'vitest'
import {
  getSpellLevelColor,
  getSpellSchoolColor,
  getItemRarityColor,
  getItemTypeColor,
  getSizeColor,
  getChallengeRatingColor
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

  describe('getChallengeRatingColor', () => {
    it('returns success for CR 0 (easy tier)', () => {
      expect(getChallengeRatingColor('0')).toBe('success')
    })

    it('returns success for CR 1/8 (fractional easy)', () => {
      expect(getChallengeRatingColor('1/8')).toBe('success')
    })

    it('returns success for CR 1/4', () => {
      expect(getChallengeRatingColor('1/4')).toBe('success')
    })

    it('returns success for CR 4 (easy tier max)', () => {
      expect(getChallengeRatingColor('4')).toBe('success')
    })

    it('returns info for CR 5 (medium tier)', () => {
      expect(getChallengeRatingColor('5')).toBe('info')
    })

    it('returns info for CR 10 (medium tier max)', () => {
      expect(getChallengeRatingColor('10')).toBe('info')
    })

    it('returns warning for CR 11 (hard tier)', () => {
      expect(getChallengeRatingColor('11')).toBe('warning')
    })

    it('returns warning for CR 16 (hard tier max)', () => {
      expect(getChallengeRatingColor('16')).toBe('warning')
    })

    it('returns error for CR 17 (deadly tier)', () => {
      expect(getChallengeRatingColor('17')).toBe('error')
    })

    it('returns error for CR 30 (max CR)', () => {
      expect(getChallengeRatingColor('30')).toBe('error')
    })

    // Edge case tests for invalid input
    it('returns info for invalid CR string', () => {
      expect(getChallengeRatingColor('invalid')).toBe('info')
    })

    it('returns info for malformed fraction with missing numerator', () => {
      expect(getChallengeRatingColor('/4')).toBe('info')
    })

    it('returns info for malformed fraction with missing denominator', () => {
      expect(getChallengeRatingColor('1/')).toBe('info')
    })

    it('returns info for division by zero', () => {
      expect(getChallengeRatingColor('0/0')).toBe('info')
      expect(getChallengeRatingColor('5/0')).toBe('info')
    })

    it('returns info for empty string', () => {
      expect(getChallengeRatingColor('')).toBe('info')
    })
  })
})
