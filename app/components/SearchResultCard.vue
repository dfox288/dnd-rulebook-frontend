<script setup lang="ts">
import type { Spell, Item, Race, CharacterClass, Background, Feat } from '~/types/search'

interface Props {
  result: Spell | Item | Race | CharacterClass | Background | Feat
  type: 'spell' | 'item' | 'race' | 'class' | 'background' | 'feat'
}

const props = defineProps<Props>()

/**
 * Get badge color based on entity type
 */
const getBadgeColor = () => {
  const colors = {
    spell: 'purple',
    item: 'amber',
    race: 'blue',
    class: 'red',
    background: 'green',
    feat: 'orange',
  }
  return colors[props.type]
}

/**
 * Get URL path for entity detail page
 */
const getUrl = () => {
  const pluralTypes = {
    spell: 'spells',
    item: 'items',
    race: 'races',
    class: 'classes',
    background: 'backgrounds',
    feat: 'feats',
  }
  return `/${pluralTypes[props.type]}/${props.result.slug}`
}

/**
 * Truncate description to specified length
 */
const truncateDescription = (text: string, length: number = 200): string => {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

/**
 * Check if result is a spell
 */
const isSpell = (result: any): result is Spell => props.type === 'spell'

/**
 * Check if result is an item
 */
const isItem = (result: any): result is Item => props.type === 'item'
</script>

<template>
  <NuxtLink :to="getUrl()" class="block">
    <UCard class="hover:shadow-lg transition-shadow h-full">
      <div class="space-y-3">
        <!-- Header with name and type badge -->
        <div class="flex items-start justify-between gap-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1">
            {{ result.name }}
          </h3>
          <UBadge :color="getBadgeColor()" variant="subtle" size="sm">
            {{ type }}
          </UBadge>
        </div>

        <!-- Spell-specific metadata -->
        <div v-if="isSpell(result)" class="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span class="inline-flex items-center gap-1">
            <span class="font-medium">Level {{ result.level }}</span>
          </span>
          <span>•</span>
          <span>{{ result.casting_time }}</span>
          <span v-if="result.needs_concentration">
            <span>•</span>
            <span class="text-primary-600 dark:text-primary-400">Concentration</span>
          </span>
          <span v-if="result.is_ritual">
            <span>•</span>
            <span class="text-secondary-600 dark:text-secondary-400">Ritual</span>
          </span>
        </div>

        <!-- Item-specific metadata -->
        <div v-if="isItem(result)" class="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          <UBadge :color="result.is_magic ? 'primary' : 'gray'" variant="soft" size="xs">
            {{ result.rarity }}
          </UBadge>
          <span v-if="result.is_magic">
            <UBadge color="purple" variant="soft" size="xs">Magic</UBadge>
          </span>
          <span v-if="result.requires_attunement">
            <UBadge color="blue" variant="soft" size="xs">Attunement</UBadge>
          </span>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {{ truncateDescription(result.description) }}
        </p>
      </div>
    </UCard>
  </NuxtLink>
</template>
