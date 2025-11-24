import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FeatsIndexPage from '~/pages/feats/index.vue'

/**
 * Feats Page - Basic Rendering Tests
 *
 * Note: Implementation details are tested via composable and component tests.
 * These tests only verify basic page mounting and rendering.
 */
describe('Feats Page', () => {
  it('should mount without errors', async () => {
    const wrapper = await mountSuspended(FeatsIndexPage, {
      route: '/feats'
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render page with content', async () => {
    const wrapper = await mountSuspended(FeatsIndexPage, {
      route: '/feats'
    })

    const html = wrapper.html()
    expect(html.length).toBeGreaterThan(0)
  })
})
