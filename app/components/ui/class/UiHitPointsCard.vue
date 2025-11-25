<script setup lang="ts">
interface Props {
  hitDie: number
  className: string
}

const props = defineProps<Props>()

/**
 * Calculate average HP per level (rounded up as per D&D rules)
 * Formula: (hitDie / 2) + 1
 */
const averageHp = computed(() => {
  return Math.floor(props.hitDie / 2) + 1
})

/**
 * Format class name for display (lowercase for readability)
 */
const formattedClassName = computed(() => {
  return props.className.toLowerCase()
})
</script>

<template>
  <UCard>
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 rounded-lg bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
          <UIcon
            name="i-heroicons-heart"
            class="w-6 h-6 text-error-600 dark:text-error-400"
          />
        </div>
      </div>

      <div class="flex-1 space-y-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Hit Points
        </h3>

        <dl class="space-y-2 text-sm">
          <div class="flex flex-col sm:flex-row sm:gap-2">
            <dt class="font-medium text-gray-600 dark:text-gray-400 sm:w-32">
              Hit Dice
            </dt>
            <dd class="text-gray-900 dark:text-gray-100">
              1d{{ hitDie }} per {{ formattedClassName }} level
            </dd>
          </div>

          <div class="flex flex-col sm:flex-row sm:gap-2">
            <dt class="font-medium text-gray-600 dark:text-gray-400 sm:w-32">
              HP at 1st Level
            </dt>
            <dd class="text-gray-900 dark:text-gray-100">
              {{ hitDie }} + Constitution modifier
            </dd>
          </div>

          <div class="flex flex-col sm:flex-row sm:gap-2">
            <dt class="font-medium text-gray-600 dark:text-gray-400 sm:w-32">
              HP at Higher Levels
            </dt>
            <dd class="text-gray-900 dark:text-gray-100">
              1d{{ hitDie }} (or {{ averageHp }}) + Constitution modifier per {{ formattedClassName }} level after 1st
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </UCard>
</template>
