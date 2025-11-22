import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiAccordionActions from '~/components/ui/accordion/UiAccordionActions.vue'

describe('UiAccordionActions', () => {
  const mockActions = [
    {
      id: 1,
      name: 'Multiattack',
      description: 'The dragon can use its Frightful Presence. It then makes three attacks.',
      attack_data: null,
      recharge: null
    },
    {
      id: 2,
      name: 'Fire Breath',
      description: 'The dragon exhales fire in a 90-foot cone.',
      attack_data: '["Fire Damage||26d6"]',
      recharge: '5-6'
    }
  ]

  const mockLegendaryActions = [
    {
      id: 1,
      name: 'Detect',
      description: 'The dragon makes a Wisdom (Perception) check.',
      action_cost: 1,
      attack_data: null,
      recharge: null
    },
    {
      id: 2,
      name: 'Wing Attack',
      description: 'The dragon beats its wings.',
      action_cost: 2,
      attack_data: '["Bludgeoning Damage||2d6+10"]',
      recharge: null
    }
  ]

  it('renders accordion header with action count', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: mockActions,
        title: 'Actions'
      }
    })

    expect(wrapper.text()).toContain('Actions (2)')
  })

  it('displays action names', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: mockActions,
        title: 'Actions'
      }
    })

    // Click accordion button to expand it
    const button = wrapper.find('button')
    if (button.exists()) {
      await button.trigger('click')
    }

    expect(wrapper.text()).toContain('Multiattack')
    expect(wrapper.text()).toContain('Fire Breath')
  })

  it('displays action descriptions', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: mockActions,
        title: 'Actions'
      }
    })

    // Click accordion button to expand it
    const button = wrapper.find('button')
    if (button.exists()) {
      await button.trigger('click')
    }

    expect(wrapper.text()).toContain('The dragon can use its Frightful Presence')
    expect(wrapper.text()).toContain('The dragon exhales fire')
  })

  it('shows recharge badge when present', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: mockActions,
        title: 'Actions'
      }
    })

    // Click accordion button to expand it
    const button = wrapper.find('button')
    if (button.exists()) {
      await button.trigger('click')
    }

    expect(wrapper.text()).toContain('Recharge 5-6')
  })

  it('does not show recharge badge when null', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: [mockActions[0]], // Only Multiattack (no recharge)
        title: 'Actions'
      }
    })

    expect(wrapper.text()).not.toContain('Recharge')
  })

  it('shows action cost badge when showCost is true', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: mockLegendaryActions,
        title: 'Legendary Actions',
        showCost: true
      }
    })

    // Click accordion button to expand it
    const button = wrapper.find('button')
    if (button.exists()) {
      await button.trigger('click')
    }

    expect(wrapper.text()).toContain('Costs 1 Action')
    expect(wrapper.text()).toContain('Costs 2 Actions')
  })

  it('does not show action cost when showCost is false', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: mockLegendaryActions,
        title: 'Legendary Actions',
        showCost: false
      }
    })

    expect(wrapper.text()).not.toContain('Costs')
  })

  it('does not render when actions array is empty', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: [],
        title: 'Actions'
      }
    })

    // Component should not render anything when no actions
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('does not render when no actions provided', async () => {
    const wrapper = await mountSuspended(UiAccordionActions, {
      props: {
        actions: [],
        title: 'Actions'
      }
    })

    // Component should not render the accordion element
    const accordion = wrapper.find('div')
    expect(accordion.exists()).toBe(false)
  })
})
