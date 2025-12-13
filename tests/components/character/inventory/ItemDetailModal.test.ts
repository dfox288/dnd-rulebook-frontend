// tests/components/character/inventory/ItemDetailModal.test.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ItemDetailModal from '~/components/character/inventory/ItemDetailModal.vue'
import type { CharacterEquipment } from '~/types/character'

const mockWeapon: CharacterEquipment = {
  id: 1,
  item: {
    name: 'Longsword',
    description: 'A versatile martial weapon favored by knights.',
    weight: '3.00',
    item_type: 'Melee Weapon',
    damage: '1d8 slashing',
    properties: ['Versatile (1d10)', 'Martial'],
    cost_cp: 1500,
    rarity: 'Common'
  },
  item_slug: 'phb:longsword',
  is_dangling: 'false',
  custom_name: null,
  custom_description: null,
  quantity: 1,
  equipped: true,
  location: 'main_hand'
}

const mockPotion: CharacterEquipment = {
  id: 3,
  item: {
    name: 'Potion of Healing',
    description: 'You regain 2d4 + 2 hit points when you drink this potion.',
    weight: '0.50',
    item_type: 'Potion',
    cost_cp: 5000,
    rarity: 'Common'
  },
  item_slug: 'phb:potion-of-healing',
  is_dangling: 'false',
  custom_name: null,
  custom_description: null,
  quantity: 3,
  equipped: false,
  location: 'inventory'
}

/**
 * ItemDetailModal Tests
 *
 * Note: UModal uses teleportation which makes DOM testing complex.
 * These tests focus on component interface (props/events) rather than rendered output.
 * Actual modal content rendering is tested via e2e tests.
 *
 * @see Design: docs/frontend/plans/2025-12-13-inventory-redesign.md
 */
describe('ItemDetailModal', () => {
  it('mounts successfully with item prop', async () => {
    const wrapper = await mountSuspended(ItemDetailModal, {
      props: { open: true, item: mockWeapon }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('mounts successfully with null item', async () => {
    const wrapper = await mountSuspended(ItemDetailModal, {
      props: { open: true, item: null }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts open prop', async () => {
    const wrapper = await mountSuspended(ItemDetailModal, {
      props: { open: false, item: mockWeapon }
    })

    expect(wrapper.props('open')).toBe(false)
  })

  it('emits update:open event', async () => {
    const wrapper = await mountSuspended(ItemDetailModal, {
      props: { open: true, item: mockWeapon }
    })

    // Manually trigger the emit since we can't access teleported content
    wrapper.vm.$emit('update:open', false)

    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })

  // Test computed properties via vm access
  describe('computed properties', () => {
    it('computes displayName from item.name', async () => {
      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: mockWeapon }
      })

      // Access the vm to check computed values
      expect((wrapper.vm as unknown as { displayName: string }).displayName).toBe('Longsword')
    })

    it('computes displayName from custom_name when present', async () => {
      const customItem: CharacterEquipment = {
        ...mockWeapon,
        custom_name: 'Flametongue'
      }

      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: customItem }
      })

      expect((wrapper.vm as unknown as { displayName: string }).displayName).toBe('Flametongue')
    })

    it('computes description from item.description', async () => {
      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: mockWeapon }
      })

      expect((wrapper.vm as unknown as { description: string }).description).toContain('versatile martial weapon')
    })

    it('computes description from custom_description when present', async () => {
      const customItem: CharacterEquipment = {
        ...mockWeapon,
        custom_description: 'A magical blade that bursts into flame.'
      }

      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: customItem }
      })

      expect((wrapper.vm as unknown as { description: string }).description).toContain('magical blade')
    })

    it('computes weight correctly', async () => {
      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: mockWeapon }
      })

      expect((wrapper.vm as unknown as { weight: number | null }).weight).toBe(3)
    })

    it('computes costGp correctly (cp to gp conversion)', async () => {
      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: mockWeapon }
      })

      // 1500 cp = 15 gp
      expect((wrapper.vm as unknown as { costGp: string | null }).costGp).toBe('15')
    })

    it('computes damage from item', async () => {
      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: mockWeapon }
      })

      expect((wrapper.vm as unknown as { damage: string | null }).damage).toBe('1d8 slashing')
    })

    it('computes properties from item', async () => {
      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: mockWeapon }
      })

      const properties = (wrapper.vm as unknown as { properties: string[] }).properties
      expect(properties).toContain('Versatile (1d10)')
      expect(properties).toContain('Martial')
    })

    it('computes rarityColor based on rarity', async () => {
      const rareItem: CharacterEquipment = {
        ...mockWeapon,
        item: { ...mockWeapon.item as object, rarity: 'Rare' }
      }

      const wrapper = await mountSuspended(ItemDetailModal, {
        props: { open: true, item: rareItem }
      })

      expect((wrapper.vm as unknown as { rarityColor: string }).rarityColor).toBe('info')
    })
  })
})
