import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SkillCard from '~/components/skill/SkillCard.vue'
import { testCardHoverEffects, testCardBorderStyling } from '../../helpers/cardBehavior'

describe('SkillCard', () => {
  const mockSkill = {
    id: 1,
    name: 'Acrobatics',
    ability_score: {
      id: 2,
      code: 'DEX',
      name: 'Dexterity'
    }
  }

  const mountCard = () => mountSuspended(SkillCard, {
    props: { skill: mockSkill }
  })

  testCardHoverEffects(mountCard)
  testCardBorderStyling(mountCard)

  it('displays skill name as title', async () => {
    const wrapper = await mountSuspended(SkillCard, {
      props: { skill: mockSkill }
    })

    expect(wrapper.text()).toContain('Acrobatics')
  })

  it('displays ability score code as badge', async () => {
    const wrapper = await mountSuspended(SkillCard, {
      props: { skill: mockSkill }
    })

    expect(wrapper.text()).toContain('DEX')
  })

  it('displays ability score full name', async () => {
    const wrapper = await mountSuspended(SkillCard, {
      props: { skill: mockSkill }
    })

    expect(wrapper.text()).toContain('Dexterity')
  })

  it('handles missing ability score gracefully', async () => {
    const noAbility = {
      id: 2,
      name: 'Perception',
      ability_score: null
    }

    const wrapper = await mountSuspended(SkillCard, {
      props: { skill: noAbility }
    })

    expect(wrapper.text()).toContain('Perception')
    expect(wrapper.text()).not.toContain('null')
  })

  it('displays category badge', async () => {
    const wrapper = await mountSuspended(SkillCard, {
      props: { skill: mockSkill }
    })

    expect(wrapper.text()).toContain('Skill')
  })

  it('uses skill color for ability score badge', async () => {
    const wrapper = await mountSuspended(SkillCard, {
      props: { skill: mockSkill }
    })

    const html = wrapper.html()
    // Skill color badge should be present (bg-skill class)
    expect(html).toContain('bg-skill')
  })

  describe('background images', () => {
    it('computes background image URL correctly from skill name', async () => {
      const wrapper = await mountSuspended(SkillCard, {
        props: {
          skill: {
            id: 1,
            name: 'Animal Handling',
            ability_score: {
              id: 3,
              code: 'WIS',
              name: 'Wisdom'
            }
          }
        }
      })

      const url = wrapper.vm.backgroundImageUrl
      // Slug is generated from name: "Animal Handling" -> "animal-handling"
      expect(url).toBe('/images/generated/conversions/256/skills/stability-ai/animal-handling.png')
    })

    it('applies background image with opacity layer', async () => {
      const wrapper = await mountSuspended(SkillCard, {
        props: {
          skill: {
            id: 1,
            name: 'Acrobatics'
          }
        }
      })

      const html = wrapper.html()
      // Check for absolute positioned background div with opacity
      expect(html).toContain('absolute inset-0')
      expect(html).toContain('opacity-10')
      expect(html).toContain('acrobatics.png')
    })
  })
})
