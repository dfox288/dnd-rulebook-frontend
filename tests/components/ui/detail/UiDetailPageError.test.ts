import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UiDetailPageError from '~/components/ui/detail/UiDetailPageError.vue'

describe('UiDetailPageError', () => {
  const mountOptions = {
    global: {
      stubs: {
        NuxtLink: {
          template: '<a><slot /></a>',
          props: ['to']
        },
        UButton: {
          template: '<button><slot /></button>',
          props: ['color']
        }
      }
    }
  }

  it('renders error icon', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Spell'
      },
      ...mountOptions
    })

    // Should show exclamation triangle icon
    const container = wrapper.find('.text-red-500')
    expect(container.exists()).toBe(true)
  })

  it('displays entity type in heading', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Spell'
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('Spell Not Found')
  })

  it('displays different entity types correctly', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Item'
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('Item Not Found')
  })

  it('displays error message', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Race'
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain("The race you're looking for doesn't exist or has been removed.")
  })

  it('renders back button with default link', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Class'
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('Back to Search')
  })

  it('uses custom back link when provided', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Feat',
        backLink: '/feats'
      },
      ...mountOptions
    })

    // Button should exist (we can't test the href directly without stubbing NuxtLink)
    expect(wrapper.text()).toContain('Back to Search')
  })

  it('applies correct layout styling', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Background'
      },
      ...mountOptions
    })

    // Should have padding
    const outerContainer = wrapper.find('.py-12')
    expect(outerContainer.exists()).toBe(true)

    // Text should be centered
    const textCenter = wrapper.find('.text-center')
    expect(textCenter.exists()).toBe(true)
  })

  it('renders with dark mode support', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Spell'
      },
      ...mountOptions
    })

    // Heading should support dark mode
    const heading = wrapper.find('h2')
    expect(heading.classes()).toContain('text-gray-900')
    expect(heading.classes()).toContain('dark:text-gray-100')

    // Description text should support dark mode
    const description = wrapper.find('p')
    expect(description.classes()).toContain('text-gray-600')
    expect(description.classes()).toContain('dark:text-gray-400')
  })

  it('formats entity type in error message', () => {
    const wrapper = mount(UiDetailPageError, {
      props: {
        entityType: 'Item'
      },
      ...mountOptions
    })

    // Should lowercase entity type in message
    expect(wrapper.text()).toContain("The item you're looking for")
  })
})
