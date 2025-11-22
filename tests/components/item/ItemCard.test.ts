import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ItemCard from '~/components/item/ItemCard.vue'
import type { Item } from '~/types'
import { testCardLinkBehavior, testCardHoverEffects, testCardBorderStyling } from '../../helpers/cardBehavior'
import { testDescriptionTruncation } from '../../helpers/descriptionBehavior'
import { testSourceFooter, testOptionalSourceFooter } from '../../helpers/sourceBehavior'

describe('ItemCard', () => {
  const mockItem: Item = {
    id: 1,
    name: 'Longsword',
    slug: 'longsword',
    rarity: 'common',
    item_type: {
      id: 5,
      name: 'Martial Weapon'
    },
    is_magic: false,
    requires_attunement: false,
    cost_cp: 1500,
    weight: 3,
    description: 'A versatile martial weapon used by warriors across the realms.',
    sources: [
      { code: 'PHB', name: 'Player\'s Handbook', pages: '149' }
    ]
  }

  // Shared card behavior tests (using helpers)
  testCardLinkBehavior(
    () => mountSuspended(ItemCard, { props: { item: mockItem } }),
    '/items/longsword'
  )

  testCardHoverEffects(
    () => mountSuspended(ItemCard, { props: { item: mockItem } })
  )

  testCardBorderStyling(
    () => mountSuspended(ItemCard, { props: { item: mockItem } })
  )

  testDescriptionTruncation(
    () => mountSuspended(ItemCard, { props: { item: { ...mockItem, description: 'A'.repeat(200) } } }),
    () => mountSuspended(ItemCard, { props: { item: { ...mockItem, description: 'Short item description' } } })
  )

  testSourceFooter(
    () => mountSuspended(ItemCard, { props: { item: mockItem } }),
    'Player\'s Handbook'
  )

  testOptionalSourceFooter(
    () => mountSuspended(ItemCard, { props: { item: { ...mockItem, sources: undefined } } }),
    'Longsword'
  )

  // Item-specific tests (domain logic)

  it('renders item name', async () => {
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).toContain('Longsword')
  })

  it('renders item type when provided', async () => {
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).toContain('Martial Weapon')
  })

  it('handles missing item type gracefully', async () => {
    const itemWithoutType = { ...mockItem, item_type: undefined }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: itemWithoutType }
    })

    expect(wrapper.text()).toContain('Longsword')
    expect(wrapper.text()).not.toContain('Martial Weapon')
  })

  it('formats rarity text with proper capitalization', async () => {
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).toContain('Common')
  })

  it('formats multi-word rarity correctly', async () => {
    const rareItem = { ...mockItem, rarity: 'very rare' }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: rareItem }
    })

    expect(wrapper.text()).toContain('Very Rare')
  })

  it('handles missing rarity with default', async () => {
    const itemWithoutRarity = { ...mockItem, rarity: undefined }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: itemWithoutRarity }
    })

    expect(wrapper.text()).toContain('Common')
  })

  it('formats cost in gold pieces when >= 1 gp', async () => {
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).toContain('15 gp')
  })

  it('formats cost in copper pieces when < 1 gp', async () => {
    const cheapItem = { ...mockItem, cost_cp: 50 }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: cheapItem }
    })

    expect(wrapper.text()).toContain('50 cp')
  })

  it('handles fractional gold pieces', async () => {
    const fractionalItem = { ...mockItem, cost_cp: 155 }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: fractionalItem }
    })

    expect(wrapper.text()).toContain('1.6 gp')
  })

  it('hides cost when not provided', async () => {
    const itemWithoutCost = { ...mockItem, cost_cp: undefined }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: itemWithoutCost }
    })

    const text = wrapper.text()
    expect(text).not.toContain('gp')
    expect(text).not.toContain('cp')
  })

  it('renders weight when provided', async () => {
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).toContain('3 lb')
  })

  it('hides weight when not provided', async () => {
    const itemWithoutWeight = { ...mockItem, weight: undefined }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: itemWithoutWeight }
    })

    expect(wrapper.text()).not.toContain('lb')
  })

  it('shows magic badge when is_magic is true', async () => {
    const magicItem = { ...mockItem, is_magic: true }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: magicItem }
    })

    expect(wrapper.text()).toContain('Magic')
  })

  it('hides magic badge when is_magic is false', async () => {
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).not.toContain('Magic')
  })

  it('shows attunement badge when requires_attunement is true', async () => {
    const attunementItem = { ...mockItem, requires_attunement: true }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: attunementItem }
    })

    expect(wrapper.text()).toContain('Attunement')
  })

  it('hides attunement badge when requires_attunement is false', async () => {
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).not.toContain('Attunement')
  })

  it('handles items with both magic and attunement', async () => {
    const specialItem = {
      ...mockItem,
      is_magic: true,
      requires_attunement: true
    }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: specialItem }
    })

    const text = wrapper.text()
    expect(text).toContain('Magic')
    expect(text).toContain('Attunement')
  })

  it('renders description when provided', async () => {
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).toContain('A versatile martial weapon')
  })

  it('shows default description when not provided', async () => {
    const itemWithoutDescription = { ...mockItem, description: undefined }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: itemWithoutDescription }
    })

    expect(wrapper.text()).toContain('No description available')
  })

  it('displays all key information in organized layout', async () => {
    const fullItem = {
      ...mockItem,
      is_magic: true,
      requires_attunement: true
    }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: fullItem }
    })

    const text = wrapper.text()
    expect(text).toContain('Longsword')
    expect(text).toContain('Martial Weapon')
    expect(text).toContain('Common')
    expect(text).toContain('15 gp')
    expect(text).toContain('3 lb')
    expect(text).toContain('Magic')
    expect(text).toContain('Attunement')
  })

  it('handles different rarity levels', async () => {
    const rarities = ['common', 'uncommon', 'rare', 'very rare', 'legendary', 'artifact']

    for (const rarity of rarities) {
      const rarityItem = { ...mockItem, rarity }
      const wrapper = await mountSuspended(ItemCard, {
        props: { item: rarityItem }
      })

      expect(wrapper.html()).toBeTruthy()
    }
  })

  it('handles weapon item types', async () => {
    const weaponTypes = ['Simple Weapon', 'Martial Weapon', 'Bow', 'Sword']

    for (const typeName of weaponTypes) {
      const weaponItem = { ...mockItem, item_type: { id: 1, name: typeName } }
      const wrapper = await mountSuspended(ItemCard, {
        props: { item: weaponItem }
      })

      expect(wrapper.text()).toContain(typeName)
    }
  })

  it('handles armor item types', async () => {
    const armorItem = {
      ...mockItem,
      item_type: { id: 2, name: 'Heavy Armor' }
    }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: armorItem }
    })

    expect(wrapper.text()).toContain('Heavy Armor')
  })

  it('handles potion item types', async () => {
    const potionItem = {
      ...mockItem,
      item_type: { id: 3, name: 'Potion' },
      is_magic: true
    }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: potionItem }
    })

    expect(wrapper.text()).toContain('Potion')
    expect(wrapper.text()).toContain('Magic')
  })

  it('handles zero-cost items', async () => {
    const freeItem = { ...mockItem, cost_cp: 0 }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: freeItem }
    })

    const text = wrapper.text()
    expect(text).not.toContain('gp')
    expect(text).not.toContain('cp')
  })

  it('handles zero-weight items', async () => {
    const weightlessItem = { ...mockItem, weight: 0 }
    const wrapper = await mountSuspended(ItemCard, {
      props: { item: weightlessItem }
    })

    expect(wrapper.text()).not.toContain('lb')
  })
})
