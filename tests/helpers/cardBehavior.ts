import { it, expect, describe } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'

/**
 * Shared test helpers for entity card components
 *
 * These helpers eliminate redundant tests across entity card components
 * (SpellCard, ItemCard, RaceCard, ClassCard, BackgroundCard, FeatCard, MonsterCard)
 *
 * Usage:
 *   const mountCard = () => mountSuspended(MyCard, { props: { entity: mockData } })
 *   testCardLinkBehavior(mountCard, '/my-entity/slug')
 *
 *   // Or use the comprehensive helper:
 *   testEntityCardBasics({
 *     component: SpellCard,
 *     propName: 'spell',
 *     mockFactory: createMockSpell,
 *     entityName: 'Fireball',
 *     linkPath: '/spells/fireball'
 *   })
 */

interface EntityCardBasicsConfig {
  /** The Vue component to test */
  component: Component
  /** The prop name for the entity (e.g., 'spell', 'item', 'monster') */
  propName: string
  /** Factory function that creates mock entities */
  mockFactory: (overrides?: Record<string, unknown>) => Record<string, unknown>
  /** Expected entity name in the rendered output */
  entityName: string
  /** Expected link href for the detail page */
  linkPath: string
  /** Optional fields that might be missing (for graceful handling tests) */
  optionalFields?: string[]
}

/**
 * Comprehensive test suite for entity card basics
 * Tests: name rendering, detail page link, hover effects, optional field handling
 */
export function testEntityCardBasics(config: EntityCardBasicsConfig) {
  const {
    component,
    propName,
    mockFactory,
    entityName,
    linkPath,
    optionalFields = []
  } = config

  describe('Entity Card Basics', () => {
    it(`renders ${propName} name`, async () => {
      const wrapper = await mountSuspended(component, {
        props: { [propName]: mockFactory() }
      })

      expect(wrapper.text()).toContain(entityName)
    })

    it('links to detail page with correct slug', async () => {
      const wrapper = await mountSuspended(component, {
        props: { [propName]: mockFactory() }
      })

      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe(linkPath)
    })

    it('applies hover effects for interactivity', async () => {
      const wrapper = await mountSuspended(component, {
        props: { [propName]: mockFactory() }
      })

      const html = wrapper.html()
      expect(html).toContain('hover')
    })

    // Test optional field handling
    optionalFields.forEach((field) => {
      it(`handles missing ${field} gracefully`, async () => {
        const wrapper = await mountSuspended(component, {
          props: { [propName]: mockFactory({ [field]: undefined }) }
        })

        // Should not crash and should still render the entity name
        expect(wrapper.text()).toContain(entityName)
      })
    })
  })
}

/**
 * Tests that entity card renders the entity name prominently
 * Use this when you only need to test name rendering
 */
export function testEntityCardName(
  mountComponent: () => Promise<VueWrapper>,
  expectedName: string
) {
  it('renders entity name prominently', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.text()).toContain(expectedName)
  })
}

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

/**
 * Test helper for card background image behavior
 * Tests that background images are rendered and styled correctly
 */
export function testBackgroundImageBehavior(
  componentName: string,
  mountComponent: () => Promise<VueWrapper>,
  options: {
    hasBackgroundImage?: boolean
  } = {}
) {
  const { hasBackgroundImage = true } = options

  describe(`${componentName} - Background Image`, () => {
    if (hasBackgroundImage) {
      it('renders background image when available', async () => {
        const wrapper = await mountComponent()
        const bgDiv = wrapper.find('[data-testid="card-background"]')
        expect(bgDiv.exists()).toBe(true)
        expect(bgDiv.attributes('style')).toContain('background-image')
      })
    } else {
      it('does not render background when image unavailable', async () => {
        const wrapper = await mountComponent()
        const bgDiv = wrapper.find('[data-testid="card-background"]')
        expect(bgDiv.exists()).toBe(false)
      })
    }
  })
}
