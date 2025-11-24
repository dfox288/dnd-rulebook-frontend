<script setup lang="ts">
/**
 * Bottom navigation for detail pages
 * Provides "Back to [Entity]" button for easier navigation on long pages
 */
interface Props {
  to: string
  label: string
}

defineProps<Props>()
</script>

<template>
  <div class="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
    <UButton
      :to="to"
      variant="soft"
      color="neutral"
      size="lg"
    >
      ← {{ label }}
    </UButton>
  </div>
</template>
