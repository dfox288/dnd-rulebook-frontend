<script setup lang="ts">
interface SpellSchool {
  id: number
  code: string
  name: string
  description?: string | null
}

interface Props {
  spellSchool: SpellSchool
}

const props = defineProps<Props>()
const { getImagePath } = useEntityImage()

// Use code field for image filename (e.g., "A", "C", "EV")
// Image files are named by code, not slug or name
const backgroundImageUrl = computed(() =>
  getImagePath('spell-schools', props.spellSchool.code, 256)
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
  </UCard>
</template>
