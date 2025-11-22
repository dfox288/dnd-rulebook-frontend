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
  </div>
</template>
