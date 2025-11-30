<script setup lang="ts">
interface ItemProperty {
  name: string
  code: string
  description?: string | null
}

interface Props {
  damageDice: string | null
  versatileDamage: string | null
  damageType: { name: string } | null
  rangeNormal: number | null
  rangeLong: number | null
  weight: string | null
  properties: ItemProperty[]
}

const props = defineProps<Props>()

// Compute damage display text
const damageText = computed(() => {
  if (!props.damageDice) return null

  let text = props.damageDice

  // Add versatile damage in parentheses if present
  if (props.versatileDamage) {
    text += ` (${props.versatileDamage} 2H)`
  }

  return text
})

// Compute range display text
const rangeText = computed(() => {
  if (props.rangeNormal !== null && props.rangeLong !== null) {
    return `${props.rangeNormal}/${props.rangeLong} ft.`
  }
  return 'Melee'
})

// Compute weight display text
const weightText = computed(() => {
  if (props.weight === null) return null
  return `${props.weight} lb`
})
</script>

<template>
  <div class="space-y-4">
    <!-- Weapon Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Damage -->
      <div
        v-if="damageText"
        class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div
          class="text-2xl mb-1"
          aria-hidden="true"
        >
          ⚔️
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Damage
        </div>
        <div class="text-sm font-semibold text-center">
          {{ damageText }}
        </div>
      </div>

      <!-- Damage Type -->
      <div
        v-if="damageType"
        class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div
          class="text-2xl mb-1"
          aria-hidden="true"
        >
          💥
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Type
        </div>
        <div class="text-sm font-semibold text-center">
          {{ damageType.name }}
        </div>
      </div>

      <!-- Range -->
      <div class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div
          class="text-2xl mb-1"
          aria-hidden="true"
        >
          📏
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Range
        </div>
        <div class="text-sm font-semibold text-center">
          {{ rangeText }}
        </div>
      </div>

      <!-- Weight -->
      <div
        v-if="weightText"
        class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div
          class="text-2xl mb-1"
          aria-hidden="true"
        >
          ⚖️
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Weight
        </div>
        <div class="text-sm font-semibold text-center">
          {{ weightText }}
        </div>
      </div>
    </div>

    <!-- Properties -->
    <div
      v-if="properties.length > 0"
      class="flex flex-wrap gap-2"
    >
      <UBadge
        v-for="property in properties"
        :key="property.code"
        color="item"
        variant="subtle"
        size="md"
      >
        {{ property.name }}
      </UBadge>
    </div>
  </div>
</template>
