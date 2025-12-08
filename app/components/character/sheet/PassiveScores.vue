<!-- app/components/character/sheet/PassiveScores.vue -->
<script setup lang="ts">
/**
 * Passive Scores Display
 *
 * Shows Passive Perception, Investigation, and Insight.
 * Designed for the sidebar (~200px width).
 */

defineProps<{
  perception: number | null
  investigation: number | null
  insight: number | null
}>()
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
      Passive
    </h3>
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">Perception</span>
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          {{ perception ?? '—' }}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">Investigation</span>
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          {{ investigation ?? '—' }}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">Insight</span>
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          {{ insight ?? '—' }}
        </span>
      </div>
    </div>
  </div>
</template>
