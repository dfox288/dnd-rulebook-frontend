import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RaceOverviewSpellsCard from '~/components/race/overview/SpellsCard.vue'
import type { components } from '~/types/api/generated'

type EntitySpellResource = components['schemas']['EntitySpellResource']

describe('RaceOverviewSpellsCard', () => {
  const mockSpells: EntitySpellResource[] = [
    {
      id: 1,
      spell_id: 1,
      spell: {
        id: 1,
        slug: 'thaumaturgy',
        name: 'Thaumaturgy',
        level: 0
      },
      ability_score_id: 6,
      ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
      level_requirement: null,
      usage_limit: null,
      is_cantrip: true,
      charges_cost_min: null,
      charges_cost_max: null,
      charges_cost_formula: null
    },
    {
      id: 2,
      spell_id: 2,
      spell: {
        id: 2,
        slug: 'hellish-rebuke',
        name: 'Hellish Rebuke',
        level: 1
      },
      ability_score_id: 6,
      ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
      level_requirement: 3,
      usage_limit: '1/long rest',
      is_cantrip: false,
      charges_cost_min: null,
      charges_cost_max: null,
      charges_cost_formula: null
    },
    {
      id: 3,
      spell_id: 3,
      spell: {
        id: 3,
        slug: 'darkness',
        name: 'Darkness',
        level: 2
      },
      ability_score_id: 6,
      ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
      level_requirement: 5,
      usage_limit: '1/long rest',
      is_cantrip: false,
      charges_cost_min: null,
      charges_cost_max: null,
      charges_cost_formula: null
    }
  ]

  it('renders card with header', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: mockSpells }
    })

    expect(wrapper.text()).toContain('Innate Spellcasting')
  })

  it('displays all spell names', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: mockSpells }
    })

    expect(wrapper.text()).toContain('Thaumaturgy')
    expect(wrapper.text()).toContain('Hellish Rebuke')
    expect(wrapper.text()).toContain('Darkness')
  })

  it('shows cantrip indicator for cantrips', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: mockSpells }
    })

    expect(wrapper.text()).toContain('(cantrip)')
  })

  it('shows level requirement and usage limit for leveled spells', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: mockSpells }
    })

    expect(wrapper.text()).toContain('(3rd level, 1/long rest)')
    expect(wrapper.text()).toContain('(5th level, 1/long rest)')
  })

  it('renders spell names as links to spell detail pages', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: mockSpells }
    })

    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThanOrEqual(3)

    const thaumaturgyLink = links.find(link => link.text().includes('Thaumaturgy'))
    expect(thaumaturgyLink?.attributes('href')).toBe('/spells/thaumaturgy')

    const hellishRebukeLink = links.find(link => link.text().includes('Hellish Rebuke'))
    expect(hellishRebukeLink?.attributes('href')).toBe('/spells/hellish-rebuke')

    const darknessLink = links.find(link => link.text().includes('Darkness'))
    expect(darknessLink?.attributes('href')).toBe('/spells/darkness')
  })

  it('displays spellcasting ability in footer when provided', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: {
        spells: mockSpells,
        spellcastingAbility: 'CHA'
      }
    })

    expect(wrapper.text()).toContain('Spellcasting ability: Charisma')
  })

  it('does not show footer when spellcasting ability is not provided', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: mockSpells }
    })

    expect(wrapper.text()).not.toContain('Spellcasting ability:')
  })

  it('sorts spells with cantrips first, then by level requirement', async () => {
    const unsortedSpells: EntitySpellResource[] = [
      {
        id: 2,
        spell_id: 2,
        spell: {
          id: 2,
          slug: 'hellish-rebuke',
          name: 'Hellish Rebuke',
          level: 1
        },
        ability_score_id: 6,
        ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
        level_requirement: 3,
        usage_limit: '1/long rest',
        is_cantrip: false,
        charges_cost_min: null,
        charges_cost_max: null,
        charges_cost_formula: null
      },
      {
        id: 1,
        spell_id: 1,
        spell: {
          id: 1,
          slug: 'thaumaturgy',
          name: 'Thaumaturgy',
          level: 0
        },
        ability_score_id: 6,
        ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
        level_requirement: null,
        usage_limit: null,
        is_cantrip: true,
        charges_cost_min: null,
        charges_cost_max: null,
        charges_cost_formula: null
      },
      {
        id: 3,
        spell_id: 3,
        spell: {
          id: 3,
          slug: 'darkness',
          name: 'Darkness',
          level: 2
        },
        ability_score_id: 6,
        ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
        level_requirement: 5,
        usage_limit: '1/long rest',
        is_cantrip: false,
        charges_cost_min: null,
        charges_cost_max: null,
        charges_cost_formula: null
      }
    ]

    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: unsortedSpells }
    })

    const text = wrapper.text()
    const thaumaturgyIndex = text.indexOf('Thaumaturgy')
    const hellishRebukeIndex = text.indexOf('Hellish Rebuke')
    const darknessIndex = text.indexOf('Darkness')

    expect(thaumaturgyIndex).toBeLessThan(hellishRebukeIndex)
    expect(hellishRebukeIndex).toBeLessThan(darknessIndex)
  })

  it('handles spells with no level requirement (cantrips)', async () => {
    const cantripOnly: EntitySpellResource[] = [
      {
        id: 1,
        spell_id: 1,
        spell: {
          id: 1,
          slug: 'light',
          name: 'Light',
          level: 0
        },
        ability_score_id: 4,
        ability_score: { id: 4, code: 'INT', name: 'Intelligence' },
        level_requirement: null,
        usage_limit: null,
        is_cantrip: true,
        charges_cost_min: null,
        charges_cost_max: null,
        charges_cost_formula: null
      }
    ]

    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: cantripOnly }
    })

    expect(wrapper.text()).toContain('Light')
    expect(wrapper.text()).toContain('(cantrip)')
    expect(wrapper.text()).not.toContain('level requirement')
  })

  it('handles empty spells array gracefully', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: [] }
    })

    expect(wrapper.text()).toContain('Innate Spellcasting')
    expect(wrapper.findAll('a').length).toBe(0)
  })

  it('formats ability score names correctly', async () => {
    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: {
        spells: mockSpells,
        spellcastingAbility: 'INT'
      }
    })

    expect(wrapper.text()).toContain('Spellcasting ability: Intelligence')
  })

  it('handles different ordinal suffixes for level requirements', async () => {
    const spellsWithDifferentLevels: EntitySpellResource[] = [
      {
        id: 1,
        spell_id: 1,
        spell: {
          id: 1,
          slug: 'spell-1',
          name: 'Spell 1',
          level: 1
        },
        ability_score_id: 6,
        ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
        level_requirement: 1,
        usage_limit: '1/long rest',
        is_cantrip: false,
        charges_cost_min: null,
        charges_cost_max: null,
        charges_cost_formula: null
      },
      {
        id: 2,
        spell_id: 2,
        spell: {
          id: 2,
          slug: 'spell-2',
          name: 'Spell 2',
          level: 1
        },
        ability_score_id: 6,
        ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
        level_requirement: 2,
        usage_limit: '1/long rest',
        is_cantrip: false,
        charges_cost_min: null,
        charges_cost_max: null,
        charges_cost_formula: null
      },
      {
        id: 3,
        spell_id: 3,
        spell: {
          id: 3,
          slug: 'spell-3',
          name: 'Spell 3',
          level: 1
        },
        ability_score_id: 6,
        ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
        level_requirement: 3,
        usage_limit: '1/long rest',
        is_cantrip: false,
        charges_cost_min: null,
        charges_cost_max: null,
        charges_cost_formula: null
      }
    ]

    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: spellsWithDifferentLevels }
    })

    expect(wrapper.text()).toContain('(1st level, 1/long rest)')
    expect(wrapper.text()).toContain('(2nd level, 1/long rest)')
    expect(wrapper.text()).toContain('(3rd level, 1/long rest)')
  })

  it('handles spells without usage limit', async () => {
    const spellsWithoutLimit: EntitySpellResource[] = [
      {
        id: 1,
        spell_id: 1,
        spell: {
          id: 1,
          slug: 'spell-1',
          name: 'Spell 1',
          level: 1
        },
        ability_score_id: 6,
        ability_score: { id: 6, code: 'CHA', name: 'Charisma' },
        level_requirement: 3,
        usage_limit: null,
        is_cantrip: false,
        charges_cost_min: null,
        charges_cost_max: null,
        charges_cost_formula: null
      }
    ]

    const wrapper = await mountSuspended(RaceOverviewSpellsCard, {
      props: { spells: spellsWithoutLimit }
    })

    expect(wrapper.text()).toContain('Spell 1')
    // Should show level requirement but not usage limit
    expect(wrapper.text()).toContain('3rd level')
  })
})
