import type { components } from '~/types/api/generated'

type SavingThrow = components['schemas']['EntitySavingThrowResource']

/**
 * Mock Dexterity saving throw
 */
export const mockDexSave: SavingThrow = {
  ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
  save_effect: null,
  is_initial_save: true,
  save_modifier: null,
  dc: null
}

/**
 * Mock Wisdom saving throw with effect
 */
export const mockWisSaveNegates: SavingThrow = {
  ability_score: { id: 5, code: 'WIS', name: 'Wisdom' },
  save_effect: 'negates',
  is_initial_save: true,
  save_modifier: null,
  dc: null
}

/**
 * Mock recurring Constitution save
 */
export const mockConSaveRecurring: SavingThrow = {
  ability_score: { id: 3, code: 'CON', name: 'Constitution' },
  save_effect: 'ends_effect',
  is_initial_save: false,
  save_modifier: null,
  dc: null
}

/**
 * Mock save with advantage
 */
export const mockSaveWithAdvantage: SavingThrow = {
  ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
  save_effect: null,
  is_initial_save: true,
  save_modifier: 'advantage',
  dc: null
}

/**
 * Mock save with disadvantage
 */
export const mockSaveWithDisadvantage: SavingThrow = {
  ability_score: { id: 5, code: 'WIS', name: 'Wisdom' },
  save_effect: null,
  is_initial_save: true,
  save_modifier: 'disadvantage',
  dc: null
}

/**
 * Mock save with DC
 */
export const mockSaveWithDC: SavingThrow = {
  ability_score: { id: 5, code: 'WIS', name: 'Wisdom' },
  save_effect: 'negates',
  is_initial_save: true,
  save_modifier: null,
  dc: 15
}

/**
 * Representative array of saving throws
 */
export const mockSavingThrowsArray: SavingThrow[] = [
  mockDexSave,
  mockWisSaveNegates
]
