<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  entityType?: string
}

const props = defineProps<Props>()

const loadingText = computed(() => {
  if (!props.entityType) {
    return 'Loading...'
  }
  return `Loading ${props.entityType}...`
})
</script>

<template>
  <div class="flex justify-center items-center py-12">
    <div class="flex flex-col items-center gap-4">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary-500"
      />
      <p class="text-gray-600 dark:text-gray-400">
        {{ loadingText }}
      </p>
    </div>
  </div>
</template>
