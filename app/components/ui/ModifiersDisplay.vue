<script setup lang="ts">
interface AbilityScore {
  id: number
  code: string
  name: string
}

interface Modifier {
  id: number
  modifier_category: string
  ability_score?: AbilityScore | null
  value: string | number
  condition?: string | null
}

interface Props {
  modifiers?: Modifier[]
}

defineProps<Props>()

/**
 * Format modifier value with + or - sign
 */
const formatValue = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseInt(value) : value
  return numValue > 0 ? `+${numValue}` : `${numValue}`
}
</script>

<template>
  <div v-if="modifiers && modifiers.length > 0" data-testid="modifiers-container" class="p-4 space-y-3">
    <div
      v-for="modifier in modifiers"
      :key="modifier.id"
      data-testid="modifier-item"
      class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
    >
      <div class="font-medium text-gray-900 dark:text-gray-100">
        <template v-if="modifier.ability_score">
          {{ modifier.ability_score.name }} ({{ modifier.ability_score.code }}): {{ formatValue(modifier.value) }}
        </template>
        <template v-else>
          {{ modifier.modifier_category }}: {{ formatValue(modifier.value) }}
        </template>
      </div>
      <div v-if="modifier.condition" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {{ modifier.condition }}
      </div>
    </div>
  </div>
</template>
