<!-- app/components/character/sheet/Conditions.vue -->
<script setup lang="ts">
/**
 * Active Conditions Display
 *
 * Displays a prominent alert banner when the character has active conditions.
 * When editable=true (play mode), shows controls for adding/removing conditions.
 * Hidden when no conditions are present (unless editable=true).
 */

interface ConditionItem {
  id: string
  name: string
  slug: string
  level: string
  source: string
  duration: string
  is_dangling: boolean
}

const props = defineProps<{
  conditions?: ConditionItem[]
  editable?: boolean
}>()

const emit = defineEmits<{
  'remove': [conditionSlug: string]
  'update-level': [payload: { slug: string, level: number }]
  'add-click': []
  'confirm-deadly-exhaustion': [payload: { slug: string, currentLevel: number, targetLevel: number }]
}>()

/**
 * Only show alert when conditions exist OR when editable (to show add button)
 */
const showComponent = computed(() => {
  const hasConditions = props.conditions && props.conditions.length > 0
  return hasConditions || props.editable
})

/**
 * Whether there are conditions to display
 */
const hasConditions = computed(() => {
  return props.conditions && props.conditions.length > 0
})

/**
 * Number of active conditions for title
 */
const conditionCount = computed(() => {
  return props.conditions?.length ?? 0
})

/**
 * Alert title with singular/plural handling
 */
const alertTitle = computed(() => {
  const count = conditionCount.value
  return count === 1 ? '1 Active Condition' : `${count} Active Conditions`
})

/**
 * Format condition display text
 * Includes level for Exhaustion, shows duration if present
 */
function formatCondition(condition: ConditionItem) {
  const levelText = condition.level ? ` ${condition.level}` : ''
  const name = `${condition.name}${levelText}`
  return condition.duration ? `${name} - ${condition.duration}` : name
}

/**
 * Check if a condition is exhaustion
 */
function isExhaustion(condition: ConditionItem): boolean {
  return condition.slug.includes('exhaustion')
}

/**
 * Get numeric level from condition (for exhaustion)
 */
function getLevel(condition: ConditionItem): number {
  return parseInt(condition.level, 10) || 1
}

/**
 * Handle remove button click
 */
function handleRemove(conditionSlug: string) {
  emit('remove', conditionSlug)
}

/**
 * Handle exhaustion level increment
 * Emits confirmation request when incrementing to level 6 (death)
 */
function handleIncrement(condition: ConditionItem) {
  const currentLevel = getLevel(condition)
  if (currentLevel >= 6) return

  const targetLevel = currentLevel + 1

  // Level 6 = death, require confirmation
  if (targetLevel === 6) {
    emit('confirm-deadly-exhaustion', {
      slug: condition.slug,
      currentLevel,
      targetLevel
    })
    return
  }

  emit('update-level', { slug: condition.slug, level: targetLevel })
}

/**
 * Handle exhaustion level decrement
 */
function handleDecrement(condition: ConditionItem) {
  const currentLevel = getLevel(condition)
  if (currentLevel > 1) {
    emit('update-level', { slug: condition.slug, level: currentLevel - 1 })
  }
}

/**
 * Handle add button click
 */
function handleAddClick() {
  emit('add-click')
}

/**
 * Check if increment is disabled (at max level 6)
 */
function isIncrementDisabled(condition: ConditionItem): boolean {
  return getLevel(condition) >= 6
}

/**
 * Check if decrement is disabled (at min level 1)
 */
function isDecrementDisabled(condition: ConditionItem): boolean {
  return getLevel(condition) <= 1
}

/**
 * Check if exhaustion is at deadly level
 */
function isDeadlyExhaustion(condition: ConditionItem): boolean {
  return isExhaustion(condition) && getLevel(condition) === 6
}
</script>

<template>
  <div v-if="showComponent">
    <!-- Alert with conditions -->
    <UAlert
      v-if="hasConditions"
      data-testid="conditions-alert"
      color="warning"
      icon="i-heroicons-exclamation-triangle"
      :title="alertTitle"
    >
      <template #description>
        <ul class="list-disc list-inside space-y-2">
          <li
            v-for="condition in conditions"
            :key="condition.id"
            class="flex items-center justify-between gap-2"
          >
            <span class="flex-1">
              {{ formatCondition(condition) }}
              <!-- Death warning for level 6 exhaustion -->
              <UBadge
                v-if="isDeadlyExhaustion(condition)"
                color="error"
                variant="solid"
                size="md"
                class="ml-2"
              >
                Death!
              </UBadge>
            </span>

            <!-- Editable controls -->
            <span
              v-if="editable"
              class="flex items-center gap-1 flex-shrink-0"
            >
              <!-- Exhaustion stepper -->
              <template v-if="isExhaustion(condition)">
                <UButton
                  data-testid="exhaustion-decrement"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-minus"
                  :disabled="isDecrementDisabled(condition)"
                  @click.stop="handleDecrement(condition)"
                />
                <UButton
                  data-testid="exhaustion-increment"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-plus"
                  :disabled="isIncrementDisabled(condition)"
                  @click.stop="handleIncrement(condition)"
                />
              </template>

              <!-- Remove button -->
              <UButton
                :data-testid="`remove-condition-${condition.slug}`"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click.stop="handleRemove(condition.slug)"
              />
            </span>
          </li>
        </ul>

        <!-- Add button inside alert -->
        <div
          v-if="editable"
          class="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800"
        >
          <UButton
            data-testid="add-condition-btn"
            color="warning"
            variant="soft"
            size="sm"
            icon="i-heroicons-plus"
            @click="handleAddClick"
          >
            Add Condition
          </UButton>
        </div>
      </template>
    </UAlert>

    <!-- Empty state with add button (editable only) -->
    <div
      v-else-if="editable"
      class="p-3"
    >
      <UButton
        data-testid="add-condition-btn"
        color="neutral"
        variant="soft"
        size="sm"
        icon="i-heroicons-plus"
        @click="handleAddClick"
      >
        Add Condition
      </UButton>
    </div>
  </div>
</template>
