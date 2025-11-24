<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CharacterClass } from '~/types'

definePageMeta({
  title: 'Spell List Generator - D&D 5e Compendium',
  description: 'Create and manage your spell list for any D&D 5e spellcasting class'
})

useSeoMeta({
  title: 'Spell List Generator - D&D 5e Compendium',
  description: 'Create and manage your spell list for any D&D 5e spellcasting class'
})

const { apiFetch } = useApi()

// Fetch spellcasting classes
const { data: classes, loading: classesLoading } = await useAsyncData<CharacterClass[]>(
  'spellcasting-classes',
  async () => {
    const response = await apiFetch<{ data: CharacterClass[] }>('/classes?per_page=100')
    // Filter to only spellcasting classes
    return response.data.filter(c => c.is_spellcaster === '1')
  }
)

// Use spell list generator composable
const {
  selectedClass,
  characterLevel,
  spellSlots,
  maxSpells,
  setClassData
} = useSpellListGenerator()

// Class dropdown options
const classOptions = computed(() => {
  if (!classes.value) return []
  return classes.value.map(c => ({
    label: c.name,
    value: c.slug,
    class: c
  }))
})

// Level dropdown options
const levelOptions = Array.from({ length: 20 }, (_, i) => ({
  label: `Level ${i + 1}`,
  value: i + 1
}))

// Selected class option (for USelectMenu v-model)
const selectedClassOption = ref<{ label: string; value: string; class: CharacterClass } | null>(null)

// Watch for class selection
watch(selectedClassOption, (option) => {
  if (option) {
    setClassData(option.class)
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">🪄 Spell List Generator</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Choose spells for your character based on class and level.
          </p>
        </div>
      </div>
    </div>

    <!-- Character Setup -->
    <div class="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold mb-4">Character Setup</h2>

      <div class="flex flex-wrap gap-4 mb-6">
        <!-- Class Dropdown -->
        <div class="w-64">
          <label class="block text-sm font-medium mb-2">Class</label>
          <USelectMenu
            v-model="selectedClassOption"
            :items="classOptions"
            value-key="value"
            placeholder="Select class"
            :loading="classesLoading"
          />
        </div>

        <!-- Level Dropdown -->
        <div class="w-32">
          <label class="block text-sm font-medium mb-2">Level</label>
          <USelectMenu
            v-model="characterLevel"
            :items="levelOptions"
            value-key="value"
            placeholder="Level"
          />
        </div>
      </div>

      <!-- Spell Info Display (show when class selected) -->
      <div v-if="selectedClass" class="space-y-2">
        <div class="flex items-center gap-4 text-sm">
          <span class="font-medium">📊 Spell Slots:</span>
          <span>Cantrips: {{ spellSlots.cantrips }}</span>
          <span v-if="spellSlots['1st']">1st: {{ spellSlots['1st'] }}</span>
          <span v-if="spellSlots['2nd']">2nd: {{ spellSlots['2nd'] }}</span>
          <span v-if="spellSlots['3rd']">3rd: {{ spellSlots['3rd'] }}</span>
          <span v-if="spellSlots['4th']">4th: {{ spellSlots['4th'] }}</span>
          <span v-if="spellSlots['5th']">5th: {{ spellSlots['5th'] }}</span>
        </div>
        <div class="text-sm">
          <span class="font-medium">📝 Spells to Prepare:</span>
          {{ maxSpells }} ({{ characterLevel }} + 3 modifier)
        </div>
      </div>
    </div>

    <!-- TODO: Spell selection section -->
    <!-- TODO: Summary sidebar -->
  </div>
</template>
