<!-- app/components/character/wizard/WizardEmptyState.vue -->
<script setup lang="ts">
interface Props {
  /** The icon name to display */
  icon: string
  /** The main title/message text */
  title: string
  /** Optional description text */
  description?: string
  /** Icon color variant. Defaults to 'gray' */
  iconColor?: 'gray' | 'success'
  /** Text variant. 'prominent' uses larger text */
  variant?: 'default' | 'prominent'
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'gray',
  variant: 'default'
})

const iconColorClass = computed(() => {
  switch (props.iconColor) {
    case 'success':
      return 'text-success'
    default:
      return 'text-gray-400'
  }
})

const titleClass = computed(() => {
  const base = 'text-gray-600 dark:text-gray-400'
  return props.variant === 'prominent' ? `${base} text-lg` : base
})
</script>

<template>
  <div
    data-testid="wizard-empty-state"
    class="text-center py-12"
  >
    <UIcon
      data-testid="wizard-empty-state-icon"
      :name="icon"
      class="w-12 h-12 mx-auto mb-4"
      :class="iconColorClass"
    />
    <p
      data-testid="wizard-empty-state-title"
      :class="titleClass"
    >
      {{ title }}
    </p>
    <p
      v-if="description"
      data-testid="wizard-empty-state-description"
      class="text-gray-600 dark:text-gray-400"
    >
      {{ description }}
    </p>
  </div>
</template>
