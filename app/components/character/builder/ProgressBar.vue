<!-- app/components/character/builder/ProgressBar.vue -->
<script setup lang="ts">
import type { WizardStep } from '~/composables/useWizardSteps'

const props = defineProps<{
  steps: WizardStep[]
  currentIndex: number
  currentLabel: string
}>()

const emit = defineEmits<{
  'step-click': [stepName: string]
}>()

function handleDotClick(step: WizardStep, index: number) {
  // Only allow clicking completed steps (before current)
  if (index < props.currentIndex) {
    emit('step-click', step.name)
  }
}

function getDotClasses(index: number): string[] {
  const classes = ['w-3', 'h-3', 'rounded-full', 'transition-all']

  if (index < props.currentIndex) {
    // Completed - clickable
    classes.push('bg-primary', 'cursor-pointer', 'hover:scale-110')
  } else if (index === props.currentIndex) {
    // Current - highlighted with ring
    classes.push('bg-primary', 'ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-gray-900')
  } else {
    // Future - muted
    classes.push('bg-gray-300', 'dark:bg-gray-600', 'cursor-not-allowed')
  }

  return classes
}

// Human-readable step number (1-indexed for display)
const stepNumber = computed(() => props.currentIndex + 1)
const totalSteps = computed(() => props.steps.length)
</script>

<template>
  <div class="flex items-center justify-between gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <!-- Progress dots -->
    <div class="flex items-center gap-2">
      <button
        v-for="(step, index) in steps"
        :key="step.name"
        type="button"
        data-test="progress-dot"
        :class="getDotClasses(index)"
        :disabled="index >= currentIndex"
        :title="step.label"
        @click="handleDotClick(step, index)"
      />
    </div>

    <!-- Step counter -->
    <div class="text-sm text-gray-600 dark:text-gray-400">
      <span class="font-medium text-gray-900 dark:text-white">
        Step {{ stepNumber }} of {{ totalSteps }}:
      </span>
      {{ currentLabel }}
    </div>
  </div>
</template>
