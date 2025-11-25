import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UiHitPointsCard from '~/components/ui/class/UiHitPointsCard.vue'

describe('UiHitPointsCard', () => {
  const mountOptions = {
    global: {
      stubs: {
        UCard: {
          template: '<div class="card"><slot /></div>'
        },
        UIcon: {
          template: '<i class="icon" />',
          props: ['name']
        }
      }
    }
  }

  it('renders hit die value', () => {
    const wrapper = mount(UiHitPointsCard, {
      props: {
        hitDie: 8,
        className: 'rogue'
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('1d8')
  })

  it('renders HP at 1st level correctly', () => {
    const wrapper = mount(UiHitPointsCard, {
      props: {
        hitDie: 10,
        className: 'fighter'
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('10 + Constitution modifier')
  })

  it('renders HP at higher levels correctly', () => {
    const wrapper = mount(UiHitPointsCard, {
      props: {
        hitDie: 12,
        className: 'barbarian'
      },
      ...mountOptions
    })

    // Should show both die roll and average
    expect(wrapper.text()).toContain('1d12')
    expect(wrapper.text()).toContain('(or 7)')
  })

  it('calculates average HP correctly for different hit dice', () => {
    // d6 average = 4
    const d6Wrapper = mount(UiHitPointsCard, {
      props: { hitDie: 6, className: 'wizard' },
      ...mountOptions
    })
    expect(d6Wrapper.text()).toContain('(or 4)')

    // d8 average = 5
    const d8Wrapper = mount(UiHitPointsCard, {
      props: { hitDie: 8, className: 'rogue' },
      ...mountOptions
    })
    expect(d8Wrapper.text()).toContain('(or 5)')

    // d10 average = 6
    const d10Wrapper = mount(UiHitPointsCard, {
      props: { hitDie: 10, className: 'fighter' },
      ...mountOptions
    })
    expect(d10Wrapper.text()).toContain('(or 6)')

    // d12 average = 7
    const d12Wrapper = mount(UiHitPointsCard, {
      props: { hitDie: 12, className: 'barbarian' },
      ...mountOptions
    })
    expect(d12Wrapper.text()).toContain('(or 7)')
  })

  it('includes class name in per-level description', () => {
    const wrapper = mount(UiHitPointsCard, {
      props: {
        hitDie: 8,
        className: 'rogue'
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('per rogue level')
  })

  it('displays heart icon', () => {
    const wrapper = mount(UiHitPointsCard, {
      props: {
        hitDie: 8,
        className: 'rogue'
      },
      ...mountOptions
    })

    expect(wrapper.find('.icon').exists()).toBe(true)
  })
})
