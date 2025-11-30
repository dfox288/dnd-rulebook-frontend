<script setup lang="ts">
import { computed } from 'vue'

interface SkillWithAbility {
  name: string
  abilityCode: string | null
}

interface Props {
  skills: SkillWithAbility[]
  languageDisplay: string
  toolProficiencies: string[]
  startingGold: number | null
  equipmentCount: number
}

interface Stat {
  icon: string
  label: string
  value: string
}

const props = defineProps<Props>()

/**
 * Build stats array for the quick stats card
 * Only includes stats that have values
 */
const stats = computed<Stat[]>(() => {
  const result: Stat[] = []

  // Skills stat
  if (props.skills.length > 0) {
    const skillDisplay = props.skills
      .map((skill) => {
        if (skill.abilityCode) {
          return `${skill.name} (${skill.abilityCode})`
        }
        return skill.name
      })
      .join(', ')

    result.push({
      icon: 'i-heroicons-academic-cap',
      label: 'Skills',
      value: skillDisplay
    })
  }

  // Languages stat
  if (props.languageDisplay) {
    result.push({
      icon: 'i-heroicons-language',
      label: 'Languages',
      value: props.languageDisplay
    })
  }

  // Tool Proficiencies stat
  if (props.toolProficiencies.length > 0) {
    result.push({
      icon: 'i-heroicons-wrench',
      label: 'Tool Proficiencies',
      value: props.toolProficiencies.join(', ')
    })
  }

  // Starting Equipment count stat
  if (props.equipmentCount > 0) {
    result.push({
      icon: 'i-heroicons-cube',
      label: 'Starting Items',
      value: `${props.equipmentCount} item${props.equipmentCount !== 1 ? 's' : ''}`
    })
  }

  // Starting Gold stat
  if (props.startingGold !== null && props.startingGold > 0) {
    result.push({
      icon: 'i-heroicons-banknotes',
      label: 'Starting Gold',
      value: `${props.startingGold} gp`
    })
  }

  return result
})
</script>

<template>
  <UCard v-if="stats.length > 0">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="flex items-start gap-3"
      >
        <UIcon
          :name="stat.icon"
          class="w-5 h-5 text-gray-400 mt-1 flex-shrink-0"
        />
        <div>
          <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
            {{ stat.label }}
          </div>
          <div class="text-lg text-gray-900 dark:text-gray-100">
            {{ stat.value }}
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
