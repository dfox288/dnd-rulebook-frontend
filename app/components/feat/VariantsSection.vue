<script setup lang="ts">
import type { Feat } from '~/types/api/entities'

const props = defineProps<{
  variants: Feat[]
  currentSlug: string
}>()

// Filter out current feat for "other variants" label, but show all in grid
const otherVariantsCount = computed(() =>
  props.variants.filter(v => v.slug !== props.currentSlug).length
)
</script>

<template>
  <section v-if="variants.length > 1">
    <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      Related Variants
      <span class="text-base font-normal text-gray-500 dark:text-gray-400">
        ({{ otherVariantsCount }} other{{ otherVariantsCount === 1 ? '' : 's' }})
      </span>
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      <NuxtLink
        v-for="variant in variants"
        :key="variant.slug"
        :to="`/feats/${variant.slug}`"
        class="block"
      >
        <UCard
          :class="[
            'h-full transition-all',
            variant.slug === currentSlug
              ? 'ring-2 ring-primary bg-primary/5'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
        >
          <div class="text-center py-2">
            <div class="font-medium text-sm">
              {{ variant.name }}
            </div>
            <div class="mt-1">
              <UBadge
                v-if="variant.is_half_feat"
                label="Half-Feat"
                color="warning"
                variant="subtle"
                size="sm"
              />
            </div>
            <div
              v-if="variant.slug === currentSlug"
              class="text-xs text-primary mt-1"
            >
              (current)
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </section>
</template>
