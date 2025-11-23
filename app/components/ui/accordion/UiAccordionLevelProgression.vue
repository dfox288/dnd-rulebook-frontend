<script setup lang="ts">
import type { components } from '~/types/api/generated'

type LevelProgression = components['schemas']['ClassLevelProgressionResource']

interface Props {
  levelProgression: LevelProgression[]
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  borderColor: 'gray-700'
})

// Don't render if no data
if (!props.levelProgression || props.levelProgression.length === 0) {
  // Component returns nothing
}

// Determine which columns to show based on data
// Show cantrips if any level has a non-zero value
const hasCantrips = computed(() =>
  props.levelProgression.some(level => level.cantrips_known !== null && level.cantrips_known !== 0)
)

// Show spells_known column if the field exists (even if all values are null)
// This is because null is semantically meaningful (prepared casters vs known casters)
const hasSpellsKnown = computed(() =>
  props.levelProgression.some(level => 'spells_known' in level)
)

// Check which spell level columns should be shown (hide if all 0)
const showSpellLevel = (level: number) => {
  const key = `spell_slots_${level === 1 ? '1st' : level === 2 ? '2nd' : level === 3 ? '3rd' : `${level}th`}` as keyof LevelProgression
  return props.levelProgression.some(prog => {
    const value = prog[key]
    return value !== null && value !== 0
  })
}

const visibleSpellLevels = computed(() => {
  const levels = []
  for (let i = 1; i <= 9; i++) {
    if (showSpellLevel(i)) {
      levels.push(i)
    }
  }
  return levels
})

// Helper to format spell level ordinals
const ordinalSuffix = (n: number): string => {
  if (n === 1) return '1st'
  if (n === 2) return '2nd'
  if (n === 3) return '3rd'
  return `${n}th`
}

// Helper to display null values as em dash
const displayValue = (value: number | null): string => {
  if (value === null) return '—'
  return String(value)
}

// Get spell slot value for a given level
const getSpellSlot = (progression: LevelProgression, level: number): number | null => {
  const key = `spell_slots_${ordinalSuffix(level)}` as keyof LevelProgression
  return progression[key] as number | null
}
</script>

<template>
  <div v-if="levelProgression && levelProgression.length > 0" class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-700 text-sm">
      <thead class="bg-gray-800/50">
        <tr>
          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Level
          </th>
          <th v-if="hasCantrips" scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Cantrips
          </th>
          <th v-if="hasSpellsKnown" scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Spells Known
          </th>
          <th
            v-for="spellLevel in visibleSpellLevels"
            :key="spellLevel"
            scope="col"
            class="px-3 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            {{ ordinalSuffix(spellLevel) }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-gray-900 divide-y divide-gray-800">
        <tr
          v-for="(progression, index) in levelProgression"
          :key="progression.id"
          :class="index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/30'"
        >
          <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-200">
            {{ progression.level }}
          </td>
          <td v-if="hasCantrips" class="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
            {{ displayValue(progression.cantrips_known) }}
          </td>
          <td v-if="hasSpellsKnown" class="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
            {{ displayValue(progression.spells_known) }}
          </td>
          <td
            v-for="spellLevel in visibleSpellLevels"
            :key="spellLevel"
            class="px-3 py-2 whitespace-nowrap text-sm text-gray-300 text-center"
          >
            {{ getSpellSlot(progression, spellLevel) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
