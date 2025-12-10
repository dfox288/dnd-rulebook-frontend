import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import StepHitPoints from '~/components/character/levelup/StepHitPoints.vue'

// Mock the stores and composables
vi.mock('~/stores/characterLevelUp', () => ({
  useCharacterLevelUpStore: vi.fn(() => ({
    characterId: 1,
    selectedClassSlug: 'phb:fighter'
  }))
}))

vi.mock('~/composables/useUnifiedChoices', () => ({
  useUnifiedChoices: vi.fn(() => ({
    choices: ref([]),
    choicesByType: computed(() => ({ hitPoints: [] })),
    pending: ref(false),
    fetchChoices: vi.fn(),
    resolveChoice: vi.fn()
  }))
}))

vi.mock('~/composables/useLevelUpWizard', () => ({
  useLevelUpWizard: vi.fn(() => ({
    nextStep: vi.fn()
  }))
}))

describe('StepHitPoints', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders HP choice options', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 10,
        conModifier: 2
      }
    })

    expect(wrapper.text()).toContain('Hit Point Increase')
    expect(wrapper.find('[data-testid="roll-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="average-button"]').exists()).toBe(true)
  })

  it('shows hit die type', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 10,
        conModifier: 2
      }
    })

    expect(wrapper.text()).toContain('d10')
  })

  it('calculates average value correctly (rounded up)', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 10, // Average = (10+1)/2 = 5.5, rounded up = 6
        conModifier: 2
      }
    })

    expect(wrapper.text()).toContain('6') // Average for d10
  })

  it('calculates average correctly for d8', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 8, // Average = (8+1)/2 = 4.5, rounded up = 5
        conModifier: 2
      }
    })

    expect(wrapper.text()).toContain('5') // Average for d8
  })

  it('calculates average correctly for d6', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 6, // Average = (6+1)/2 = 3.5, rounded up = 4
        conModifier: 2
      }
    })

    expect(wrapper.text()).toContain('4') // Average for d6
  })

  it('calculates total with CON modifier', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 10,
        conModifier: 3
      }
    })

    // Click average button
    await wrapper.find('[data-testid="average-button"]').trigger('click')
    await wrapper.vm.$nextTick()

    // Average 6 + CON 3 = 9
    expect(wrapper.text()).toContain('9')
  })

  it('shows confirm button disabled initially', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 10,
        conModifier: 2
      }
    })

    const confirmBtn = wrapper.find('[data-testid="confirm-hp-btn"]')
    expect(confirmBtn.exists()).toBe(true)
    expect(confirmBtn.attributes('disabled')).toBeDefined()
  })

  it('enables confirm button after selection', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 10,
        conModifier: 2
      }
    })

    // Click average button
    await wrapper.find('[data-testid="average-button"]').trigger('click')
    await wrapper.vm.$nextTick()

    const confirmBtn = wrapper.find('[data-testid="confirm-hp-btn"]')
    expect(confirmBtn.attributes('disabled')).toBeUndefined()
  })

  it('displays negative CON modifier correctly', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 10,
        conModifier: -1
      }
    })

    expect(wrapper.text()).toContain('-1')
  })

  it('displays positive CON modifier with plus sign', async () => {
    const wrapper = await mountSuspended(StepHitPoints, {
      props: {
        hitDie: 10,
        conModifier: 3
      }
    })

    expect(wrapper.text()).toContain('+3')
  })
})
