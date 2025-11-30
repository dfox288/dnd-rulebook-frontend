<script setup lang="ts">
import type { SpellEffect } from '~/types'

interface Props {
  effects: SpellEffect[]
  baseLevel: number
  scalingType: 'spell_slot_level' | 'character_level'
}

const props = defineProps<Props>()

// Determine if component should render
const shouldRender = computed(() => {
  if (props.effects.length <= 1) return false

  // Get unique levels based on scaling type
  const levels = props.scalingType === 'spell_slot_level'
    ? props.effects.map(e => e.min_spell_slot).filter(Boolean)
    : props.effects.map(e => e.min_character_level).filter(Boolean)

  const uniqueLevels = new Set(levels)
  return uniqueLevels.size > 1
})

// Sort effects by appropriate level
const sortedEffects = computed(() => {
  return [...props.effects].sort((a, b) => {
    const levelA = props.scalingType === 'spell_slot_level'
      ? (a.min_spell_slot ?? 0)
      : (a.min_character_level ?? 0)
    const levelB = props.scalingType === 'spell_slot_level'
      ? (b.min_spell_slot ?? 0)
      : (b.min_character_level ?? 0)
    return levelA - levelB
  })
})

// Generate table headers based on scaling type
const tableHeaders = computed(() => {
  if (props.scalingType === 'spell_slot_level') {
    return sortedEffects.value.map((effect) => {
      const level = effect.min_spell_slot ?? 0
      return formatOrdinal(level)
    })
  } else {
    // Character level ranges
    const levels = sortedEffects.value.map(e => e.min_character_level ?? 0)
    return levels.map((level, index) => {
      const nextLevel = levels[index + 1]
      if (!nextLevel) {
        return `${level}+`
      }
      return `${level}-${nextLevel - 1}`
    })
  }
})

// Format ordinal numbers (1st, 2nd, 3rd, etc.)
function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = num % 100
  const suffix = suffixes[(v - 20) % 10] ?? suffixes[v] ?? 'th'
  return num + suffix
}

// Calculate average damage from dice formula
function calculateAverage(diceFormula: string | null): number | null {
  if (!diceFormula) return null

  // Match pattern like "8d6" or "2d10"
  const match = diceFormula.match(/^(\d+)d(\d+)$/)
  if (!match || !match[1] || !match[2]) return null

  const numDice = parseInt(match[1], 10)
  const sides = parseInt(match[2], 10)

  // Average = numDice * (1 + sides) / 2
  const average = numDice * (1 + sides) / 2
  return Math.floor(average)
}

// Check if any effect has dice formula (for showing average row)
const hasDiceFormulas = computed(() => {
  return sortedEffects.value.some((effect) => {
    const match = effect.dice_formula?.match(/^\d+d\d+$/)
    return !!match
  })
})

// Determine row label based on effect type
const effectRowLabel = computed(() => {
  const firstEffect = sortedEffects.value[0]
  if (!firstEffect) return 'Effect'

  if (firstEffect.effect_type === 'healing') {
    return 'Healing'
  } else if (firstEffect.effect_type === 'damage') {
    return 'Damage'
  } else {
    return 'Effect'
  }
})

// Header title
const headerTitle = computed(() => {
  return props.scalingType === 'spell_slot_level'
    ? 'SCALING BY SPELL SLOT'
    : 'SCALING BY CHARACTER LEVEL'
})
</script>

<template>
  <UCard
    v-if="shouldRender"
    class="border-2 border-spell-200 dark:border-spell-800"
  >
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <span
          class="text-xl"
          aria-hidden="true"
        >📈</span>
        <h2 class="text-lg font-bold tracking-wide">
          {{ headerTitle }}
        </h2>
      </div>
    </template>

    <!-- Scrollable Table Container -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="text-left px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 border-b-2 border-gray-200 dark:border-gray-700">
              {{ scalingType === 'spell_slot_level' ? 'Slot' : 'Character Level' }}
            </th>
            <th
              v-for="(header, index) in tableHeaders"
              :key="index"
              class="px-4 py-2 text-sm font-bold text-center border-b-2 border-gray-200 dark:border-gray-700"
              :class="{
                'bg-spell-100 dark:bg-spell-900':
                  (scalingType === 'spell_slot_level' && sortedEffects[index]?.min_spell_slot === baseLevel)
                  || (scalingType === 'character_level' && index === 0)
              }"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Effect Row -->
          <tr>
            <td class="px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-400">
              {{ effectRowLabel }}
            </td>
            <td
              v-for="(effect, index) in sortedEffects"
              :key="effect.id"
              class="px-4 py-3 text-center font-semibold"
              :class="{
                'bg-spell-50 dark:bg-spell-900/30':
                  (scalingType === 'spell_slot_level' && effect.min_spell_slot === baseLevel)
                  || (scalingType === 'character_level' && index === 0)
              }"
            >
              {{ effect.dice_formula }}
            </td>
          </tr>

          <!-- Average Row (only if dice formulas exist) -->
          <tr v-if="hasDiceFormulas">
            <td class="px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-400">
              Average
            </td>
            <td
              v-for="(effect, index) in sortedEffects"
              :key="`avg-${effect.id}`"
              class="px-4 py-3 text-center text-gray-700 dark:text-gray-300"
              :class="{
                'bg-spell-50 dark:bg-spell-900/30':
                  (scalingType === 'spell_slot_level' && effect.min_spell_slot === baseLevel)
                  || (scalingType === 'character_level' && index === 0)
              }"
            >
              {{ calculateAverage(effect.dice_formula) ?? '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>
