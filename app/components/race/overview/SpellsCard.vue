<script setup lang="ts">
import type { components } from '~/types/api/generated'

type EntitySpellResource = components['schemas']['EntitySpellResource']

interface Props {
  spells: EntitySpellResource[]
  spellcastingAbility?: string
}

const props = defineProps<Props>()

// Ability score code to full name mapping
const abilityScoreNames: Record<string, string> = {
  STR: 'Strength',
  DEX: 'Dexterity',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  CHA: 'Charisma'
}

// Sort spells: cantrips first, then by level requirement
const sortedSpells = computed(() => {
  return [...props.spells].sort((a, b) => {
    // Cantrips first
    if (a.is_cantrip && !b.is_cantrip) return -1
    if (!a.is_cantrip && b.is_cantrip) return 1

    // Then by level requirement (null treated as 0)
    const aLevel = a.level_requirement ?? 0
    const bLevel = b.level_requirement ?? 0
    return aLevel - bLevel
  })
})

// Format ordinal numbers (1st, 2nd, 3rd, 4th, etc.)
function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'] as const
  const v = num % 100
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]
  return `${num}${suffix}`
}

// Get spell description (cantrip or level + usage)
function getSpellDescription(entitySpell: EntitySpellResource): string {
  if (entitySpell.is_cantrip) {
    return '(cantrip)'
  }

  const parts: string[] = []

  if (entitySpell.level_requirement !== null) {
    parts.push(`${formatOrdinal(entitySpell.level_requirement)} level`)
  }

  if (entitySpell.usage_limit) {
    parts.push(entitySpell.usage_limit)
  }

  return parts.length > 0 ? `(${parts.join(', ')})` : ''
}

// Get full ability score name
const abilityScoreName = computed(() => {
  if (!props.spellcastingAbility) return null
  return abilityScoreNames[props.spellcastingAbility] || props.spellcastingAbility
})
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        Innate Spellcasting
      </h3>
    </template>

    <div class="space-y-2">
      <div
        v-for="entitySpell in sortedSpells"
        :key="entitySpell.id"
        class="flex items-baseline gap-2"
      >
        <NuxtLink
          v-if="entitySpell.spell"
          :to="`/spells/${entitySpell.spell.slug}`"
          class="text-primary hover:underline"
        >
          {{ entitySpell.spell.name }}
        </NuxtLink>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ getSpellDescription(entitySpell) }}
        </span>
      </div>
    </div>

    <template
      v-if="abilityScoreName"
      #footer
    >
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Spellcasting ability: {{ abilityScoreName }}
      </p>
    </template>
  </UCard>
</template>
