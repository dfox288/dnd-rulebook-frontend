<script setup lang="ts">
import type { components } from '~/types/api/generated'

type EntitySpellResource = components['schemas']['EntitySpellResource']

interface Props {
  spells: EntitySpellResource[]
}

const props = defineProps<Props>()

/**
 * Format spell level for display
 */
function getSpellLevelText(level: number): string {
  if (level === 0) return 'Cantrip'
  const suffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
  return `${level}${suffix[level]} Level`
}

/**
 * Check if we should render the component
 */
const shouldRender = computed(() => props.spells.length > 0)
</script>

<template>
  <section v-if="shouldRender">
    <div class="flex items-center gap-2 mb-4">
      <UIcon
        name="i-heroicons-sparkles"
        class="w-5 h-5 text-primary"
      />
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
        Granted Spells
      </h2>
    </div>

    <!-- Max 2 columns - works in constrained hero section width -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NuxtLink
        v-for="entitySpell in spells"
        :key="entitySpell.id"
        :to="`/spells/${entitySpell.spell?.slug}`"
        class="block group"
      >
        <UCard
          class="h-full hover:ring-2 hover:ring-spell-500 dark:hover:ring-spell-400 transition-all border-2 border-spell-200 dark:border-spell-800"
        >
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-spell-600 dark:group-hover:text-spell-400 transition-colors">
              {{ entitySpell.spell?.name }}
            </h3>
          </template>

          <div class="space-y-2">
            <!-- Spell Level Badge -->
            <div>
              <UBadge
                color="spell"
                variant="subtle"
                size="md"
              >
                {{ getSpellLevelText(entitySpell.spell?.level ?? 0) }}
              </UBadge>
            </div>

            <!-- School Badge -->
            <div v-if="entitySpell.spell?.school">
              <UBadge
                color="primary"
                variant="subtle"
                size="md"
              >
                {{ entitySpell.spell.school.name }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </section>
</template>
