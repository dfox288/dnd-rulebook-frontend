import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RacesIndexPage from '~/pages/races/index.vue'

/**
 * Races Page - Basic Rendering Tests
 *
 * Note: Implementation details are tested via composable and component tests.
 * These tests only verify basic page mounting and rendering.
 */
describe('Races Page', () => {
  it('should mount without errors', async () => {
    const wrapper = await mountSuspended(RacesIndexPage, {
      route: '/races'
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render page with content', async () => {
    const wrapper = await mountSuspended(RacesIndexPage, {
      route: '/races'
    })

    const html = wrapper.html()
    expect(html.length).toBeGreaterThan(0)
  })
})
