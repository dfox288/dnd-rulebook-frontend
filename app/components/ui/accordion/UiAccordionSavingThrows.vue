<script setup lang="ts">
import type { components } from '~/types/api/generated'

// SavingThrowResource has ability_score.id as string, dc as string
type SavingThrowResource = components['schemas']['SavingThrowResource']

interface Props {
  savingThrows: SavingThrowResource[]
}

defineProps<Props>()

/**
 * Format save effect into human-readable text
 */
const formatSaveEffect = (effect: string | null): string | null => {
  if (!effect) return null

  const effectMap: Record<string, string> = {
    negates: 'Negates effect',
    ends_effect: 'Ends effect'
  }

  return effectMap[effect] || effect
}
</script>

<template>
  <div class="p-4 space-y-3">
    <div
      v-for="(save, index) in savingThrows"
      :key="index"
      class="border-l-4 border-warning-500 pl-4 py-2"
    >
      <div class="flex items-center gap-2 mb-2">
        <!-- Ability Score Code Badge -->
        <UBadge
          color="warning"
          variant="solid"
          size="sm"
        >
          {{ save.ability_score.code }}
        </UBadge>

        <!-- Ability Score Name -->
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ save.ability_score.name }}
        </span>

        <!-- DC (Difficulty Class) Badge -->
        <UBadge
          v-if="save.dc"
          color="error"
          variant="solid"
          size="sm"
        >
          DC {{ save.dc }}
        </UBadge>

        <!-- Initial vs Recurring Save Badge -->
        <UBadge
          :color="save.is_initial_save ? 'primary' : 'info'"
          variant="soft"
          size="sm"
        >
          {{ save.is_initial_save ? 'Initial Save' : 'Recurring Save' }}
        </UBadge>

        <!-- Save Modifier Badge (advantage/disadvantage/standard roll) -->
        <UBadge
          v-if="save.save_modifier && save.save_modifier !== 'none'"
          :color="save.save_modifier === 'advantage' ? 'success' : 'error'"
          variant="soft"
          size="sm"
        >
          {{ save.save_modifier === 'advantage' ? 'Advantage' : 'Disadvantage' }}
        </UBadge>
        <UBadge
          v-else-if="save.save_modifier === 'none'"
          color="neutral"
          variant="soft"
          size="sm"
        >
          Standard Roll
        </UBadge>
      </div>

      <!-- Save Effect (if present) -->
      <div
        v-if="save.save_effect"
        class="text-sm text-gray-700 dark:text-gray-300"
      >
        <span class="font-medium">Effect:</span> {{ formatSaveEffect(save.save_effect) }}
      </div>
    </div>
  </div>
</template>
