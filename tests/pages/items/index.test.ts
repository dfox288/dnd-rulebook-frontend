import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ItemsIndexPage from '~/pages/items/index.vue'

/**
 * Items Page - Basic Rendering Tests
 *
 * Note: Implementation details are tested via composable and component tests.
 * These tests only verify basic page mounting and rendering.
 */
describe('Items Page', () => {
  it('should mount without errors', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage, {
      route: '/items'
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render page with content', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage, {
      route: '/items'
    })

    const html = wrapper.html()
    expect(html.length).toBeGreaterThan(0)
  })
})
