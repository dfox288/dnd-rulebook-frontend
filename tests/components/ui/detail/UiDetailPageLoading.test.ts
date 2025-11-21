import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UiDetailPageLoading from '~/components/ui/detail/UiDetailPageLoading.vue'

describe('UiDetailPageLoading', () => {
  it('renders loading spinner icon', () => {
    const wrapper = mount(UiDetailPageLoading)

    // Should show spinner icon with correct classes
    const container = wrapper.find('.animate-spin')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('text-primary-500')
  })

  it('displays default loading message', () => {
    const wrapper = mount(UiDetailPageLoading)

    expect(wrapper.text()).toContain('Loading...')
  })

  it('displays custom entity type in loading message', () => {
    const wrapper = mount(UiDetailPageLoading, {
      props: {
        entityType: 'spell'
      }
    })

    expect(wrapper.text()).toContain('Loading spell...')
  })

  it('displays different entity types correctly', () => {
    const wrapper = mount(UiDetailPageLoading, {
      props: {
        entityType: 'item'
      }
    })

    expect(wrapper.text()).toContain('Loading item...')
  })

  it('applies correct layout classes', () => {
    const wrapper = mount(UiDetailPageLoading)

    // Should center content
    const container = wrapper.find('.flex.justify-center.items-center')
    expect(container.exists()).toBe(true)

    // Should have vertical spacing
    expect(container.classes()).toContain('py-12')
  })

  it('renders with dark mode support', () => {
    const wrapper = mount(UiDetailPageLoading)

    const text = wrapper.find('p')
    expect(text.classes()).toContain('text-gray-600')
    expect(text.classes()).toContain('dark:text-gray-400')
  })

  it('has correct spacing between icon and text', () => {
    const wrapper = mount(UiDetailPageLoading)

    const innerContainer = wrapper.find('.flex.flex-col.items-center')
    expect(innerContainer.exists()).toBe(true)
    expect(innerContainer.classes()).toContain('gap-4')
  })
})
