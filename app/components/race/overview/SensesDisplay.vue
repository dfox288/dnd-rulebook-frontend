<script setup lang="ts">
interface Sense {
  type: string
  name: string
  range: number
  is_limited: boolean
  notes: string | null
}

interface Props {
  senses: Sense[]
}

defineProps<Props>()

/**
 * Formats a sense into display text
 * Example: "Darkvision 60 ft." or "Blindsight 30 ft. (limited)"
 */
function formatSense(sense: Sense): string {
  let text = `${sense.name} ${sense.range} ft.`
  if (sense.is_limited) {
    text += ' (limited)'
  }
  return text
}
</script>

<template>
  <div
    v-if="senses.length > 0"
    class="space-y-1"
  >
    <div
      v-for="(sense, index) in senses"
      :key="index"
      data-sense-item
      class="flex items-start gap-2"
    >
      <UIcon
        name="i-heroicons-eye"
        class="size-5 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"
      />
      <div class="flex-1">
        <span class="text-gray-900 dark:text-gray-100">
          {{ formatSense(sense) }}
        </span>
        <span
          v-if="sense.notes"
          class="text-gray-600 dark:text-gray-400 ml-1"
        >
          ({{ sense.notes }})
        </span>
      </div>
    </div>
  </div>
</template>
