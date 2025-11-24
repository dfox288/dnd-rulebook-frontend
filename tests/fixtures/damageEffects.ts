import type { components } from '~/types/api/generated'

type DamageEffect = components['schemas']['EntitySpellDamageResource']

/**
 * Mock damage effect with spell slot scaling
 */
export const mockDamageEffect3rdLevel: DamageEffect = {
  id: 1,
  description: 'Fire damage',
  dice_formula: '8d6',
  min_spell_slot: 3,
  min_character_level: null
}

/**
 * Mock damage effect for 4th level
 */
export const mockDamageEffect4thLevel: DamageEffect = {
  id: 2,
  description: 'At 4th level',
  dice_formula: '9d6',
  min_spell_slot: 4,
  min_character_level: null
}

/**
 * Mock damage effect for 5th level
 */
export const mockDamageEffect5thLevel: DamageEffect = {
  id: 3,
  description: 'At 5th level',
  dice_formula: '10d6',
  min_spell_slot: 5,
  min_character_level: null
}

/**
 * Mock cantrip damage with character level scaling
 */
export const mockCantripDamageLevel1: DamageEffect = {
  id: 4,
  description: 'Cantrip damage',
  dice_formula: '1d10',
  min_spell_slot: 0,
  min_character_level: 1
}

/**
 * Mock cantrip damage at higher level
 */
export const mockCantripDamageLevel5: DamageEffect = {
  id: 5,
  description: 'Cantrip damage (higher)',
  dice_formula: '2d10',
  min_spell_slot: 0,
  min_character_level: 5
}

/**
 * Mock healing effect (non-damage)
 */
export const mockHealingEffect: DamageEffect = {
  id: 6,
  description: 'Hit Points',
  dice_formula: '5d8',
  min_spell_slot: 1,
  min_character_level: null
}

/**
 * Mock effect with both spell slot and character level
 */
export const mockCombinedScaling: DamageEffect = {
  id: 7,
  description: 'Combined scaling',
  dice_formula: '3d10',
  min_spell_slot: 5,
  min_character_level: 11
}

/**
 * Representative array of damage effects (spell slot scaling)
 */
export const mockDamageEffectsArray: DamageEffect[] = [
  mockDamageEffect3rdLevel,
  mockDamageEffect4thLevel,
  mockDamageEffect5thLevel
]

/**
 * Representative array of cantrip effects (character level scaling)
 */
export const mockCantripEffectsArray: DamageEffect[] = [
  mockCantripDamageLevel1,
  mockCantripDamageLevel5
]
