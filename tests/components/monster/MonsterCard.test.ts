import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Monster } from '~/types'
import MonsterCard from '~/components/monster/MonsterCard.vue'
import { testCardLinkBehavior, testCardHoverEffects, testCardBorderStyling } from '../../helpers/cardBehavior'
import { testSourceFooter } from '../../helpers/sourceBehavior'

describe('MonsterCard', () => {
  const mockMonster: Monster = {
    id: 1,
    slug: 'ancient-red-dragon',
    name: 'Ancient Red Dragon',
    size: { id: 6, code: 'G', name: 'Gargantuan' },
    type: 'dragon',
    alignment: 'Chaotic Evil',
    armor_class: 22,
    armor_type: 'natural armor',
    hit_points_average: 546,
    hit_dice: '28d20+252',
    speed_walk: 40,
    speed_fly: 80,
    speed_swim: null,
    speed_burrow: null,
    speed_climb: 40,
    can_hover: false,
    strength: 30,
    dexterity: 10,
    constitution: 29,
    intelligence: 18,
    wisdom: 15,
    charisma: 23,
    challenge_rating: '24',
    experience_points: 62000,
    description: 'The most covetous of the true dragons, red dragons tirelessly seek to increase their treasure hoards.',
    traits: [],
    actions: [],
    legendary_actions: [
      { id: 1, name: 'Detect', description: 'The dragon makes a check.' }
    ],
    modifiers: [],
    conditions: [],
    sources: [
      { id: 1, code: 'MM', name: 'Monster Manual', pages: 'p. 97' }
    ]
  }

  // Shared behavior tests
  const mountCard = () => mountSuspended(MonsterCard, { props: { monster: mockMonster } })

  testCardLinkBehavior(mountCard, '/monsters/ancient-red-dragon')
  testCardHoverEffects(mountCard)
  testCardBorderStyling(mountCard)
  testSourceFooter(mountCard, 'Monster Manual')

  it('renders monster name', async () => {
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster: mockMonster }
    })

    expect(wrapper.text()).toContain('Ancient Red Dragon')
  })

  it('renders CR badge with monster color', async () => {
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster: mockMonster }
    })

    expect(wrapper.text()).toContain('CR 24')
    // CR badge should use monster entity color
    const badge = wrapper.find('[class*="bg-monster"]')
    expect(badge.exists()).toBe(true)
  })

  it('renders type badge', async () => {
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster: mockMonster }
    })

    expect(wrapper.text()).toContain('dragon')
  })

  it('displays size', async () => {
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster: mockMonster }
    })

    expect(wrapper.text()).toContain('Gargantuan')
  })

  it('displays alignment', async () => {
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster: mockMonster }
    })

    expect(wrapper.text()).toContain('Chaotic Evil')
  })

  it('displays armor class', async () => {
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster: mockMonster }
    })

    expect(wrapper.text()).toContain('AC 22')
  })

  it('displays hit points', async () => {
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster: mockMonster }
    })

    expect(wrapper.text()).toContain('546 HP')
  })

  it('shows legendary indicator when has legendary actions', async () => {
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster: mockMonster }
    })

    expect(wrapper.text()).toContain('Legendary')
  })

  it('hides legendary indicator when no legendary actions', async () => {
    const monster = { ...mockMonster, legendary_actions: [] }
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster }
    })

    expect(wrapper.text()).not.toContain('Legendary')
  })

  it('truncates long descriptions', async () => {
    const longDesc = 'A'.repeat(200)
    const monster = { ...mockMonster, description: longDesc }
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster }
    })

    const text = wrapper.text()
    // Should contain truncated version (150 chars + '...')
    expect(text).toContain('A'.repeat(150) + '...')
    // Should NOT contain the full 200 chars
    expect(text).not.toContain('A'.repeat(200))
  })

  it('does not truncate short descriptions', async () => {
    const shortDesc = 'A small creature.'
    const monster = { ...mockMonster, description: shortDesc }
    const wrapper = await mountSuspended(MonsterCard, {
      props: { monster }
    })

    expect(wrapper.text()).toContain(shortDesc)
    expect(wrapper.text()).not.toContain('...')
  })

  it('handles different CR values correctly', async () => {
    const crTests = [
      { cr: '0' },
      { cr: '1/4' },
      { cr: '5' },
      { cr: '11' },
      { cr: '24' }
    ]

    for (const test of crTests) {
      const monster = { ...mockMonster, challenge_rating: test.cr }
      const wrapper = await mountSuspended(MonsterCard, {
        props: { monster }
      })

      expect(wrapper.text()).toContain(`CR ${test.cr}`)
      // All CR badges use monster entity color
      const badge = wrapper.find('[class*="bg-monster"]')
      expect(badge.exists()).toBe(true)
    }
  })
})
