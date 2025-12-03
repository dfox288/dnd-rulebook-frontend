<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCharacterBuilderStore } from '~/stores/characterBuilder'

const store = useCharacterBuilderStore()
const {
  selectedClass,
  selectedBackground,
  equipmentChoices,
  equipmentItemSelections,
  allEquipmentChoicesMade,
  isLoading
} = storeToRefs(store)

// Separate equipment by source
const classFixedEquipment = computed(() =>
  selectedClass.value?.equipment?.filter(eq => !eq.is_choice) ?? []
)

const backgroundFixedEquipment = computed(() =>
  selectedBackground.value?.equipment?.filter(eq => !eq.is_choice) ?? []
)

// Get choice groups by source
const classChoiceGroups = computed(() => {
  const groups = new Map()
  for (const item of selectedClass.value?.equipment ?? []) {
    if (item.is_choice && item.choice_group) {
      const existing = groups.get(item.choice_group) ?? []
      groups.set(item.choice_group, [...existing, item])
    }
  }
  return groups
})

const backgroundChoiceGroups = computed(() => {
  const groups = new Map()
  for (const item of selectedBackground.value?.equipment ?? []) {
    if (item.is_choice && item.choice_group) {
      const existing = groups.get(item.choice_group) ?? []
      groups.set(item.choice_group, [...existing, item])
    }
  }
  return groups
})

/**
 * Handle equipment choice selection
 * Clear any previous item selections for this group when option changes
 */
function handleChoiceSelect(choiceGroup: string, id: number) {
  // Clear item selections when changing options
  store.clearEquipmentItemSelections(choiceGroup)
  store.setEquipmentChoice(choiceGroup, id)
}

/**
 * Handle item selection within a compound choice
 */
function handleItemSelect(choiceGroup: string, choiceOption: number, choiceItemIndex: number, itemId: number) {
  store.setEquipmentItemSelection(choiceGroup, choiceOption, choiceItemIndex, itemId)
}

/**
 * Build itemSelections map for a specific choice group
 * Extracts selections from the full map and formats for EquipmentChoiceGroup
 */
function buildItemSelectionsMap(choiceGroup: string): Map<string, number> {
  const map = new Map<string, number>()
  for (const [key, value] of equipmentItemSelections.value) {
    if (key.startsWith(`${choiceGroup}:`)) {
      // Extract "choiceOption:index" from "choiceGroup:choiceOption:index"
      const parts = key.split(':')
      const shortKey = `${parts[1]}:${parts[2]}`
      map.set(shortKey, value)
    }
  }
  return map
}

/**
 * Format choice group name for display
 * Converts "choice_1" to "Equipment Choice 1"
 */
function formatGroupName(group: string): string {
  // Extract number from "choice_1", "choice_2", etc.
  const match = group.match(/choice[_-]?(\d+)/i)
  if (match) {
    return `Equipment Choice ${match[1]}`
  }
  return group
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Get display name for equipment item
 * Uses item name if available, otherwise falls back to description
 */
function getItemDisplayName(item: { item?: { name?: string } | null, description?: string | null }): string {
  if (item.item?.name) {
    return item.item.name
  }
  if (item.description) {
    return item.description
  }
  return 'Unknown item'
}

/**
 * Continue to next step
 */
function handleContinue() {
  store.nextStep()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Choose Your Starting Equipment
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Select your starting gear from your class and background
      </p>
    </div>

    <!-- Class Equipment -->
    <div
      v-if="selectedClass"
      class="space-y-4"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
        From Your Class ({{ selectedClass.name }})
      </h3>

      <!-- Fixed Items -->
      <div
        v-if="classFixedEquipment.length > 0"
        class="space-y-2"
      >
        <div
          v-for="item in classFixedEquipment"
          :key="item.id"
          class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
        >
          <UIcon
            name="i-heroicons-check-circle"
            class="w-5 h-5 text-green-500"
          />
          <span>{{ getItemDisplayName(item) }}</span>
          <span
            v-if="item.quantity > 1"
            class="text-gray-500"
          >(×{{ item.quantity }})</span>
        </div>
      </div>

      <!-- Choice Groups -->
      <CharacterBuilderEquipmentChoiceGroup
        v-for="[group, items] in classChoiceGroups"
        :key="group"
        :group-name="formatGroupName(group)"
        :items="items"
        :selected-id="equipmentChoices.get(group) ?? null"
        :item-selections="buildItemSelectionsMap(group)"
        @select="(id) => handleChoiceSelect(group, id)"
        @item-select="(opt, idx, itemId) => handleItemSelect(group, opt, idx, itemId)"
      />
    </div>

    <!-- Background Equipment -->
    <div
      v-if="selectedBackground"
      class="space-y-4"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
        From Your Background ({{ selectedBackground.name }})
      </h3>

      <!-- Fixed Items -->
      <div
        v-if="backgroundFixedEquipment.length > 0"
        class="space-y-2"
      >
        <div
          v-for="item in backgroundFixedEquipment"
          :key="item.id"
          class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
        >
          <UIcon
            name="i-heroicons-check-circle"
            class="w-5 h-5 text-green-500"
          />
          <span>{{ getItemDisplayName(item) }}</span>
          <span
            v-if="item.quantity > 1"
            class="text-gray-500"
          >(×{{ item.quantity }})</span>
        </div>
      </div>

      <!-- Choice Groups -->
      <CharacterBuilderEquipmentChoiceGroup
        v-for="[group, items] in backgroundChoiceGroups"
        :key="group"
        :group-name="formatGroupName(group)"
        :items="items"
        :selected-id="equipmentChoices.get(group) ?? null"
        :item-selections="buildItemSelectionsMap(group)"
        @select="(id) => handleChoiceSelect(group, id)"
        @item-select="(opt, idx, itemId) => handleItemSelect(group, opt, idx, itemId)"
      />
    </div>

    <!-- Continue Button -->
    <div class="flex justify-center pt-4">
      <UButton
        data-test="continue-btn"
        size="lg"
        :disabled="!allEquipmentChoicesMade || isLoading"
        :loading="isLoading"
        @click="handleContinue"
      >
        Continue with Equipment
      </UButton>
    </div>
  </div>
</template>
