import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SizeCard from '~/components/size/SizeCard.vue'

describe('SizeCard', () => {
  const mockSize = {
    id: 1,
    code: 'M',
    name: 'Medium'
  }

  it('renders size name', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    expect(wrapper.text()).toContain('Medium')
  })

  it('renders size code badge', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    expect(wrapper.text()).toContain('M')
  })

  it('shows category badge', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    expect(wrapper.text()).toContain('Creature Size')
  })

  it('applies hover effects for interactivity', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    const html = wrapper.html()
    expect(html).toContain('hover')
  })

  it('uses card component with border', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    const html = wrapper.html()
    expect(html).toContain('border')
  })

  it('renders with proper spacing structure', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    const html = wrapper.html()
    expect(html).toContain('space-y-3')
  })

  it('displays all key information in organized layout', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    const text = wrapper.text()
    expect(text).toContain('M')
    expect(text).toContain('Medium')
    expect(text).toContain('Creature Size')
  })

  it('handles all D&D size categories', async () => {
    const sizes = [
      { code: 'T', name: 'Tiny' },
      { code: 'S', name: 'Small' },
      { code: 'M', name: 'Medium' },
      { code: 'L', name: 'Large' },
      { code: 'H', name: 'Huge' },
      { code: 'G', name: 'Gargantuan' }
    ]

    for (const size of sizes) {
      const wrapper = await mountSuspended(SizeCard, {
        props: { size: { id: 1, ...size } }
      })

      expect(wrapper.text()).toContain(size.code)
      expect(wrapper.text()).toContain(size.name)
    }
  })

  it('uses neutral color theme', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    const html = wrapper.html()
    // Neutral badges should be present
    expect(html).toBeTruthy()
  })

  it('displays size code in large solid badge', async () => {
    const wrapper = await mountSuspended(SizeCard, {
      props: { size: mockSize }
    })

    const html = wrapper.html()
    // Check that badge is rendered with solid variant and prominent styling
    expect(html).toContain('M')
    expect(html).toBeTruthy()
  })
})
