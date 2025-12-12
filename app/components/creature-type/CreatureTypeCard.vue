<script setup lang="ts">
interface CreatureType {
  id: number
  name: string
  slug: string
  description: string
  typically_immune_to_poison: boolean
  typically_immune_to_charmed: boolean
  typically_immune_to_frightened: boolean
  typically_immune_to_exhaustion: boolean
  requires_sustenance: boolean
  requires_sleep: boolean
}

interface Props {
  creatureType: CreatureType
}

const props = defineProps<Props>()
const { getImagePath } = useEntityImage()
const backgroundImageUrl = computed(() =>
  getImagePath('creature-types', props.creatureType.slug, 256)
)

const immunities = computed(() => {
  const list: string[] = []
  if (props.creatureType.typically_immune_to_poison) list.push('Poison')
  if (props.creatureType.typically_immune_to_charmed) list.push('Charmed')
  if (props.creatureType.typically_immune_to_frightened) list.push('Frightened')
  if (props.creatureType.typically_immune_to_exhaustion) list.push('Exhaustion')
  return list
})

const traits = computed(() => {
  const list: string[] = []
  if (!props.creatureType.requires_sustenance) list.push('No Food/Water')
  if (!props.creatureType.requires_sleep) list.push('No Sleep')
  return list
})
</script>

<template>
  <UCard class="relative overflow-hidden hover:shadow-lg transition-shadow h-full border-2 border-creature-300 dark:border-creature-700 hover:border-creature-500 group">
    <!-- Background Image Layer -->
    <div
      v-if="backgroundImageUrl"
      class="absolute inset-0 bg-cover bg-center opacity-15 transition-all duration-300 group-hover:opacity-30 group-hover:scale-110 group-hover:rotate-3"
      :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
    />

    <!-- Content Layer -->
    <div class="relative z-10 space-y-3">
      <!-- Creature Type Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ creatureType.name }}
      </h3>

      <!-- Description (truncated to 3 lines) -->
      <p
        v-if="creatureType.description"
        class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3"
      >
        {{ creatureType.description }}
      </p>

      <!-- Typical Immunities -->
      <div
        v-if="immunities.length > 0"
        class="flex flex-wrap items-center gap-1"
      >
        <span class="text-xs text-gray-500 dark:text-gray-400 mr-1">Typically immune:</span>
        <UBadge
          v-for="immunity in immunities"
          :key="immunity"
          color="error"
          variant="soft"
          size="md"
        >
          {{ immunity }}
        </UBadge>
      </div>

      <!-- Special Traits (doesn't need food/water/sleep) -->
      <div
        v-if="traits.length > 0"
        class="flex flex-wrap items-center gap-1"
      >
        <UBadge
          v-for="trait in traits"
          :key="trait"
          color="info"
          variant="soft"
          size="md"
        >
          {{ trait }}
        </UBadge>
      </div>

      <!-- Category Badge -->
      <div class="flex items-center gap-2">
        <UBadge
          color="creature"
          variant="soft"
          size="md"
        >
          Creature Type
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
