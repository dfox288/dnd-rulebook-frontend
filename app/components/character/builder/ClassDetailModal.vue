<!-- app/components/character/builder/ClassDetailModal.vue -->
<script setup lang="ts">
import type { CharacterClass } from '~/types'

interface Props {
  characterClass: CharacterClass | null
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Use local ref for v-model binding (matches RaceDetailModal pattern)
const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) emit('close')
  }
})

/**
 * Check if class is a spellcaster
 */
const isCaster = computed(() => {
  return props.characterClass?.spellcasting_ability !== null
    && props.characterClass?.spellcasting_ability !== undefined
})

/**
 * Format hit die
 */
const hitDieText = computed(() => {
  return `d${props.characterClass?.hit_die}`
})

function handleClose() {
  emit('close')
}
</script>

<template>
  <UModal v-if="open" v-model="isOpen">
    <div class="flex items-center justify-between w-full mb-4">
      <h2 class="text-xl font-bold">
        {{ characterClass?.name }}
      </h2>
      <UButton
        data-testid="close-btn"
        variant="ghost"
        icon="i-heroicons-x-mark"
        @click="handleClose"
      />
    </div>

    <div
      v-if="characterClass"
      class="space-y-6"
    >
      <!-- Description -->
      <p
        v-if="characterClass.description"
        class="text-gray-700 dark:text-gray-300"
      >
        {{ characterClass.description }}
      </p>

      <!-- Basic Info -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Hit Die
          </h4>
          <p class="text-gray-600 dark:text-gray-400">
            {{ hitDieText }}
          </p>
        </div>
        <div v-if="characterClass.primary_ability">
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Primary Ability
          </h4>
          <p class="text-gray-600 dark:text-gray-400">
            {{ characterClass.primary_ability }}
          </p>
        </div>
      </div>

      <!-- Saving Throws -->
      <div v-if="characterClass.saving_throws && characterClass.saving_throws.length > 0">
        <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Saving Throw Proficiencies
        </h4>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="save in characterClass.saving_throws"
            :key="save.id"
            color="class"
            variant="subtle"
            size="md"
          >
            {{ save.name }}
          </UBadge>
        </div>
      </div>

      <!-- Spellcasting -->
      <div v-if="isCaster">
        <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Spellcasting
        </h4>
        <div class="bg-spell-50 dark:bg-spell-900/20 rounded-lg p-3">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-sparkles"
              class="w-5 h-5 text-spell-500"
            />
            <span class="text-gray-700 dark:text-gray-300">
              Spellcasting Ability: <strong>{{ characterClass.spellcasting_ability?.name }}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>
