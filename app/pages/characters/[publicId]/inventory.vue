<!-- app/pages/characters/[publicId]/inventory.vue -->
<script setup lang="ts">
/**
 * Inventory Management Page
 *
 * Full inventory UI with item actions, equipment status sidebar,
 * add loot/shop modals, and optional encumbrance tracking.
 *
 * @see Design: docs/frontend/plans/2025-12-13-inventory-tab-design-v2.md
 */

import type { CharacterEquipment } from '~/types/character'

const route = useRoute()
const publicId = computed(() => route.params.publicId as string)

// Fetch character data for page context
const { apiFetch } = useApi()
const { data: characterData, pending: characterPending } = await useAsyncData(
  `inventory-character-${publicId.value}`,
  () => apiFetch<{ data: { id: number, name: string, public_id: string } }>(`/characters/${publicId.value}`)
)

// Fetch equipment data
const { data: equipmentData, pending: equipmentPending, refresh: refreshEquipment } = await useAsyncData(
  `inventory-equipment-${publicId.value}`,
  () => apiFetch<{ data: CharacterEquipment[] }>(`/characters/${publicId.value}/equipment`)
)

// Fetch stats for carrying capacity
const { data: statsData, pending: statsPending } = await useAsyncData(
  `inventory-stats-${publicId.value}`,
  () => apiFetch<{ data: { carrying_capacity?: number, push_drag_lift?: number, spellcasting?: unknown } }>(
    `/characters/${publicId.value}/stats`
  )
)

const loading = computed(() => characterPending.value || equipmentPending.value || statsPending.value)
const character = computed(() => characterData.value?.data ?? null)
const equipment = computed(() => equipmentData.value?.data ?? [])
const stats = computed(() => statsData.value?.data ?? null)
const isSpellcaster = computed(() => !!stats.value?.spellcasting)

// Calculate total weight of all equipment (rounded to 2 decimal places)
const currentWeight = computed(() => {
  const total = equipment.value.reduce((sum, item) => {
    const itemData = item.item as { weight?: string | number } | null
    const weight = parseFloat(String(itemData?.weight ?? 0)) || 0
    return sum + (weight * item.quantity)
  }, 0)
  return Math.round(total * 100) / 100
})

// Handle clicking an item in the sidebar (scroll to it in list)
function handleItemClick(itemId: number) {
  // TODO: Scroll to item in list when ItemList component is implemented
  console.log('Scroll to item:', itemId)
}

useSeoMeta({
  title: () => character.value ? `${character.value.name} - Inventory` : 'Inventory'
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- Back Link -->
    <div class="mb-4">
      <UButton
        :to="`/characters/${publicId}`"
        variant="ghost"
        icon="i-heroicons-arrow-left"
      >
        Back to Character
      </UButton>
    </div>

    <!-- Tab Navigation -->
    <CharacterTabNavigation
      data-testid="tab-navigation"
      :public-id="publicId"
      :is-spellcaster="isSpellcaster"
    />

    <!-- Loading State -->
    <div
      v-if="loading"
      data-testid="loading-skeleton"
      class="space-y-4"
    >
      <USkeleton class="h-12 w-full" />
      <div class="grid lg:grid-cols-[1fr_280px] gap-6">
        <USkeleton class="h-96" />
        <USkeleton class="h-96" />
      </div>
    </div>

    <!-- Main Content -->
    <div
      v-else
      data-testid="inventory-layout"
      class="grid lg:grid-cols-[1fr_280px] gap-6"
    >
      <!-- Left Column: Item List -->
      <div class="space-y-4">
        <!-- Character Name (for SEO and context) -->
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ character?.name }}'s Inventory
        </h1>

        <!-- Search -->
        <UInput
          placeholder="Search items..."
          icon="i-heroicons-magnifying-glass"
          data-testid="item-search"
        />

        <!-- Item List Placeholder -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500">
          Item list will go here
          <br>
          {{ equipment.length }} items loaded
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <UButton
            data-testid="add-loot-btn"
            icon="i-heroicons-plus"
          >
            Add Loot
          </UButton>
          <UButton
            data-testid="shop-btn"
            variant="outline"
            icon="i-heroicons-shopping-cart"
          >
            Shop
          </UButton>
        </div>
      </div>

      <!-- Right Column: Sidebar (sticky on desktop) -->
      <div class="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <!-- Equipment Status -->
        <CharacterInventoryEquipmentStatus
          :equipment="equipment"
          @item-click="handleItemClick"
        />

        <!-- Encumbrance Bar -->
        <CharacterInventoryEncumbranceBar
          v-if="stats?.carrying_capacity"
          :current-weight="currentWeight"
          :carrying-capacity="stats.carrying_capacity"
          :public-id="publicId"
        />
      </div>
    </div>
  </div>
</template>
