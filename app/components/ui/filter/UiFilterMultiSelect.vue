<script setup lang="ts">
import { computed } from 'vue'

/**
 * Multi-select filter component for selecting multiple values from a list
 *
 * @example
 * ```vue
 * <UiFilterMultiSelect
 *   v-model="selectedTypes"
 *   label="Damage Types"
 *   :options="[
 *     { value: 'fire', label: 'Fire' },
 *     { value: 'cold', label: 'Cold' }
 *   ]"
 *   color="warning"
 *   placeholder="Select damage types..."
 * />
 * ```
 */

interface Option {
  value: string
  label: string
}

interface Props {
  /** Array of selected values */
  modelValue: string[] | null | undefined
  /** Filter label */
  label: string
  /** Available options */
  options: Option[]
  /** Entity semantic color (default: 'primary') */
  color?: string
  /** Placeholder text when nothing selected (default: 'Select...') */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  placeholder: 'Select...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// Normalize model value (handle null/undefined)
const normalizedValue = computed<string[]>(() => {
  if (!props.modelValue) return []
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

// Button text showing selection count or placeholder
const buttonText = computed(() => {
  const count = normalizedValue.value.length
  if (count === 0) return props.placeholder
  return `${count} selected`
})

// Show clear button when items are selected
const showClearButton = computed(() => normalizedValue.value.length > 0)

// Handle selection change from USelectMenu
const handleChange = (newSelection: string[]) => {
  emit('update:modelValue', newSelection || [])
}

// Clear all selections
const clearAll = () => {
  emit('update:modelValue', [])
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Label -->
    <label
      v-if="label"
      class="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>

    <!-- Select Menu Container -->
    <div class="relative flex items-center gap-2">
      <!-- Multi-Select Dropdown -->
      <USelectMenu
        :model-value="normalizedValue"
        :options="options"
        multiple
        searchable
        :aria-label="`${label} filter`"
        value-attribute="value"
        option-attribute="label"
        class="flex-1"
        @update:model-value="handleChange"
      >
        <template #label>
          <div class="flex items-center gap-2">
            <span v-if="normalizedValue.length === 0">{{ placeholder }}</span>
            <span v-else>{{ buttonText }}</span>
            <UBadge
              v-if="normalizedValue.length > 0"
              :color="color"
              size="xs"
              variant="soft"
            >
              {{ normalizedValue.length }}
            </UBadge>
          </div>
        </template>
      </USelectMenu>

      <!-- Clear Button -->
      <UButton
        v-if="showClearButton"
        icon="i-heroicons-x-mark"
        color="gray"
        variant="ghost"
        size="xs"
        :aria-label="`Clear ${label} filter`"
        @click="clearAll"
      />
    </div>
  </div>
</template>
