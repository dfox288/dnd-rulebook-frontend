<!-- app/components/character/builder/SpellDetailModal.vue -->
<script setup lang="ts">
import type { Spell } from '~/types'

interface Props {
  spell: Spell | null
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Use local ref for v-model binding (matches other detail modal patterns)
const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) emit('close')
  }
})

/**
 * Format spell level text
 */
const levelText = computed(() => {
  if (!props.spell) return ''
  if (props.spell.level === 0) return 'Cantrip'
  const suffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
  return `${props.spell.level}${suffix[props.spell.level]} Level`
})

/**
 * Format components as string
 */
const componentsText = computed(() => {
  if (!props.spell) return ''
  const parts = []
  if (props.spell.needs_verbal_component) parts.push('V')
  if (props.spell.needs_somatic_component) parts.push('S')
  if (props.spell.needs_material_component) parts.push('M')
  return parts.join(', ')
})

function handleClose() {
  emit('close')
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="spell?.name ?? 'Spell Details'"
  >
    <template #body>
      <div
        v-if="spell"
        class="space-y-4"
      >
        <!-- Level and School Badge -->
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge
            color="spell"
            variant="subtle"
            size="md"
          >
            {{ levelText }}
          </UBadge>
          <UBadge
            v-if="spell.school"
            color="neutral"
            variant="subtle"
            size="md"
          >
            {{ spell.school.name }}
          </UBadge>
          <UBadge
            v-if="spell.needs_concentration"
            color="warning"
            variant="subtle"
            size="md"
          >
            Concentration
          </UBadge>
          <UBadge
            v-if="spell.is_ritual"
            color="info"
            variant="subtle"
            size="md"
          >
            Ritual
          </UBadge>
        </div>

        <!-- Casting Stats Grid -->
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="font-semibold text-gray-900 dark:text-gray-100">Casting Time:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ spell.casting_time }}</span>
          </div>
          <div>
            <span class="font-semibold text-gray-900 dark:text-gray-100">Range:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ spell.range }}</span>
          </div>
          <div>
            <span class="font-semibold text-gray-900 dark:text-gray-100">Components:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ componentsText }}</span>
          </div>
          <div>
            <span class="font-semibold text-gray-900 dark:text-gray-100">Duration:</span>
            <span class="ml-1 text-gray-600 dark:text-gray-400">{{ spell.duration }}</span>
          </div>
        </div>

        <!-- Material Component Detail -->
        <div
          v-if="spell.needs_material_component && spell.material_component"
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm"
        >
          <span class="font-semibold text-gray-900 dark:text-gray-100">Materials:</span>
          <span class="ml-1 text-gray-600 dark:text-gray-400">{{ spell.material_component }}</span>
        </div>

        <!-- Description -->
        <div
          v-if="spell.description"
          class="prose prose-sm dark:prose-invert max-w-none"
        >
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {{ spell.description }}
          </p>
        </div>

        <!-- Higher Levels -->
        <div
          v-if="spell.higher_level"
          class="bg-spell-50 dark:bg-spell-900/20 rounded-lg p-3"
        >
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            At Higher Levels
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ spell.higher_level }}
          </p>
        </div>
      </div>
    </template>
  </UModal>
</template>
