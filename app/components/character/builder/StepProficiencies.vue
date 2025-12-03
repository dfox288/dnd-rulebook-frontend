<!-- app/components/character/builder/StepProficiencies.vue -->
<script setup lang="ts">
const store = useCharacterBuilderStore()
const { characterId, proficiencyChoices, pendingProficiencySelections, allProficiencyChoicesComplete, isLoading, selectedClass, selectedRace, selectedBackground } = storeToRefs(store)

// Fetch saved proficiencies to show already-selected skills
const { apiFetch } = useApi()

interface SavedProficiency {
  id: number
  source: string
  choice_group?: string
  skill?: { id: number, name: string, slug: string }
}

const { data: savedProficiencies } = await useAsyncData(
  `step-proficiencies-saved-${characterId.value}`,
  () => apiFetch<{ data: SavedProficiency[] }>(`/characters/${characterId.value}/proficiencies`),
  { transform: (response: { data: SavedProficiency[] }) => response.data }
)

// Check if this is an edit (choices already made)
const isEditing = computed(() => {
  if (!proficiencyChoices.value) return false
  const { class: cls, race, background } = proficiencyChoices.value.data

  // If any group has remaining < quantity, choices were made
  for (const group of Object.values(cls)) {
    if (group.remaining < group.quantity) return true
  }
  for (const group of Object.values(race)) {
    if (group.remaining < group.quantity) return true
  }
  for (const group of Object.values(background)) {
    if (group.remaining < group.quantity) return true
  }
  return false
})

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
      options: Array<{ type: string, skill_id: number, skill: { id: number, name: string, slug: string } }>
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
        options: group.options
      }))
    })
  }

  return sources
})

// Get selected count for a choice group
function getSelectedCount(source: string, groupName: string): number {
  const key = `${source}:${groupName}`
  return pendingProficiencySelections.value.get(key)?.size ?? 0
}

// Check if a skill is selected
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

// Get saved skill names for a specific choice group (for displaying already-selected skills)
function getSavedSkillsForGroup(source: string, groupName: string): string[] {
  if (!savedProficiencies.value) return []

  return savedProficiencies.value
    .filter(p => p.source === source && p.choice_group === groupName && p.skill)
    .map(p => p.skill!.name)
}

/**
 * Continue to next step - saves proficiency choices first
 */
async function handleContinue() {
  await store.saveProficiencyChoices()
  store.nextStep()
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
              Choose {{ group.quantity }} skill{{ group.quantity > 1 ? 's' : '' }}:
            </span>
            <UBadge
              :color="getSelectedCount(sourceData.source, group.groupName) === group.quantity || group.remaining === 0 ? 'success' : 'neutral'"
              size="md"
            >
              <template v-if="group.remaining === 0 && getSelectedCount(sourceData.source, group.groupName) === 0">
                ✓ Already selected
              </template>
              <template v-else>
                {{ getSelectedCount(sourceData.source, group.groupName) }}/{{ group.quantity }} selected
              </template>
            </UBadge>
          </div>

          <!-- Already selected message (when editing and no options available) -->
          <div
            v-if="group.remaining === 0 && group.options.length === 0"
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <p class="font-medium text-green-800 dark:text-green-200">
                  Skills already selected
                </p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <UBadge
                    v-for="skill in getSavedSkillsForGroup(sourceData.source, group.groupName)"
                    :key="skill"
                    color="primary"
                    variant="subtle"
                    size="md"
                  >
                    {{ skill }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Skill options grid (when options available) -->
          <div
            v-else
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            <button
              v-for="option in group.options"
              :key="option.skill_id"
              type="button"
              class="skill-option p-3 rounded-lg border text-left transition-all"
              :class="{
                'border-primary bg-primary/10': isSkillSelected(sourceData.source, group.groupName, option.skill_id),
                'border-gray-200 dark:border-gray-700 hover:border-primary/50': !isSkillSelected(sourceData.source, group.groupName, option.skill_id)
              }"
              @click="handleSkillToggle(sourceData.source, group.groupName, option.skill_id, group.quantity)"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  :name="isSkillSelected(sourceData.source, group.groupName, option.skill_id) ? 'i-heroicons-check-circle-solid' : 'i-heroicons-circle'"
                  class="w-5 h-5"
                  :class="{
                    'text-primary': isSkillSelected(sourceData.source, group.groupName, option.skill_id),
                    'text-gray-400': !isSkillSelected(sourceData.source, group.groupName, option.skill_id)
                  }"
                />
                <span class="font-medium">{{ option.skill.name }}</span>
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
