<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  label?: string
  badgeCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Filters',
  badgeCount: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggleFilters = () => {
  emit('update:modelValue', !props.modelValue)
}

const buttonText = computed(() => {
  return props.modelValue ? `Hide ${props.label}` : `Show ${props.label}`
})

const showBadge = computed(() => {
  return props.badgeCount > 0
})
</script>

<template>
  <div class="space-y-4">
    <!-- Search + Filter Toggle Row -->
    <div class="flex gap-2">
      <!-- Search Input Slot (optional) -->
      <slot name="search" />

      <!-- Filter Toggle Button -->
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-0 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-500"
        :aria-expanded="modelValue"
        @click="toggleFilters"
      >
        <!-- Icon -->
        <svg
          class="w-3 h-3 transition-transform"
          :class="{ 'rotate-180': modelValue }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>

        <!-- Button Text -->
        <span class="min-w-[100px] text-center">{{ buttonText }}</span>

        <!-- Badge -->
        <span
          v-if="showBadge"
          data-testid="filter-badge"
          class="px-2 py-0.5 text-xs font-bold text-white bg-primary-500 rounded-full"
        >
          {{ badgeCount }}
        </span>
      </button>
    </div>

    <!-- Collapsible Filter Content -->
    <Transition
      enter-active-class="overflow-hidden transition-all duration-300 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-96 opacity-100"
      leave-active-class="overflow-hidden transition-all duration-200 ease-in"
      leave-from-class="max-h-96 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="modelValue">
        <slot />
      </div>
    </Transition>
  </div>
</template>
