import { describe, it, expect } from 'vitest'
import { useSpellListGenerator } from '~/composables/useSpellListGenerator'

describe('useSpellListGenerator', () => {
  it('calculates spell slots from level progression', () => {
    const { setClassData, characterLevel, spellSlots } = useSpellListGenerator()

    // Mock class with level_progression
    const mockClass = {
      id: 1,
      slug: 'wizard',
      name: 'Wizard',
      level_progression: [
        {
          level: 1,
          cantrips_known: 3,
          spell_slots_1st: 2,
          spell_slots_2nd: 0,
          spell_slots_3rd: 0
        },
        {
          level: 2,
          cantrips_known: 3,
          spell_slots_1st: 3,
          spell_slots_2nd: 0,
          spell_slots_3rd: 0
        },
        {
          level: 3,
          cantrips_known: 3,
          spell_slots_1st: 4,
          spell_slots_2nd: 2,
          spell_slots_3rd: 0
        }
      ]
    } as any

    setClassData(mockClass)
    characterLevel.value = 3

    expect(spellSlots.value).toEqual({
      cantrips: 3,
      '1st': 4,
      '2nd': 2,
      '3rd': 0
    })
  })

  it('calculates max prepared spells for prepared casters', () => {
    const { setClassData, characterLevel, maxSpells } = useSpellListGenerator()

    const wizardClass = {
      id: 1,
      slug: 'wizard',
      name: 'Wizard',
      level_progression: [
        { level: 1 },
        { level: 2 },
        { level: 3 },
        { level: 4 },
        { level: 5 }
      ]
    } as any

    setClassData(wizardClass)
    characterLevel.value = 5

    // Wizard: level + 3 (default modifier) = 8
    expect(maxSpells.value).toBe(8)
    expect(maxSpells.value).toBe(5 + 3)
  })

  it('calculates max known spells for known casters', () => {
    const { setClassData, characterLevel, maxSpells } = useSpellListGenerator()

    const bardClass = {
      id: 2,
      slug: 'bard',
      name: 'Bard',
      level_progression: [
        { level: 1 },
        { level: 2 },
        { level: 3 },
        { level: 4 },
        { level: 5 }
      ]
    } as any

    setClassData(bardClass)
    characterLevel.value = 5

    // Bard level 5: 8 spells known (from table)
    expect(maxSpells.value).toBe(8)
  })
})
