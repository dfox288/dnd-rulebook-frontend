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
  <div
    :style="backgroundImageUrl ? {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : {}"
    class="group relative overflow-hidden rounded-lg border border-default
           transition-all duration-200 hover:border-primary hover:scale-[1.02]
           hover:shadow-lg dark:hover:shadow-primary/20
           after:absolute after:inset-0 after:bg-background/90 hover:after:bg-background/80
           after:transition-colors after:duration-200"
  >
    <div class="relative z-10 p-4 space-y-3">
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
  </div>
</template>
