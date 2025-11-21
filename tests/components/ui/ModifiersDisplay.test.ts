import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ModifiersDisplay from '~/components/ui/ModifiersDisplay.vue'

describe('ModifiersDisplay', () => {
  const abilityScoreModifiers = [
    {
      id: 1,
      modifier_category: 'ability_score',
      ability_score: {
        id: 1,
        code: 'STR',
        name: 'Strength'
      },
      value: '2',
      condition: null
    },
    {
      id: 2,
      modifier_category: 'ability_score',
      ability_score: {
        id: 6,
        code: 'CHA',
        name: 'Charisma'
      },
      value: '1',
      condition: null
    }
  ]

  const genericModifiers = [
    {
      id: 3,
      modifier_category: 'speed',
      ability_score: null,
      value: '10',
      condition: 'while not wearing armor'
    }
  ]

  it('renders nothing when modifiers is empty array', () => {
    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: [] }
    })

    const container = wrapper.find('[data-testid="modifiers-container"]')
    expect(container.exists()).toBe(false)
  })

  it('renders nothing when modifiers is undefined', () => {
    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: undefined }
    })

    const container = wrapper.find('[data-testid="modifiers-container"]')
    expect(container.exists()).toBe(false)
  })

  it('displays ability score modifiers with name and code', () => {
    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: abilityScoreModifiers }
    })

    expect(wrapper.text()).toContain('Strength (STR): +2')
    expect(wrapper.text()).toContain('Charisma (CHA): +1')
  })

  it('formats positive values with plus sign', () => {
    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: abilityScoreModifiers }
    })

    expect(wrapper.text()).toContain('+2')
    expect(wrapper.text()).toContain('+1')
  })

  it('displays negative values correctly', () => {
    const negativeModifier = [{
      id: 4,
      modifier_category: 'ability_score',
      ability_score: {
        id: 2,
        code: 'DEX',
        name: 'Dexterity'
      },
      value: '-2',
      condition: null
    }]

    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: negativeModifier }
    })

    expect(wrapper.text()).toContain('Dexterity (DEX): -2')
  })

  it('displays generic modifiers with category name', () => {
    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: genericModifiers }
    })

    expect(wrapper.text()).toContain('speed: +10')
  })

  it('displays condition text when present', () => {
    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: genericModifiers }
    })

    expect(wrapper.text()).toContain('while not wearing armor')
  })

  it('renders multiple modifiers correctly', () => {
    const mixed = [...abilityScoreModifiers, ...genericModifiers]
    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: mixed }
    })

    const items = wrapper.findAll('[data-testid="modifier-item"]')
    expect(items.length).toBe(3)
  })

  it('handles modifiers without condition', () => {
    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: abilityScoreModifiers }
    })

    // Should not show condition text for modifiers without conditions
    expect(wrapper.text()).not.toContain('while not wearing armor')
  })

  it('handles mixed ability score and generic modifiers', () => {
    const mixed = [
      {
        id: 1,
        modifier_category: 'ability_score',
        ability_score: {
          id: 1,
          code: 'STR',
          name: 'Strength'
        },
        value: '2',
        condition: null
      },
      {
        id: 2,
        modifier_category: 'movement',
        ability_score: null,
        value: '5',
        condition: 'in difficult terrain'
      }
    ]

    const wrapper = mount(ModifiersDisplay, {
      props: { modifiers: mixed }
    })

    expect(wrapper.text()).toContain('Strength (STR): +2')
    expect(wrapper.text()).toContain('movement: +5')
    expect(wrapper.text()).toContain('in difficult terrain')
  })
})
