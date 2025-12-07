<!-- app/components/character/wizard/review/CharacterIdentity.vue -->
<script setup lang="ts">
/**
 * Character identity header - displays name and race/class/background
 */

defineProps<{
  characterName: string
  race: string
  characterClass: string
  background: string
}>()
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
      {{ characterName }}
    </h1>
    <p class="text-gray-600 dark:text-gray-400 mt-1">
      {{ race }} · {{ characterClass }} · {{ background }}
    </p>
  </div>
</template>
