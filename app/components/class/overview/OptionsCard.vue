<script setup lang="ts">
import type { OptionalFeatureResource } from '~/types/api/entities'

const props = defineProps<{
  optionalFeaturesByType: Map<string, OptionalFeatureResource[]>
  slug: string
}>()

const hasOptionalFeatures = computed(() => props.optionalFeaturesByType.size > 0)
</script>

<template>
  <div
    v-if="hasOptionalFeatures"
    class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Class Options
      </h3>
      <NuxtLink
        :to="`/classes/${slug}/journey`"
        class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
      >
        View All
        <UIcon
          name="i-heroicons-arrow-right"
          class="w-4 h-4"
        />
      </NuxtLink>
    </div>

    <div class="space-y-3">
      <div
        v-for="[featureType, features] in optionalFeaturesByType"
        :key="featureType"
        class="flex items-center justify-between"
      >
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ featureType }}
        </span>
        <UBadge
          variant="subtle"
          class="badge"
        >
          {{ features.length }}
        </UBadge>
      </div>
    </div>
  </div>
</template>
