import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BackgroundsPage from '~/pages/backgrounds/index.vue'

describe('Backgrounds Page - Filter Layout', () => {
  describe('active filters label', () => {
    it('displays "Active filters:" label when search is active', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = 'Noble'
      await wrapper.vm.$nextTick()

      const html = wrapper.html()
      expect(html).toContain('Active filters:')
    })

    it('does not display "Active:" (old label)', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = 'Noble'
      await wrapper.vm.$nextTick()

      const html = wrapper.html()
      // Check that "Active:" is NOT present (without "filters")
      expect(html).not.toMatch(/Active:</)
      expect(html).not.toMatch(/Active:\s*</)
    })
  })

  describe('clear filters button layout', () => {
    it('displays clear filters button on same row as active filters label', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = 'Noble'
      await wrapper.vm.$nextTick()

      // Find the parent container with justify-between
      const container = wrapper.find('.flex.flex-wrap.items-center.justify-between')
      expect(container.exists()).toBe(true)

      // Verify it contains both the label and the clear button
      const html = container.html()
      expect(html).toContain('Active filters:')
      expect(html).toContain('Clear filters')
    })

    it('does not show clear button when no filters are active', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = ''
      await wrapper.vm.$nextTick()

      // Container should not exist when no active filters
      const container = wrapper.find('.flex.flex-wrap.items-center.justify-between')
      expect(container.exists()).toBe(false)
    })

    it('clear button clears search query', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = 'Noble'
      await wrapper.vm.$nextTick()

      // Find and click clear button
      const clearButton = wrapper.find('button')
      const clearButtonText = clearButton.text()

      // Find the button that says "Clear filters" (not the search clear button)
      const buttons = wrapper.findAll('button')
      const clearFiltersButton = buttons.find(btn => btn.text().includes('Clear filters'))

      expect(clearFiltersButton).toBeDefined()
      await clearFiltersButton!.trigger('click')

      // Search should be cleared
      expect(component.searchQuery).toBe('')
    })
  })

  describe('filter chip display', () => {
    it('displays search query chip', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = 'Noble'
      await wrapper.vm.$nextTick()

      const html = wrapper.html()
      expect(html).toContain('"Noble"')
      expect(html).toContain('✕')
    })

    it('clicking search chip clears search', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = 'Noble'
      await wrapper.vm.$nextTick()

      // Find and click search chip (the one with the query text)
      const chips = wrapper.findAll('button')
      const searchChip = chips.find(btn => btn.text().includes('"Noble"'))

      expect(searchChip).toBeDefined()
      await searchChip!.trigger('click')

      expect(component.searchQuery).toBe('')
    })
  })

  describe('layout structure', () => {
    it('uses flex-wrap for responsive chip layout', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = 'Noble'
      await wrapper.vm.$nextTick()

      const container = wrapper.find('.flex.flex-wrap.items-center.justify-between')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('flex-wrap')
    })

    it('groups label and chips together on left side', async () => {
      const wrapper = await mountSuspended(BackgroundsPage)

      const component = wrapper.vm as any
      component.searchQuery = 'Noble'
      await wrapper.vm.$nextTick()

      // Find the inner flex container with chips
      const innerContainer = wrapper.find('.flex.flex-wrap.items-center.gap-2')
      expect(innerContainer.exists()).toBe(true)

      // Should contain both label and chip
      expect(innerContainer.text()).toContain('Active filters:')
      expect(innerContainer.text()).toContain('"Noble"')
    })
  })
})
