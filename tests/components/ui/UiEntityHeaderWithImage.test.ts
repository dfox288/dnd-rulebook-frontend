import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiEntityHeaderWithImage from '~/components/ui/UiEntityHeaderWithImage.vue'

describe('UiEntityHeaderWithImage', () => {
  it('renders title correctly', async () => {
    const wrapper = await mountSuspended(UiEntityHeaderWithImage, {
      props: {
        title: 'Dragonborn'
      }
    })

    expect(wrapper.text()).toContain('Dragonborn')
  })

  it('renders badges when provided', async () => {
    const wrapper = await mountSuspended(UiEntityHeaderWithImage, {
      props: {
        title: 'Dragonborn',
        badges: [
          { label: 'Medium', color: 'info', variant: 'subtle', size: 'lg' },
          { label: 'Race', color: 'primary', variant: 'subtle', size: 'lg' }
        ]
      }
    })

    expect(wrapper.text()).toContain('Medium')
    expect(wrapper.text()).toContain('Race')
  })

  it('renders image when imagePath is provided', async () => {
    const wrapper = await mountSuspended(UiEntityHeaderWithImage, {
      props: {
        title: 'Dragonborn',
        imagePath: '/images/generated/conversions/512/races/stability-ai/dragonborn.webp',
        imageAlt: 'Dragonborn character portrait'
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Dragonborn character portrait')
  })

  it('does not render image when imagePath is null', async () => {
    const wrapper = await mountSuspended(UiEntityHeaderWithImage, {
      props: {
        title: 'Dragonborn',
        imagePath: null
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)
  })

  it('does not render image when imagePath is not provided', async () => {
    const wrapper = await mountSuspended(UiEntityHeaderWithImage, {
      props: {
        title: 'Dragonborn'
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)
  })

  it('has responsive layout classes', async () => {
    const wrapper = await mountSuspended(UiEntityHeaderWithImage, {
      props: {
        title: 'Dragonborn',
        imagePath: '/images/test.webp'
      }
    })

    const container = wrapper.find('.flex')
    expect(container.classes()).toContain('flex-col')
    expect(container.classes()).toContain('md:flex-row')
  })

  it('uses NuxtImg with lazy loading', async () => {
    const wrapper = await mountSuspended(UiEntityHeaderWithImage, {
      props: {
        title: 'Dragonborn',
        imagePath: '/images/test.webp'
      }
    })

    const img = wrapper.find('img')
    expect(img.attributes('loading')).toBe('lazy')
  })
})
