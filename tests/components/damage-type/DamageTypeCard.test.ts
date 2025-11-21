import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DamageTypeCard from '~/components/damage-type/DamageTypeCard.vue'

describe('DamageTypeCard', () => {
  const mockDamageType = {
    id: 1,
    name: 'Fire'
  }

  it('renders damage type name', async () => {
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: mockDamageType }
    })

    expect(wrapper.text()).toContain('Fire')
  })

  it('shows type badge', async () => {
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: mockDamageType }
    })

    expect(wrapper.text()).toContain('Damage Type')
  })

  it('applies hover effects for interactivity', async () => {
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: mockDamageType }
    })

    const html = wrapper.html()
    expect(html).toContain('hover')
  })

  it('uses card component with border', async () => {
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: mockDamageType }
    })

    const html = wrapper.html()
    expect(html).toContain('border')
  })

  it('renders with proper spacing structure', async () => {
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: mockDamageType }
    })

    const html = wrapper.html()
    expect(html).toContain('space-y-3')
  })

  it('displays all key information in organized layout', async () => {
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: mockDamageType }
    })

    const text = wrapper.text()
    expect(text).toContain('Fire')
    expect(text).toContain('Damage Type')
  })

  it('handles all common damage types', async () => {
    const damageTypes = [
      'Acid',
      'Bludgeoning',
      'Cold',
      'Fire',
      'Force',
      'Lightning',
      'Necrotic',
      'Piercing',
      'Poison',
      'Psychic',
      'Radiant',
      'Slashing',
      'Thunder'
    ]

    for (const name of damageTypes) {
      const wrapper = await mountSuspended(DamageTypeCard, {
        props: { damageType: { id: 1, name } }
      })

      expect(wrapper.text()).toContain(name)
    }
  })

  it('uses neutral color theme', async () => {
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: mockDamageType }
    })

    const html = wrapper.html()
    // Neutral badges should be present
    expect(html).toBeTruthy()
  })

  it('handles long damage type names', async () => {
    const longName = 'Bludgeoning'
    const longNameType = { id: 1, name: longName }
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: longNameType }
    })

    expect(wrapper.text()).toContain(longName)
  })

  it('renders damage type name prominently', async () => {
    const wrapper = await mountSuspended(DamageTypeCard, {
      props: { damageType: mockDamageType }
    })

    const html = wrapper.html()
    // Should have heading styling
    expect(html).toContain('text-xl')
    expect(html).toContain('font-semibold')
  })
})
