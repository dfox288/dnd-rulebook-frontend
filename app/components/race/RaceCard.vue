<script setup lang="ts">
interface Race {
  id: number
  name: string
  slug: string
  size?: {
    id: number
    name: string
  }
  speed: number
  parent_race_id?: number
  modifiers?: any[]
  traits?: any[]
  description?: string
}

interface Props {
  race: Race
}

const props = defineProps<Props>()

/**
 * Check if this is a subrace
 */
const isSubrace = computed(() => {
  return props.race.parent_race_id !== null && props.race.parent_race_id !== undefined
})

/**
 * Get ability score modifiers summary
 */
const abilityModifiers = computed(() => {
  if (!props.race.modifiers || props.race.modifiers.length === 0) return null
  const mods = props.race.modifiers
    .filter((m: any) => m.modifier_type === 'ability_score' && m.ability_score)
    .slice(0, 3)
    .map((m: any) => `${m.ability_score.code} +${m.value}`)
  return mods.length > 0 ? mods.join(', ') : null
})

/**
 * Truncate description to specified length
 */
const truncatedDescription = computed(() => {
  if (!props.race.description) return 'A playable race for D&D 5e characters'
  const maxLength = 150
  if (props.race.description.length <= maxLength) return props.race.description
  return props.race.description.substring(0, maxLength).trim() + '...'
})
</script>

<template>
  <NuxtLink :to="`/races/${race.slug}`" class="block h-full">
    <UCard class="hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700">
      <div class="space-y-3">
        <!-- Size and Type Badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge v-if="race.size" color="blue" variant="subtle" size="sm">
            {{ race.size.name }}
          </UBadge>
          <UBadge v-if="isSubrace" color="purple" variant="soft" size="sm">
            Subrace
          </UBadge>
        </div>

        <!-- Race Name -->
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {{ race.name }}
        </h3>

        <!-- Quick Stats -->
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-bolt" class="w-4 h-4" />
            <span>{{ race.speed }} ft</span>
          </div>
          <div v-if="abilityModifiers" class="flex items-center gap-1">
            <UIcon name="i-heroicons-arrow-trending-up" class="w-4 h-4" />
            <span>{{ abilityModifiers }}</span>
          </div>
        </div>

        <!-- Traits Count -->
        <div v-if="race.traits && race.traits.length > 0" class="flex items-center gap-2">
          <UBadge color="green" variant="soft" size="xs">
            👥 {{ race.traits.length }} {{ race.traits.length === 1 ? 'Trait' : 'Traits' }}
          </UBadge>
        </div>

        <!-- Description Preview -->
        <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {{ truncatedDescription }}
        </p>
      </div>
    </UCard>
  </NuxtLink>
</template>
