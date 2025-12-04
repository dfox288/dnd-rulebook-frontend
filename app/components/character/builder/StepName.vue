<!-- app/components/character/builder/StepName.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCharacterBuilderStore } from '~/stores/characterBuilder'
import { useWizardNavigation } from '~/composables/useWizardSteps'
import type { CharacterAlignment } from '~/types/character'
import type { Alignment } from '~/types'

/**
 * Step 1: Name Your Character
 *
 * Name input and alignment selector with validation.
 * Creates a draft character on the API when user proceeds.
 */

const store = useCharacterBuilderStore()
const { name, alignment, isLoading, characterId } = storeToRefs(store)
const { nextStep } = useWizardNavigation()
const { apiFetch } = useApi()

// Valid character alignments (as defined in the API schema)
const VALID_CHARACTER_ALIGNMENTS: CharacterAlignment[] = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
  'Unaligned'
]

// Fetch alignments from API and filter to valid character alignments
const { data: alignmentsData } = await useAsyncData('alignments', () =>
  apiFetch<{ data: Alignment[] }>('/alignments')
)

// Build select options from API data, filtering to valid character alignments
const alignmentOptions = computed(() => {
  const options: { label: string, value: CharacterAlignment | null }[] = [
    { label: 'Select alignment (optional)', value: null }
  ]

  if (alignmentsData.value?.data) {
    // Filter and map API alignments to valid character alignments
    for (const apiAlignment of alignmentsData.value.data) {
      // Check if this alignment matches a valid character alignment (case-insensitive)
      const match = VALID_CHARACTER_ALIGNMENTS.find(
        valid => valid.toLowerCase() === apiAlignment.name.toLowerCase()
          || (apiAlignment.name === 'Neutral' && valid === 'True Neutral')
      )
      if (match) {
        options.push({ label: match, value: match })
      }
    }
  }

  // Ensure we have all alignments even if API doesn't return them
  // (fallback to static list if API returns fewer than expected)
  if (options.length < 11) {
    return [
      { label: 'Select alignment (optional)', value: null },
      ...VALID_CHARACTER_ALIGNMENTS.map(a => ({ label: a, value: a }))
    ]
  }

  return options
})

// Validation
const isValid = computed(() => name.value.trim().length > 0)
const errorMessage = ref<string | null>(null)

// Create character and proceed
async function handleCreate() {
  if (!isValid.value) return

  errorMessage.value = null

  try {
    await store.createDraft(name.value.trim())
    nextStep()
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to create character'
  }
}

// Update existing character name and proceed
async function handleUpdate() {
  if (!isValid.value) return

  errorMessage.value = null

  try {
    await store.updateName(name.value.trim())
    nextStep()
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to update name'
  }
}

// Route to create or update based on edit mode
function handleNext() {
  if (characterId.value) {
    handleUpdate()
  } else {
    handleCreate()
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Name Your Character
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        What shall this hero be called?
      </p>
    </div>

    <!-- Name and Alignment Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Name Input -->
      <UFormField
        label="Character Name"
        :error="errorMessage ?? undefined"
        required
      >
        <UInput
          v-model="name"
          type="text"
          placeholder="Enter a name..."
          size="xl"
          autofocus
          :disabled="isLoading"
          @keyup.enter="handleNext"
        />
      </UFormField>

      <!-- Alignment Select -->
      <UFormField label="Alignment">
        <USelect
          v-model="alignment"
          :items="alignmentOptions"
          value-key="value"
          size="xl"
          :disabled="isLoading"
          data-testid="alignment-select"
        />
      </UFormField>
    </div>

    <!-- Helper Text -->
    <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
      Choose a name that fits your character's personality and background.
      You can always change it later.
    </p>

    <!-- Create Button -->
    <div class="flex justify-center">
      <UButton
        size="lg"
        :disabled="!isValid"
        :loading="isLoading"
        @click="handleNext"
      >
        <template v-if="characterId">
          Continue
        </template>
        <template v-else>
          Begin Your Journey
        </template>
      </UButton>
    </div>
  </div>
</template>
