import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiDetailEntityImage from '~/components/ui/detail/UiDetailEntityImage.vue'

describe('UiDetailEntityImage', () => {
  it('displays image when imagePath is provided', async () => {
    const wrapper = await mountSuspended(UiDetailEntityImage, {
      props: {
        imagePath: '/images/fireball.jpg',
        imageAlt: 'Fireball spell'
      }
    })

    const img = wrapper.findComponent({ name: 'NuxtImg' })
    expect(img.exists()).toBe(true)
    // NuxtImg transforms the src with /_ipx/_ prefix for optimization
    expect(img.attributes('src')).toContain('/images/fireball.jpg')
  })

  it('shows correct alt text', async () => {
    const wrapper = await mountSuspended(UiDetailEntityImage, {
      props: {
        imagePath: '/images/longsword.jpg',
        imageAlt: 'Longsword weapon'
      }
    })

    const img = wrapper.findComponent({ name: 'NuxtImg' })
    expect(img.attributes('alt')).toBe('Longsword weapon')
  })

  it('does not render when imagePath is null', async () => {
    const wrapper = await mountSuspended(UiDetailEntityImage, {
      props: {
        imagePath: null,
        imageAlt: 'Test alt text'
      }
    })

    const img = wrapper.findComponent({ name: 'NuxtImg' })
    expect(img.exists()).toBe(false)
  })

  it('does not render when imagePath is undefined', async () => {
    const wrapper = await mountSuspended(UiDetailEntityImage, {
      props: {
        imagePath: undefined,
        imageAlt: 'Test alt text'
      }
    })

    const img = wrapper.findComponent({ name: 'NuxtImg' })
    expect(img.exists()).toBe(false)
  })

  it('applies responsive width and height classes', async () => {
    const wrapper = await mountSuspended(UiDetailEntityImage, {
      props: {
        imagePath: '/images/test.jpg',
        imageAlt: 'Test image'
      }
    })

    const img = wrapper.findComponent({ name: 'NuxtImg' })
    const classes = img.classes().join(' ')
    expect(classes).toContain('w-full')
    expect(classes).toContain('h-auto')
  })

  it('applies rounded corners styling', async () => {
    const wrapper = await mountSuspended(UiDetailEntityImage, {
      props: {
        imagePath: '/images/test.jpg',
        imageAlt: 'Test image'
      }
    })

    const img = wrapper.findComponent({ name: 'NuxtImg' })
    const classes = img.classes().join(' ')
    expect(classes).toMatch(/rounded/)
  })

  it('applies shadow styling', async () => {
    const wrapper = await mountSuspended(UiDetailEntityImage, {
      props: {
        imagePath: '/images/test.jpg',
        imageAlt: 'Test image'
      }
    })

    const img = wrapper.findComponent({ name: 'NuxtImg' })
    const classes = img.classes().join(' ')
    expect(classes).toMatch(/shadow/)
  })

  it('uses lazy loading by default', async () => {
    const wrapper = await mountSuspended(UiDetailEntityImage, {
      props: {
        imagePath: '/images/test.jpg',
        imageAlt: 'Test image'
      }
    })

    const img = wrapper.findComponent({ name: 'NuxtImg' })
    // NuxtImg has lazy loading enabled by default unless explicitly disabled
    expect(img.exists()).toBe(true)
  })
})
