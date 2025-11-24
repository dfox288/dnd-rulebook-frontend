import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClassesIndexPage from '~/pages/classes/index.vue'

/**
 * Classes Page - Basic Rendering Tests
 *
 * Note: Implementation details are tested via composable and component tests.
 * These tests only verify basic page mounting and rendering.
 */
describe('Classes Page', () => {
  it('should mount without errors', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage, {
      route: '/classes'
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render page with content', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage, {
      route: '/classes'
    })

    const html = wrapper.html()
    expect(html.length).toBeGreaterThan(0)
  })
})
