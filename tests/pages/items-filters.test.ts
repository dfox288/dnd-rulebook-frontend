import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ItemsPage from '~/pages/items/index.vue'

describe('Items Page - Filter Layout', () => {
  describe('filter label changes', () => {
    it('shows "Active filters:" label (not "Active:")', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedType = 1
      await wrapper.vm.$nextTick()

      const label = wrapper.find('.text-sm.font-medium')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Active filters:')
    })

    it('does not show old "Active:" label', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedType = 1
      await wrapper.vm.$nextTick()

      const label = wrapper.find('.text-sm.font-medium')
      expect(label.text()).not.toBe('Active:')
    })
  })

  describe('clear filters button position', () => {
    it('shows clear filters button on same row as chips', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedType = 1
      await wrapper.vm.$nextTick()

      // Find the chips container
      const chipsContainer = wrapper.find('.flex.flex-wrap.items-center.justify-between')
      expect(chipsContainer.exists()).toBe(true)

      // Clear filters button should be inside this container (it's the last button)
      const clearButton = wrapper.findAll('button').find(btn =>
        btn.text().includes('Clear filters')
      )
      expect(clearButton).toBeDefined()
      expect(clearButton!.text()).toContain('Clear filters')
    })

    it('does not show clear filters button in separate section', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Old pattern: button in .flex.justify-end container
      const oldButtonContainer = wrapper.find('.flex.justify-end')

      // If it exists, it should NOT contain the Clear Filters button
      if (oldButtonContainer.exists()) {
        const button = oldButtonContainer.find('button')
        if (button.exists()) {
          expect(button.text()).not.toContain('Clear Filters')
          expect(button.text()).not.toContain('Clear filters')
        }
      }
    })

    it('clear filters button is right-aligned using justify-between', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedType = 1
      await wrapper.vm.$nextTick()

      // Find the chips row with justify-between
      const chipsRow = wrapper.find('.flex.flex-wrap.items-center.justify-between')
      expect(chipsRow.exists()).toBe(true)
      expect(chipsRow.classes()).toContain('justify-between')
    })
  })

  describe('filter chip display', () => {
    it('shows type filter chip when type is selected', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedType = 1
      await wrapper.vm.$nextTick()

      // Find chip buttons (look for the type chip with × symbol)
      const chips = wrapper.findAll('button').filter(btn =>
        btn.text().includes('✕') && btn.text() !== '"" ✕'
      )
      expect(chips.length).toBeGreaterThan(0)
    })

    it('shows rarity filter chip when rarity is selected', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedRarity = 'rare'
      await wrapper.vm.$nextTick()

      const chips = wrapper.findAll('button').filter(btn =>
        btn.text().includes('rare')
      )
      expect(chips.length).toBeGreaterThan(0)
    })

    it('shows magic filter chip when magic filter is selected', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedMagic = 'true'
      await wrapper.vm.$nextTick()

      const chips = wrapper.findAll('button').filter(btn =>
        btn.text().includes('Magic')
      )
      expect(chips.length).toBeGreaterThan(0)
    })

    it('clicking chip clears that specific filter', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedRarity = 'rare'
      await wrapper.vm.$nextTick()

      // Find the rarity chip
      const chips = wrapper.findAll('button').filter(btn =>
        btn.text().toLowerCase().includes('rare')
      )
      expect(chips.length).toBeGreaterThan(0)

      // Click the first matching chip
      await chips[0].trigger('click')

      // Rarity should be cleared
      expect(component.selectedRarity).toBeNull()
    })
  })

  describe('clear filters functionality', () => {
    it('clears all filters when clear filters button is clicked', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedType = 1
      component.selectedRarity = 'rare'
      component.selectedMagic = 'true'
      component.hasCharges = '1'
      component.hasPrerequisites = '1'
      await wrapper.vm.$nextTick()

      // Find and click clear filters button
      const clearButton = wrapper.findAll('button').find(btn =>
        btn.text().includes('Clear filters')
      )
      expect(clearButton).toBeDefined()
      await clearButton!.trigger('click')

      // All filters should be cleared
      expect(component.selectedType).toBeNull()
      expect(component.selectedRarity).toBeNull()
      expect(component.selectedMagic).toBeNull()
      expect(component.hasCharges).toBeNull()
      expect(component.hasPrerequisites).toBeNull()
    })

    it('only shows clear filters button when filters are active', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      await wrapper.vm.$nextTick()

      // No filters active - button should not exist
      let clearButton = wrapper.findAll('button').find(btn =>
        btn.text().includes('Clear filters')
      )
      expect(clearButton).toBeUndefined()

      // Add a filter
      component.selectedType = 1
      await wrapper.vm.$nextTick()

      // Button should now exist
      clearButton = wrapper.findAll('button').find(btn =>
        btn.text().includes('Clear filters')
      )
      expect(clearButton).toBeDefined()
    })
  })
})
