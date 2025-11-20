<script setup lang="ts">
interface Spell {
  id: number
  name: string
  slug: string
  level: number
  school?: {
    id: number
    name: string
  }
  casting_time: string
  range: string
  description: string
  is_ritual: boolean
  needs_concentration: boolean
}

interface Props {
  spell: Spell
}

const props = defineProps<Props>()

/**
 * Format spell level for display
 */
const levelText = computed(() => {
  if (props.spell.level === 0) return 'Cantrip'
  const suffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
  return `${props.spell.level}${suffix[props.spell.level]} Level`
})

/**
 * Truncate description to specified length
 */
const truncatedDescription = computed(() => {
  const maxLength = 150
  if (props.spell.description.length <= maxLength) return props.spell.description
  return props.spell.description.substring(0, maxLength).trim() + '...'
})
</script>

<template>
  <NuxtLink :to="`/spells/${spell.slug}`" class="block h-full">
    <UCard class="hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700">
      <div class="space-y-3">
        <!-- Level and School Badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge color="purple" variant="subtle" size="sm">
            {{ levelText }}
          </UBadge>
          <UBadge v-if="spell.school" color="blue" variant="soft" size="sm">
            {{ spell.school.name }}
          </UBadge>
        </div>

        <!-- Spell Name -->
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {{ spell.name }}
        </h3>

        <!-- Quick Stats -->
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-clock" class="w-4 h-4" />
            <span>{{ spell.casting_time }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-arrow-trending-up" class="w-4 h-4" />
            <span>{{ spell.range }}</span>
          </div>
        </div>

        <!-- Conditional Badges -->
        <div v-if="spell.is_ritual || spell.needs_concentration" class="flex items-center gap-2">
          <UBadge v-if="spell.is_ritual" color="blue" variant="soft" size="xs">
            🔮 Ritual
          </UBadge>
          <UBadge v-if="spell.needs_concentration" color="orange" variant="soft" size="xs">
            ⭐ Concentration
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
