<script setup lang="ts">
interface SpellSchool {
  id: number
  slug: string
  code: string
  name: string
  description?: string | null
}

interface Props {
  spellSchool: SpellSchool
}

const props = defineProps<Props>()
const { getImagePath } = useEntityImage()
const backgroundImageUrl = computed(() =>
  getImagePath('spell-schools', props.spellSchool.slug, 256)
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
      <!-- Code Badge -->
      <div class="flex items-center gap-2">
        <UBadge
          color="neutral"
          variant="solid"
          size="lg"
        >
          {{ spellSchool.code }}
        </UBadge>
      </div>

      <!-- Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ spellSchool.name }}
      </h3>

      <!-- Description (optional, truncated) -->
      <p
        v-if="spellSchool.description"
        class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
      >
        {{ spellSchool.description }}
      </p>

      <!-- Category Badge -->
      <div class="flex items-center gap-2">
        <UBadge
          color="neutral"
          variant="soft"
          size="xs"
        >
          Spell School
        </UBadge>
      </div>
    </div>
  </div>
</template>
