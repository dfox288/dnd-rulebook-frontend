<script setup lang="ts">
import type { components } from '~/types/api/generated'

type EntityItemResource = components['schemas']['EntityItemResource']
type EquipmentChoiceItemResource = components['schemas']['EquipmentChoiceItemResource']

interface Props {
  groupName: string
  items: EntityItemResource[]
  selectedId: number | null
  itemSelections?: Map<string, number> // key: "choiceOption:index", value: itemId
}

const props = withDefaults(defineProps<Props>(), {
  itemSelections: () => new Map()
})

const emit = defineEmits<{
  select: [id: number]
  itemSelect: [choiceOption: number, choiceItemIndex: number, itemId: number]
}>()

function handleSelect(id: number) {
  emit('select', id)
}

function handleItemSelect(choiceOption: number, choiceItemIndex: number, itemIds: number[]) {
  // For single selection, emit the first (and only) item
  if (itemIds.length > 0) {
    emit('itemSelect', choiceOption, choiceItemIndex, itemIds[0])
  }
}

/**
 * Get display name for equipment item
 */
function getItemDisplayName(item: EntityItemResource): string {
  if (item.item?.name) {
    return item.item.name
  }
  if (item.description) {
    return item.description
  }
  return 'Unknown item'
}

/**
 * Get the selected option object
 */
const selectedOption = computed(() =>
  props.items.find(item => item.id === props.selectedId)
)

/**
 * Check if a choice_item needs a picker (has proficiency_type, no fixed item)
 */
function needsPicker(choiceItem: EquipmentChoiceItemResource): boolean {
  return !!choiceItem.proficiency_type && !choiceItem.item
}

/**
 * Get current selection for a choice item
 */
function getItemSelection(choiceOption: number, index: number): number[] {
  const key = `${choiceOption}:${index}`
  const selected = props.itemSelections?.get(key)
  return selected ? [selected] : []
}
</script>

<template>
  <div class="space-y-2">
    <h4 class="font-medium text-gray-700 dark:text-gray-300">
      {{ groupName }}
    </h4>

    <div class="space-y-2">
      <div
        v-for="item in items"
        :key="item.id"
      >
        <!-- Main option button -->
        <button
          :data-test="`option-${item.id}`"
          type="button"
          class="w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3"
          :class="[
            selectedId === item.id
              ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
          ]"
          @click="handleSelect(item.id)"
        >
          <!-- Radio indicator -->
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            :class="[
              selectedId === item.id
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-400'
            ]"
          >
            <div
              v-if="selectedId === item.id"
              class="w-2 h-2 rounded-full bg-white"
            />
          </div>

          <!-- Item info -->
          <div>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ getItemDisplayName(item) }}
            </span>
            <span
              v-if="item.quantity > 1 && !item.choice_items?.length"
              class="text-gray-500 ml-1"
            >
              (×{{ item.quantity }})
            </span>
          </div>
        </button>

        <!-- Inline choice_items pickers (only for selected option) -->
        <div
          v-if="selectedId === item.id && item.choice_items?.length"
          class="ml-8 mt-2 space-y-3 border-l-2 border-primary-200 pl-4"
        >
          <div
            v-for="(choiceItem, index) in item.choice_items"
            :key="index"
            class="flex items-center gap-2"
          >
            <!-- Category item - needs picker -->
            <template v-if="needsPicker(choiceItem)">
              <div class="flex-1">
                <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Select {{ choiceItem.proficiency_type?.name?.toLowerCase() }}
                  <span v-if="choiceItem.quantity > 1">({{ choiceItem.quantity }})</span>
                </label>
                <CharacterBuilderEquipmentItemPicker
                  :data-test="`choice-item-picker-${index}`"
                  :proficiency-type="choiceItem.proficiency_type!"
                  :quantity="choiceItem.quantity"
                  :model-value="getItemSelection(item.choice_option!, index)"
                  @update:model-value="(ids) => handleItemSelect(item.choice_option!, index, ids)"
                />
              </div>
            </template>

            <!-- Fixed item - auto-included -->
            <template v-else-if="choiceItem.item">
              <div
                :data-test="`fixed-item-${index}`"
                class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0"
                />
                <span>{{ choiceItem.item.name }}</span>
                <span
                  v-if="choiceItem.quantity > 1"
                  class="text-gray-500"
                >
                  (×{{ choiceItem.quantity }})
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
