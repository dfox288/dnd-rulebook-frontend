import { describe, it, expect, beforeEach } from 'vitest'
import { useSpellListGenerator } from '~/composables/useSpellListGenerator'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { if (key in store) store[key] = undefined },
    clear: () => { store = {} }
  }
})()
global.localStorage = localStorageMock as Storage

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
    } as Record<string, unknown>

    setClassData(mockClass)
    characterLevel.value = 3

    expect(spellSlots.value).toEqual({
      'cantrips': 3,
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
    } as Record<string, unknown>

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
    } as Record<string, unknown>

    setClassData(bardClass)
    characterLevel.value = 5

    // Bard level 5: 8 spells known (from table)
    expect(maxSpells.value).toBe(8)
  })

  it('toggles spell selection', () => {
    const { selectedSpells, toggleSpell, setClassData, characterLevel } = useSpellListGenerator()

    // Set up a class first so maxSpells > 0
    const wizardClass = {
      id: 1,
      slug: 'wizard',
      name: 'Wizard',
      level_progression: []
    } as Record<string, unknown>
    setClassData(wizardClass)
    characterLevel.value = 5

    const added = toggleSpell(1)
    expect(added).toBe(true)
    expect(selectedSpells.value.has(1)).toBe(true)

    const removed = toggleSpell(1)
    expect(removed).toBe(true)
    expect(selectedSpells.value.has(1)).toBe(false)
  })

  it('tracks selection count', () => {
    const { toggleSpell, selectionCount, setClassData, characterLevel } = useSpellListGenerator()

    // Set up a class first so maxSpells > 0
    const wizardClass = {
      id: 1,
      slug: 'wizard',
      name: 'Wizard',
      level_progression: []
    } as Record<string, unknown>
    setClassData(wizardClass)
    characterLevel.value = 5

    expect(selectionCount.value).toBe(0)

    toggleSpell(1)
    toggleSpell(2)
    expect(selectionCount.value).toBe(2)

    toggleSpell(1)
    expect(selectionCount.value).toBe(1)
  })

  it('prevents selecting more spells than maxSpells allows', () => {
    const { toggleSpell, selectionCount, maxSpells, setClassData, characterLevel, selectedSpells } = useSpellListGenerator()

    // Set up wizard at level 3 (max spells = 3 + 3 = 6)
    const wizardClass = {
      id: 1,
      slug: 'wizard',
      name: 'Wizard',
      level_progression: []
    } as Record<string, unknown>

    setClassData(wizardClass)
    characterLevel.value = 3

    expect(maxSpells.value).toBe(6)

    // Add 6 spells (should all succeed)
    for (let i = 1; i <= 6; i++) {
      const success = toggleSpell(i)
      expect(success).toBe(true)
    }
    expect(selectionCount.value).toBe(6)

    // Try to add 7th spell (should fail)
    const failedAdd = toggleSpell(7)
    expect(failedAdd).toBe(false)
    expect(selectionCount.value).toBe(6)
    expect(selectedSpells.value.has(7)).toBe(false)

    // Deselecting should still work
    const deselect = toggleSpell(1)
    expect(deselect).toBe(true)
    expect(selectionCount.value).toBe(5)
  })
})

describe('useSpellListGenerator - LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves selections to localStorage', () => {
    const { toggleSpell, characterLevel, setClassData, saveToStorage } = useSpellListGenerator()

    const mockClass = {
      id: 1,
      slug: 'wizard',
      name: 'Wizard',
      level_progression: []
    } as Record<string, unknown>

    setClassData(mockClass)
    characterLevel.value = 5
    toggleSpell(1)
    toggleSpell(2)

    saveToStorage()

    const stored = localStorage.getItem('dnd-spell-list-wizard')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!)
    expect(parsed.classSlug).toBe('wizard')
    expect(parsed.characterLevel).toBe(5)
    expect(parsed.selectedSpells).toEqual([1, 2])
  })

  it('loads selections from localStorage', () => {
    const mockData = {
      classSlug: 'wizard',
      characterLevel: 5,
      selectedSpells: [1, 2, 3]
    }
    localStorage.setItem('dnd-spell-list-wizard', JSON.stringify(mockData))

    const { selectedSpells, characterLevel, loadFromStorage, setClassData } = useSpellListGenerator()

    const mockClass = {
      id: 1,
      slug: 'wizard',
      name: 'Wizard',
      level_progression: []
    } as Record<string, unknown>

    setClassData(mockClass)
    loadFromStorage()

    expect(selectedSpells.value.has(1)).toBe(true)
    expect(selectedSpells.value.has(2)).toBe(true)
    expect(selectedSpells.value.has(3)).toBe(true)
    expect(characterLevel.value).toBe(5)
  })
})
