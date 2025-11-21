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
  <UCard class="hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700">
    <div class="space-y-3">
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
  </UCard>
</template>
