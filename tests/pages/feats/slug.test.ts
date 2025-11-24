import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FeatsSlugPage from '~/pages/feats/[slug].vue'

describe('Feats [slug] Page', () => {
  it('should render description section with prose styling', async () => {
    const wrapper = await mountSuspended(FeatsSlugPage, {
      route: '/feats/alert'
    })

    const html = wrapper.html()

    // Should have description section
    expect(html).toContain('Description')
  })

  it('should render description with whitespace-pre-line formatting', async () => {
    const wrapper = await mountSuspended(FeatsSlugPage, {
      route: '/feats/alert'
    })

    const html = wrapper.html()

    // Should preserve line breaks in description
    expect(html).toContain('whitespace-pre-line')
  })

  it('should render single UAccordion with type="multiple"', async () => {
    const wrapper = await mountSuspended(FeatsSlugPage, {
      route: '/feats/alert'
    })

    const accordions = wrapper.findAllComponents({ name: 'UAccordion' })
    expect(accordions.length).toBe(1)
    expect(accordions[0].props('type')).toBe('multiple')
  })
})
