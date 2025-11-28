<script setup lang="ts">
import type { components } from '~/types/api/generated'

type ClassFeatureResource = components['schemas']['ClassFeatureResource']

interface Props {
  features: ClassFeatureResource[]
  showLevel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLevel: true
})

// Use centralized feature filtering composable
const { filterDisplayFeatures } = useFeatureFiltering()

/**
 * Group features by level, filtering out choice options, multiclass, and starting features
 */
const featuresByLevel = computed(() => {
  const filtered = filterDisplayFeatures(props.features)
  const grouped = new Map<number, ClassFeatureResource[]>()

  filtered.forEach((feature) => {
    const level = feature.level
    if (!grouped.has(level)) {
      grouped.set(level, [])
    }
    grouped.get(level)!.push(feature)
  })

  // Convert to array and sort by level
  return Array.from(grouped.entries())
    .sort(([levelA], [levelB]) => levelA - levelB)
    .filter(([, features]) => features.length > 0) // Hide empty levels
})

/**
 * Create accordion items for UAccordion
 */
const accordionItems = computed(() => {
  return featuresByLevel.value.map(([level, features]) => {
    const featureCount = features.length
    const countText = featureCount === 1 ? '1 feature' : `${featureCount} features`

    return {
      label: `Level ${level} (${countText})`,
      slot: `level-${level}`,
      defaultOpen: true // Open by default for better UX and testing
    }
  })
})
</script>

<template>
  <UAccordion
    v-if="featuresByLevel.length > 0"
    :items="accordionItems"
    type="multiple"
    class="border-2 border-class-500 dark:border-class-700 rounded-lg"
  >
    <!-- Render slot content for each level -->
    <template
      v-for="[level, levelFeatures] in featuresByLevel"
      :key="`slot-${level}`"
      #[`level-${level}`]
    >
      <UiAccordionTraitsList
        :traits="levelFeatures"
        :show-level="showLevel"
      />
    </template>
  </UAccordion>
</template>
