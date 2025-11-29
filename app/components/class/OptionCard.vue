<script setup lang="ts">
import type { OptionalFeatureResource } from '~/types/api/entities'

interface Props {
  option: OptionalFeatureResource
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

/**
 * Check if option has a prerequisite
 */
const hasPrerequisite = computed(() => {
  return props.option.prerequisite_text !== null && props.option.prerequisite_text !== undefined
})

/**
 * Check if option has a level requirement
 */
const hasLevelRequirement = computed(() => {
  return props.option.level_requirement !== null && props.option.level_requirement !== undefined
})
</script>

<template>
  <UCard
    v-if="!compact"
    class="h-full border-2 border-class-300 dark:border-class-700"
  >
    <div class="space-y-3">
      <!-- Header with name and level badge -->
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1">
          {{ option.name }}
        </h3>
        <UBadge
          v-if="hasLevelRequirement"
          color="class"
          variant="soft"
          size="sm"
        >
          Level {{ option.level_requirement }}
        </UBadge>
      </div>

      <!-- Prerequisite -->
      <div
        v-if="hasPrerequisite"
        class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
      >
        <UIcon
          name="i-heroicons-exclamation-circle"
          class="w-4 h-4 mt-0.5 flex-shrink-0"
        />
        <span>{{ option.prerequisite_text }}</span>
      </div>

      <!-- Description -->
      <p
        v-if="option.description"
        class="text-sm text-gray-700 dark:text-gray-300"
      >
        {{ option.description }}
      </p>
    </div>
  </UCard>

  <details
    v-else
    class="group border-2 border-class-300 dark:border-class-700 rounded-lg"
  >
    <summary class="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div class="flex items-center justify-between gap-3">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-chevron-right"
              class="w-4 h-4 transition-transform group-open:rotate-90"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ option.name }}
            </h3>
          </div>
          <div
            v-if="hasPrerequisite"
            class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1 ml-7"
          >
            <UIcon
              name="i-heroicons-exclamation-circle"
              class="w-4 h-4 mt-0.5 flex-shrink-0"
            />
            <span>{{ option.prerequisite_text }}</span>
          </div>
        </div>
        <UBadge
          v-if="hasLevelRequirement"
          color="class"
          variant="soft"
          size="sm"
        >
          Level {{ option.level_requirement }}
        </UBadge>
      </div>
    </summary>

    <div class="px-4 pb-4 pt-2">
      <p
        v-if="option.description"
        class="text-sm text-gray-700 dark:text-gray-300 ml-7"
      >
        {{ option.description }}
      </p>
    </div>
  </details>
</template>
