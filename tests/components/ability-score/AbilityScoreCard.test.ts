import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AbilityScoreCard from '~/components/ability-score/AbilityScoreCard.vue'
import { testCardHoverEffects, testCardBorderStyling } from '../../helpers/cardBehavior'

describe('AbilityScoreCard', () => {
  const mockAbilityScore = {
    id: 1,
    code: 'STR',
    name: 'Strength'
  }

  const mountCard = () => mountSuspended(AbilityScoreCard, {
    props: { abilityScore: mockAbilityScore }
  })

  testCardHoverEffects(mountCard)
  testCardBorderStyling(mountCard)

  it('displays ability score code as large badge', async () => {
    const wrapper = await mountSuspended(AbilityScoreCard, {
      props: { abilityScore: mockAbilityScore }
    })

    expect(wrapper.text()).toContain('STR')
  })

  it('displays ability score name as title', async () => {
    const wrapper = await mountSuspended(AbilityScoreCard, {
      props: { abilityScore: mockAbilityScore }
    })

    expect(wrapper.text()).toContain('Strength')
  })

  it('displays category badge', async () => {
    const wrapper = await mountSuspended(AbilityScoreCard, {
      props: { abilityScore: mockAbilityScore }
    })

    expect(wrapper.text()).toContain('Ability Score')
  })

  it('handles missing optional fields gracefully', async () => {
    const minimalData = {
      id: 2,
      code: 'DEX',
      name: 'Dexterity'
    }

    const wrapper = await mountSuspended(AbilityScoreCard, {
      props: { abilityScore: minimalData }
    })

    expect(wrapper.text()).toContain('DEX')
    expect(wrapper.text()).toContain('Dexterity')
  })

  describe('background images', () => {
    it('computes background image URL correctly', async () => {
      const wrapper = await mountSuspended(AbilityScoreCard, {
        props: {
          abilityScore: {
            id: 1,
            code: 'STR',
            name: 'Strength'
          }
        }
      })

      const url = wrapper.vm.backgroundImageUrl
      expect(url).toBe('/images/generated/conversions/256/ability_scores/stability-ai/str.png')
    })

    it('applies background image with opacity layer', async () => {
      const wrapper = await mountSuspended(AbilityScoreCard, {
        props: {
          abilityScore: {
            id: 1,
            code: 'STR',
            name: 'Strength'
          }
        }
      })

      const html = wrapper.html()
      // Check for absolute positioned background div with opacity
      expect(html).toContain('absolute inset-0')
      expect(html).toContain('opacity-15')
      expect(html).toContain('group-hover:opacity-30')
      expect(html).toContain('str.png')
    })
  })
})
