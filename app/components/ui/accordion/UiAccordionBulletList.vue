<script setup lang="ts">
interface Item {
  id: number
  proficiency_name?: string
  name?: string
}

interface Props {
  items: Item[]
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
      • {{ item.proficiency_name || item.name }}
    </div>
  </div>
</template>
