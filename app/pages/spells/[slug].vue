<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch spell data using useAsyncData for SSR support
const { data: spell, error, pending } = await useAsyncData(
  `spell-${slug}`,
  async () => {
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiBase}/spells/${slug}`)
    return response.data
  }
)

// Set page meta
useSeoMeta({
  title: computed(() => spell.value ? `${spell.value.name} - D&D 5e Spell` : 'Spell - D&D 5e Compendium'),
  description: computed(() => spell.value?.description?.substring(0, 160)),
})

/**
 * Format spell level for display
 */
const spellLevelText = computed(() => {
  if (!spell.value) return ''
  if (spell.value.level === 0) return 'Cantrip'
  const suffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
  return `${spell.value.level}${suffix[spell.value.level]}-level`
})

/**
 * Format components for display
 */
const componentsText = computed(() => {
  if (!spell.value) return ''
  const parts = []
  if (spell.value.components.includes('V')) parts.push('Verbal')
  if (spell.value.components.includes('S')) parts.push('Somatic')
  if (spell.value.components.includes('M')) parts.push(`Material (${spell.value.material_components})`)
  return parts.join(', ')
})

/**
 * Get damage effects grouped by spell slot level
 */
const damageEffects = computed(() => {
  if (!spell.value?.effects) return []
  return spell.value.effects
    .filter((e: any) => e.effect_type === 'damage')
    .sort((a: any, b: any) => a.min_spell_slot - b.min_spell_slot)
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
        <p class="text-gray-600 dark:text-gray-400">Loading spell...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12">
      <UCard>
        <div class="text-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Spell Not Found
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            The spell you're looking for doesn't exist or has been removed.
          </p>
          <UButton to="/search" color="primary">
            Back to Search
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Spell Content -->
    <div v-else-if="spell" class="space-y-6">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <UBadge color="purple" variant="subtle">
            {{ spellLevelText }} {{ spell.school.name }}
          </UBadge>
          <UBadge v-if="spell.is_ritual" color="secondary" variant="soft" size="xs">
            Ritual
          </UBadge>
          <UBadge v-if="spell.needs_concentration" color="primary" variant="soft" size="xs">
            Concentration
          </UBadge>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {{ spell.name }}
        </h1>
      </div>

      <!-- Quick Stats -->
      <UCard>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Casting Time
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ spell.casting_time }}
            </div>
          </div>

          <div>
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Range
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ spell.range }}
            </div>
          </div>

          <div>
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Components
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ spell.components }}
            </div>
            <div v-if="spell.material_components" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ spell.material_components }}
            </div>
          </div>

          <div>
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Duration
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ spell.duration }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- Description -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Description
          </h2>
        </template>
        <div class="prose dark:prose-invert max-w-none">
          <p class="whitespace-pre-line text-gray-700 dark:text-gray-300">{{ spell.description }}</p>
        </div>
      </UCard>

      <!-- Damage Effects (if any) -->
      <UCard v-if="damageEffects.length > 0">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Damage
          </h2>
        </template>
        <div class="space-y-3">
          <div
            v-for="effect in damageEffects"
            :key="effect.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100">
                {{ effect.description }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Spell Slot Level {{ effect.min_spell_slot }}
              </div>
            </div>
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {{ effect.dice_formula }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- Sources -->
      <UCard v-if="spell.sources && spell.sources.length > 0">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Source
          </h2>
        </template>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="source in spell.sources"
            :key="source.code"
            class="flex items-center gap-2"
          >
            <UBadge color="gray" variant="soft">
              {{ source.name }}
            </UBadge>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              p. {{ source.pages }}
            </span>
          </div>
        </div>
      </UCard>

      <!-- Back Button -->
      <div class="flex justify-center pt-4">
        <UButton
          to="/search"
          variant="soft"
          color="gray"
          icon="i-heroicons-arrow-left"
        >
          Back to Search
        </UButton>
      </div>
    </div>
  </div>
</template>
