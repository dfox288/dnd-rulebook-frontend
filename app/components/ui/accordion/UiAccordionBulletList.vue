<script setup lang="ts">
import type { components } from '~/types/api/generated'

// Use API ProficiencyResource type - has id: number and proficiency_name: string | null
type ProficiencyResource = components['schemas']['ProficiencyResource']

interface Props {
  items: ProficiencyResource[]
}

defineProps<Props>()

/**
 * Get display name for a proficiency item
 * Tries multiple fallback strategies to handle various nested structures
 */
function getDisplayName(item: ProficiencyResource): string {
  // Prefer proficiency_name if available
  if (item.proficiency_name) return item.proficiency_name

  // Fallback to nested detail structures
  if (item.proficiency_type_detail?.name) return item.proficiency_type_detail.name
  if (item.skill?.name) return item.skill.name
  if (item.item?.name) return item.item.name
  if (item.ability_score?.name) return item.ability_score?.name

  // Last resort fallback
  return 'Unknown'
}
</script>

<template>
  <div class="p-4 space-y-2">
    <div
      v-for="item in items"
      :key="item.id"
      class="text-gray-700 dark:text-gray-300"
    >
      • {{ getDisplayName(item) }}
    </div>
  </div>
</template>
