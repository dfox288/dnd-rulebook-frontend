<script setup lang="ts">
import type { components } from '~/types/api/generated'

type EntityDataTableResource = components['schemas']['EntityDataTableResource']

interface Props {
  dataTables: EntityDataTableResource[]
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
</script>

<template>
  <div
    v-if="dataTables.length > 0"
    class="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
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
        >
          {{ entry.result_text }}
        </li>
      </ol>
    </UCard>
  </div>
</template>
