import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiAccordionClassCounters from '~/components/ui/accordion/UiAccordionClassCounters.vue'
import type { CounterFromAPI } from '~/types/api/entities'

describe('UiAccordionClassCounters', () => {
  // CounterFromAPI: pre-grouped counters with progression arrays
  const mockCounters: CounterFromAPI[] = [
    {
      name: 'Ki Points',
      reset_timing: 'Short Rest',
      progression: [{ level: 1, value: 2 }]
    },
    {
      name: 'Rage',
      reset_timing: 'Long Rest',
      progression: [{ level: 3, value: 3 }]
    }
  ]

  it('renders counters sorted by level', async () => {
    const wrapper = await mountSuspended(UiAccordionClassCounters, {
      props: { counters: mockCounters }
    })

    expect(wrapper.text()).toContain('Ki Points')
    expect(wrapper.text()).toContain('Rage')

    // Level 1 should appear before Level 3 (sorted)
    const text = wrapper.text()
    const kiIndex = text.indexOf('Ki Points')
    const rageIndex = text.indexOf('Rage')
    expect(kiIndex).toBeLessThan(rageIndex)
  })

  it('displays reset timing badges', async () => {
    const wrapper = await mountSuspended(UiAccordionClassCounters, {
      props: { counters: mockCounters }
    })

    expect(wrapper.text()).toContain('Long Rest')
    expect(wrapper.text()).toContain('Short Rest')
  })

  it('handles empty counters array', async () => {
    const wrapper = await mountSuspended(UiAccordionClassCounters, {
      props: { counters: [] }
    })

    expect(wrapper.text()).toBe('')
  })

  it('shows each counter name once with progression', async () => {
    // API returns pre-grouped counters - each counter appears once with all level progressions
    const countersWithProgressions: CounterFromAPI[] = [
      {
        name: 'Rage',
        reset_timing: 'Long Rest',
        progression: [
          { level: 1, value: 2 },
          { level: 3, value: 3 },
          { level: 6, value: 4 }
        ]
      },
      {
        name: 'Ki Points',
        reset_timing: 'Short Rest',
        progression: [{ level: 2, value: 2 }]
      }
    ]

    const wrapper = await mountSuspended(UiAccordionClassCounters, {
      props: { counters: countersWithProgressions }
    })

    // Each counter name appears once (API pre-groups them)
    const text = wrapper.text()
    const rageMatches = text.match(/Rage/g)
    expect(rageMatches).toHaveLength(1)

    const kiMatches = text.match(/Ki Points/g)
    expect(kiMatches).toHaveLength(1)
  })

  it('shows progression values for grouped counters', async () => {
    const countersWithProgression: CounterFromAPI[] = [
      {
        name: 'Rage',
        reset_timing: 'Long Rest',
        progression: [
          { level: 1, value: 2 },
          { level: 3, value: 3 },
          { level: 6, value: 4 }
        ]
      }
    ]

    const wrapper = await mountSuspended(UiAccordionClassCounters, {
      props: { counters: countersWithProgression }
    })

    const text = wrapper.text()

    // Should show progression values (2, 3, 4)
    expect(text).toContain('2')
    expect(text).toContain('3')
    expect(text).toContain('4')

    // Should show the levels where values change
    expect(text).toContain('Level 1')
    expect(text).toContain('Level 3')
    expect(text).toContain('Level 6')
  })

  it('handles single-occurrence counters normally', async () => {
    const singleCounters: CounterFromAPI[] = [
      {
        name: 'Unique Counter',
        reset_timing: 'Long Rest',
        progression: [{ level: 1, value: 5 }]
      }
    ]

    const wrapper = await mountSuspended(UiAccordionClassCounters, {
      props: { counters: singleCounters }
    })

    expect(wrapper.text()).toContain('Unique Counter')
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('Level 1')
  })

  it('handles multiple counters with varying progressions', async () => {
    const mixedCounters: CounterFromAPI[] = [
      {
        name: 'Rage',
        reset_timing: 'Long Rest',
        progression: [
          { level: 1, value: 2 },
          { level: 3, value: 3 }
        ]
      },
      {
        name: 'Ki Points',
        reset_timing: 'Short Rest',
        progression: [{ level: 2, value: 2 }]
      },
      {
        name: 'Sorcery Points',
        reset_timing: 'Long Rest',
        progression: [{ level: 5, value: 5 }]
      }
    ]

    const wrapper = await mountSuspended(UiAccordionClassCounters, {
      props: { counters: mixedCounters }
    })

    const text = wrapper.text()

    // All counter names should appear once
    expect(text.match(/Rage/g)).toHaveLength(1)
    expect(text.match(/Ki Points/g)).toHaveLength(1)
    expect(text.match(/Sorcery Points/g)).toHaveLength(1)
  })
})
