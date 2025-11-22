<script setup lang="ts">
interface Language {
  id: number
  name: string
  slug: string
  script: string
  typical_speakers: string
  description?: string
}

interface Props {
  language: Language
}

const props = defineProps<Props>()
const { getImagePath } = useEntityImage()
const backgroundImageUrl = computed(() =>
  getImagePath('languages', props.language.slug, 256)
)

/**
 * Truncate description to specified length
 */
const truncatedDescription = computed(() => {
  if (!props.language.description) return 'A language spoken in the D&D multiverse'
  const maxLength = 120
  if (props.language.description.length <= maxLength) return props.language.description
  return props.language.description.substring(0, maxLength).trim() + '...'
})
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
      <!-- Language Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ language.name }}
      </h3>

      <!-- Script & Speakers -->
      <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
        <div class="flex items-center gap-1">
          <UIcon
            name="i-heroicons-pencil-square"
            class="w-4 h-4"
          />
          <span>{{ language.script }} Script</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon
            name="i-heroicons-user-group"
            class="w-4 h-4"
          />
          <span>{{ language.typical_speakers }}</span>
        </div>
      </div>

      <!-- Description Preview -->
      <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
        {{ truncatedDescription }}
      </p>
    </div>
  </div>
</template>
