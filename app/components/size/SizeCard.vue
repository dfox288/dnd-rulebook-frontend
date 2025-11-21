<script setup lang="ts">
interface Size {
  id: number
  code: string
  name: string
}

interface Props {
  size: Size
}

defineProps<Props>()
</script>

<template>
  <UCard class="hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700">
    <div class="space-y-3">
      <!-- Size Code Badge -->
      <div class="flex items-center gap-2">
        <UBadge color="neutral" variant="solid" size="lg">
          {{ size.code }}
        </UBadge>
      </div>

      <!-- Size Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ size.name }}
      </h3>

      <!-- Category Badge -->
      <div class="flex items-center gap-2">
        <UBadge color="neutral" variant="soft" size="xs">
          Creature Size
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
