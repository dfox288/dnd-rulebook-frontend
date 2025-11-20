<script setup lang="ts">
interface CharacterClass {
  id: number
  name: string
  slug: string
  hit_die: number
  primary_ability?: {
    id: number
    code: string
    name: string
  }
  saving_throws?: any[]
  proficiencies?: any[]
  subclass_name?: string
  description?: string
}

interface Props {
  characterClass: CharacterClass
}

const props = defineProps<Props>()

/**
 * Format hit die for display
 */
const hitDieText = computed(() => {
  return `d${props.characterClass.hit_die}`
})

/**
 * Get saving throw proficiencies
 */
const savingThrows = computed(() => {
  if (!props.characterClass.saving_throws || props.characterClass.saving_throws.length === 0) {
    return null
  }
  return props.characterClass.saving_throws
    .map((st: any) => st.ability_score?.code || st.name)
    .join(', ')
})

/**
 * Truncate description to specified length
 */
const truncatedDescription = computed(() => {
  if (!props.characterClass.description) return 'A playable class for D&D 5e characters'
  const maxLength = 150
  if (props.characterClass.description.length <= maxLength) return props.characterClass.description
  return props.characterClass.description.substring(0, maxLength).trim() + '...'
})
</script>

<template>
  <NuxtLink :to="`/classes/${characterClass.slug}`" class="block h-full">
    <UCard class="hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700">
      <div class="space-y-3">
        <!-- Hit Die and Primary Ability Badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge color="red" variant="subtle" size="sm">
            ❤️ {{ hitDieText }}
          </UBadge>
          <UBadge v-if="characterClass.primary_ability" color="blue" variant="soft" size="sm">
            {{ characterClass.primary_ability.code }}
          </UBadge>
        </div>

        <!-- Class Name -->
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {{ characterClass.name }}
        </h3>

        <!-- Quick Stats -->
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
          <div v-if="savingThrows" class="flex items-center gap-1">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
            <span>{{ savingThrows }}</span>
          </div>
          <div v-if="characterClass.subclass_name" class="flex items-center gap-1">
            <UIcon name="i-heroicons-users" class="w-4 h-4" />
            <span>{{ characterClass.subclass_name }}</span>
          </div>
        </div>

        <!-- Proficiencies Count -->
        <div v-if="characterClass.proficiencies && characterClass.proficiencies.length > 0" class="flex items-center gap-2">
          <UBadge color="green" variant="soft" size="xs">
            ⚔️ {{ characterClass.proficiencies.length }} Proficiencies
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
