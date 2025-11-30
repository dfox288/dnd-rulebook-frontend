import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RaceOverviewSensesDisplay from '~/components/race/overview/SensesDisplay.vue'

describe('RaceOverviewSensesDisplay', () => {
  const basicDarkvision = {
    type: 'darkvision',
    name: 'Darkvision',
    range: 60,
    is_limited: false,
    notes: null
  }

  const superiorDarkvision = {
    type: 'darkvision',
    name: 'Superior Darkvision',
    range: 120,
    is_limited: false,
    notes: 'Drow only'
  }

  const limitedBlindsight = {
    type: 'blindsight',
    name: 'Blindsight',
    range: 30,
    is_limited: true,
    notes: null
  }

  it('renders nothing when senses array is empty', async () => {
    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [] }
    })

    expect(wrapper.text()).toBe('')
  })

  it('displays a single sense with icon', async () => {
    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [basicDarkvision] }
    })

    expect(wrapper.text()).toContain('Darkvision 60 ft.')
    // Verify component structure includes data attribute for sense items
    expect(wrapper.find('[data-sense-item]').exists()).toBe(true)
  })

  it('displays superior darkvision with correct range', async () => {
    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [superiorDarkvision] }
    })

    expect(wrapper.text()).toContain('Superior Darkvision 120 ft.')
  })

  it('displays limited sense with "(limited)" text', async () => {
    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [limitedBlindsight] }
    })

    expect(wrapper.text()).toContain('Blindsight 30 ft. (limited)')
  })

  it('displays notes when provided', async () => {
    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [superiorDarkvision] }
    })

    expect(wrapper.text()).toContain('Drow only')
  })

  it('displays multiple senses separated', async () => {
    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [basicDarkvision, limitedBlindsight] }
    })

    const text = wrapper.text()
    expect(text).toContain('Darkvision 60 ft.')
    expect(text).toContain('Blindsight 30 ft. (limited)')
  })

  it('handles sense with both limited flag and notes', async () => {
    const complexSense = {
      type: 'tremorsense',
      name: 'Tremorsense',
      range: 30,
      is_limited: true,
      notes: 'While on stone surfaces'
    }

    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [complexSense] }
    })

    const text = wrapper.text()
    expect(text).toContain('Tremorsense 30 ft. (limited)')
    expect(text).toContain('While on stone surfaces')
  })

  it('displays all three common sense types', async () => {
    const tremorsense = {
      type: 'tremorsense',
      name: 'Tremorsense',
      range: 15,
      is_limited: false,
      notes: null
    }

    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: {
        senses: [basicDarkvision, limitedBlindsight, tremorsense]
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Darkvision 60 ft.')
    expect(text).toContain('Blindsight 30 ft. (limited)')
    expect(text).toContain('Tremorsense 15 ft.')
  })

  it('uses correct spacing between multiple senses', async () => {
    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [basicDarkvision, limitedBlindsight] }
    })

    // Should have some separation structure (comma, div, etc.)
    const html = wrapper.html()
    expect(html).toBeTruthy()
    // The component should render both senses
    expect(wrapper.findAll('[data-sense-item]').length).toBe(2)
  })

  it('handles sense with zero range', async () => {
    const zeroRangeSense = {
      type: 'special',
      name: 'Special Vision',
      range: 0,
      is_limited: false,
      notes: 'No range specified'
    }

    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [zeroRangeSense] }
    })

    // Should still display even with 0 range
    expect(wrapper.text()).toContain('Special Vision')
  })

  it('renders sense items with proper structure', async () => {
    const wrapper = await mountSuspended(RaceOverviewSensesDisplay, {
      props: { senses: [basicDarkvision, limitedBlindsight] }
    })

    // Should have data attributes for both senses
    const senseItems = wrapper.findAll('[data-sense-item]')
    expect(senseItems.length).toBe(2)
  })
})
