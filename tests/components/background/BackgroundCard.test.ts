import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Background } from '~/types'
import BackgroundCard from '~/components/background/BackgroundCard.vue'
import { testCardLinkBehavior, testCardHoverEffects, testCardBorderStyling } from '../../helpers/cardBehavior'
import { testDescriptionTruncation } from '../../helpers/descriptionBehavior'
import { testSourceFooter, testOptionalSourceFooter } from '../../helpers/sourceBehavior'

describe('BackgroundCard', () => {
  const mockBackground: Background = {
    id: 1,
    name: 'Acolyte',
    slug: 'acolyte',
    skill_proficiencies: [
      { id: 1, name: 'Insight' },
      { id: 2, name: 'Religion' }
    ],
    tool_proficiencies: [],
    languages: [
      { id: 1, name: 'Common' },
      { id: 2, name: 'Elvish' }
    ],
    feature_name: 'Shelter of the Faithful',
    description: 'You have spent your life in the service of a temple to a specific god or pantheon of gods.',
    sources: [
      { code: 'PHB', name: 'Player\'s Handbook', pages: '127' }
    ]
  }

  // Shared card behavior tests (using helpers)
  testCardLinkBehavior(
    () => mountSuspended(BackgroundCard, { props: { background: mockBackground } }),
    '/backgrounds/acolyte'
  )

  testCardHoverEffects(
    () => mountSuspended(BackgroundCard, { props: { background: mockBackground } })
  )

  testCardBorderStyling(
    () => mountSuspended(BackgroundCard, { props: { background: mockBackground } })
  )

  testDescriptionTruncation(
    () => mountSuspended(BackgroundCard, { props: { background: { ...mockBackground, description: 'A'.repeat(200) } } }),
    () => mountSuspended(BackgroundCard, { props: { background: { ...mockBackground, description: 'Short background description' } } })
  )

  testSourceFooter(
    () => mountSuspended(BackgroundCard, { props: { background: mockBackground } }),
    'Player\'s Handbook'
  )

  testOptionalSourceFooter(
    () => mountSuspended(BackgroundCard, { props: { background: { ...mockBackground, sources: undefined } } }),
    'Acolyte'
  )

  // Background-specific tests (domain logic)

  it('renders background name', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    expect(wrapper.text()).toContain('Acolyte')
  })

  it('renders feature name badge when provided', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    expect(wrapper.text()).toContain('Shelter of the Faithful')
  })

  it('hides feature badge when not provided', async () => {
    const bgWithoutFeature = { ...mockBackground, feature_name: undefined }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: bgWithoutFeature }
    })

    const html = wrapper.html()
    // Should not have the feature badge section
    expect(html).not.toContain('Shelter')
  })

  it('shows skills summary with plural form', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    expect(wrapper.text()).toContain('2 Skills')
  })

  it('uses singular form for single skill', async () => {
    const oneSkillBg = {
      ...mockBackground,
      skill_proficiencies: [{ id: 1, name: 'Insight' }]
    }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: oneSkillBg }
    })

    expect(wrapper.text()).toContain('1 Skill')
  })

  it('hides skills summary when none provided', async () => {
    const noSkillsBg = { ...mockBackground, skill_proficiencies: [] }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: noSkillsBg }
    })

    expect(wrapper.text()).not.toContain('Skills')
  })

  it('shows languages count with plural form', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    expect(wrapper.text()).toContain('2 Languages')
  })

  it('uses singular form for single language', async () => {
    const oneLangBg = {
      ...mockBackground,
      languages: [{ id: 1, name: 'Common' }]
    }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: oneLangBg }
    })

    expect(wrapper.text()).toContain('1 Language')
  })

  it('hides languages count when none provided', async () => {
    const noLangsBg = { ...mockBackground, languages: [] }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: noLangsBg }
    })

    expect(wrapper.text()).not.toContain('Language')
  })

  it('shows tool proficiencies badge when provided', async () => {
    const bgWithTools = {
      ...mockBackground,
      tool_proficiencies: [
        { id: 1, name: 'Thieves\' Tools' },
        { id: 2, name: 'Disguise Kit' }
      ]
    }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: bgWithTools }
    })

    expect(wrapper.text()).toContain('2 Tools')
  })

  it('hides tool proficiencies when none provided', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    expect(wrapper.text()).not.toContain('Tools')
  })

  it('renders description when provided', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    expect(wrapper.text()).toContain('You have spent your life')
  })

  it('shows default description when not provided', async () => {
    const bgWithoutDescription = { ...mockBackground, description: undefined }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: bgWithoutDescription }
    })

    expect(wrapper.text()).toContain('A character background for D&D 5e')
  })

  it('displays all key information in organized layout', async () => {
    const fullBg = {
      ...mockBackground,
      tool_proficiencies: [{ id: 1, name: 'Thieves\' Tools' }]
    }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: fullBg }
    })

    const text = wrapper.text()
    expect(text).toContain('Acolyte')
    expect(text).toContain('Shelter of the Faithful')
    expect(text).toContain('2 Skills')
    expect(text).toContain('2 Languages')
    expect(text).toContain('1 Tools')
  })

  it('handles backgrounds with all optional fields', async () => {
    const fullBg = {
      ...mockBackground,
      skill_proficiencies: [{ id: 1, name: 'Insight' }],
      tool_proficiencies: [{ id: 1, name: 'Thieves\' Tools' }],
      languages: [{ id: 1, name: 'Common' }],
      feature_name: 'Feature Name',
      description: 'Full description',
      sources: [{ code: 'PHB', name: 'Player\'s Handbook', pages: '127' }]
    }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: fullBg }
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('handles backgrounds with minimal fields', async () => {
    const minimalBg = {
      id: 1,
      name: 'Soldier',
      slug: 'soldier'
    }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: minimalBg }
    })

    expect(wrapper.text()).toContain('Soldier')
  })

  it('handles backgrounds with many tools', async () => {
    const manyToolsBg = {
      ...mockBackground,
      tool_proficiencies: [
        { id: 1, name: 'Thieves\' Tools' },
        { id: 2, name: 'Disguise Kit' },
        { id: 3, name: 'Forgery Kit' }
      ]
    }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: manyToolsBg }
    })

    expect(wrapper.text()).toContain('3 Tools')
  })
})
