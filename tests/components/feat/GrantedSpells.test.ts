import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FeatGrantedSpells from '~/components/feat/GrantedSpells.vue'
import type { components } from '~/types/api/generated'

type EntitySpellResource = components['schemas']['EntitySpellResource']

const mockSpells: EntitySpellResource[] = [
  {
    id: 1,
    spell_id: 42,
    spell: {
      id: 42,
      slug: 'detect-magic',
      name: 'Detect Magic',
      level: 1,
      school: {
        id: 1,
        code: 'D',
        name: 'Divination',
        slug: 'divination',
        description: null
      },
      casting_time: '1 action',
      casting_time_type: 'action',
      range: 'Self',
      components: 'V, S',
      material_components: null,
      material_cost_gp: '0',
      material_consumed: 'false',
      duration: 'Concentration, up to 10 minutes',
      needs_concentration: true,
      is_ritual: true,
      description: 'For the duration, you sense the presence of magic within 30 feet of you.',
      higher_levels: null,
      requires_verbal: true,
      requires_somatic: true,
      requires_material: false,
      area_of_effect: '30-foot radius sphere'
    },
    ability_score_id: null,
    ability_score: undefined,
    level_requirement: null,
    usage_limit: null,
    is_cantrip: false,
    charges_cost_min: null,
    charges_cost_max: null,
    charges_cost_formula: null
  },
  {
    id: 2,
    spell_id: 99,
    spell: {
      id: 99,
      slug: 'light',
      name: 'Light',
      level: 0,
      school: {
        id: 2,
        code: 'EV',
        name: 'Evocation',
        slug: 'evocation',
        description: null
      },
      casting_time: '1 action',
      casting_time_type: 'action',
      range: 'Touch',
      components: 'V, M',
      material_components: 'a firefly or phosphorescent moss',
      material_cost_gp: '0',
      material_consumed: 'false',
      duration: '1 hour',
      needs_concentration: false,
      is_ritual: false,
      description: 'You touch one object that is no larger than 10 feet in any dimension.',
      higher_levels: null,
      requires_verbal: true,
      requires_somatic: false,
      requires_material: true,
      area_of_effect: 'Touch'
    },
    ability_score_id: null,
    ability_score: undefined,
    level_requirement: null,
    usage_limit: null,
    is_cantrip: true,
    charges_cost_min: null,
    charges_cost_max: null,
    charges_cost_formula: null
  },
  {
    id: 3,
    spell_id: 88,
    spell: {
      id: 88,
      slug: 'shield',
      name: 'Shield',
      level: 1,
      school: {
        id: 3,
        code: 'A',
        name: 'Abjuration',
        slug: 'abjuration',
        description: null
      },
      casting_time: '1 reaction',
      casting_time_type: 'reaction',
      range: 'Self',
      components: 'V, S',
      material_components: null,
      material_cost_gp: '0',
      material_consumed: 'false',
      duration: '1 round',
      needs_concentration: false,
      is_ritual: false,
      description: 'An invisible barrier of magical force appears and protects you.',
      higher_levels: null,
      requires_verbal: true,
      requires_somatic: true,
      requires_material: false,
      area_of_effect: 'Self'
    },
    ability_score_id: null,
    ability_score: undefined,
    level_requirement: null,
    usage_limit: null,
    is_cantrip: false,
    charges_cost_min: null,
    charges_cost_max: null,
    charges_cost_formula: null
  }
]

describe('FeatGrantedSpells', () => {
  it('renders section when spells are provided', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: mockSpells }
    })

    expect(wrapper.text()).toContain('Granted Spells')
  })

  it('does not render when spells array is empty', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: [] }
    })

    expect(wrapper.text()).not.toContain('Granted Spells')
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('renders all spell cards', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: mockSpells }
    })

    expect(wrapper.text()).toContain('Detect Magic')
    expect(wrapper.text()).toContain('Light')
    expect(wrapper.text()).toContain('Shield')
  })

  it('displays spell level correctly for cantrips', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: [mockSpells[1]] } // Light (cantrip)
    })

    expect(wrapper.text()).toContain('Cantrip')
  })

  it('displays spell level correctly for 1st level spells', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: [mockSpells[0]] } // Detect Magic (1st level)
    })

    expect(wrapper.text()).toContain('1st Level')
  })

  it('displays spell school name', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: mockSpells }
    })

    expect(wrapper.text()).toContain('Divination')
    expect(wrapper.text()).toContain('Evocation')
    expect(wrapper.text()).toContain('Abjuration')
  })

  it('creates links to spell detail pages', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: [mockSpells[0]] }
    })

    // UCard with :to prop creates a link
    expect(wrapper.html()).toContain('/spells/detect-magic')
  })

  it('uses responsive grid layout', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: mockSpells }
    })

    const grid = wrapper.find('.grid')
    expect(grid.exists()).toBe(true)
    expect(grid.classes()).toContain('grid-cols-1')
    expect(grid.classes()).toContain('md:grid-cols-2')
    expect(grid.classes()).toContain('lg:grid-cols-3')
  })

  it('handles spells without school gracefully', async () => {
    const spellWithoutSchool: EntitySpellResource = {
      ...mockSpells[0],
      spell: {
        ...mockSpells[0].spell!,
        school: undefined
      }
    }

    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: [spellWithoutSchool] }
    })

    expect(wrapper.text()).toContain('Detect Magic')
    // Should not crash, school section should be hidden
  })

  it('displays spell icon in header', async () => {
    const wrapper = await mountSuspended(FeatGrantedSpells, {
      props: { spells: mockSpells }
    })

    // Check for icon (UIcon component renders as i-heroicons-sparkles class)
    expect(wrapper.html()).toContain('i-heroicons-sparkles')
  })
})
