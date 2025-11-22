import { describe, it, expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'

/**
 * Shared test helpers for entity card components
 *
 * These helpers eliminate redundant tests across entity card components
 * (SpellCard, ItemCard, RaceCard, ClassCard, BackgroundCard, FeatCard)
 *
 * Usage:
 *   const mountCard = () => mountSuspended(MyCard, { props: { entity: mockData } })
 *   testCardLinkBehavior(mountCard, '/my-entity/slug')
 */

/**
 * Tests that card component links to detail page with correct slug
 */
export function testCardLinkBehavior(
  mountComponent: () => Promise<VueWrapper>,
  expectedHref: string
) {
  it('links to detail page with slug', async () => {
    const wrapper = await mountComponent()
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe(expectedHref)
  })
}

/**
 * Tests that card component has hover effects for interactivity
 */
export function testCardHoverEffects(
  mountComponent: () => Promise<VueWrapper>
) {
  it('applies hover effects for interactivity', async () => {
    const wrapper = await mountComponent()
    const html = wrapper.html()
    expect(html).toContain('hover')
  })
}

/**
 * Tests that card component renders with proper border styling
 */
export function testCardBorderStyling(
  mountComponent: () => Promise<VueWrapper>
) {
  it('uses card component with border', async () => {
    const wrapper = await mountComponent()
    const html = wrapper.html()
    expect(html).toContain('border')
  })
}
