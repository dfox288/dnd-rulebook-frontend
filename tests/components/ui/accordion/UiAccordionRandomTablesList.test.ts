import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiAccordionRandomTablesList from '~/components/ui/accordion/UiAccordionRandomTablesList.vue'

describe('UiAccordionRandomTablesList', () => {
  const mockTables = [
    {
      id: 1,
      table_name: 'Entertainer Routines',
      dice_type: 'd10',
      description: 'Choose your performance style',
      entries: [
        {
          id: 1,
          roll_min: 1,
          roll_max: 1,
          result_text: 'Actor',
          sort_order: 0
        },
        {
          id: 2,
          roll_min: 2,
          roll_max: 2,
          result_text: 'Dancer',
          sort_order: 1
        },
        {
          id: 3,
          roll_min: 3,
          roll_max: 5,
          result_text: 'Fire-eater',
          sort_order: 2
        }
      ]
    }
  ]

  const mockMultipleTables = [
    mockTables[0],
    {
      id: 2,
      table_name: 'Personality Trait',
      dice_type: 'd8',
      description: null,
      entries: [
        {
          id: 4,
          roll_min: 1,
          roll_max: 1,
          result_text: 'I know a story relevant to almost every situation.',
          sort_order: 0
        }
      ]
    }
  ]

  it('renders table name and dice type', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    expect(wrapper.text()).toContain('Entertainer Routines')
    expect(wrapper.text()).toContain('(d10)')
  })

  it('displays table description when present', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    expect(wrapper.text()).toContain('Choose your performance style')
  })

  it('hides description when null', async () => {
    const tableWithoutDescription = [{
      ...mockTables[0],
      description: null
    }]

    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: tableWithoutDescription }
    })

    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders table header correctly', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(2)
    expect(headers[0].text()).toContain('Roll')
    expect(headers[1].text()).toContain('Result')
  })

  it('renders all table entries', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
  })

  it('formats single roll correctly', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    const firstRow = wrapper.findAll('tbody tr')[0]
    const rollCell = firstRow.findAll('td')[0]
    expect(rollCell.text()).toBe('1')
  })

  it('formats roll range correctly', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    const thirdRow = wrapper.findAll('tbody tr')[2]
    const rollCell = thirdRow.findAll('td')[0]
    expect(rollCell.text()).toBe('3-5')
  })

  it('renders result text correctly', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    const firstRow = wrapper.findAll('tbody tr')[0]
    const resultCell = firstRow.findAll('td')[1]
    expect(resultCell.text()).toBe('Actor')
  })

  it('handles multiple tables with proper spacing', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockMultipleTables }
    })

    const tables = wrapper.findAll('table')
    expect(tables).toHaveLength(2)

    // Verify both table names appear
    expect(wrapper.text()).toContain('Entertainer Routines')
    expect(wrapper.text()).toContain('Personality Trait')
  })

  it('handles empty tables array gracefully', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: [] }
    })

    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('maintains sort order', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    const rows = wrapper.findAll('tbody tr')
    const results = rows.map(row => row.findAll('td')[1].text())

    expect(results).toEqual(['Actor', 'Dancer', 'Fire-eater'])
  })

  it('component mounts without errors', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: { tables: mockTables }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('accepts borderColor prop', async () => {
    const wrapper = await mountSuspended(UiAccordionRandomTablesList, {
      props: {
        tables: mockTables,
        borderColor: 'purple-500'
      }
    })

    // Component should accept the prop without error
    expect(wrapper.exists()).toBe(true)
  })
})
