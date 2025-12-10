<script setup lang="ts">
import { useCharacterLevelUpStore } from '~/stores/characterLevelUp'
import { useLevelUpWizard } from '~/composables/useLevelUpWizard'

const props = defineProps<{
  hitDie: number
  conModifier: number
}>()

const emit = defineEmits<{
  'choice-made': [hpGained: number]
}>()

const store = useCharacterLevelUpStore()
const { nextStep } = useLevelUpWizard()

// Use unified choices for HP choice resolution
const { resolveChoice, fetchChoices, choicesByType } = useUnifiedChoices(
  computed(() => store.characterId)
)

// Local state
const selectedMethod = ref<'roll' | 'average' | null>(null)
const rollResult = ref<number | null>(null)
const hpGained = ref<number | null>(null)
const isSaving = ref(false)

// Reference to die roller component
const dieRoller = ref<{ rollDie: () => void } | null>(null)

// Calculate average (rounded up per 5e rules)
const averageValue = computed(() => Math.ceil((props.hitDie + 1) / 2))

// Calculate total HP gained
const totalHpGained = computed(() => {
  if (selectedMethod.value === 'average') {
    return averageValue.value + props.conModifier
  }
  if (selectedMethod.value === 'roll' && rollResult.value !== null) {
    return rollResult.value + props.conModifier
  }
  return null
})

function handleRollClick() {
  selectedMethod.value = 'roll'
  dieRoller.value?.rollDie()
}

function handleRollComplete(result: number) {
  rollResult.value = result
  hpGained.value = result + props.conModifier
}

function handleAverageClick() {
  selectedMethod.value = 'average'
  rollResult.value = averageValue.value
  hpGained.value = averageValue.value + props.conModifier
}

async function handleConfirm() {
  if (hpGained.value === null) return

  isSaving.value = true
  try {
    // Find the HP choice and resolve it
    await fetchChoices('hit_points')
    const hpChoices = choicesByType.value.hitPoints
    const firstChoice = hpChoices?.[0]
    if (firstChoice) {
      await resolveChoice(firstChoice.id, {
        hit_point_increase: hpGained.value
      })
    }

    emit('choice-made', hpGained.value)
    nextStep()
  } finally {
    isSaving.value = false
  }
}

// Fetch HP choices on mount
onMounted(() => {
  fetchChoices('hit_points')
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Hit Point Increase
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Your hit die: <span class="font-semibold">d{{ hitDie }}</span>
        &bull; Constitution modifier: <span class="font-semibold">{{ conModifier >= 0 ? '+' : '' }}{{ conModifier }}</span>
      </p>
    </div>

    <!-- Choice Options -->
    <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
      <!-- Roll Option -->
      <div
        class="flex flex-col items-center p-6 rounded-xl border-2 transition-all cursor-pointer"
        :class="selectedMethod === 'roll'
          ? 'border-primary bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'"
        data-testid="roll-button"
        @click="handleRollClick"
      >
        <CharacterLevelupHitDieRoller
          ref="dieRoller"
          :die-size="hitDie"
          @roll-complete="handleRollComplete"
        />
        <span class="mt-3 font-semibold text-gray-900 dark:text-white">
          Roll d{{ hitDie }}
        </span>
        <span class="text-sm text-gray-500">
          Take your chances
        </span>
      </div>

      <!-- Average Option -->
      <div
        class="flex flex-col items-center p-6 rounded-xl border-2 transition-all cursor-pointer"
        :class="selectedMethod === 'average'
          ? 'border-primary bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'"
        data-testid="average-button"
        @click="handleAverageClick"
      >
        <div class="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
          <span class="text-3xl font-bold text-gray-700 dark:text-gray-300">
            {{ averageValue }}
          </span>
        </div>
        <span class="mt-3 font-semibold text-gray-900 dark:text-white">
          Take Average
        </span>
        <span class="text-sm text-gray-500">
          Guaranteed value
        </span>
      </div>
    </div>

    <!-- Result Display -->
    <div
      v-if="totalHpGained !== null"
      class="text-center p-6 bg-success-50 dark:bg-success-900/20 rounded-xl"
    >
      <p class="text-lg text-gray-700 dark:text-gray-300">
        <span v-if="selectedMethod === 'roll'">
          You rolled <span class="font-bold text-primary">{{ rollResult }}</span>
        </span>
        <span v-else>
          Average: <span class="font-bold">{{ averageValue }}</span>
        </span>
        + {{ conModifier }} (CON) =
        <span class="text-2xl font-bold text-success-600 dark:text-success-400">
          {{ totalHpGained }} HP
        </span>
      </p>
    </div>

    <!-- Confirm Button -->
    <div class="flex justify-center pt-4">
      <UButton
        data-testid="confirm-hp-btn"
        size="lg"
        :disabled="totalHpGained === null || isSaving"
        :loading="isSaving"
        @click="handleConfirm"
      >
        Confirm HP Increase
      </UButton>
    </div>
  </div>
</template>
