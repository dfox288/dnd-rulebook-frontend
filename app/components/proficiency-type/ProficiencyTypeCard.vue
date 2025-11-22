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

const props = defineProps<Props>()
const { getImagePath } = useEntityImage()

// Slugify name: Light Armor -> light-armor
const slug = computed(() =>
  props.proficiencyType.name.toLowerCase().replace(/\s+/g, '-')
)
const backgroundImageUrl = computed(() =>
  getImagePath('proficiency-types', slug.value, 256)
)
</script>

<template>
  <UCard class="relative overflow-hidden hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700 group">
    <!-- Background Image Layer -->
    <div
      v-if="backgroundImageUrl"
      class="absolute inset-0 bg-cover bg-center opacity-10 transition-opacity duration-300 group-hover:opacity-20"
      :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
    />

    <!-- Content Layer -->
    <div class="relative z-10 space-y-3">
      <!-- Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ proficiencyType.name }}
      </h3>

      <!-- Category and Subcategory Badges -->
      <div class="flex items-center gap-2 flex-wrap">
        <UBadge
          color="neutral"
          variant="solid"
          size="md"
        >
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
        <UBadge
          color="neutral"
          variant="soft"
          size="xs"
        >
          Proficiency Type
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
