import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BackgroundCharacteristicsGrid from '~/components/background/BackgroundCharacteristicsGrid.vue'
import type { components } from '~/types/api/generated'

type EntityDataTableResource = components['schemas']['EntityDataTableResource']

describe('BackgroundCharacteristicsGrid', () => {
  const mockPersonalityTable: EntityDataTableResource = {
    id: 1,
    table_name: 'Personality Trait',
    dice_type: 'd8',
    table_type: 'random',
    description: null,
    entries: [
      { id: 1, roll_min: 1, roll_max: 1, result_text: 'I idolize a hero of the old tales and measure my deeds against theirs.' },
      { id: 2, roll_min: 2, roll_max: 2, result_text: 'I find common ground between the fiercest enemies.' }
    ]
  }

  const mockIdealTable: EntityDataTableResource = {
    id: 2,
    table_name: 'Ideal',
    dice_type: 'd6',
    table_type: 'random',
    description: null,
    entries: [
      { id: 3, roll_min: 1, roll_max: 1, result_text: 'Respect. People deserve to be treated with dignity. (Good)' },
      { id: 4, roll_min: 2, roll_max: 2, result_text: 'Fairness. No one should get preferential treatment. (Lawful)' }
    ]
  }

  const mockBondTable: EntityDataTableResource = {
    id: 3,
    table_name: 'Bond',
    dice_type: 'd6',
    table_type: 'random',
    description: null,
    entries: [
      { id: 5, roll_min: 1, roll_max: 1, result_text: 'I have a family, but I have no idea where they are.' },
      { id: 6, roll_min: 2, roll_max: 2, result_text: 'I worked the land, I love the land, and I will protect it.' }
    ]
  }

  const mockFlawTable: EntityDataTableResource = {
    id: 4,
    table_name: 'Flaw',
    dice_type: 'd6',
    table_type: 'random',
    description: null,
    entries: [
      { id: 7, roll_min: 1, roll_max: 1, result_text: 'The tyrant who rules my land will stop at nothing to see me killed.' },
      { id: 8, roll_min: 2, roll_max: 2, result_text: 'I have a weakness for the vices of the city.' }
    ]
  }

  it('hides section entirely when no tables provided', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: []
      }
    })

    expect(wrapper.text()).toBe('')
  })

  it('renders all 4 tables when provided', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockPersonalityTable, mockIdealTable, mockBondTable, mockFlawTable]
      }
    })

    expect(wrapper.text()).toContain('Personality Trait')
    expect(wrapper.text()).toContain('Ideal')
    expect(wrapper.text()).toContain('Bond')
    expect(wrapper.text()).toContain('Flaw')
  })

  it('shows dice type in header', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockPersonalityTable, mockIdealTable]
      }
    })

    expect(wrapper.text()).toContain('d8 Personality Trait')
    expect(wrapper.text()).toContain('d6 Ideal')
  })

  it('shows table name in header', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockPersonalityTable]
      }
    })

    expect(wrapper.text()).toContain('Personality Trait')
  })

  it('renders numbered entries', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockPersonalityTable]
      }
    })

    expect(wrapper.text()).toContain('I idolize a hero of the old tales and measure my deeds against theirs.')
    expect(wrapper.text()).toContain('I find common ground between the fiercest enemies.')
  })

  it('renders ideal entries with alignment tags', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockIdealTable]
      }
    })

    expect(wrapper.text()).toContain('Respect. People deserve to be treated with dignity. (Good)')
    expect(wrapper.text()).toContain('Fairness. No one should get preferential treatment. (Lawful)')
  })

  it('orders tables correctly (Personality, Ideal, Bond, Flaw)', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockFlawTable, mockBondTable, mockIdealTable, mockPersonalityTable]
      }
    })

    const text = wrapper.text()
    const personalityIndex = text.indexOf('Personality Trait')
    const idealIndex = text.indexOf('Ideal')
    const bondIndex = text.indexOf('Bond')
    const flawIndex = text.indexOf('Flaw')

    expect(personalityIndex).toBeLessThan(idealIndex)
    expect(idealIndex).toBeLessThan(bondIndex)
    expect(bondIndex).toBeLessThan(flawIndex)
  })

  it('renders 2x2 grid on desktop', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockPersonalityTable, mockIdealTable, mockBondTable, mockFlawTable]
      }
    })

    const grid = wrapper.find('.grid')
    expect(grid.exists()).toBe(true)
    expect(grid.classes()).toContain('md:grid-cols-2')
  })

  it('renders single column on mobile', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockPersonalityTable]
      }
    })

    const grid = wrapper.find('.grid')
    expect(grid.exists()).toBe(true)
    expect(grid.classes()).toContain('grid-cols-1')
  })

  it('renders UCard for each table', async () => {
    const wrapper = await mountSuspended(BackgroundCharacteristicsGrid, {
      props: {
        dataTables: [mockPersonalityTable, mockIdealTable]
      }
    })

    const cards = wrapper.findAllComponents({ name: 'UCard' })
    expect(cards).toHaveLength(2)
  })
})
