import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiAccordionLevelProgression from '~/components/ui/accordion/UiAccordionLevelProgression.vue'
import type { components } from '~/types/api/generated'

type LevelProgression = components['schemas']['ClassLevelProgressionResource']

describe('UiAccordionLevelProgression', () => {
  const mockProgression: LevelProgression[] = [
    {
      id: 1,
      level: 1,
      cantrips_known: 3,
      spells_known: 2,
      spell_slots_1st: 2,
      spell_slots_2nd: 0,
      spell_slots_3rd: 0,
      spell_slots_4th: 0,
      spell_slots_5th: 0,
      spell_slots_6th: 0,
      spell_slots_7th: 0,
      spell_slots_8th: 0,
      spell_slots_9th: 0
    },
    {
      id: 2,
      level: 2,
      cantrips_known: 3,
      spells_known: 3,
      spell_slots_1st: 3,
      spell_slots_2nd: 0,
      spell_slots_3rd: 0,
      spell_slots_4th: 0,
      spell_slots_5th: 0,
      spell_slots_6th: 0,
      spell_slots_7th: 0,
      spell_slots_8th: 0,
      spell_slots_9th: 0
    }
  ]

  it('renders level progression table', async () => {
    const wrapper = await mountSuspended(UiAccordionLevelProgression, {
      props: { levelProgression: mockProgression }
    })

    expect(wrapper.text()).toContain('Level')
    expect(wrapper.text()).toContain('Cantrips')
    expect(wrapper.text()).toContain('1st')
  })

  it('displays spell slot values', async () => {
    const wrapper = await mountSuspended(UiAccordionLevelProgression, {
      props: { levelProgression: mockProgression }
    })

    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
  })

  it('hides columns with all zero values', async () => {
    const wrapper = await mountSuspended(UiAccordionLevelProgression, {
      props: { levelProgression: mockProgression }
    })

    // Should show 1st level slots
    expect(wrapper.text()).toContain('1st')

    // Should NOT show 9th level slots (all zeros)
    expect(wrapper.text()).not.toContain('9th')
  })

  it('handles empty progression array', async () => {
    const wrapper = await mountSuspended(UiAccordionLevelProgression, {
      props: { levelProgression: [] }
    })

    expect(wrapper.text()).toBe('')
  })
})
