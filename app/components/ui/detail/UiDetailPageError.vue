<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  entityType: string
  backLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  backLink: '/search'
})

const headingText = computed(() => `${props.entityType} Not Found`)

const messageText = computed(() => {
  const lowercaseEntity = props.entityType.toLowerCase()
  return `The ${lowercaseEntity} you're looking for doesn't exist or has been removed.`
})
</script>

<template>
  <div class="py-12">
    <UCard>
      <div class="text-center">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-12 h-12 mx-auto mb-4 text-red-500"
        />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {{ headingText }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ messageText }}
        </p>
        <NuxtLink :to="backLink">
          <UButton color="primary">
            Back to Search
          </UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
