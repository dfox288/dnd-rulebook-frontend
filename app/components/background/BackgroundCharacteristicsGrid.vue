<script setup lang="ts">
import type { components } from '~/types/api/generated'

type EntityDataTableResource = components['schemas']['EntityDataTableResource']
type EntityDataTableEntryResource = components['schemas']['EntityDataTableEntryResource']

interface Props {
  dataTables: EntityDataTableResource[]
  description?: string | null
}

const props = defineProps<Props>()

// Define the order we want to display the tables
const tableOrder = ['Personality Trait', 'Ideal', 'Bond', 'Flaw']

// Sort tables by the defined order
const orderedTables = computed(() => {
  return [...props.dataTables].sort((a, b) => {
    const aIndex = tableOrder.indexOf(a.table_name)
    const bIndex = tableOrder.indexOf(b.table_name)
    return aIndex - bIndex
  })
})

/**
 * Format the roll display for a table entry
 * Shows single number (e.g., "1") or range (e.g., "1-2") if roll_min !== roll_max
 */
function formatRoll(entry: EntityDataTableEntryResource): string {
  if (entry.roll_min === entry.roll_max) {
    return String(entry.roll_min)
  }
  return `${entry.roll_min}-${entry.roll_max}`
}
</script>

<template>
  <div v-if="dataTables.length > 0">
    <!-- Flavor text description -->
    <p
      v-if="description"
      class="text-gray-600 dark:text-gray-400 mb-6"
    >
      {{ description }}
    </p>

    <!-- 2x2 Grid of tables -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard
        v-for="table in orderedTables"
        :key="table.id"
      >
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ table.dice_type }} {{ table.table_name }}
          </h3>
        </template>

        <ol class="space-y-2">
          <li
            v-for="entry in table.entries"
            :key="entry.id"
            class="flex gap-3"
          >
            <span class="font-semibold text-gray-500 dark:text-gray-400 w-6 flex-shrink-0">
              {{ formatRoll(entry) }}.
            </span>
            <span>{{ entry.result_text }}</span>
          </li>
        </ol>
      </UCard>
    </div>
  </div>
</template>
