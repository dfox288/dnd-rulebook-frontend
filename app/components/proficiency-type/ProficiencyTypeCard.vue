<script setup lang="ts">
interface ProficiencyType {
  id: number
  name: string
  category: string
  subcategory?: string | null
}

interface Props {
  proficiencyType: ProficiencyType
}

defineProps<Props>()
</script>

<template>
  <UCard class="hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700">
    <div class="space-y-3">
      <!-- Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ proficiencyType.name }}
      </h3>

      <!-- Category and Subcategory Badges -->
      <div class="flex items-center gap-2 flex-wrap">
        <UBadge color="neutral" variant="solid" size="md">
          {{ proficiencyType.category }}
        </UBadge>
        <UBadge
          v-if="proficiencyType.subcategory"
          color="neutral"
          variant="soft"
          size="md"
        >
          {{ proficiencyType.subcategory }}
        </UBadge>
      </div>

      <!-- Type Badge -->
      <div class="flex items-center gap-2">
        <UBadge color="neutral" variant="soft" size="xs">
          Proficiency Type
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
