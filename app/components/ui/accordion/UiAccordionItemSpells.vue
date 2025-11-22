<script setup lang="ts">
import type { components } from '~/types/api/generated'

// ItemSpellResource has string types for id and level (from pivot table)
type ItemSpellResource = components['schemas']['ItemSpellResource']

interface Props {
  spells: ItemSpellResource[]
}

defineProps<Props>()

/**
 * Format spell level for display (1st, 2nd, 3rd, etc.)
 * API returns level as string, so we convert to number
 */
const formatSpellLevel = (level: string): string => {
  const levelNum = Number.parseInt(level, 10)
  const suffixes = ['th', 'st', 'nd', 'rd']
  const remainder = levelNum % 10
  const suffix = remainder <= 3 && ![11, 12, 13].includes(levelNum % 100)
    ? suffixes[remainder]
    : suffixes[0]
  return `${levelNum}${suffix} level`
}

/**
 * Format charges cost display
 * API returns costs as strings, so we convert to numbers
 */
const formatChargesCost = (min: string, max: string): string => {
  const minNum = Number.parseInt(min, 10)
  const maxNum = Number.parseInt(max, 10)
  if (minNum === maxNum) {
    return minNum === 1 ? '1 charge' : `${minNum} charges`
  }
  return `${minNum}-${maxNum} charges`
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div
      v-for="spell in spells"
      :key="spell.id"
      class="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
    >
      <!-- Spell Name & Level -->
      <div class="flex items-baseline justify-between gap-4 mb-2">
        <NuxtLink
          :to="`/spells/${spell.slug}`"
          class="text-lg font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          {{ spell.name }}
        </NuxtLink>
        <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {{ formatSpellLevel(spell.level) }}
        </span>
      </div>

      <!-- Charges Cost -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <span class="font-medium">Cost:</span>
        {{ formatChargesCost(spell.charges_cost_min, spell.charges_cost_max) }}
        <span
          v-if="spell.charges_cost_formula"
          class="text-gray-600 dark:text-gray-400"
        >
          ({{ spell.charges_cost_formula }})
        </span>
      </div>

      <!-- Optional: Usage Limit -->
      <div
        v-if="spell.usage_limit"
        class="text-sm text-gray-600 dark:text-gray-400 mt-1"
      >
        <span class="font-medium">Limit:</span> {{ spell.usage_limit }}
      </div>

      <!-- Optional: Level Requirement -->
      <div
        v-if="spell.level_requirement"
        class="text-sm text-gray-600 dark:text-gray-400 mt-1"
      >
        <span class="font-medium">Requires character level {{ spell.level_requirement }}</span>
      </div>
    </div>
  </div>
</template>
