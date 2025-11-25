import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RacesPage from '~/pages/races/index.vue'

describe('Races Page - Filter Layout', () => {
  describe('Size filter layout', () => {
    it('does not display label before size filter buttons', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Open filters first
      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Look for the size filter label (should NOT exist)
      const sizeLabel = wrapper.find('[data-testid="size-filter-label"]')
      expect(sizeLabel.exists()).toBe(false)
    })

    it('displays size filter buttons', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Open filters first
      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Wait for sizes to load
      await wrapper.vm.$nextTick()

      // Look for the size filter buttons container
      const sizeButtons = wrapper.find('[data-testid="size-filter-buttons"]')
      expect(sizeButtons.exists()).toBe(true)
    })
  })

  describe('Active filters section', () => {
    it('displays "Active filters:" label (not "Active:")', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Set a filter to make section visible
      const component = wrapper.vm as any
      component.selectedSize = 'M'
      await wrapper.vm.$nextTick()

      // Look for the label
      const label = wrapper.find('[data-testid="active-filters-label"]')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Active filters:')
      expect(label.text()).not.toBe('Active:')
    })

    it('displays size filter chip when size is selected', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Select a size
      const component = wrapper.vm as any
      component.selectedSize = 'M'
      await wrapper.vm.$nextTick()

      // Look for the chip
      const chip = wrapper.find('[data-testid="size-filter-chip"]')
      expect(chip.exists()).toBe(true)
      expect(chip.text()).toContain('✕')
    })

    it('clicking size chip clears size filter', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Select a size
      const component = wrapper.vm as any
      component.selectedSize = 'M'
      await wrapper.vm.$nextTick()

      // Click chip
      const chip = wrapper.find('[data-testid="size-filter-chip"]')
      await chip.trigger('click')

      // Size should be cleared
      expect(component.selectedSize).toBe('')
    })

    it('does not show size chip when no size selected', async () => {
      const wrapper = await mountSuspended(RacesPage)

      const component = wrapper.vm as any
      component.selectedSize = ''
      await wrapper.vm.$nextTick()

      // Chip should not exist
      const chip = wrapper.find('[data-testid="size-filter-chip"]')
      expect(chip.exists()).toBe(false)
    })
  })

  describe('Clear filters button position', () => {
    it('displays Clear filters button on same row as Active filters label', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Set a filter to make section visible
      const component = wrapper.vm as any
      component.selectedSize = 'M'
      await wrapper.vm.$nextTick()

      // Look for the parent container
      const container = wrapper.find('[data-testid="active-filters-row"]')
      expect(container.exists()).toBe(true)

      // Check that it has justify-between class (for right-alignment)
      expect(container.classes()).toContain('justify-between')

      // Look for the Clear filters button
      const clearButton = wrapper.find('[data-testid="clear-filters-button"]')
      expect(clearButton.exists()).toBe(true)
      expect(clearButton.text()).toContain('Clear filters')
    })

    it('Clear filters button only shows when filters are active', async () => {
      const wrapper = await mountSuspended(RacesPage)

      const component = wrapper.vm as any

      // No filters - button should not exist
      component.selectedSize = ''
      component.searchQuery = ''
      await wrapper.vm.$nextTick()

      let clearButton = wrapper.find('[data-testid="clear-filters-button"]')
      expect(clearButton.exists()).toBe(false)

      // Add filter - button should appear
      component.selectedSize = 'M'
      await wrapper.vm.$nextTick()

      clearButton = wrapper.find('[data-testid="clear-filters-button"]')
      expect(clearButton.exists()).toBe(true)
    })

    it('clicking Clear filters button clears all filters', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Set filters
      const component = wrapper.vm as any
      component.selectedSize = 'M'
      component.searchQuery = 'Elf'
      await wrapper.vm.$nextTick()

      // Click Clear filters button
      const clearButton = wrapper.find('[data-testid="clear-filters-button"]')
      await clearButton.trigger('click')

      // All filters should be cleared
      expect(component.selectedSize).toBe('')
      expect(component.searchQuery).toBe('')
    })
  })

  describe('Search query chip', () => {
    it('displays search query chip when search is active', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Set search query
      const component = wrapper.vm as any
      component.searchQuery = 'Elf'
      await wrapper.vm.$nextTick()

      // Look for the chip
      const chip = wrapper.find('[data-testid="search-query-chip"]')
      expect(chip.exists()).toBe(true)
      expect(chip.text()).toContain('Elf')
      expect(chip.text()).toContain('✕')
    })

    it('clicking search query chip clears search', async () => {
      const wrapper = await mountSuspended(RacesPage)

      // Set search query
      const component = wrapper.vm as any
      component.searchQuery = 'Elf'
      await wrapper.vm.$nextTick()

      // Click chip
      const chip = wrapper.find('[data-testid="search-query-chip"]')
      await chip.trigger('click')

      // Search should be cleared
      expect(component.searchQuery).toBe('')
    })
  })
})
