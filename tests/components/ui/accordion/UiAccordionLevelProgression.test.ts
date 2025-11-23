import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UiAccordionLevelProgression from '~/components/ui/accordion/UiAccordionLevelProgression.vue'

describe('UiAccordionLevelProgression', () => {
  // Full caster (Wizard) - 9th level spells at level 17
  const mockFullCaster = [
    { id: 1, level: 1, cantrips_known: 3, spells_known: null, spell_slots_1st: 2, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 2, level: 2, cantrips_known: 3, spells_known: null, spell_slots_1st: 3, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 3, level: 3, cantrips_known: 3, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 2, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 4, level: 4, cantrips_known: 4, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 5, level: 5, cantrips_known: 4, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 2, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 6, level: 6, cantrips_known: 4, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 7, level: 7, cantrips_known: 4, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 1, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 8, level: 8, cantrips_known: 4, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 2, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 9, level: 9, cantrips_known: 4, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 1, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 10, level: 10, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 11, level: 11, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 12, level: 12, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 13, level: 13, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 14, level: 14, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 15, level: 15, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 0 },
    { id: 16, level: 16, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 0 },
    { id: 17, level: 17, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 1 },
    { id: 18, level: 18, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 3, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 1 },
    { id: 19, level: 19, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 3, spell_slots_6th: 2, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 1 },
    { id: 20, level: 20, cantrips_known: 5, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 3, spell_slots_6th: 2, spell_slots_7th: 2, spell_slots_8th: 1, spell_slots_9th: 1 }
  ]

  // Half caster (Paladin) - starts at level 2, max 5th level spells
  const mockHalfCaster = [
    { id: 21, level: 1, cantrips_known: null, spells_known: null, spell_slots_1st: 0, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 22, level: 2, cantrips_known: null, spells_known: null, spell_slots_1st: 2, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 23, level: 3, cantrips_known: null, spells_known: null, spell_slots_1st: 3, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 24, level: 4, cantrips_known: null, spells_known: null, spell_slots_1st: 3, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 25, level: 5, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 2, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 26, level: 6, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 2, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 27, level: 7, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 28, level: 8, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 29, level: 9, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 2, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 30, level: 10, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 2, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 31, level: 11, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 32, level: 12, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 33, level: 13, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 1, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 34, level: 14, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 1, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 35, level: 15, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 2, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 36, level: 16, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 2, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 37, level: 17, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 1, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 38, level: 18, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 1, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 39, level: 19, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 40, level: 20, cantrips_known: null, spells_known: null, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 }
  ]

  // Third caster (Eldritch Knight) - starts at level 3, max 4th level spells
  const mockThirdCaster = [
    { id: 41, level: 1, cantrips_known: null, spells_known: null, spell_slots_1st: 0, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 42, level: 2, cantrips_known: null, spells_known: null, spell_slots_1st: 0, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 43, level: 3, cantrips_known: 2, spells_known: 3, spell_slots_1st: 2, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 44, level: 4, cantrips_known: 2, spells_known: 4, spell_slots_1st: 3, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 45, level: 5, cantrips_known: 2, spells_known: 4, spell_slots_1st: 3, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 46, level: 6, cantrips_known: 2, spells_known: 4, spell_slots_1st: 3, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 47, level: 7, cantrips_known: 2, spells_known: 5, spell_slots_1st: 4, spell_slots_2nd: 2, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 48, level: 8, cantrips_known: 2, spells_known: 6, spell_slots_1st: 4, spell_slots_2nd: 2, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 49, level: 9, cantrips_known: 2, spells_known: 6, spell_slots_1st: 4, spell_slots_2nd: 2, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 50, level: 10, cantrips_known: 3, spells_known: 7, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 51, level: 11, cantrips_known: 3, spells_known: 8, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 52, level: 12, cantrips_known: 3, spells_known: 8, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 53, level: 13, cantrips_known: 3, spells_known: 9, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 2, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 54, level: 14, cantrips_known: 3, spells_known: 10, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 2, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 55, level: 15, cantrips_known: 3, spells_known: 10, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 2, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 56, level: 16, cantrips_known: 3, spells_known: 11, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 57, level: 17, cantrips_known: 3, spells_known: 11, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 58, level: 18, cantrips_known: 3, spells_known: 11, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 59, level: 19, cantrips_known: 3, spells_known: 12, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 1, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 60, level: 20, cantrips_known: 3, spells_known: 13, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 1, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 }
  ]

  // Sorcerer with spells_known
  const mockSorcerer = [
    { id: 61, level: 1, cantrips_known: 4, spells_known: 2, spell_slots_1st: 2, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 62, level: 2, cantrips_known: 4, spells_known: 3, spell_slots_1st: 3, spell_slots_2nd: 0, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 63, level: 3, cantrips_known: 4, spells_known: 4, spell_slots_1st: 4, spell_slots_2nd: 2, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 64, level: 4, cantrips_known: 5, spells_known: 5, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 0, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 65, level: 5, cantrips_known: 5, spells_known: 6, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 2, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 66, level: 6, cantrips_known: 5, spells_known: 7, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 0, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 67, level: 7, cantrips_known: 5, spells_known: 8, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 1, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 68, level: 8, cantrips_known: 5, spells_known: 9, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 2, spell_slots_5th: 0, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 69, level: 9, cantrips_known: 5, spells_known: 10, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 1, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 70, level: 10, cantrips_known: 6, spells_known: 11, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 0, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 71, level: 11, cantrips_known: 6, spells_known: 12, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 72, level: 12, cantrips_known: 6, spells_known: 12, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 0, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 73, level: 13, cantrips_known: 6, spells_known: 13, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 74, level: 14, cantrips_known: 6, spells_known: 13, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 0, spell_slots_9th: 0 },
    { id: 75, level: 15, cantrips_known: 6, spells_known: 14, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 0 },
    { id: 76, level: 16, cantrips_known: 6, spells_known: 14, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 0 },
    { id: 77, level: 17, cantrips_known: 6, spells_known: 15, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 2, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 1 },
    { id: 78, level: 18, cantrips_known: 6, spells_known: 15, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 3, spell_slots_6th: 1, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 1 },
    { id: 79, level: 19, cantrips_known: 6, spells_known: 15, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 3, spell_slots_6th: 2, spell_slots_7th: 1, spell_slots_8th: 1, spell_slots_9th: 1 },
    { id: 80, level: 20, cantrips_known: 6, spells_known: 15, spell_slots_1st: 4, spell_slots_2nd: 3, spell_slots_3rd: 3, spell_slots_4th: 3, spell_slots_5th: 3, spell_slots_6th: 2, spell_slots_7th: 2, spell_slots_8th: 1, spell_slots_9th: 1 }
  ]

  it('renders table with correct headers', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: mockFullCaster }
    })

    const headers = wrapper.findAll('th')
    expect(headers.length).toBeGreaterThan(0)
    expect(headers[0].text()).toContain('Level')
  })

  it('displays all 20 levels', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: mockFullCaster }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(20)

    // Check first and last level
    expect(rows[0].text()).toContain('1')
    expect(rows[19].text()).toContain('20')
  })

  it('shows cantrips_known column when present', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: mockFullCaster }
    })

    const headers = wrapper.findAll('th')
    const headerTexts = headers.map(h => h.text())
    expect(headerTexts).toContain('Cantrips')

    // Verify cantrip value is displayed
    const firstRow = wrapper.findAll('tbody tr')[0]
    expect(firstRow.text()).toContain('3')
  })

  it('shows spells_known column when present', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: mockSorcerer }
    })

    const headers = wrapper.findAll('th')
    const headerTexts = headers.map(h => h.text())
    expect(headerTexts).toContain('Spells Known')

    // Verify spell known value is displayed
    const firstRow = wrapper.findAll('tbody tr')[0]
    expect(firstRow.text()).toContain('2')
  })

  it('displays "—" for null values', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: mockFullCaster }
    })

    // Full casters have null spells_known - should show em dash
    const firstRow = wrapper.findAll('tbody tr')[0]
    const cells = firstRow.findAll('td')

    // Find the spells_known column (should be after cantrips)
    const cellTexts = cells.map(c => c.text())
    expect(cellTexts).toContain('—')
  })

  it('hides columns for spell levels that are always 0', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: mockHalfCaster }
    })

    const headers = wrapper.findAll('th')
    const headerTexts = headers.map(h => h.text())

    // Half-casters only go up to 5th level spells, so 6th-9th should be hidden
    expect(headerTexts).not.toContain('6th')
    expect(headerTexts).not.toContain('7th')
    expect(headerTexts).not.toContain('8th')
    expect(headerTexts).not.toContain('9th')
  })

  it('handles half-casters (starts at level 2)', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: mockHalfCaster }
    })

    // Level 1 should show 0 spell slots
    const firstRow = wrapper.findAll('tbody tr')[0]
    const firstRowText = firstRow.text()
    expect(firstRowText).toContain('0')

    // Level 2 should show actual spell slots
    const secondRow = wrapper.findAll('tbody tr')[1]
    const secondRowText = secondRow.text()
    expect(secondRowText).toContain('2')
  })

  it('handles third-casters (starts at level 3)', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: mockThirdCaster }
    })

    // Level 1 and 2 should show 0 spell slots
    const firstRow = wrapper.findAll('tbody tr')[0]
    expect(firstRow.text()).toContain('0')

    const secondRow = wrapper.findAll('tbody tr')[1]
    expect(secondRow.text()).toContain('0')

    // Level 3 should show actual spell slots
    const thirdRow = wrapper.findAll('tbody tr')[2]
    expect(thirdRow.text()).toContain('2')
  })

  it('handles empty array gracefully', () => {
    const wrapper = mount(UiAccordionLevelProgression, {
      props: { levelProgression: [] }
    })

    // Component should not render a table when empty
    expect(wrapper.find('table').exists()).toBe(false)
  })
})
