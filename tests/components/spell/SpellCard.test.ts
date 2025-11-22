import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SpellCard from '~/components/spell/SpellCard.vue'
import type { Spell } from '~/types'
import type { components } from '~/types/api/generated'
import { testCardLinkBehavior, testCardHoverEffects, testCardBorderStyling } from '../../helpers/cardBehavior'
import { testDescriptionTruncation } from '../../helpers/descriptionBehavior'
import { testSourceFooter, testOptionalSourceFooter } from '../../helpers/sourceBehavior'

describe('SpellCard - Type Compatibility', () => {
  it('should accept OpenAPI-generated Spell type', () => {
    // This test verifies that our Spell interface is compatible with the generated type
    const generatedSpell: components['schemas']['SpellResource'] = {
      id: 1,
      name: 'Fireball',
      slug: 'fireball',
      level: 3,
      casting_time: '1 action',
      range: '150 feet',
      components: 'V, S, M',
      material_components: 'a tiny ball of bat guano and sulfur',
      duration: 'Instantaneous',
      description: 'A bright streak...',
      higher_levels: null,
      is_ritual: false,
      needs_concentration: false
    }

    // Should be assignable to our application Spell type
    const spell: Spell = generatedSpell

    expect(spell.id).toBe(1)
    expect(spell.name).toBe('Fireball')
  })
})

describe('SpellCard', () => {
  const mockSpell: Spell = {
    id: 1,
    name: 'Fireball',
    slug: 'fireball',
    level: 3,
    school: {
      id: 5,
      code: 'EV',
      name: 'Evocation'
    },
    casting_time: '1 action',
    range: '150 feet',
    description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.',
    is_ritual: false,
    needs_concentration: false,
    sources: [
      { code: 'PHB', name: 'Player\'s Handbook', pages: '241' }
    ]
  }

  // Shared card behavior tests (using helpers)
  testCardLinkBehavior(
    () => mountSuspended(SpellCard, { props: { spell: mockSpell } }),
    '/spells/fireball'
  )

  testCardHoverEffects(
    () => mountSuspended(SpellCard, { props: { spell: mockSpell } })
  )

  testCardBorderStyling(
    () => mountSuspended(SpellCard, { props: { spell: mockSpell } })
  )

  testDescriptionTruncation(
    () => mountSuspended(SpellCard, { props: { spell: { ...mockSpell, description: 'A'.repeat(200) } } }),
    () => mountSuspended(SpellCard, { props: { spell: { ...mockSpell, description: 'Short spell description' } } })
  )

  testSourceFooter(
    () => mountSuspended(SpellCard, { props: { spell: mockSpell } }),
    'Player\'s Handbook'
  )

  testOptionalSourceFooter(
    () => mountSuspended(SpellCard, { props: { spell: { ...mockSpell, sources: undefined } } }),
    'Fireball'
  )

  // Spell-specific tests (domain logic)
  it('renders spell name', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    expect(wrapper.text()).toContain('Fireball')
  })

  it('formats spell level correctly for low level spells', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    expect(wrapper.text()).toContain('3rd Level')
  })

  it('formats cantrips correctly', async () => {
    const cantrip = { ...mockSpell, level: 0 }
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: cantrip }
    })

    expect(wrapper.text()).toContain('Cantrip')
  })

  it('formats 1st level correctly', async () => {
    const firstLevel = { ...mockSpell, level: 1 }
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: firstLevel }
    })

    expect(wrapper.text()).toContain('1st Level')
  })

  it('formats 2nd level correctly', async () => {
    const secondLevel = { ...mockSpell, level: 2 }
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: secondLevel }
    })

    expect(wrapper.text()).toContain('2nd Level')
  })

  it('renders school name when school is provided', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    expect(wrapper.text()).toContain('Evocation')
  })

  it('handles missing school gracefully', async () => {
    const spellWithoutSchool = { ...mockSpell, school: undefined }
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: spellWithoutSchool }
    })

    expect(wrapper.text()).toContain('Fireball')
    expect(wrapper.text()).not.toContain('Evocation')
  })

  it('renders casting time', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    expect(wrapper.text()).toContain('1 action')
  })

  it('renders range', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    expect(wrapper.text()).toContain('150 feet')
  })

  it('renders description preview', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    expect(wrapper.text()).toContain('A bright streak flashes')
  })

  it('shows concentration badge when needs_concentration is true', async () => {
    const concentrationSpell = { ...mockSpell, needs_concentration: true }
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: concentrationSpell }
    })

    expect(wrapper.text()).toContain('Concentration')
  })

  it('hides concentration badge when needs_concentration is false', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    expect(wrapper.text()).not.toContain('Concentration')
  })

  it('shows ritual badge when is_ritual is true', async () => {
    const ritualSpell = { ...mockSpell, is_ritual: true }
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: ritualSpell }
    })

    expect(wrapper.text()).toContain('Ritual')
  })

  it('hides ritual badge when is_ritual is false', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    expect(wrapper.text()).not.toContain('Ritual')
  })

  it('handles spells with all badges (concentration + ritual)', async () => {
    const fullSpell = {
      ...mockSpell,
      needs_concentration: true,
      is_ritual: true
    }
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: fullSpell }
    })

    const text = wrapper.text()
    expect(text).toContain('Concentration')
    expect(text).toContain('Ritual')
  })

  it('displays all key information in organized layout', async () => {
    const wrapper = await mountSuspended(SpellCard, {
      props: { spell: mockSpell }
    })

    const text = wrapper.text()
    expect(text).toContain('3rd Level')
    expect(text).toContain('Evocation')
    expect(text).toContain('Fireball')
    expect(text).toContain('1 action')
    expect(text).toContain('150 feet')
    expect(text).toContain('Player\'s Handbook')
  })
})
