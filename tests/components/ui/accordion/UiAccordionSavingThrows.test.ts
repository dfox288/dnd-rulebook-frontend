import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiAccordionSavingThrows from '~/components/ui/accordion/UiAccordionSavingThrows.vue'

describe('UiAccordionSavingThrows', () => {
  it('renders ability score name', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
            save_effect: null,
            is_initial_save: true
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('Dexterity')
  })

  it('renders multiple saving throws', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
            save_effect: null,
            is_initial_save: true
          },
          {
            ability_score: { id: 5, code: 'WIS', name: 'Wisdom' },
            save_effect: 'negates',
            is_initial_save: true
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('Dexterity')
    expect(wrapper.text()).toContain('Wisdom')
  })

  it('displays "Initial Save" badge when is_initial_save is true', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
            save_effect: null,
            is_initial_save: true
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('Initial Save')
  })

  it('displays "Recurring Save" badge when is_initial_save is false', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 5, code: 'WIS', name: 'Wisdom' },
            save_effect: 'ends_effect',
            is_initial_save: false
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('Recurring Save')
  })

  it('displays "Negates effect" when save_effect is "negates"', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 5, code: 'WIS', name: 'Wisdom' },
            save_effect: 'negates',
            is_initial_save: true
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('Negates effect')
  })

  it('displays "Ends effect" when save_effect is "ends_effect"', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 5, code: 'WIS', name: 'Wisdom' },
            save_effect: 'ends_effect',
            is_initial_save: false
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('Ends effect')
  })

  it('does not display save effect when it is null', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
            save_effect: null,
            is_initial_save: true
          }
        ]
      }
    })

    expect(wrapper.text()).not.toContain('Negates')
    expect(wrapper.text()).not.toContain('Ends')
  })

  it('handles empty array gracefully', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: []
      }
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('displays ability score code in badge', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
            save_effect: null,
            is_initial_save: true
          }
        ]
      }
    })

    expect(wrapper.text()).toContain('DEX')
  })

  it('applies proper spacing and layout classes', async () => {
    const wrapper = await mountSuspended(UiAccordionSavingThrows, {
      props: {
        savingThrows: [
          {
            ability_score: { id: 2, code: 'DEX', name: 'Dexterity' },
            save_effect: null,
            is_initial_save: true
          }
        ]
      }
    })

    const container = wrapper.find('.space-y-3')
    expect(container.exists()).toBe(true)
  })
})
