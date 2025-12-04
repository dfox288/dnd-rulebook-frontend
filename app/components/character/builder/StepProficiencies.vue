<!-- app/components/character/builder/StepProficiencies.vue -->
<script setup lang="ts">
import type { ProficiencyOption, ProficiencyTypeOption } from '~/types/proficiencies'
import { useWizardNavigation } from '~/composables/useWizardSteps'

const store = useCharacterBuilderStore()
const { proficiencyChoices, pendingProficiencySelections, allProficiencyChoicesComplete, isLoading, selectedClass, selectedRace, selectedBackground } = storeToRefs(store)
const { nextStep } = useWizardNavigation()

const hasAnyChoices = computed(() => {
  if (!proficiencyChoices.value) return false
  const { class: cls, race, background } = proficiencyChoices.value.data
  return Object.keys(cls).length > 0
    || Object.keys(race).length > 0
    || Object.keys(background).length > 0
})

// Organize choices by source for display
const choicesBySource = computed(() => {
  if (!proficiencyChoices.value) return []

  const sources: Array<{
    source: 'class' | 'race' | 'background'
    label: string
    entityName: string
    groups: Array<{
      groupName: string
      quantity: number
      remaining: number
      selectedSkills: number[]
      selectedProficiencyTypes: number[]
      options: ProficiencyOption[]
    }>
  }> = []

  const { class: cls, race, background } = proficiencyChoices.value.data

  if (Object.keys(cls).length > 0) {
    sources.push({
      source: 'class',
      label: 'From Class',
      entityName: selectedClass.value?.name ?? 'Unknown',
      groups: Object.entries(cls).map(([groupName, group]) => ({
        groupName,
        quantity: group.quantity,
        remaining: group.remaining,
        selectedSkills: group.selected_skills ?? [],
        selectedProficiencyTypes: group.selected_proficiency_types ?? [],
        options: group.options
      }))
    })
  }

  if (Object.keys(race).length > 0) {
    sources.push({
      source: 'race',
      label: 'From Race',
      entityName: selectedRace.value?.name ?? 'Unknown',
      groups: Object.entries(race).map(([groupName, group]) => ({
        groupName,
        quantity: group.quantity,
        remaining: group.remaining,
        selectedSkills: group.selected_skills ?? [],
        selectedProficiencyTypes: group.selected_proficiency_types ?? [],
        options: group.options
      }))
    })
  }

  if (Object.keys(background).length > 0) {
    sources.push({
      source: 'background',
      label: 'From Background',
      entityName: selectedBackground.value?.name ?? 'Unknown',
      groups: Object.entries(background).map(([groupName, group]) => ({
        groupName,
        quantity: group.quantity,
        remaining: group.remaining,
        selectedSkills: group.selected_skills ?? [],
        selectedProficiencyTypes: group.selected_proficiency_types ?? [],
        options: group.options
      }))
    })
  }

  return sources
})

/**
 * Initialize pending selections from API's selected_skills/selected_proficiency_types
 * This pre-populates the selections when editing an existing character
 */
function initializePendingSelections() {
  if (!proficiencyChoices.value) return

  const { class: cls, race, background } = proficiencyChoices.value.data

  // Helper to initialize a source's selections
  const initSource = (source: 'class' | 'race' | 'background', groups: typeof cls) => {
    for (const [groupName, group] of Object.entries(groups)) {
      const key = `${source}:${groupName}`

      // Only initialize if not already in pending selections
      if (!pendingProficiencySelections.value.has(key)) {
        const selectedIds = new Set<number>()

        // Add previously selected skills
        for (const skillId of group.selected_skills ?? []) {
          selectedIds.add(skillId)
        }

        // Note: proficiency_type selections would need separate tracking
        // For now, we focus on skills which are the most common

        if (selectedIds.size > 0) {
          store.initializeProficiencySelections(source, groupName, selectedIds)
        }
      }
    }
  }

  initSource('class', cls)
  initSource('race', race)
  initSource('background', background)
}

// Initialize on mount
onMounted(() => {
  initializePendingSelections()
})

// Re-initialize if proficiencyChoices changes (e.g., after refetch)
watch(proficiencyChoices, () => {
  initializePendingSelections()
}, { immediate: false })

// Get selected count for a choice group
function getSelectedCount(source: string, groupName: string): number {
  const key = `${source}:${groupName}`
  return pendingProficiencySelections.value.get(key)?.size ?? 0
}

// Check if a skill is selected (either pending or from API)
function isSkillSelected(source: string, groupName: string, skillId: number): boolean {
  const key = `${source}:${groupName}`
  return pendingProficiencySelections.value.get(key)?.has(skillId) ?? false
}

// Handle skill toggle
function handleSkillToggle(source: 'class' | 'race' | 'background', groupName: string, skillId: number, quantity: number) {
  const key = `${source}:${groupName}`
  const current = pendingProficiencySelections.value.get(key)?.size ?? 0
  const isSelected = isSkillSelected(source, groupName, skillId)

  // Don't allow selecting more than quantity (unless deselecting)
  if (!isSelected && current >= quantity) return

  store.toggleProficiencySelection(source, groupName, skillId)
}

/**
 * Get display name for an option (handles both skill and proficiency_type)
 */
function getOptionName(option: ProficiencyOption): string {
  if (option.type === 'skill') {
    return option.skill.name
  } else {
    return option.proficiency_type.name
  }
}

/**
 * Get option ID for keying and selection
 */
function getOptionId(option: ProficiencyOption): number {
  if (option.type === 'skill') {
    return option.skill_id
  } else {
    return option.proficiency_type_id
  }
}

/**
 * Get the label for a choice group based on option types
 * Returns "skill", "proficiency", or the specific type name
 */
function getChoiceLabel(options: ProficiencyOption[], quantity: number): string {
  const firstOption = options[0]
  if (!firstOption) return `Choose ${quantity}`

  // Check if all options are the same type
  const firstType = firstOption.type
  const allSameType = options.every(opt => opt.type === firstType)

  if (allSameType && firstType === 'skill') {
    return `Choose ${quantity} skill${quantity > 1 ? 's' : ''}`
  }

  if (allSameType && firstType === 'proficiency_type') {
    // Try to get a more specific label from the proficiency type category
    const proficiencyOption = firstOption as ProficiencyTypeOption
    const name = proficiencyOption.proficiency_type.name

    // Check for common patterns to provide better labels
    if (name.toLowerCase().includes('tool')) {
      return `Choose ${quantity} tool${quantity > 1 ? 's' : ''}`
    }
    if (name.toLowerCase().includes('weapon')) {
      return `Choose ${quantity} weapon${quantity > 1 ? 's' : ''}`
    }
    if (name.toLowerCase().includes('armor')) {
      return `Choose ${quantity} armor type${quantity > 1 ? 's' : ''}`
    }
    if (name.toLowerCase().includes('language')) {
      return `Choose ${quantity} language${quantity > 1 ? 's' : ''}`
    }

    return `Choose ${quantity} proficienc${quantity > 1 ? 'ies' : 'y'}`
  }

  // Mixed types
  return `Choose ${quantity} option${quantity > 1 ? 's' : ''}`
}

/**
 * Continue to next step - saves proficiency choices first
 */
async function handleContinue() {
  await store.saveProficiencyChoices()
  nextStep()
}
</script>

<template>
  <div class="step-proficiencies">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-primary">
        Choose Your Proficiencies
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Your class, race, and background grant the following choices
      </p>
    </div>

    <!-- No choices needed -->
    <div
      v-if="!hasAnyChoices"
      class="text-center py-8"
    >
      <UIcon
        name="i-heroicons-check-circle"
        class="w-12 h-12 text-success mx-auto mb-4"
      />
      <p class="text-lg">
        No additional choices needed
      </p>
      <p class="text-gray-600 dark:text-gray-400">
        All your proficiencies have been automatically assigned
      </p>
    </div>

    <!-- Choice groups by source -->
    <div
      v-else
      class="space-y-8"
    >
      <div
        v-for="sourceData in choicesBySource"
        :key="sourceData.source"
        class="choice-source"
      >
        <!-- Source header -->
        <h3 class="text-lg font-semibold mb-4">
          {{ sourceData.label }}: {{ sourceData.entityName }}
        </h3>

        <!-- Choice groups within source -->
        <div
          v-for="group in sourceData.groups"
          :key="group.groupName"
          class="mb-6"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium">
              {{ getChoiceLabel(group.options, group.quantity) }}:
            </span>
            <UBadge
              :color="getSelectedCount(sourceData.source, group.groupName) === group.quantity ? 'success' : 'neutral'"
              size="md"
            >
              {{ getSelectedCount(sourceData.source, group.groupName) }}/{{ group.quantity }} selected
            </UBadge>
          </div>

          <!-- Skill options grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              v-for="option in group.options"
              :key="getOptionId(option)"
              type="button"
              class="skill-option p-3 rounded-lg border text-left transition-all"
              :class="{
                'border-primary bg-primary/10': isSkillSelected(sourceData.source, group.groupName, getOptionId(option)),
                'border-gray-200 dark:border-gray-700 hover:border-primary/50': !isSkillSelected(sourceData.source, group.groupName, getOptionId(option))
              }"
              @click="handleSkillToggle(sourceData.source, group.groupName, getOptionId(option), group.quantity)"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  :name="isSkillSelected(sourceData.source, group.groupName, getOptionId(option)) ? 'i-heroicons-check-circle-solid' : 'i-heroicons-circle'"
                  class="w-5 h-5"
                  :class="{
                    'text-primary': isSkillSelected(sourceData.source, group.groupName, getOptionId(option)),
                    'text-gray-400': !isSkillSelected(sourceData.source, group.groupName, getOptionId(option))
                  }"
                />
                <span class="font-medium">{{ getOptionName(option) }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Continue Button -->
    <div class="flex justify-center pt-6">
      <UButton
        data-test="continue-btn"
        size="lg"
        :disabled="!allProficiencyChoicesComplete || isLoading"
        :loading="isLoading"
        @click="handleContinue"
      >
        Continue with Proficiencies
      </UButton>
    </div>
  </div>
</template>
