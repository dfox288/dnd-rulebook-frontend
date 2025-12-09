<!-- app/components/character/wizard/WizardStepHeader.vue -->
<script setup lang="ts">
interface Props {
  /** The main heading text for the wizard step */
  title: string
  /** Optional description text shown below the title */
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div
    data-testid="wizard-step-header"
    class="text-center"
  >
    <h2
      data-testid="wizard-step-title"
      class="text-2xl font-bold text-gray-900 dark:text-white"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      data-testid="wizard-step-description"
      class="mt-2 text-gray-600 dark:text-gray-400"
    >
      {{ description }}
    </p>
  </div>
</template>
