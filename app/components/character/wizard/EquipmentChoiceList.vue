<!-- app/components/character/wizard/EquipmentChoiceList.vue -->
<script setup lang="ts">
import type { components } from '~/types/api/generated'

type PendingChoice = components['schemas']['PendingChoiceResource']

interface EquipmentOption {
  option: string
  label: string
  items: Array<{ id: number, name: string, quantity: number }>
}

interface Props {
  choices: PendingChoice[]
  localSelections: Map<string, string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [choiceId: string, optionLetter: string]
}>()

/**
 * Get typed options for an equipment choice
 */
function getEquipmentOptions(choice: PendingChoice): EquipmentOption[] {
  return (choice.options as EquipmentOption[] | null) ?? []
}

/**
 * Handle option selection
 */
function handleSelect(choiceId: string, optionLetter: string) {
  emit('select', choiceId, optionLetter)
}

/**
 * Check if an option is selected
 */
function isSelected(choiceId: string, optionLetter: string): boolean {
  return props.localSelections.get(choiceId) === optionLetter
}
</script>

<template>
  <div
    v-for="choice in choices"
    :key="choice.id"
    class="space-y-2"
  >
    <h4 class="font-medium text-gray-700 dark:text-gray-300">
      {{ choice.source_name }} Equipment Choice
    </h4>

    <div class="space-y-2">
      <button
        v-for="option in getEquipmentOptions(choice)"
        :key="option.option"
        :data-test="`option-${option.option}`"
        type="button"
        class="w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3"
        :class="[
          isSelected(choice.id, option.option)
            ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
        ]"
        @click="handleSelect(choice.id, option.option)"
      >
        <!-- Radio indicator -->
        <div
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          :class="[
            isSelected(choice.id, option.option)
              ? 'border-primary-500 bg-primary-500'
              : 'border-gray-400'
          ]"
        >
          <div
            v-if="isSelected(choice.id, option.option)"
            class="w-2 h-2 rounded-full bg-white"
          />
        </div>

        <!-- Option label and items -->
        <div class="flex-1">
          <div class="font-medium text-gray-900 dark:text-white">
            {{ option.label }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span
              v-for="(item, idx) in option.items"
              :key="item.id"
            >
              {{ item.name }}
              <span v-if="item.quantity > 1">(×{{ item.quantity }})</span>
              <span v-if="idx < option.items.length - 1">, </span>
            </span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
