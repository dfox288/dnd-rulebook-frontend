import { it, expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'

/**
 * Shared test helpers for source footer rendering in entity cards
 *
 * Tests that source information is displayed correctly:
 * - Shows source name when sources are provided
 * - Handles missing sources gracefully
 *
 * Usage:
 *   testSourceFooter(
 *     () => mountSuspended(Card, { props: { entity: mockWithSources } }),
 *     'Player\'s Handbook'
 *   )
 */

/**
 * Tests that source footer displays source name
 */
export function testSourceFooter(
  mountComponent: () => Promise<VueWrapper>,
  expectedSourceName: string
) {
  it('renders sources footer', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.text()).toContain(expectedSourceName)
  })
}

/**
 * Tests that component handles missing sources gracefully
 */
export function testOptionalSourceFooter(
  mountWithoutSources: () => Promise<VueWrapper>,
  entityName: string
) {
  it('handles missing sources gracefully', async () => {
    const wrapper = await mountWithoutSources()
    // Should still render entity name without crashing
    expect(wrapper.text()).toContain(entityName)
  })
}
