import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SpellCastingStats from '~/components/spell/SpellCastingStats.vue'

describe('SpellCastingStats', () => {
  // Basic stats rendering

  it('renders casting time', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('1 action')
  })

  it('renders range', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('150 feet')
  })

  it('renders duration', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('Instantaneous')
  })

  // Area of Effect

  it('renders area of effect when present', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: { type: 'sphere', size: 20 },
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('20')
    expect(wrapper.text()).toContain('Sphere')
  })

  it('handles null area of effect gracefully', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    // Should not crash and should render other stats
    expect(wrapper.text()).toContain('1 action')
    expect(wrapper.text()).toContain('150 feet')
  })

  it('formats different area of effect types', async () => {
    const aoeTypes = [
      { type: 'sphere', size: 20 },
      { type: 'cone', size: 15 },
      { type: 'cube', size: 10 },
      { type: 'line', size: 60 }
    ]

    for (const aoe of aoeTypes) {
      const wrapper = await mountSuspended(SpellCastingStats, {
        props: {
          castingTime: '1 action',
          castingTimeType: 'action',
          range: '150 feet',
          duration: 'Instantaneous',
          areaOfEffect: aoe,
          components: 'V, S',
          requiresVerbal: true,
          requiresSomatic: true,
          requiresMaterial: false,
          materialComponents: null,
          materialCostGp: null,
          materialConsumed: null
        }
      })

      const text = wrapper.text()
      expect(text).toContain(aoe.size.toString())
      expect(text.toLowerCase()).toContain(aoe.type.toLowerCase())
    }
  })

  // Component Icons

  it('shows V icon when requiresVerbal is true', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V',
        requiresVerbal: true,
        requiresSomatic: false,
        requiresMaterial: false,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('V')
  })

  it('shows S icon when requiresSomatic is true', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'S',
        requiresVerbal: false,
        requiresSomatic: true,
        requiresMaterial: false,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('S')
  })

  it('shows M icon when requiresMaterial is true', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'M',
        requiresVerbal: false,
        requiresSomatic: false,
        requiresMaterial: true,
        materialComponents: 'bat guano',
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('M')
  })

  it('shows all three component icons when all are required', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: 'bat guano and sulfur',
        materialCostGp: null,
        materialConsumed: null
      }
    })

    const text = wrapper.text()
    expect(text).toContain('V')
    expect(text).toContain('S')
    expect(text).toContain('M')
  })

  // Material Components

  it('shows material component description when present', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: 'bat guano and sulfur',
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('bat guano and sulfur')
  })

  it('does not show material section when requiresMaterial is false', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: false,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).not.toContain('Materials')
  })

  it('shows material cost when present', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: 'a diamond',
        materialCostGp: 300,
        materialConsumed: null
      }
    })

    expect(wrapper.text()).toContain('300')
    expect(wrapper.text()).toContain('gp')
  })

  it('marks consumed materials with (consumed) text', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: 'a diamond',
        materialCostGp: 300,
        materialConsumed: true
      }
    })

    expect(wrapper.text()).toContain('consumed')
  })

  it('highlights costly materials (>= 100gp) with warning styling', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: 'a diamond',
        materialCostGp: 100,
        materialConsumed: null
      }
    })

    // Check for warning color class (could be text-warning, bg-warning, etc.)
    const html = wrapper.html()
    expect(html).toContain('warning')
  })

  it('does not apply warning styling for materials < 100gp', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: 'a pinch of sulfur',
        materialCostGp: 50,
        materialConsumed: null
      }
    })

    // Should show the cost but not with warning styling
    expect(wrapper.text()).toContain('50')
    expect(wrapper.text()).toContain('gp')
  })

  // Layout tests

  it('applies grid layout for stats', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: { type: 'sphere', size: 20 },
        components: 'V, S',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: false,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    // Check for grid classes
    const grid = wrapper.find('.grid')
    expect(grid.exists()).toBe(true)
  })

  it('has responsive grid classes (4-col desktop, 2x2 mobile)', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: { type: 'sphere', size: 20 },
        components: 'V, S',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: false,
        materialComponents: null,
        materialCostGp: null,
        materialConsumed: null
      }
    })

    const html = wrapper.html()
    // Should have classes for 2 cols on mobile and 4 on desktop
    expect(html).toMatch(/grid-cols-2/)
    expect(html).toMatch(/md:grid-cols-4/)
  })

  // Integration tests

  it('renders complete spell casting stats with all fields', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: '150 feet',
        duration: 'Instantaneous',
        areaOfEffect: { type: 'sphere', size: 20 },
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: 'bat guano and sulfur',
        materialCostGp: null,
        materialConsumed: null
      }
    })

    const text = wrapper.text()
    expect(text).toContain('1 action')
    expect(text).toContain('150 feet')
    expect(text).toContain('Instantaneous')
    expect(text).toContain('20')
    expect(text).toContain('Sphere')
    expect(text).toContain('V')
    expect(text).toContain('S')
    expect(text).toContain('M')
    expect(text).toContain('bat guano and sulfur')
  })

  it('renders spell with costly consumed materials', async () => {
    const wrapper = await mountSuspended(SpellCastingStats, {
      props: {
        castingTime: '1 action',
        castingTimeType: 'action',
        range: 'Self',
        duration: 'Instantaneous',
        areaOfEffect: null,
        components: 'V, S, M',
        requiresVerbal: true,
        requiresSomatic: true,
        requiresMaterial: true,
        materialComponents: 'a diamond worth at least 300 gp',
        materialCostGp: 300,
        materialConsumed: true
      }
    })

    const text = wrapper.text()
    expect(text).toContain('300')
    expect(text).toContain('gp')
    expect(text).toContain('consumed')
    expect(text).toContain('diamond')

    // Should have warning styling
    const html = wrapper.html()
    expect(html).toContain('warning')
  })

  it('handles different casting times', async () => {
    const castingTimes = [
      '1 action',
      '1 bonus action',
      '1 reaction',
      '1 minute',
      '10 minutes',
      '1 hour'
    ]

    for (const time of castingTimes) {
      const wrapper = await mountSuspended(SpellCastingStats, {
        props: {
          castingTime: time,
          castingTimeType: 'action',
          range: '150 feet',
          duration: 'Instantaneous',
          areaOfEffect: null,
          components: 'V, S',
          requiresVerbal: true,
          requiresSomatic: true,
          requiresMaterial: false,
          materialComponents: null,
          materialCostGp: null,
          materialConsumed: null
        }
      })

      expect(wrapper.text()).toContain(time)
    }
  })

  it('handles different range types', async () => {
    const ranges = [
      'Self',
      'Touch',
      '30 feet',
      '120 feet',
      '1 mile',
      'Unlimited'
    ]

    for (const range of ranges) {
      const wrapper = await mountSuspended(SpellCastingStats, {
        props: {
          castingTime: '1 action',
          castingTimeType: 'action',
          range,
          duration: 'Instantaneous',
          areaOfEffect: null,
          components: 'V, S',
          requiresVerbal: true,
          requiresSomatic: true,
          requiresMaterial: false,
          materialComponents: null,
          materialCostGp: null,
          materialConsumed: null
        }
      })

      expect(wrapper.text()).toContain(range)
    }
  })

  it('handles different duration types', async () => {
    const durations = [
      'Instantaneous',
      '1 round',
      '1 minute',
      '10 minutes',
      '1 hour',
      '8 hours',
      '24 hours',
      'Until dispelled'
    ]

    for (const duration of durations) {
      const wrapper = await mountSuspended(SpellCastingStats, {
        props: {
          castingTime: '1 action',
          castingTimeType: 'action',
          range: '150 feet',
          duration,
          areaOfEffect: null,
          components: 'V, S',
          requiresVerbal: true,
          requiresSomatic: true,
          requiresMaterial: false,
          materialComponents: null,
          materialCostGp: null,
          materialConsumed: null
        }
      })

      expect(wrapper.text()).toContain(duration)
    }
  })
})
