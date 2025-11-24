import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { CharacterClass } from '~/types'

interface SpellSlots {
  cantrips: number
  [key: string]: number // '1st', '2nd', etc.
}

// Prepared casters calculate spells as: level + ability modifier
const PREPARED_CASTER_CLASSES = ['wizard', 'cleric', 'druid', 'paladin', 'artificer']

// Known casters use fixed tables by level
const KNOWN_SPELLS_BY_CLASS: Record<string, number[]> = {
  'bard': [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  'sorcerer': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  'warlock': [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
  'ranger': [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  'eldritch-knight': [0, 0, 2, 3, 3, 4, 4, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9],
  'arcane-trickster': [0, 0, 2, 3, 3, 4, 4, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9]
}

const DEFAULT_ABILITY_MODIFIER = 3

export interface UseSpellListGeneratorReturn {
  selectedClass: Ref<CharacterClass | null>
  characterLevel: Ref<number>
  selectedSpells: Ref<Set<number>>
  spellSlots: ComputedRef<SpellSlots>
  maxSpells: ComputedRef<number>
  toggleSpell: (spellId: number) => void
  selectionCount: ComputedRef<number>
  setClassData: (classData: CharacterClass) => void
}

export function useSpellListGenerator(): UseSpellListGeneratorReturn {
  const selectedClass = ref<CharacterClass | null>(null)
  const characterLevel = ref(1)
  const selectedSpells = ref<Set<number>>(new Set())

  const setClassData = (classData: CharacterClass) => {
    selectedClass.value = classData
  }

  const spellSlots = computed(() => {
    if (!selectedClass.value?.level_progression) {
      return { cantrips: 0 }
    }

    const progression = selectedClass.value.level_progression[characterLevel.value - 1]
    if (!progression) {
      return { cantrips: 0 }
    }

    const slots: SpellSlots = {
      cantrips: progression.cantrips_known || 0
    }

    // Map spell_slots_1st, spell_slots_2nd, etc. to '1st', '2nd', etc.
    for (let i = 1; i <= 9; i++) {
      const key = `spell_slots_${i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : `${i}th`}`
      const value = (progression as any)[key] || 0
      if (value > 0 || i <= 3) { // Always include 1st-3rd
        const slotKey = i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : `${i}th`
        slots[slotKey] = value
      }
    }

    return slots
  })

  const maxSpells = computed(() => {
    if (!selectedClass.value) return 0

    const classSlug = selectedClass.value.slug
    const level = characterLevel.value

    // Prepared casters: level + ability modifier
    if (PREPARED_CASTER_CLASSES.includes(classSlug)) {
      return level + DEFAULT_ABILITY_MODIFIER
    }

    // Known casters: lookup from table
    if (KNOWN_SPELLS_BY_CLASS[classSlug]) {
      return KNOWN_SPELLS_BY_CLASS[classSlug][level - 1] || 0
    }

    // Fallback for unknown classes
    return level + DEFAULT_ABILITY_MODIFIER
  })

  const toggleSpell = (spellId: number) => {
    if (selectedSpells.value.has(spellId)) {
      selectedSpells.value.delete(spellId)
    } else {
      selectedSpells.value.add(spellId)
    }
    // Trigger reactivity
    selectedSpells.value = new Set(selectedSpells.value)
  }

  const selectionCount = computed(() => selectedSpells.value.size)

  return {
    selectedClass,
    characterLevel,
    selectedSpells,
    spellSlots,
    maxSpells,
    toggleSpell,
    selectionCount,
    setClassData
  }
}
