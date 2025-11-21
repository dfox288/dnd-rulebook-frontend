import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BackgroundCard from '~/components/background/BackgroundCard.vue'

describe('BackgroundCard', () => {
  const mockBackground = {
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
      { code: 'PHB', name: "Player's Handbook", pages: '127' }
    ]
  }

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
        { id: 1, name: "Thieves' Tools" },
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

  it('truncates long descriptions', async () => {
    const longDescription = 'A'.repeat(200)
    const longBg = { ...mockBackground, description: longDescription }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: longBg }
    })

    const text = wrapper.text()
    expect(text).toContain('...')
    expect(text.length).toBeLessThan(longDescription.length + 100)
  })

  it('does not truncate short descriptions', async () => {
    const shortDescription = 'Short background description'
    const shortBg = { ...mockBackground, description: shortDescription }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: shortBg }
    })

    expect(wrapper.text()).toContain(shortDescription)
    expect(wrapper.text()).not.toContain('...')
  })

  it('links to background detail page with slug', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/backgrounds/acolyte')
  })

  it('applies hover effects for interactivity', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    const html = wrapper.html()
    expect(html).toContain('hover')
  })

  it('uses card component with border', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    const html = wrapper.html()
    expect(html).toContain('border')
  })

  it('renders with proper spacing structure', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    const html = wrapper.html()
    expect(html).toContain('space-y-3')
  })

  it('renders sources footer', async () => {
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: mockBackground }
    })

    expect(wrapper.text()).toContain("Player's Handbook")
  })

  it('handles backgrounds without sources', async () => {
    const bgWithoutSources = { ...mockBackground, sources: undefined }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: bgWithoutSources }
    })

    expect(wrapper.text()).toContain('Acolyte')
  })

  it('displays all key information in organized layout', async () => {
    const fullBg = {
      ...mockBackground,
      tool_proficiencies: [{ id: 1, name: "Thieves' Tools" }]
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

  it('handles long background names with line clamp', async () => {
    const longName = 'Very Long Background Name That Should Be Truncated'
    const longNameBg = { ...mockBackground, name: longName }
    const wrapper = await mountSuspended(BackgroundCard, {
      props: { background: longNameBg }
    })

    const html = wrapper.html()
    expect(html).toContain('line-clamp-2')
  })

  it('handles backgrounds with all optional fields', async () => {
    const fullBg = {
      ...mockBackground,
      skill_proficiencies: [{ id: 1, name: 'Insight' }],
      tool_proficiencies: [{ id: 1, name: "Thieves' Tools" }],
      languages: [{ id: 1, name: 'Common' }],
      feature_name: 'Feature Name',
      description: 'Full description',
      sources: [{ code: 'PHB', name: "Player's Handbook", pages: '127' }]
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
        { id: 1, name: "Thieves' Tools" },
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
