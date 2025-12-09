<!-- app/components/character/wizard/WizardLoadingState.vue -->
<script setup lang="ts">
interface Props {
  /** The accent color for the spinner. Defaults to 'primary'. */
  color?: 'primary' | 'race' | 'class' | 'spell' | 'background'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

const colorClass = computed(() => `text-${props.color}-500`)
</script>

<template>
  <div
    data-testid="wizard-loading-state"
    role="status"
    class="flex justify-center py-12"
  >
    <UIcon
      data-testid="wizard-loading-spinner"
      name="i-heroicons-arrow-path"
      class="w-8 h-8 animate-spin"
      :class="colorClass"
    />
    <span class="sr-only">Loading...</span>
  </div>
</template>
