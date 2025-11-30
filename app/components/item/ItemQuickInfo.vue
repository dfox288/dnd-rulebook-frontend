<script setup lang="ts">
import type { EntitySource } from '~/types'

interface Props {
  cost: string | null
  weight: string | null
  sources: EntitySource[]
}

const props = defineProps<Props>()

// Determine which sections to display
const hasCost = computed(() => props.cost !== null)
const hasWeight = computed(() => props.weight !== null)
const hasSources = computed(() => props.sources && props.sources.length > 0)

// Build sections array for display
const sections = computed(() => {
  const result: Array<{ icon: string, text: string }> = []

  if (hasCost.value) {
    result.push({ icon: '💰', text: props.cost! })
  }

  if (hasWeight.value) {
    result.push({ icon: '⚖️', text: props.weight! })
  }

  if (hasSources.value) {
    // Format sources as "CODE p.PAGE" or just "CODE" if no pages
    const sourceText = props.sources
      .map((source) => {
        if (source.pages) {
          return `${source.code} p.${source.pages}`
        }
        return source.code
      })
      .join(', ')

    result.push({ icon: '📖', text: sourceText })
  }

  return result
})
</script>

<template>
  <div
    v-if="sections.length > 0"
    class="flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
    data-testid="item-quick-info"
  >
    <template
      v-for="(section, index) in sections"
      :key="index"
    >
      <!-- Bullet separator between sections -->
      <span
        v-if="index > 0"
        class="text-gray-400 dark:text-gray-600"
        aria-hidden="true"
      >
        •
      </span>

      <!-- Section content -->
      <span class="flex items-center gap-1.5">
        <span
          class="text-base"
          aria-hidden="true"
        >
          {{ section.icon }}
        </span>
        <span>{{ section.text }}</span>
      </span>
    </template>
  </div>
</template>
