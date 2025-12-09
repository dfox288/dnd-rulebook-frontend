<!-- app/components/character/wizard/WizardContinueButton.vue -->
<script setup lang="ts">
interface Props {
  /** Button text. Defaults to 'Continue' */
  text?: string
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether to show loading spinner */
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  text: 'Continue',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    data-testid="wizard-continue-container"
    class="flex justify-center pt-4"
  >
    <UButton
      data-testid="continue-btn"
      size="lg"
      :disabled="disabled"
      :loading="loading"
      @click="emit('click')"
    >
      {{ text }}
    </UButton>
  </div>
</template>
