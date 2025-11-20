<script setup lang="ts">
interface Item {
  id: number
  name: string
  slug: string
  rarity: string
  item_type?: {
    id: number
    name: string
  }
  is_magic: boolean
  requires_attunement: boolean
  cost?: string
  weight?: string
  description?: string
}

interface Props {
  item: Item
}

const props = defineProps<Props>()

/**
 * Get rarity color for badge
 */
const rarityColor = computed(() => {
  const colors: Record<string, string> = {
    'common': 'gray',
    'uncommon': 'green',
    'rare': 'blue',
    'very rare': 'purple',
    'legendary': 'orange',
    'artifact': 'red'
  }
  return colors[props.item.rarity?.toLowerCase()] || 'gray'
})

/**
 * Format rarity for display
 */
const rarityText = computed(() => {
  return props.item.rarity?.split(' ').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ') || 'Common'
})

/**
 * Truncate description to specified length
 */
const truncatedDescription = computed(() => {
  if (!props.item.description) return 'No description available'
  const maxLength = 150
  if (props.item.description.length <= maxLength) return props.item.description
  return props.item.description.substring(0, maxLength).trim() + '...'
})
</script>

<template>
  <NuxtLink :to="`/items/${item.slug}`" class="block h-full">
    <UCard class="hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700">
      <div class="space-y-3">
        <!-- Rarity and Type Badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge :color="rarityColor" variant="subtle" size="sm">
            {{ rarityText }}
          </UBadge>
          <UBadge v-if="item.item_type" color="gray" variant="soft" size="sm">
            {{ item.item_type.name }}
          </UBadge>
        </div>

        <!-- Item Name -->
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {{ item.name }}
        </h3>

        <!-- Quick Stats -->
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
          <div v-if="item.cost" class="flex items-center gap-1">
            <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4" />
            <span>{{ item.cost }}</span>
          </div>
          <div v-if="item.weight" class="flex items-center gap-1">
            <UIcon name="i-heroicons-scale" class="w-4 h-4" />
            <span>{{ item.weight }}</span>
          </div>
        </div>

        <!-- Conditional Badges -->
        <div v-if="item.is_magic || item.requires_attunement" class="flex items-center gap-2">
          <UBadge v-if="item.is_magic" color="purple" variant="soft" size="xs">
            ✨ Magic
          </UBadge>
          <UBadge v-if="item.requires_attunement" color="blue" variant="soft" size="xs">
            🔮 Attunement
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
