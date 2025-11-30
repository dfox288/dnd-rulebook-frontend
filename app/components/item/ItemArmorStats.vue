<script setup lang="ts">
/**
 * ItemArmorStats - Armor Defense Statistics Component
 *
 * Displays armor defensive statistics in a grid layout:
 * - AC (Armor Class)
 * - STR Req (Strength requirement)
 * - Stealth (Disadvantage or Normal)
 * - Dex Mod (Dexterity modifier limit)
 * - Speed penalty warning (if STR requirement exists)
 *
 * For shields, shows simplified layout with AC bonus only.
 */

interface Modifier {
  modifier_category: string
  value: string
  condition?: string | null
}

interface Props {
  armorClass: number | null
  strengthRequirement: number | null
  stealthDisadvantage: boolean
  modifiers: Modifier[]
  isShield: boolean
}

const props = defineProps<Props>()

/**
 * Parse dexterity modifier limit from modifiers array
 *
 * Looks for ac_base modifier and checks condition field:
 * - "dex_modifier: none" → "None"
 * - "dex_modifier: max_2" → "+2 max"
 * - No condition or other → "Full"
 */
const dexModifier = computed(() => {
  const acBaseModifier = props.modifiers.find(m => m.modifier_category === 'ac_base')

  if (!acBaseModifier || !acBaseModifier.condition) {
    return 'Full'
  }

  const condition = acBaseModifier.condition.toLowerCase()

  if (condition.includes('dex_modifier: none')) {
    return 'None'
  }

  if (condition.includes('dex_modifier: max_2')) {
    return '+2 max'
  }

  return 'Full'
})

/**
 * Format strength requirement for display
 */
const strReqText = computed(() => {
  return props.strengthRequirement !== null ? String(props.strengthRequirement) : 'None'
})

/**
 * Format stealth status for display
 */
const stealthText = computed(() => {
  return props.stealthDisadvantage ? 'Disadvantage' : 'Normal'
})

/**
 * Format AC for display
 * For shields, show as bonus (+2)
 * For armor, show as value (18)
 */
const acText = computed(() => {
  if (props.armorClass === null) return '—'
  return props.isShield ? `+${props.armorClass}` : String(props.armorClass)
})
</script>

<template>
  <div class="space-y-3">
    <!-- Stats Grid -->
    <div
      v-if="isShield"
      class="grid grid-cols-1 gap-3"
    >
      <!-- Shield: AC Bonus only -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          🛡️ AC Bonus
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ acText }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      <!-- Armor Class -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          🛡️ AC
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ acText }}
        </div>
      </div>

      <!-- Strength Requirement -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          💪 STR Req
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ strReqText }}
        </div>
      </div>

      <!-- Stealth -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          🤫 Stealth
        </div>
        <div
          class="text-lg font-bold"
          :class="stealthDisadvantage ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
        >
          {{ stealthText }}
        </div>
      </div>

      <!-- Dex Modifier -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          🎯 Dex Mod
        </div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ dexModifier }}
        </div>
      </div>
    </div>

    <!-- Speed Penalty Warning -->
    <div
      v-if="!isShield && strengthRequirement !== null"
      class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
    >
      <div class="flex items-start gap-2">
        <div class="text-amber-600 dark:text-amber-400 text-lg">
          ⚠️
        </div>
        <div class="text-sm text-amber-800 dark:text-amber-200">
          Speed reduced by 10 ft. if Strength &lt; {{ strengthRequirement }}
        </div>
      </div>
    </div>
  </div>
</template>
