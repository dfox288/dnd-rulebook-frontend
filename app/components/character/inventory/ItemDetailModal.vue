<!-- app/components/character/inventory/ItemDetailModal.vue -->
<script setup lang="ts">
/**
 * Item Detail Modal
 *
 * Read-only modal displaying item details when clicking on an item in the inventory table.
 * Shows item name, type, rarity, stats (weight, value, quantity), description, and properties.
 *
 * Layout inspired by SpellDetailModal for consistency across the app.
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

// Use local ref for v-model binding (matches SpellDetailModal pattern)
const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    emit('update:open', value)
  }
})

// Item data accessors - handle loosely typed item field
const itemData = computed(() => props.item?.item as {
  name?: string
  description?: string
  weight?: string
  item_type?: string
  armor_class?: number
  damage?: string
  damage_type?: string
  properties?: string[]
  cost_cp?: number
  rarity?: string
  range_normal?: number
  range_long?: number
  requires_attunement?: boolean
  stealth_disadvantage?: boolean
  str_minimum?: number
} | null)

const displayName = computed(() => {
  if (!props.item) return ''
  if (props.item.custom_name) return props.item.custom_name
  return itemData.value?.name ?? 'Unknown Item'
})

const description = computed(() => {
  if (!props.item) return ''

  // Try custom_description first
  if (props.item.custom_description) {
    // Backend may store JSON like {"source":"background","description":"..."}
    // Try to parse and extract the description field
    try {
      const parsed = JSON.parse(props.item.custom_description)
      if (typeof parsed === 'object' && parsed.description) {
        return parsed.description
      }
      // If it parsed but has no description field, it's metadata - skip it
      if (typeof parsed === 'object' && parsed.source) {
        return itemData.value?.description ?? ''
      }
    } catch {
      // Not JSON, use as-is
      return props.item.custom_description
    }
  }

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
const damageType = computed(() => itemData.value?.damage_type ?? null)
const armorClass = computed(() => itemData.value?.armor_class ?? null)
const properties = computed(() => itemData.value?.properties ?? [])
const requiresAttunement = computed(() => itemData.value?.requires_attunement ?? false)
const stealthDisadvantage = computed(() => itemData.value?.stealth_disadvantage ?? false)
const strMinimum = computed(() => itemData.value?.str_minimum ?? null)

// Range for ranged weapons
const range = computed(() => {
  const normal = itemData.value?.range_normal
  const long = itemData.value?.range_long
  if (!normal) return null
  if (long) return `${normal}/${long} ft`
  return `${normal} ft`
})

// Full damage text with type
const damageText = computed(() => {
  if (!damage.value) return null
  if (damageType.value) return `${damage.value} ${damageType.value}`
  return damage.value
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

// Location text for equipped items
const locationText = computed(() => {
  if (!props.item?.equipped) return null
  switch (props.item.location) {
    case 'main_hand': return 'Main Hand'
    case 'off_hand': return 'Off Hand'
    case 'worn': return 'Worn'
    case 'attuned': return 'Attuned'
    default: return props.item.location
  }
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="displayName"
  >
    <template #body>
      <div
        v-if="item"
        class="space-y-4"
      >
        <!-- Type and Rarity Badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge
            v-if="itemType"
            color="item"
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
          <UBadge
            v-if="requiresAttunement"
            color="warning"
            variant="subtle"
            size="md"
          >
            Attunement
          </UBadge>
          <UBadge
            v-if="item.equipped"
            color="primary"
            variant="subtle"
            size="md"
          >
            {{ locationText }}
          </UBadge>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div v-if="weight !== null">
            <span class="font-semibold text-gray-900 dark:text-gray-100">Weight:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ weight }} lb</span>
          </div>
          <div v-if="costGp">
            <span class="font-semibold text-gray-900 dark:text-gray-100">Value:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ costGp }} gp</span>
          </div>
          <div v-if="item.quantity > 1">
            <span class="font-semibold text-gray-900 dark:text-gray-100">Quantity:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ item.quantity }}</span>
          </div>
          <div v-if="damageText">
            <span class="font-semibold text-gray-900 dark:text-gray-100">Damage:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ damageText }}</span>
          </div>
          <div v-if="armorClass">
            <span class="font-semibold text-gray-900 dark:text-gray-100">AC:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ armorClass }}</span>
          </div>
          <div v-if="range">
            <span class="font-semibold text-gray-900 dark:text-gray-100">Range:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ range }}</span>
          </div>
        </div>

        <!-- Armor Restrictions -->
        <div
          v-if="stealthDisadvantage || strMinimum"
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm"
        >
          <span
            v-if="stealthDisadvantage"
            class="block text-gray-600 dark:text-gray-400"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-4 h-4 inline mr-1 text-warning"
            />
            Disadvantage on Stealth checks
          </span>
          <span
            v-if="strMinimum"
            class="block text-gray-600 dark:text-gray-400"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-4 h-4 inline mr-1 text-warning"
            />
            Requires Strength {{ strMinimum }}
          </span>
        </div>

        <!-- Description -->
        <div
          v-if="description"
          class="prose prose-sm dark:prose-invert max-w-none"
        >
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {{ description }}
          </p>
        </div>

        <!-- Properties -->
        <div
          v-if="properties.length > 0"
          class="bg-item-50 dark:bg-item-900/20 rounded-lg p-3"
        >
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
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

        <!-- Custom Name/Description Note -->
        <div
          v-if="item.custom_name || item.custom_description"
          class="text-xs text-gray-400 dark:text-gray-500 italic"
        >
          <span v-if="item.custom_name && itemData?.name">
            Base item: {{ itemData.name }}
          </span>
        </div>
      </div>
    </template>
  </UModal>
</template>
