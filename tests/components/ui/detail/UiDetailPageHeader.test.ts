import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UiDetailPageHeader from '~/components/ui/detail/UiDetailPageHeader.vue'

describe('UiDetailPageHeader', () => {
  const mountOptions = {
    global: {
      stubs: {
        UBadge: {
          template: '<span class="badge"><slot /></span>',
          props: ['color', 'variant', 'size']
        }
      }
    }
  }

  it('renders title correctly', () => {
    const wrapper = mount(UiDetailPageHeader, {
      props: {
        title: 'Fireball'
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('Fireball')
  })

  it('renders badges when provided', () => {
    const wrapper = mount(UiDetailPageHeader, {
      props: {
        title: 'Fireball',
        badges: [
          { label: '3rd Level', color: 'info', variant: 'subtle', size: 'lg' },
          { label: 'Evocation', color: 'error', variant: 'subtle', size: 'lg' }
        ]
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('3rd Level')
    expect(wrapper.text()).toContain('Evocation')
  })

  it('renders without badges when array is empty', () => {
    const wrapper = mount(UiDetailPageHeader, {
      props: {
        title: 'Longsword',
        badges: []
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('Longsword')
    const badges = wrapper.findAll('.badge')
    expect(badges).toHaveLength(0)
  })

  it('renders without badges when undefined', () => {
    const wrapper = mount(UiDetailPageHeader, {
      props: {
        title: 'Elf'
      },
      ...mountOptions
    })

    const badges = wrapper.findAll('.badge')
    expect(badges).toHaveLength(0)
  })

  it('wraps badges flexibly', () => {
    const wrapper = mount(UiDetailPageHeader, {
      props: {
        title: 'Test',
        badges: [{ label: 'Badge 1', color: 'primary', variant: 'soft', size: 'sm' }]
      },
      ...mountOptions
    })

    const badgeContainer = wrapper.find('.flex.items-center.gap-2.flex-wrap')
    expect(badgeContainer.exists()).toBe(true)
  })
})
