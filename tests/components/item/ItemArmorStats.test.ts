import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ItemArmorStats from '~/components/item/ItemArmorStats.vue'

describe('ItemArmorStats', () => {
  // Test data helpers
  const createModifier = (category: string, value: string, condition?: string | null) => ({
    modifier_category: category,
    value,
    condition
  })

  // Basic rendering - Armor Class

  it('renders armor class value', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 18,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers: [],
        isShield: false
      }
    })

    expect(wrapper.text()).toContain('18')
  })

  // Strength requirement tests

  it('renders strength requirement when present', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 18,
        strengthRequirement: 15,
        stealthDisadvantage: false,
        modifiers: [],
        isShield: false
      }
    })

    expect(wrapper.text()).toContain('15')
  })

  it('shows "None" for STR when no requirement', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 12,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers: [],
        isShield: false
      }
    })

    expect(wrapper.text()).toContain('None')
  })

  // Stealth tests

  it('renders stealth disadvantage indicator when true', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 16,
        strengthRequirement: 13,
        stealthDisadvantage: true,
        modifiers: [],
        isShield: false
      }
    })

    expect(wrapper.text()).toContain('Disadvantage')
  })

  it('shows "Normal" stealth when no disadvantage', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 12,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers: [],
        isShield: false
      }
    })

    expect(wrapper.text()).toContain('Normal')
  })

  // Dex modifier parsing tests

  it('parses dex modifier as "None" from condition', async () => {
    const modifiers = [
      createModifier('ac_base', '18', 'dex_modifier: none')
    ]

    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 18,
        strengthRequirement: 15,
        stealthDisadvantage: true,
        modifiers,
        isShield: false
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Dex Mod')
    expect(text).toContain('None')
  })

  it('parses dex modifier as "+2 max" from condition', async () => {
    const modifiers = [
      createModifier('ac_base', '15', 'dex_modifier: max_2')
    ]

    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 15,
        strengthRequirement: null,
        stealthDisadvantage: true,
        modifiers,
        isShield: false
      }
    })

    expect(wrapper.text()).toContain('+2 max')
  })

  it('parses dex modifier as "Full" when no condition', async () => {
    const modifiers = [
      createModifier('ac_base', '12', null)
    ]

    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 12,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers,
        isShield: false
      }
    })

    expect(wrapper.text()).toContain('Full')
  })

  it('parses dex modifier as "Full" when condition does not mention dex', async () => {
    const modifiers = [
      createModifier('ac_base', '12', 'some other condition')
    ]

    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 12,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers,
        isShield: false
      }
    })

    expect(wrapper.text()).toContain('Full')
  })

  // Shield display tests

  it('handles shield display with AC bonus', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 2,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers: [],
        isShield: true
      }
    })

    expect(wrapper.text()).toContain('+2')
  })

  it('does not show STR/Stealth/Dex fields for shields', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 2,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers: [],
        isShield: true
      }
    })

    const text = wrapper.text()
    expect(text).not.toContain('STR Req')
    expect(text).not.toContain('Stealth')
    expect(text).not.toContain('Dex Mod')
  })

  // Speed penalty warning tests

  it('shows speed penalty warning when STR requirement exists', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 18,
        strengthRequirement: 15,
        stealthDisadvantage: true,
        modifiers: [],
        isShield: false
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Speed reduced by 10 ft.')
    expect(text).toContain('Strength < 15')
  })

  it('does not show warning when no STR requirement', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 12,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers: [],
        isShield: false
      }
    })

    const text = wrapper.text()
    expect(text).not.toContain('Speed reduced')
    expect(text).not.toContain('Strength <')
  })

  // Null/missing value tests

  it('handles null armor class gracefully', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: null,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers: [],
        isShield: false
      }
    })

    // Should render without errors
    expect(wrapper.exists()).toBe(true)
  })

  it('handles empty modifiers array', async () => {
    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 16,
        strengthRequirement: 13,
        stealthDisadvantage: true,
        modifiers: [],
        isShield: false
      }
    })

    // Should default to "Full" dex modifier when no ac_base modifier found
    expect(wrapper.text()).toContain('Full')
  })

  it('ignores non-ac_base modifiers', async () => {
    const modifiers = [
      createModifier('skill', 'disadvantage', null),
      createModifier('speed', '-10', 'strength < 15')
    ]

    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 16,
        strengthRequirement: 13,
        stealthDisadvantage: true,
        modifiers,
        isShield: false
      }
    })

    // Should default to "Full" since no ac_base modifier
    expect(wrapper.text()).toContain('Full')
  })

  // Integration test - Complete armor

  it('displays complete plate armor stats correctly', async () => {
    const modifiers = [
      createModifier('ac_base', '18', 'dex_modifier: none')
    ]

    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 18,
        strengthRequirement: 15,
        stealthDisadvantage: true,
        modifiers,
        isShield: false
      }
    })

    const text = wrapper.text()
    // AC
    expect(text).toContain('18')
    // STR Req
    expect(text).toContain('15')
    // Stealth
    expect(text).toContain('Disadvantage')
    // Dex Mod
    expect(text).toContain('None')
    // Warning
    expect(text).toContain('Speed reduced by 10 ft.')
    expect(text).toContain('Strength < 15')
  })

  it('displays complete studded leather armor stats correctly', async () => {
    const modifiers = [
      createModifier('ac_base', '12', null)
    ]

    const wrapper = await mountSuspended(ItemArmorStats, {
      props: {
        armorClass: 12,
        strengthRequirement: null,
        stealthDisadvantage: false,
        modifiers,
        isShield: false
      }
    })

    const text = wrapper.text()
    // AC
    expect(text).toContain('12')
    // STR Req
    expect(text).toContain('None')
    // Stealth
    expect(text).toContain('Normal')
    // Dex Mod
    expect(text).toContain('Full')
    // No warning
    expect(text).not.toContain('Speed reduced')
  })
})
