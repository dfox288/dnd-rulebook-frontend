<!-- app/components/character/builder/StepSubrace.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Race } from '~/types'
import { useCharacterBuilderStore } from '~/stores/characterBuilder'
import { useWizardNavigation } from '~/composables/useWizardSteps'

const store = useCharacterBuilderStore()
const { selectedBaseRace, selectedRace, subraceId, isLoading, error } = storeToRefs(store)
const { nextStep } = useWizardNavigation()

// API client for fetching full subrace details
const { apiFetch } = useApi()

// Type for subrace items from the subraces array (partial Race data)
type SubraceItem = NonNullable<Race['subraces']>[number]

// Local state for selected subrace
const localSelectedSubrace = ref<SubraceItem | null>(null)

// Modal state
const detailModalOpen = ref(false)
const detailSubrace = ref<Race | null>(null)
const loadingDetail = ref(false)

// Get subraces directly from the selected base race
// The selectedBaseRace already has the full subraces array from the detail endpoint
const availableSubraces = computed(() => {
  if (!selectedBaseRace.value?.subraces) return []
  return selectedBaseRace.value.subraces
})

// Validation: can proceed if subrace is selected
const canProceed = computed(() => {
  return localSelectedSubrace.value !== null
})

/**
 * Handle subrace selection
 */
function handleSubraceSelect(subrace: SubraceItem) {
  localSelectedSubrace.value = subrace
}

/**
 * Open detail modal - fetch full subrace data for complete info
 */
async function handleViewDetails(subrace: SubraceItem) {
  loadingDetail.value = true
  detailModalOpen.value = true

  try {
    // Fetch full subrace detail to get all traits, modifiers, etc.
    const response = await apiFetch<{ data: Race }>(`/races/${subrace.slug}`)
    detailSubrace.value = response.data
  } catch (err) {
    console.error('Failed to fetch subrace details:', err)
    // Still show modal with partial data from the list
    // Use unknown intermediate cast since SubraceItem is a partial Race
    detailSubrace.value = subrace as unknown as Race
  } finally {
    loadingDetail.value = false
  }
}

/**
 * Close detail modal
 */
function handleCloseModal() {
  detailModalOpen.value = false
  detailSubrace.value = null
}

/**
 * Confirm selection and save to store
 * Needs to fetch full race detail before saving since subraces array only has partial data
 */
async function confirmSelection() {
  if (!localSelectedSubrace.value) return

  try {
    // Fetch full subrace detail before saving (the subraces array only has partial data)
    const fullSubrace = await apiFetch<{ data: Race }>(`/races/${localSelectedSubrace.value.slug}`)
    await store.selectSubrace(fullSubrace.data)
    nextStep()
  } catch (err) {
    console.error('Failed to save subrace:', err)
  }
}

// Initialize from store if already selected (editing existing selection)
onMounted(() => {
  if (subraceId.value && selectedRace.value?.parent_race) {
    // Find the matching subrace in availableSubraces to set local state
    const existingSubrace = availableSubraces.value.find(s => s.id === subraceId.value)
    if (existingSubrace) {
      localSelectedSubrace.value = existingSubrace
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Choose Your Subrace
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ selectedBaseRace?.name }} has multiple subraces to choose from
      </p>
    </div>

    <!-- Error State -->
    <UAlert
      v-if="error"
      color="error"
      icon="i-heroicons-exclamation-circle"
      :title="error"
    />

    <!-- Subrace Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <CharacterBuilderSubracePickerCard
        v-for="subrace in availableSubraces"
        :key="subrace.id"
        :subrace="subrace"
        :selected="localSelectedSubrace?.id === subrace.id"
        :parent-race-slug="selectedBaseRace?.slug"
        @select="handleSubraceSelect"
        @view-details="handleViewDetails(subrace)"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="availableSubraces.length === 0"
      class="text-center py-12"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-12 h-12 text-amber-400 mx-auto mb-4"
      />
      <p class="text-gray-600 dark:text-gray-400">
        No subraces found for {{ selectedBaseRace?.name }}
      </p>
    </div>

    <!-- Confirm Button -->
    <div class="flex justify-center pt-4">
      <UButton
        size="lg"
        :disabled="!canProceed || isLoading"
        :loading="isLoading"
        @click="confirmSelection"
      >
        {{ isLoading ? 'Saving...' : 'Continue with ' + (localSelectedSubrace?.name || 'Selection') }}
      </UButton>
    </div>

    <!-- Detail Modal -->
    <CharacterBuilderSubraceDetailModal
      :subrace="detailSubrace"
      :open="detailModalOpen"
      :parent-race="selectedBaseRace"
      @close="handleCloseModal"
    />
  </div>
</template>
