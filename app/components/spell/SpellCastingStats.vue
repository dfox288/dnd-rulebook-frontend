<script setup lang="ts">
interface Props {
  castingTime: string
  castingTimeType: string
  range: string
  duration: string
  areaOfEffect: { type: string, size: number } | null
  components: string
  requiresVerbal: boolean
  requiresSomatic: boolean
  requiresMaterial: boolean
  materialComponents: string | null
  materialCostGp: number | null
  materialConsumed: boolean | null
}

const props = defineProps<Props>()

// Format area of effect text
const areaOfEffectText = computed(() => {
  if (!props.areaOfEffect) return null
  const { size, type } = props.areaOfEffect
  return `${size} ft. ${type.charAt(0).toUpperCase()}${type.slice(1)}`
})

// Check if material cost is high (>= 100gp)
const isCostlyMaterial = computed(() => {
  return props.materialCostGp !== null && props.materialCostGp >= 100
})

// Build material component display text
const materialText = computed(() => {
  if (!props.materialComponents) return null

  let text = props.materialComponents

  // Add cost and consumed status if present
  const details = []
  if (props.materialCostGp !== null) {
    details.push(`${props.materialCostGp} gp`)
  }
  if (props.materialConsumed === true) {
    details.push('consumed')
  }

  if (details.length > 0) {
    text += ` (${details.join(', ')})`
  }

  return text
})
</script>

<template>
  <div class="space-y-4">
    <!-- Stats Grid: 4-column on desktop, 2x2 on mobile -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Casting Time -->
      <div class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div
          class="text-2xl mb-1"
          aria-hidden="true"
        >
          ⏱️
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Casting Time
        </div>
        <div class="text-sm font-semibold text-center">
          {{ castingTime }}
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
          {{ range }}
        </div>
      </div>

      <!-- Duration -->
      <div class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div
          class="text-2xl mb-1"
          aria-hidden="true"
        >
          ⏳
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Duration
        </div>
        <div class="text-sm font-semibold text-center">
          {{ duration }}
        </div>
      </div>

      <!-- Area of Effect -->
      <div
        v-if="areaOfEffectText"
        class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div
          class="text-2xl mb-1"
          aria-hidden="true"
        >
          📐
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Area
        </div>
        <div class="text-sm font-semibold text-center">
          {{ areaOfEffectText }}
        </div>
      </div>
    </div>

    <!-- Components Row -->
    <div class="space-y-2">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-sm text-gray-600 dark:text-gray-400">Components:</span>

        <!-- Verbal -->
        <span
          v-if="requiresVerbal"
          class="flex items-center gap-1 text-sm"
        >
          <span
            class="text-lg"
            aria-hidden="true"
          >🗣️</span>
          <span class="font-semibold">V</span>
        </span>

        <!-- Somatic -->
        <span
          v-if="requiresSomatic"
          class="flex items-center gap-1 text-sm"
        >
          <span
            class="text-lg"
            aria-hidden="true"
          >👋</span>
          <span class="font-semibold">S</span>
        </span>

        <!-- Material -->
        <span
          v-if="requiresMaterial"
          class="flex items-center gap-1 text-sm"
        >
          <span
            class="text-lg"
            aria-hidden="true"
          >💎</span>
          <span class="font-semibold">M</span>
        </span>
      </div>

      <!-- Material Components Details -->
      <div
        v-if="requiresMaterial && materialText"
        class="pl-4 text-sm"
        :class="isCostlyMaterial ? 'text-warning-600 dark:text-warning-400 font-semibold' : 'text-gray-700 dark:text-gray-300'"
      >
        <span
          v-if="isCostlyMaterial"
          class="mr-1"
          aria-hidden="true"
        >⚠️</span>
        <span class="font-medium text-xs text-gray-500 dark:text-gray-400">Materials:</span>
        {{ materialText }}
      </div>
    </div>
  </div>
</template>
