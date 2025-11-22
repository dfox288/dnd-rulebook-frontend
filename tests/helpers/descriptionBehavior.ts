import { describe, it, expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'

/**
 * Shared test helpers for description handling in entity cards
 *
 * Tests common description behavior:
 * - Long descriptions are truncated with ellipsis
 * - Short descriptions are displayed fully
 * - Missing descriptions show default fallback text
 *
 * Usage:
 *   testDescriptionTruncation(
 *     () => mountSuspended(Card, { props: { entity: { description: 'A'.repeat(200) } } }),
 *     () => mountSuspended(Card, { props: { entity: { description: 'Short' } } })
 *   )
 */

/**
 * Tests that long descriptions are truncated and short ones are preserved
 */
export function testDescriptionTruncation(
  mountLongDescription: () => Promise<VueWrapper>,
  mountShortDescription: () => Promise<VueWrapper>
) {
  it('truncates long descriptions', async () => {
    const wrapper = await mountLongDescription()
    const text = wrapper.text()
    expect(text).toContain('...')
    // Should be significantly shorter than 200 chars
    expect(text.length).toBeLessThan(300)
  })

  it('does not truncate short descriptions', async () => {
    const wrapper = await mountShortDescription()
    const text = wrapper.text()
    expect(text).toContain('Short')
    expect(text).not.toContain('...')
  })
}

/**
 * Tests that missing description shows appropriate fallback text
 */
export function testMissingDescriptionFallback(
  mountComponent: () => Promise<VueWrapper>,
  expectedDefault: string
) {
  it('shows default description when not provided', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.text()).toContain(expectedDefault)
  })
}
