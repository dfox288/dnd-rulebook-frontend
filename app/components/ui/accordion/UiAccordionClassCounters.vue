<script setup lang="ts">
import type { CounterFromAPI } from '~/types/api/entities'
import { getResetTimingColor } from '~/utils/badgeColors'

interface Props {
  counters: CounterFromAPI[]
}

interface DisplayCounter {
  name: string
  reset_timing: string
  progressions: Array<{
    level: number
    value: string | number
  }>
}

const props = defineProps<Props>()

/**
 * Process counters for display
 * API returns: { name, reset_timing, progression: [{level, value}] }
 */
const groupedCounters = computed<DisplayCounter[]>(() => {
  if (!props.counters) return []

  return props.counters.map(counter => ({
    name: counter.name,
    reset_timing: counter.reset_timing,
    progressions: counter.progression?.sort((a, b) => a.level - b.level) || []
  }))
})
</script>

<template>
  <div
    v-if="counters && counters.length > 0"
    class="p-4 space-y-4"
  >
    <div
      v-for="counter in groupedCounters"
      :key="counter.name"
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <!-- Counter header -->
      <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100">
            {{ counter.name }}
          </h4>
          <UBadge
            :color="getResetTimingColor(counter.reset_timing)"
            variant="soft"
            size="sm"
          >
            {{ counter.reset_timing }}
          </UBadge>
        </div>
      </div>

      <!-- Progression table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                Level
              </th>
              <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                Value
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="progression in counter.progressions"
              :key="`${counter.name}-${progression.level}`"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="px-4 py-2 text-gray-900 dark:text-gray-100">
                Level {{ progression.level }}
              </td>
              <td class="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                {{ progression.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
