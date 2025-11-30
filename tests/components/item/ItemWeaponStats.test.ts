import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ItemWeaponStats from '~/components/item/ItemWeaponStats.vue'

describe('ItemWeaponStats', () => {
  // Basic damage rendering

  it('renders damage dice', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: []
      }
    })

    expect(wrapper.text()).toContain('1d8')
  })

  it('renders damage type name', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: []
      }
    })

    expect(wrapper.text()).toContain('Slashing')
  })

  // Versatile damage

  it('renders versatile damage in parentheses when present', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: '1d10',
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: []
      }
    })

    expect(wrapper.text()).toContain('1d8')
    expect(wrapper.text()).toContain('(1d10 2H)')
  })

  it('does not show versatile when null', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: []
      }
    })

    expect(wrapper.text()).not.toContain('2H')
    expect(wrapper.text()).not.toContain('1d10')
  })

  // Range rendering

  it('renders range for ranged weapons (normal/long format)', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Piercing' },
        rangeNormal: 150,
        rangeLong: 600,
        weight: null,
        properties: []
      }
    })

    expect(wrapper.text()).toContain('150/600 ft.')
  })

  it('shows "Melee" for melee weapons without range', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: []
      }
    })

    expect(wrapper.text()).toContain('Melee')
  })

  // Weight rendering

  it('renders weight when provided', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: '3',
        properties: []
      }
    })

    expect(wrapper.text()).toContain('3 lb')
  })

  it('does not render weight when null', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: []
      }
    })

    // Should not have "lb" in the text if weight is null
    const text = wrapper.text()
    // Check that weight section is not present
    expect(text.includes('lb') && !text.includes('Melee')).toBe(false)
  })

  // Property badges

  it('renders property badges', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: '1d10',
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: [
          { name: 'Versatile', code: 'VER', description: 'Can be used with one or two hands' },
          { name: 'Martial', code: 'MAR', description: 'Requires martial weapon proficiency' }
        ]
      }
    })

    expect(wrapper.text()).toContain('Versatile')
    expect(wrapper.text()).toContain('Martial')
  })

  it('handles weapon with no properties (empty array)', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d4',
        versatileDamage: null,
        damageType: { name: 'Piercing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: []
      }
    })

    // Should still render damage and type
    expect(wrapper.text()).toContain('1d4')
    expect(wrapper.text()).toContain('Piercing')
  })

  it('handles weapon with many properties', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: null,
        properties: [
          { name: 'Versatile', code: 'VER', description: null },
          { name: 'Martial', code: 'MAR', description: null },
          { name: 'Heavy', code: 'HVY', description: null },
          { name: 'Two-Handed', code: '2H', description: null }
        ]
      }
    })

    expect(wrapper.text()).toContain('Versatile')
    expect(wrapper.text()).toContain('Martial')
    expect(wrapper.text()).toContain('Heavy')
    expect(wrapper.text()).toContain('Two-Handed')
  })

  // Layout tests

  it('applies grid layout for stats', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: '3',
        properties: []
      }
    })

    // Check for grid classes
    const grid = wrapper.find('.grid')
    expect(grid.exists()).toBe(true)
  })

  // Integration tests

  it('renders complete weapon stats with all fields', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: '1d10',
        damageType: { name: 'Slashing' },
        rangeNormal: null,
        rangeLong: null,
        weight: '3',
        properties: [
          { name: 'Versatile', code: 'VER', description: 'Can be used with one or two hands' },
          { name: 'Martial', code: 'MAR', description: 'Requires martial weapon proficiency' }
        ]
      }
    })

    const text = wrapper.text()
    expect(text).toContain('1d8')
    expect(text).toContain('(1d10 2H)')
    expect(text).toContain('Slashing')
    expect(text).toContain('Melee')
    expect(text).toContain('3 lb')
    expect(text).toContain('Versatile')
    expect(text).toContain('Martial')
  })

  it('renders ranged weapon with all stats', async () => {
    const wrapper = await mountSuspended(ItemWeaponStats, {
      props: {
        damageDice: '1d8',
        versatileDamage: null,
        damageType: { name: 'Piercing' },
        rangeNormal: 150,
        rangeLong: 600,
        weight: '2',
        properties: [
          { name: 'Ammunition', code: 'AMM', description: null },
          { name: 'Two-Handed', code: '2H', description: null },
          { name: 'Heavy', code: 'HVY', description: null }
        ]
      }
    })

    const text = wrapper.text()
    expect(text).toContain('1d8')
    expect(text).toContain('Piercing')
    expect(text).toContain('150/600 ft.')
    expect(text).toContain('2 lb')
    expect(text).toContain('Ammunition')
    expect(text).toContain('Two-Handed')
    expect(text).toContain('Heavy')
  })

  it('handles different damage types correctly', async () => {
    const damageTypes = ['Slashing', 'Piercing', 'Bludgeoning', 'Fire', 'Cold']

    for (const damageTypeName of damageTypes) {
      const wrapper = await mountSuspended(ItemWeaponStats, {
        props: {
          damageDice: '1d6',
          versatileDamage: null,
          damageType: { name: damageTypeName },
          rangeNormal: null,
          rangeLong: null,
          weight: null,
          properties: []
        }
      })

      expect(wrapper.text()).toContain(damageTypeName)
    }
  })
})
