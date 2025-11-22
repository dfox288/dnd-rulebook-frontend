<script setup lang="ts">
import type { components } from '~/types/api/generated'

// ItemAbilityResource has name: string | null and description: string | null
type ItemAbilityResource = components['schemas']['ItemAbilityResource']

interface Props {
  abilities: ItemAbilityResource[]
  backgroundColor?: string
}

withDefaults(defineProps<Props>(), {
  backgroundColor: 'bg-primary-50 dark:bg-primary-900/20'
})
</script>

<template>
  <div class="p-4 space-y-4">
    <div
      v-for="ability in abilities"
      :key="ability.id"
      class="p-4 rounded-lg"
      :class="backgroundColor"
    >
      <div
        v-if="ability.name"
        class="font-semibold text-gray-900 dark:text-gray-100 mb-2"
      >
        {{ ability.name }}
      </div>
      <div
        v-if="ability.description"
        class="text-gray-700 dark:text-gray-300 whitespace-pre-line"
      >
        {{ ability.description }}
      </div>
    </div>
  </div>
</template>
