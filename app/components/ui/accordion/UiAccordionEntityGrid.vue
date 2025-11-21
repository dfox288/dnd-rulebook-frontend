<script setup lang="ts">
interface Entity {
  id: number
  slug: string
  name: string
  description?: string
  speed?: number
}

interface Props {
  entities: Entity[]
  basePath: string
}

defineProps<Props>()
</script>

<template>
  <div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <NuxtLink
        v-for="entity in entities"
        :key="entity.id"
        :to="`${basePath}/${entity.slug}`"
        class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="font-medium text-gray-900 dark:text-gray-100">{{ entity.name }}</div>
        <div v-if="entity.speed" class="text-sm text-gray-600 dark:text-gray-400">
          Speed: {{ entity.speed }} ft
        </div>
        <div v-else-if="entity.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
          {{ entity.description }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
