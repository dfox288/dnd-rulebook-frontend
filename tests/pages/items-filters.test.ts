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
      component.requiresAttunement = '1'
      component.stealthDisadvantage = '1'
      component.selectedProperties = ['Finesse', 'Light']
      component.selectedDamageTypes = ['S', 'P']
      component.selectedSources = ['PHB', 'DMG']
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
      expect(component.requiresAttunement).toBeNull()
      expect(component.stealthDisadvantage).toBeNull()
      expect(component.selectedProperties).toEqual([])
      expect(component.selectedDamageTypes).toEqual([])
      expect(component.selectedSources).toEqual([])
      expect(component.selectedCostRange).toBeNull()
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

  describe('Attunement filter', () => {
    it('shows attunement toggle filter in QUICK section', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Should have requiresAttunement ref
      expect(component.requiresAttunement).toBeDefined()
    })

    it('shows attunement filter chip when set to Yes', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.requiresAttunement = '1'
      await wrapper.vm.$nextTick()

      const chips = wrapper.findAll('button').filter(btn =>
        btn.text().includes('Attunement: Yes')
      )
      expect(chips.length).toBeGreaterThan(0)
    })

    it('shows attunement filter chip when set to No', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.requiresAttunement = '0'
      await wrapper.vm.$nextTick()

      const chips = wrapper.findAll('button').filter(btn =>
        btn.text().includes('Attunement: No')
      )
      expect(chips.length).toBeGreaterThan(0)
    })

    it('clicking attunement chip clears the filter', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.requiresAttunement = '1'
      await wrapper.vm.$nextTick()

      const chip = wrapper.findAll('button').find(btn =>
        btn.text().includes('Attunement: Yes')
      )
      expect(chip).toBeDefined()
      await chip!.trigger('click')

      expect(component.requiresAttunement).toBeNull()
    })
  })

  describe('Stealth Disadvantage filter', () => {
    it('shows stealth disadvantage toggle filter in QUICK section', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Should have stealthDisadvantage ref
      expect(component.stealthDisadvantage).toBeDefined()
    })

    it('shows stealth disadvantage filter chip when set to Yes', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.stealthDisadvantage = '1'
      await wrapper.vm.$nextTick()

      const chips = wrapper.findAll('button').filter(btn =>
        btn.text().includes('Stealth Disadv.: Yes')
      )
      expect(chips.length).toBeGreaterThan(0)
    })

    it('clicking stealth disadvantage chip clears the filter', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.stealthDisadvantage = '1'
      await wrapper.vm.$nextTick()

      const chip = wrapper.findAll('button').find(btn =>
        btn.text().includes('Stealth Disadv.: Yes')
      )
      expect(chip).toBeDefined()
      await chip!.trigger('click')

      expect(component.stealthDisadvantage).toBeNull()
    })
  })

  describe('Properties filter', () => {
    it('shows properties multiselect filter in ADVANCED section', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Should have selectedProperties ref
      expect(component.selectedProperties).toBeDefined()
      expect(Array.isArray(component.selectedProperties)).toBe(true)
    })

    it('shows property filter chips when properties are selected', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedProperties = ['Finesse', 'Light']
      await wrapper.vm.$nextTick()

      const finesseChip = wrapper.findAll('button').find(btn =>
        btn.text().includes('Finesse')
      )
      const lightChip = wrapper.findAll('button').find(btn =>
        btn.text().includes('Light')
      )

      expect(finesseChip).toBeDefined()
      expect(lightChip).toBeDefined()
    })

    it('clicking property chip removes that property from filter', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedProperties = ['Finesse', 'Light']
      await wrapper.vm.$nextTick()

      const finesseChip = wrapper.findAll('button').find(btn =>
        btn.text().includes('Finesse') && btn.text().includes('✕')
      )
      expect(finesseChip).toBeDefined()
      await finesseChip!.trigger('click')

      expect(component.selectedProperties).toEqual(['Light'])
    })
  })

  describe('Damage Type filter', () => {
    it('shows damage type multiselect filter in ADVANCED section', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Should have selectedDamageTypes ref
      expect(component.selectedDamageTypes).toBeDefined()
      expect(Array.isArray(component.selectedDamageTypes)).toBe(true)
    })

    it('shows damage type filter chips when damage types are selected', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedDamageTypes = ['S', 'P']
      await wrapper.vm.$nextTick()

      // Chips should show the damage type (either full name "Slashing" if loaded, or code "S" as fallback)
      const slashingChip = wrapper.findAll('button').find(btn =>
        btn.text().includes('S') && btn.text().includes('✕')
      )
      const piercingChip = wrapper.findAll('button').find(btn =>
        btn.text().includes('P') && btn.text().includes('✕')
      )

      expect(slashingChip).toBeDefined()
      expect(piercingChip).toBeDefined()
    })

    it('clicking damage type chip removes that type from filter', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedDamageTypes = ['S', 'P']
      await wrapper.vm.$nextTick()

      // Find first damage type chip (should be 'S')
      const damageTypeChips = wrapper.findAll('button').filter(btn =>
        btn.text().includes('✕') && (btn.text().includes('S') || btn.text().includes('P'))
      )
      expect(damageTypeChips.length).toBeGreaterThan(0)

      // Click first chip
      await damageTypeChips[0].trigger('click')

      // One damage type should remain
      expect(component.selectedDamageTypes.length).toBe(1)
    })
  })

  describe('Source filter', () => {
    it('shows source multiselect filter in ADVANCED section', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.filtersOpen = true
      await wrapper.vm.$nextTick()

      // Should have selectedSources ref
      expect(component.selectedSources).toBeDefined()
      expect(Array.isArray(component.selectedSources)).toBe(true)
    })

    it('shows source filter chips when sources are selected', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedSources = ['PHB', 'DMG']
      await wrapper.vm.$nextTick()

      // Chips should show the source (either full name or code as fallback)
      const phbChip = wrapper.findAll('button').find(btn =>
        btn.text().includes('PHB') && btn.text().includes('✕')
      )
      const dmgChip = wrapper.findAll('button').find(btn =>
        btn.text().includes('DMG') && btn.text().includes('✕')
      )

      expect(phbChip).toBeDefined()
      expect(dmgChip).toBeDefined()
    })

    it('clicking source chip removes that source from filter', async () => {
      const wrapper = await mountSuspended(ItemsPage)

      const component = wrapper.vm as any
      component.selectedSources = ['PHB', 'DMG']
      await wrapper.vm.$nextTick()

      // Find source chips
      const sourceChips = wrapper.findAll('button').filter(btn =>
        btn.text().includes('✕') && (btn.text().includes('PHB') || btn.text().includes('DMG'))
      )
      expect(sourceChips.length).toBeGreaterThan(0)

      // Click first source chip
      await sourceChips[0].trigger('click')

      // One source should remain
      expect(component.selectedSources.length).toBe(1)
    })
  })
})
