<script setup lang="ts">
interface AbilityScore {
  id: number
  code: string
  name: string
}

interface Props {
  abilityScore: AbilityScore
}

const props = defineProps<Props>()
const { getImagePath } = useEntityImage()

// Use lowercased code as slug (e.g., STR -> str)
const slug = computed(() => props.abilityScore.code.toLowerCase())
const backgroundImageUrl = computed(() =>
  getImagePath('ability-scores', slug.value, 256)
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
          {{ abilityScore.code }}
        </UBadge>
      </div>

      <!-- Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ abilityScore.name }}
      </h3>

      <!-- Category Badge -->
      <div class="flex items-center gap-2">
        <UBadge
          color="neutral"
          variant="soft"
          size="xs"
        >
          Ability Score
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
