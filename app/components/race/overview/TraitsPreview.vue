<script setup lang="ts">
import type { components } from '~/types/api/generated'

type TraitResource = components['schemas']['TraitResource']

interface Props {
  traits: TraitResource[]
  slug: string
  maxDisplay?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 3
})

/**
 * Sort traits by sort_order and limit to maxDisplay
 */
const displayTraits = computed(() => {
  return [...props.traits]
    .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
    .slice(0, props.maxDisplay)
})

/**
 * Total count of traits for "View all" link
 */
const totalTraitCount = computed(() => props.traits.length)

/**
 * Truncate description for preview
 */
function truncateDescription(text: string | null | undefined, maxLength = 100): string {
  if (!text) return ''

  if (text.length <= maxLength) return text

  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...'
  }

  return truncated + '...'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
      Key Racial Traits
    </h3>

    <!-- Traits List -->
    <div
      v-if="displayTraits.length > 0"
      class="space-y-3"
    >
      <div
        v-for="trait in displayTraits"
        :key="trait.id"
        class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {{ trait.name }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ truncateDescription(trait.description) }}
        </p>
      </div>
    </div>

    <!-- View All Link -->
    <div
      v-if="totalTraitCount > 0"
      class="pt-3 border-t border-gray-200 dark:border-gray-700"
    >
      <NuxtLink
        :to="`/races/${slug}/reference`"
        class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-center gap-1 group"
      >
        <span>View all {{ totalTraitCount }} traits in Reference</span>
        <UIcon
          name="i-heroicons-arrow-right"
          class="w-4 h-4 transition-transform group-hover:translate-x-1"
        />
      </NuxtLink>
    </div>
  </div>
</template>
