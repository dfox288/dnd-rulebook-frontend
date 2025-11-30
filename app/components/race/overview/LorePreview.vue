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
 * Total count of lore traits
 */
const totalLoreCount = computed(() => props.traits.length)

/**
 * Check if there are more traits than displayed
 */
const hasMore = computed(() => props.traits.length > props.maxDisplay)

/**
 * Truncate description to ~150 chars at sentence boundary
 */
function truncateDescription(desc: string | null | undefined): string {
  if (!desc) return ''
  const maxLength = 150
  if (desc.length <= maxLength) return desc
  const truncated = desc.substring(0, maxLength)
  const lastPeriod = truncated.lastIndexOf('.')
  if (lastPeriod > maxLength * 0.5) {
    return truncated.substring(0, lastPeriod + 1)
  }
  return truncated + '...'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
        Lore
      </h2>
      <NuxtLink
        v-if="hasMore"
        :to="`/races/${slug}/reference`"
        class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 group"
      >
        <span>View all {{ totalLoreCount }} lore entries</span>
        <UIcon
          name="i-heroicons-arrow-right"
          class="w-4 h-4 transition-transform group-hover:translate-x-1"
        />
      </NuxtLink>
    </div>

    <!-- Lore Cards -->
    <div class="grid gap-4">
      <UCard
        v-for="trait in displayTraits"
        :key="trait.id"
        class="bg-gray-50/50 dark:bg-gray-800/50"
      >
        <div class="space-y-2">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">
            {{ trait.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ truncateDescription(trait.description) }}
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
