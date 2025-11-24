import type { components } from '~/types/api/generated'

type ItemSpell = components['schemas']['EntityItemSpellResource']

/**
 * Mock spell with fixed charge cost
 */
export const mockSpellFixedCost: ItemSpell = {
  id: 201,
  name: 'Lesser Restoration',
  slug: 'lesser-restoration',
  level: 2,
  charges_cost_min: 2,
  charges_cost_max: 2,
  charges_cost_formula: null,
  usage_limit: null,
  level_requirement: null
}

/**
 * Mock spell with variable charge cost
 */
export const mockSpellVariableCost: ItemSpell = {
  id: 85,
  name: 'Cure Wounds',
  slug: 'cure-wounds',
  level: 1,
  charges_cost_min: 1,
  charges_cost_max: 4,
  charges_cost_formula: '1 per spell level',
  usage_limit: null,
  level_requirement: null
}

/**
 * Mock high-level spell
 */
export const mockSpellHighLevel: ItemSpell = {
  id: 218,
  name: 'Mass Cure Wounds',
  slug: 'mass-cure-wounds',
  level: 5,
  charges_cost_min: 5,
  charges_cost_max: 5,
  charges_cost_formula: null,
  usage_limit: null,
  level_requirement: null
}

/**
 * Mock spell with usage limit
 */
export const mockSpellWithUsageLimit: ItemSpell = {
  id: 100,
  name: 'Test Spell',
  slug: 'test-spell',
  level: 1,
  charges_cost_min: 1,
  charges_cost_max: 1,
  charges_cost_formula: null,
  usage_limit: '3/day',
  level_requirement: null
}

/**
 * Mock spell with level requirement
 */
export const mockSpellWithLevelReq: ItemSpell = {
  id: 101,
  name: 'Powerful Spell',
  slug: 'powerful-spell',
  level: 9,
  charges_cost_min: 7,
  charges_cost_max: 7,
  charges_cost_formula: null,
  usage_limit: null,
  level_requirement: 17
}

/**
 * Representative array of item spells
 */
export const mockItemSpellsArray: ItemSpell[] = [
  mockSpellFixedCost,
  mockSpellVariableCost,
  mockSpellHighLevel
]
