<!-- app/components/character/inventory/ItemDetailModal.vue -->
<script setup lang="ts">
/**
 * Item Detail Modal
 *
 * Read-only modal displaying item details when clicking on an item in the inventory table.
 * Shows item name, type, rarity, stats (weight, value, quantity), description, and properties.
 *
 * No action buttons - actions are handled in the table row.
 *
 * @see Design: docs/frontend/plans/2025-12-13-inventory-redesign.md
 */

import type { CharacterEquipment } from '~/types/character'

interface Props {
  open: boolean
  item: CharacterEquipment | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Item data accessors - handle loosely typed item field
const itemData = computed(() => props.item?.item as {
  name?: string
  description?: string
  weight?: string
  item_type?: string
  armor_class?: number
  damage?: string
  properties?: string[]
  cost_cp?: number
  rarity?: string
  range_normal?: number
  range_long?: number
} | null)

const displayName = computed(() => {
  if (!props.item) return ''
  if (props.item.custom_name) return props.item.custom_name
  return itemData.value?.name ?? 'Unknown Item'
})

const description = computed(() => {
  if (!props.item) return ''
  if (props.item.custom_description) return props.item.custom_description
  return itemData.value?.description ?? ''
})

const weight = computed(() => {
  const raw = itemData.value?.weight
  if (!raw) return null
  const num = parseFloat(raw)
  return isNaN(num) ? null : num
})

const itemType = computed(() => itemData.value?.item_type ?? null)

const rarity = computed(() => itemData.value?.rarity ?? null)

// Format cost in gold pieces
const costGp = computed(() => {
  const cp = itemData.value?.cost_cp
  if (!cp) return null
  return (cp / 100).toFixed(2).replace(/\.00$/, '')
})

// Combat stats
const damage = computed(() => itemData.value?.damage ?? null)
const armorClass = computed(() => itemData.value?.armor_class ?? null)
const properties = computed(() => itemData.value?.properties ?? [])

// Range for ranged weapons
const range = computed(() => {
  const normal = itemData.value?.range_normal
  const long = itemData.value?.range_long
  if (!normal) return null
  if (long) return `${normal}/${long} ft`
  return `${normal} ft`
})

// Badge color based on rarity
const rarityColor = computed(() => {
  switch (rarity.value?.toLowerCase()) {
    case 'common': return 'neutral'
    case 'uncommon': return 'success'
    case 'rare': return 'info'
    case 'very rare': return 'primary'
    case 'legendary': return 'warning'
    case 'artifact': return 'error'
    default: return 'neutral'
  }
})

function handleClose() {
  emit('update:open', false)
}
</script>

<template>
  <UModal
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <template #header>
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ displayName }}
          </h2>
          <div class="flex flex-wrap gap-2 mt-2">
            <UBadge
              v-if="itemType"
              color="neutral"
              variant="subtle"
              size="md"
            >
              {{ itemType }}
            </UBadge>
            <UBadge
              v-if="rarity"
              :color="rarityColor"
              variant="subtle"
              size="md"
            >
              {{ rarity }}
            </UBadge>
          </div>
        </div>
        <UButton
          icon="i-heroicons-x-mark"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="handleClose"
        />
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <!-- Stats Bar -->
        <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 pb-4 border-b border-gray-200 dark:border-gray-700">
          <span v-if="weight !== null">
            <span class="text-gray-500 dark:text-gray-400">Weight:</span>
            {{ weight }} lb
          </span>
          <span v-if="costGp">
            <span class="text-gray-500 dark:text-gray-400">Value:</span>
            {{ costGp }} gp
          </span>
          <span v-if="item && item.quantity > 1">
            <span class="text-gray-500 dark:text-gray-400">Qty:</span>
            {{ item.quantity }}
          </span>
        </div>

        <!-- Description -->
        <div v-if="description">
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {{ description }}
          </p>
        </div>

        <!-- Properties -->
        <div v-if="properties.length > 0">
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Properties
          </h4>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="prop in properties"
              :key="prop"
              color="neutral"
              variant="outline"
              size="md"
            >
              {{ prop }}
            </UBadge>
          </div>
        </div>

        <!-- Combat Stats -->
        <div v-if="damage || armorClass || range">
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Combat
          </h4>
          <div class="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
            <span v-if="damage">
              <span class="text-gray-500 dark:text-gray-400">Damage:</span>
              {{ damage }}
            </span>
            <span v-if="armorClass">
              <span class="text-gray-500 dark:text-gray-400">AC:</span>
              {{ armorClass }}
            </span>
            <span v-if="range">
              <span class="text-gray-500 dark:text-gray-400">Range:</span>
              {{ range }}
            </span>
          </div>
        </div>

        <!-- Equipped Location -->
        <div v-if="item?.equipped">
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Status
          </h4>
          <UBadge
            color="primary"
            variant="subtle"
            size="md"
          >
            Equipped: {{ item.location === 'main_hand' ? 'Main Hand' : item.location === 'off_hand' ? 'Off Hand' : item.location === 'worn' ? 'Worn' : item.location === 'attuned' ? 'Attuned' : item.location }}
          </UBadge>
        </div>
      </div>
    </template>
  </UModal>
</template>
