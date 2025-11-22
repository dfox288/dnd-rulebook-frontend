<script setup lang="ts">
import type { components } from '~/types/api/generated'

// Use API ProficiencyResource type - has id: number and proficiency_name: string | null
type ProficiencyResource = components['schemas']['ProficiencyResource']

interface Props {
  items: ProficiencyResource[]
}

defineProps<Props>()
</script>

<template>
  <div class="p-4 space-y-2">
    <div
      v-for="item in items"
      :key="item.id"
      class="text-gray-700 dark:text-gray-300"
    >
      • {{ item.proficiency_name || '' }}
    </div>
  </div>
</template>
