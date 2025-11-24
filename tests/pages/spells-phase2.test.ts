import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import SpellsPage from '~/pages/spells/index.vue'

describe('Spells Page - Phase 2: Component Flags', () => {
  describe('Filter State Initialization', () => {
    it('initializes verbal filter from URL query parameter', async () => {
      // RED: This test will fail because verbalFilter doesn't exist yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: { has_verbal: '1' }
        }
      })

      // Should initialize verbalFilter ref with '1' from URL
      expect(wrapper.vm.verbalFilter).toBe('1')
    })

    it('initializes somatic filter from URL query parameter', async () => {
      // RED: This test will fail because somaticFilter doesn't exist yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: { has_somatic: '0' }
        }
      })

      expect(wrapper.vm.somaticFilter).toBe('0')
    })

    it('initializes material filter from URL query parameter', async () => {
      // RED: This test will fail because materialFilter doesn't exist yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: { has_material: '1' }
        }
      })

      expect(wrapper.vm.materialFilter).toBe('1')
    })

    it('initializes higher levels filter from URL query parameter', async () => {
      // RED: This test will fail because higherLevelsFilter doesn't exist yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: { has_higher_levels: '1' }
        }
      })

      expect(wrapper.vm.higherLevelsFilter).toBe('1')
    })

    it('defaults component filters to null when no URL parameters', async () => {
      // RED: This test will fail because filters don't exist yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: {}
        }
      })

      expect(wrapper.vm.verbalFilter).toBeNull()
      expect(wrapper.vm.somaticFilter).toBeNull()
      expect(wrapper.vm.materialFilter).toBeNull()
      expect(wrapper.vm.higherLevelsFilter).toBeNull()
    })
  })

  describe('Query Builder Integration', () => {
    it('includes has_verbal in query params when set to "1"', async () => {
      // RED: This will fail because queryBuilder doesn't include has_verbal yet
      const wrapper = await mountSuspended(SpellsPage)

      wrapper.vm.verbalFilter = '1'
      await wrapper.vm.$nextTick()

      const queryParams = wrapper.vm.queryBuilder
      expect(queryParams.has_verbal).toBe('1')
    })

    it('includes has_verbal in query params when set to "0"', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      wrapper.vm.verbalFilter = '0'
      await wrapper.vm.$nextTick()

      const queryParams = wrapper.vm.queryBuilder
      expect(queryParams.has_verbal).toBe('0')
    })

    it('excludes has_verbal from query params when null', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      wrapper.vm.verbalFilter = null
      await wrapper.vm.$nextTick()

      const queryParams = wrapper.vm.queryBuilder
      expect(queryParams.has_verbal).toBeUndefined()
    })

    it('includes all component flags in query params when set', async () => {
      // RED: This will fail because queryBuilder doesn't include Phase 2 filters yet
      const wrapper = await mountSuspended(SpellsPage)

      wrapper.vm.verbalFilter = '1'
      wrapper.vm.somaticFilter = '0'
      wrapper.vm.materialFilter = '1'
      wrapper.vm.higherLevelsFilter = '1'
      await wrapper.vm.$nextTick()

      const queryParams = wrapper.vm.queryBuilder
      expect(queryParams.has_verbal).toBe('1')
      expect(queryParams.has_somatic).toBe('0')
      expect(queryParams.has_material).toBe('1')
      expect(queryParams.has_higher_levels).toBe('1')
    })

    it('combines Phase 2 filters with existing filters', async () => {
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: { level: '3', concentration: '1' }
        }
      })

      wrapper.vm.verbalFilter = '1'
      await wrapper.vm.$nextTick()

      const queryParams = wrapper.vm.queryBuilder
      expect(queryParams.level).toBe(3)
      expect(queryParams.concentration).toBe('1')
      expect(queryParams.has_verbal).toBe('1')
    })
  })

  describe('Filter Chips', () => {
    it('displays verbal component chip when filter is active', async () => {
      // RED: This will fail because verbal chip doesn't exist yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: { has_verbal: '1' }
        }
      })

      const chips = wrapper.findAll('[data-testid="filter-chip"]')
      const verbalChip = chips.find(chip => chip.text().includes('Verbal'))
      expect(verbalChip).toBeTruthy()
      expect(verbalChip?.text()).toContain('Yes')
    })

    it('displays "No" in verbal chip when filter is "0"', async () => {
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: { has_verbal: '0' }
        }
      })

      const chips = wrapper.findAll('[data-testid="filter-chip"]')
      const verbalChip = chips.find(chip => chip.text().includes('Verbal'))
      expect(verbalChip?.text()).toContain('No')
    })

    it('displays all 4 component filter chips when all are active', async () => {
      // RED: This will fail because chips don't exist yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: {
            has_verbal: '1',
            has_somatic: '0',
            has_material: '1',
            has_higher_levels: '1'
          }
        }
      })

      const text = wrapper.text()
      expect(text).toContain('Verbal:')
      expect(text).toContain('Somatic:')
      expect(text).toContain('Material:')
      expect(text).toContain('Scaling:') // "At Higher Levels" shortened to "Scaling"
    })

    it('removes verbal filter when chip is clicked', async () => {
      // RED: This will fail because chip removal doesn't exist yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: { has_verbal: '1' }
        }
      })

      const chips = wrapper.findAll('[data-testid="filter-chip"]')
      const verbalChip = chips.find(chip => chip.text().includes('Verbal'))

      await verbalChip?.trigger('click')

      expect(wrapper.vm.verbalFilter).toBeNull()
    })
  })

  describe('Clear Filters Function', () => {
    it('resets all Phase 2 filters when clearFilters is called', async () => {
      // RED: This will fail because clearFilters doesn't reset Phase 2 filters yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: {
            has_verbal: '1',
            has_somatic: '0',
            has_material: '1',
            has_higher_levels: '1'
          }
        }
      })

      await wrapper.vm.clearFilters()

      expect(wrapper.vm.verbalFilter).toBeNull()
      expect(wrapper.vm.somaticFilter).toBeNull()
      expect(wrapper.vm.materialFilter).toBeNull()
      expect(wrapper.vm.higherLevelsFilter).toBeNull()
    })

    it('resets Phase 2 filters without affecting other filters', async () => {
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: {
            level: '3',
            has_verbal: '1'
          }
        }
      })

      wrapper.vm.verbalFilter = null
      await wrapper.vm.$nextTick()

      // Level filter should still be set
      expect(wrapper.vm.selectedLevel).toBe(3)
    })
  })

  describe('Active Filter Count', () => {
    it('includes verbal filter in active count when set', async () => {
      // RED: This will fail because activeFilterCount doesn't include Phase 2 filters yet
      const wrapper = await mountSuspended(SpellsPage)

      const initialCount = wrapper.vm.activeFilterCount

      wrapper.vm.verbalFilter = '1'
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeFilterCount).toBe(initialCount + 1)
    })

    it('includes all Phase 2 filters in active count', async () => {
      // RED: This will fail because activeFilterCount doesn't include Phase 2 filters yet
      const wrapper = await mountSuspended(SpellsPage, {
        route: {
          query: {
            has_verbal: '1',
            has_somatic: '0',
            has_material: '1',
            has_higher_levels: '1'
          }
        }
      })

      // Should have 4 Phase 2 filters active
      expect(wrapper.vm.activeFilterCount).toBeGreaterThanOrEqual(4)
    })

    it('does not count Phase 2 filters when null', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      wrapper.vm.verbalFilter = null
      wrapper.vm.somaticFilter = null
      wrapper.vm.materialFilter = null
      wrapper.vm.higherLevelsFilter = null
      await wrapper.vm.$nextTick()

      // Count should only include other active filters, not Phase 2
      const count = wrapper.vm.activeFilterCount
      expect(count).toBe(0) // Assuming no other filters are active
    })
  })

  describe('UI Component Rendering', () => {
    it('renders 4 UiFilterToggle components for Phase 2', async () => {
      // RED: This will fail because UiFilterToggle components aren't added yet
      const wrapper = await mountSuspended(SpellsPage)

      const toggles = wrapper.findAllComponents({ name: 'UiFilterToggle' })

      // Should have 2 existing (concentration, ritual) + 4 new (Phase 2) = 6 total
      expect(toggles.length).toBeGreaterThanOrEqual(6)
    })

    it('renders verbal toggle with correct label', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      const text = wrapper.text()
      expect(text).toContain('Verbal')
    })

    it('renders somatic toggle with correct label', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      const text = wrapper.text()
      expect(text).toContain('Somatic')
    })

    it('renders material toggle with correct label', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      const text = wrapper.text()
      expect(text).toContain('Material')
    })

    it('renders higher levels toggle with correct label', async () => {
      const wrapper = await mountSuspended(SpellsPage)

      const text = wrapper.text()
      expect(text).toContain('At Higher Levels') // Or "Scaling"
    })
  })
})
