import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SpellsPage from '~/pages/spells/index.vue'

describe('Spells Page - Level Range Filtering', () => {
  describe('UI components', () => {
    it('displays level filter mode toggle', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Open filters first
      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Look for the filter mode toggle
      const toggle = wrapper.find('[data-testid="level-filter-mode-toggle"]')
      expect(toggle.exists()).toBe(true)
    })

    it('shows exact level dropdown in exact mode', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Open filters first
      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Check for exact level dropdown (should be visible by default)
      const exactDropdown = wrapper.find('[data-testid="level-exact-select"]')
      expect(exactDropdown.exists()).toBe(true)
    })

    it('shows min/max level dropdowns in range mode', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Open filters first
      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Toggle to range mode
      const modeToggle = wrapper.find('[data-testid="level-filter-mode-toggle"]')
      const rangeButton = modeToggle.findAll('button').find(btn => btn.text().includes('Range'))
      await rangeButton?.trigger('click')

      // Check for min/max dropdowns
      const minDropdown = wrapper.find('[data-testid="level-min-select"]')
      const maxDropdown = wrapper.find('[data-testid="level-max-select"]')

      expect(minDropdown.exists()).toBe(true)
      expect(maxDropdown.exists()).toBe(true)
    })
  })

  describe('filter mode switching', () => {
    it('switches from exact to range mode', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Open filters first
      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      const modeToggle = wrapper.find('[data-testid="level-filter-mode-toggle"]')

      // Initially in exact mode
      const exactButton = modeToggle.findAll('button').find(btn => btn.text().includes('Exact'))
      expect(exactButton?.classes()).toContain('bg-primary-500')

      // Click range button
      const rangeButton = modeToggle.findAll('button').find(btn => btn.text().includes('Range'))
      await rangeButton?.trigger('click')

      // Range button should now be active
      expect(rangeButton?.classes()).toContain('bg-primary-500')
    })

    it('clears exact level when switching to range mode', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Open filters first
      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Set exact level
      component.selectedLevel = 3
      await wrapper.vm.$nextTick()

      // Switch to range mode
      const modeToggle = wrapper.find('[data-testid="level-filter-mode-toggle"]')
      const rangeButton = modeToggle.findAll('button').find(btn => btn.text().includes('Range'))
      await rangeButton?.trigger('click')

      // Exact level should be cleared
      expect(component.selectedLevel).toBeNull()
    })

    it('clears min/max levels when switching to exact mode', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Open filters first
      const component = wrapper.vm as any
      component.filtersOpen = true
      component.levelFilterMode = 'range'
      await wrapper.vm.$nextTick()

      // Set min/max
      component.minLevel = 1
      component.maxLevel = 3
      await wrapper.vm.$nextTick()

      // Switch back to exact mode
      const modeToggle = wrapper.find('[data-testid="level-filter-mode-toggle"]')
      const exactButton = modeToggle.findAll('button').find(btn => btn.text().includes('Exact'))
      await exactButton?.trigger('click')

      // Min/max should be cleared
      expect(component.minLevel).toBeNull()
      expect(component.maxLevel).toBeNull()
    })
  })

  describe('filter chip display', () => {
    it('shows "Level X" chip for exact level', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Set exact level
      const component = wrapper.vm as any
      component.selectedLevel = 3

      await wrapper.vm.$nextTick()

      // Look for chip
      const chip = wrapper.find('[data-testid="level-filter-chip"]')
      expect(chip.exists()).toBe(true)
      expect(chip.text()).toContain('Level 3')
    })

    it('shows "Levels X-Y" chip for range', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Switch to range mode and set values
      const component = wrapper.vm as any
      component.levelFilterMode = 'range'
      component.minLevel = 1
      component.maxLevel = 3

      await wrapper.vm.$nextTick()

      // Look for chip
      const chip = wrapper.find('[data-testid="level-filter-chip"]')
      expect(chip.exists()).toBe(true)
      expect(chip.text()).toContain('Levels 1-3')
    })

    it('shows "Level X+" chip for min only', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Switch to range mode and set min only
      const component = wrapper.vm as any
      component.levelFilterMode = 'range'
      component.minLevel = 5
      component.maxLevel = null

      await wrapper.vm.$nextTick()

      // Look for chip
      const chip = wrapper.find('[data-testid="level-filter-chip"]')
      expect(chip.exists()).toBe(true)
      expect(chip.text()).toContain('Level 5+')
    })

    it('shows "Level X or lower" chip for max only', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Switch to range mode and set max only
      const component = wrapper.vm as any
      component.levelFilterMode = 'range'
      component.minLevel = null
      component.maxLevel = 3

      await wrapper.vm.$nextTick()

      // Look for chip
      const chip = wrapper.find('[data-testid="level-filter-chip"]')
      expect(chip.exists()).toBe(true)
      expect(chip.text()).toContain('Level 3 or lower')
    })

    it('clicking chip clears level filter', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      // Set exact level
      const component = wrapper.vm as any
      component.selectedLevel = 3

      await wrapper.vm.$nextTick()

      // Click chip
      const chip = wrapper.find('[data-testid="level-filter-chip"]')
      await chip.trigger('click')

      // Level should be cleared
      expect(component.selectedLevel).toBeNull()
    })
  })
})
