// tests/components/character/inventory/ItemRow.test.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ItemRow from '~/components/character/inventory/ItemRow.vue'
import type { CharacterEquipment } from '~/types/character'

// Mock equipment item - equipped weapon
const mockEquippedItem: CharacterEquipment = {
  id: 1,
  item: {
    name: 'Longsword',
    description: 'A versatile martial weapon favored by many warriors.',
    weight: '3.00',
    item_type: 'Melee Weapon',
    damage: '1d8 slashing'
  },
  item_slug: 'phb:longsword',
  is_dangling: 'false',
  custom_name: null,
  custom_description: null,
  quantity: 1,
  equipped: true,
  location: 'main_hand'
}

// Mock equipment item - unequipped with quantity
const mockStackableItem: CharacterEquipment = {
  id: 2,
  item: {
    name: 'Potion of Healing',
    description: 'A red liquid that restores 2d4+2 hit points.',
    weight: '0.50',
    item_type: 'Potion'
  },
  item_slug: 'phb:potion-of-healing',
  is_dangling: 'false',
  custom_name: null,
  custom_description: null,
  quantity: 3,
  equipped: false,
  location: 'inventory'
}

// Mock armor with AC
const mockArmor: CharacterEquipment = {
  id: 3,
  item: {
    name: 'Chain Mail',
    description: 'Heavy armor made of interlocking metal rings.',
    weight: '55.00',
    item_type: 'Heavy Armor',
    armor_class: 16
  },
  item_slug: 'phb:chain-mail',
  is_dangling: 'false',
  custom_name: null,
  custom_description: null,
  quantity: 1,
  equipped: true,
  location: 'worn'
}

// Custom item (no item_slug)
const mockCustomItem: CharacterEquipment = {
  id: 4,
  item: null,
  item_slug: null,
  is_dangling: 'false',
  custom_name: 'Lucky Coin',
  custom_description: 'A coin that belonged to your grandfather.',
  quantity: 1,
  equipped: false,
  location: 'inventory'
}

describe('ItemRow', () => {
  describe('display', () => {
    it('displays item name from item data', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      expect(wrapper.text()).toContain('Longsword')
    })

    it('displays custom name when present', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockCustomItem, editable: true }
      })

      expect(wrapper.text()).toContain('Lucky Coin')
    })

    it('shows quantity badge when quantity > 1', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockStackableItem, editable: true }
      })

      expect(wrapper.text()).toContain('×3')
    })

    it('hides quantity badge when quantity is 1', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      expect(wrapper.text()).not.toContain('×1')
    })
  })

  describe('equipped status', () => {
    it('shows location badge when item is equipped in main_hand', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      expect(wrapper.text()).toContain('Main Hand')
    })

    it('shows location badge when item is worn armor', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockArmor, editable: true }
      })

      expect(wrapper.text()).toContain('Worn')
    })

    it('hides location badge when item is in inventory', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockStackableItem, editable: true }
      })

      // Should not have any equipped badge
      expect(wrapper.text()).not.toContain('Main Hand')
      expect(wrapper.text()).not.toContain('Off Hand')
      expect(wrapper.text()).not.toContain('Worn')
      expect(wrapper.text()).not.toContain('Attuned')
    })
  })

  describe('expand/collapse', () => {
    it('is collapsed by default', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      expect(wrapper.find('[data-testid="item-details"]').exists()).toBe(false)
    })

    it('expands to show details when clicked', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      await wrapper.find('[data-testid="item-row"]').trigger('click')

      expect(wrapper.find('[data-testid="item-details"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('A versatile martial weapon')
    })

    it('shows weight in expanded details', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      await wrapper.find('[data-testid="item-row"]').trigger('click')

      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('lb')
    })

    it('shows damage in expanded details for weapons', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      await wrapper.find('[data-testid="item-row"]').trigger('click')

      expect(wrapper.text()).toContain('1d8 slashing')
    })

    it('shows AC in expanded details for armor', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockArmor, editable: true }
      })

      await wrapper.find('[data-testid="item-row"]').trigger('click')

      expect(wrapper.text()).toContain('AC')
      expect(wrapper.text()).toContain('16')
    })

    it('collapses when clicked again', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      // Expand
      await wrapper.find('[data-testid="item-row"]').trigger('click')
      expect(wrapper.find('[data-testid="item-details"]').exists()).toBe(true)

      // Collapse
      await wrapper.find('[data-testid="item-row"]').trigger('click')
      expect(wrapper.find('[data-testid="item-details"]').exists()).toBe(false)
    })
  })

  describe('action menu', () => {
    it('shows action menu when editable', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      expect(wrapper.find('[data-testid="item-actions"]').exists()).toBe(true)
    })

    it('hides action menu when not editable', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: false }
      })

      expect(wrapper.find('[data-testid="item-actions"]').exists()).toBe(false)
    })
  })

  describe('events', () => {
    it('emits unequip event when unequip action is triggered', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockEquippedItem, editable: true }
      })

      // Expand to access action buttons
      await wrapper.find('[data-testid="item-row"]').trigger('click')

      // Click unequip button
      const unequipBtn = wrapper.find('[data-testid="action-unequip"]')
      await unequipBtn.trigger('click')

      expect(wrapper.emitted('unequip')).toBeTruthy()
      expect(wrapper.emitted('unequip')![0]).toEqual([1])
    })

    it('emits drop event when drop action is triggered', async () => {
      const wrapper = await mountSuspended(ItemRow, {
        props: { item: mockStackableItem, editable: true }
      })

      // Expand to access action buttons
      await wrapper.find('[data-testid="item-row"]').trigger('click')

      // Click drop button
      const dropBtn = wrapper.find('[data-testid="action-drop"]')
      await dropBtn.trigger('click')

      expect(wrapper.emitted('drop')).toBeTruthy()
      expect(wrapper.emitted('drop')![0]).toEqual([2])
    })
  })
})
