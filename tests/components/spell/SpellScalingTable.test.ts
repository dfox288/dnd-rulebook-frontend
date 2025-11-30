import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SpellScalingTable from '~/components/spell/SpellScalingTable.vue'
import type { SpellEffect } from '~/types'

describe('SpellScalingTable', () => {
  // Conditional Rendering

  it('does not render when only one effect exists', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null,
        damage_type: {
          id: 1,
          name: 'Fire',
          description: 'Fire damage'
        }
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('does not render when multiple effects have same min_spell_slot', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null,
        damage_type: {
          id: 1,
          name: 'Fire',
          description: 'Fire damage'
        }
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null,
        damage_type: {
          id: 1,
          name: 'Fire',
          description: 'Fire damage'
        }
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('renders when multiple effects have different min_spell_slot values', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null,
        damage_type: {
          id: 1,
          name: 'Fire',
          description: 'Fire damage'
        }
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage at higher level',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null,
        damage_type: {
          id: 1,
          name: 'Fire',
          description: 'Fire damage'
        }
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    expect(wrapper.text()).toContain('SCALING BY SPELL SLOT')
  })

  // Header

  it('displays spell slot scaling header', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    expect(wrapper.text()).toContain('📈')
    expect(wrapper.text()).toContain('SCALING BY SPELL SLOT')
  })

  it('displays character level scaling header', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Cantrip damage',
        dice_formula: '1d10',
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 1,
        min_spell_slot: null,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Cantrip damage higher',
        dice_formula: '2d10',
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 5,
        min_spell_slot: null,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 0,
        scalingType: 'character_level'
      }
    })

    expect(wrapper.text()).toContain('📈')
    expect(wrapper.text()).toContain('SCALING BY CHARACTER LEVEL')
  })

  // Spell Slot Scaling (Fireball example)

  it('displays spell slot levels as table headers', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      },
      {
        id: 3,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '10d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 5,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('3rd')
    expect(text).toContain('4th')
    expect(text).toContain('5th')
  })

  it('displays damage values in table cells', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      },
      {
        id: 3,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '10d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 5,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('8d6')
    expect(text).toContain('9d6')
    expect(text).toContain('10d6')
  })

  it('calculates and displays average damage', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6', // Average: 8 * 3.5 = 28
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6', // Average: 9 * 3.5 = 31.5 -> 31
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('28')
    expect(text).toContain('31')
  })

  it('highlights base level column', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const html = wrapper.html()
    // Check for highlighted column (likely with bg-spell or similar)
    expect(html).toMatch(/bg-spell|bg-gray|font-bold/)
  })

  // Character Level Scaling (Eldritch Blast example)

  it('displays character level ranges as headers', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: '1 beam',
        dice_formula: '1d10',
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 1,
        min_spell_slot: null,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: '2 beams',
        dice_formula: '2d10',
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 5,
        min_spell_slot: null,
        scaling_increment: null
      },
      {
        id: 3,
        effect_type: 'damage',
        description: '3 beams',
        dice_formula: '3d10',
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 11,
        min_spell_slot: null,
        scaling_increment: null
      },
      {
        id: 4,
        effect_type: 'damage',
        description: '4 beams',
        dice_formula: '4d10',
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 17,
        min_spell_slot: null,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 0,
        scalingType: 'character_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('1-4')
    expect(text).toContain('5-10')
    expect(text).toContain('11-16')
    expect(text).toContain('17+')
  })

  it('displays damage for character level scaling', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: '1 beam',
        dice_formula: '1d10',
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 1,
        min_spell_slot: null,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: '2 beams',
        dice_formula: '2d10',
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 5,
        min_spell_slot: null,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 0,
        scalingType: 'character_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('1d10')
    expect(text).toContain('2d10')
  })

  // Dice Average Calculation

  it('calculates average for simple dice formula', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Damage',
        dice_formula: '4d6', // Average: 4 * 3.5 = 14
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 1,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Damage',
        dice_formula: '5d6', // Average: 5 * 3.5 = 17.5 -> 17
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 2,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 1,
        scalingType: 'spell_slot_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('14')
    expect(text).toContain('17')
  })

  it('handles d10 dice for average calculation', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Damage',
        dice_formula: '1d10', // Average: 1 * 5.5 = 5.5 -> 5
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 1,
        min_spell_slot: null,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Damage',
        dice_formula: '2d10', // Average: 2 * 5.5 = 11
        base_value: null,
        scaling_type: 'character_level',
        min_character_level: 5,
        min_spell_slot: null,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 0,
        scalingType: 'character_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('5')
    expect(text).toContain('11')
  })

  it('does not calculate average for non-dice formulas', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Damage',
        dice_formula: '3 targets',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 1,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Damage',
        dice_formula: '4 targets',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 2,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 1,
        scalingType: 'spell_slot_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('3 targets')
    expect(text).toContain('4 targets')
    // Should not show "Average" row for non-dice formulas
    expect(text).not.toContain('Average')
  })

  // Healing Effects

  it('adapts label for healing effects', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'healing',
        description: 'Hit Points',
        dice_formula: '5d8',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'healing',
        description: 'Hit Points',
        dice_formula: '6d8',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('5d8')
    expect(text).toContain('6d8')
    // Should adapt row label based on effect type
    expect(text).toMatch(/Healing|Hit Points|HP/)
  })

  // Mobile Responsiveness

  it('includes horizontal scroll container', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const html = wrapper.html()
    expect(html).toMatch(/overflow-x-auto|overflow-auto/)
  })

  // Layout Tests

  it('uses card layout', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const html = wrapper.html()
    // Should use UCard with spell border
    expect(html).toMatch(/border-spell|border-2/)
  })

  it('uses table element for data', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const html = wrapper.html()
    expect(html).toContain('<table')
    expect(html).toContain('</table>')
  })

  // Edge Cases

  it('handles single level difference', async () => {
    const effects: SpellEffect[] = [
      {
        id: 1,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '8d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 3,
        scaling_increment: null
      },
      {
        id: 2,
        effect_type: 'damage',
        description: 'Fire damage',
        dice_formula: '9d6',
        base_value: null,
        scaling_type: 'spell_slot_level',
        min_character_level: null,
        min_spell_slot: 4,
        scaling_increment: null
      }
    ]

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    expect(wrapper.text()).toContain('3rd')
    expect(wrapper.text()).toContain('4th')
  })

  it('handles many scaling levels', async () => {
    const effects: SpellEffect[] = Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      effect_type: 'damage' as const,
      description: 'Fire damage',
      dice_formula: `${8 + i}d6`,
      base_value: null,
      scaling_type: 'spell_slot_level' as const,
      min_character_level: null,
      min_spell_slot: 3 + i,
      scaling_increment: null
    }))

    const wrapper = await mountSuspended(SpellScalingTable, {
      props: {
        effects,
        baseLevel: 3,
        scalingType: 'spell_slot_level'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('3rd')
    expect(text).toContain('9th')
  })
})
