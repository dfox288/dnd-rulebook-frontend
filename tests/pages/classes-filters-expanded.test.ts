import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClassesIndexPage from '~/pages/classes/index.vue'

describe('Classes Hit Die Filter', () => {
  it('has hit die filter state', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Should have selectedHitDice ref (array)
    expect(component.selectedHitDice).toBeDefined()
    expect(Array.isArray(component.selectedHitDice)).toBe(true)
    expect(component.selectedHitDice.length).toBe(0)
  })

  it('has correct hit die options', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Should have hitDieOptions
    expect(component.hitDieOptions).toBeDefined()
    expect(Array.isArray(component.hitDieOptions)).toBe(true)
    expect(component.hitDieOptions.length).toBe(4)

    // Verify option labels
    const labels = component.hitDieOptions.map((o: any) => o.label)
    expect(labels).toContain('d6')
    expect(labels).toContain('d8')
    expect(labels).toContain('d10')
    expect(labels).toContain('d12')
  })

  it('allows selecting multiple hit dice', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Select multiple hit dice
    component.selectedHitDice = [6, 12]
    await wrapper.vm.$nextTick()

    expect(component.selectedHitDice).toEqual([6, 12])
  })

  it('shows hit die chips when dice are selected', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any
    component.selectedHitDice = [6, 12]
    await wrapper.vm.$nextTick()

    // Look for chips
    const chips = wrapper.findAll('button').filter(btn =>
      btn.text().includes('d6') || btn.text().includes('d12')
    )
    expect(chips.length).toBeGreaterThan(0)
  })

  it('clicking chip removes that hit die from filter', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any
    component.selectedHitDice = [6, 8, 12]
    await wrapper.vm.$nextTick()

    // Find and click d8 chip
    const d8Chip = wrapper.findAll('button').find(btn =>
      btn.text().includes('d8') && btn.text().includes('✕')
    )
    expect(d8Chip).toBeDefined()
    await d8Chip!.trigger('click')

    // d8 should be removed
    expect(component.selectedHitDice).toEqual([6, 12])
  })
})

describe('Classes Spellcasting Ability Filter', () => {
  it('has spellcasting ability filter state', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Should have selectedSpellcastingAbility ref
    expect(component.selectedSpellcastingAbility).toBeDefined()
    expect(component.selectedSpellcastingAbility).toBeNull()
  })

  it('has correct spellcasting ability options', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Should have spellcastingAbilityOptions
    expect(component.spellcastingAbilityOptions).toBeDefined()
    expect(Array.isArray(component.spellcastingAbilityOptions)).toBe(true)
    expect(component.spellcastingAbilityOptions.length).toBe(4)

    // Verify option labels
    const labels = component.spellcastingAbilityOptions.map((o: any) => o.label)
    expect(labels).toContain('All Abilities')
    expect(labels).toContain('Intelligence')
    expect(labels).toContain('Wisdom')
    expect(labels).toContain('Charisma')
  })
})

describe('Classes Parent Class Filter', () => {
  it('has parent class filter state', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Should have selectedParentClass ref
    expect(component.selectedParentClass).toBeDefined()
    expect(component.selectedParentClass).toBeNull()
  })

  it('fetches parent class options from base classes', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Should have parentClassOptions computed
    expect(component.parentClassOptions).toBeDefined()
    expect(Array.isArray(component.parentClassOptions)).toBe(true)
    expect(component.parentClassOptions.length).toBeGreaterThan(0)

    // Should have "All Classes" option
    const labels = component.parentClassOptions.map((o: any) => o.label)
    expect(labels).toContain('All Classes')
  })
})

describe('Classes Sources Filter', () => {
  it('has sources filter state', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Should have selectedSources ref (array)
    expect(component.selectedSources).toBeDefined()
    expect(Array.isArray(component.selectedSources)).toBe(true)
    expect(component.selectedSources.length).toBe(0)
  })

  it('fetches source options from API', async () => {
    const wrapper = await mountSuspended(ClassesIndexPage)

    const component = wrapper.vm as any

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Should have sourceOptions computed
    expect(component.sourceOptions).toBeDefined()
    expect(Array.isArray(component.sourceOptions)).toBe(true)
  })
})
