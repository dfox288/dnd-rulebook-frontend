import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FeatCard from '~/components/feat/FeatCard.vue'

describe('FeatCard', () => {
  const mockFeat = {
    id: 1,
    name: 'War Caster',
    slug: 'war-caster',
    prerequisites: [
      {
        ability_score: { id: 4, code: 'INT', name: 'Intelligence' },
        minimum_value: 13
      }
    ],
    modifiers: [
      { modifier_type: 'ability_score', ability_score: { id: 1, code: 'STR', name: 'Strength' }, value: 1 },
      { modifier_type: 'ability_score', ability_score: { id: 3, code: 'CON', name: 'Constitution' }, value: 1 }
    ],
    description: 'You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits.',
    sources: [
      { code: 'PHB', name: 'Player\'s Handbook', pages: '170' }
    ]
  }

  it('renders feat name', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    expect(wrapper.text()).toContain('War Caster')
  })

  it('shows prerequisites badge when prerequisites exist', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    expect(wrapper.text()).toContain('Prerequisites')
  })

  it('hides prerequisites warning badge when none exist', async () => {
    const noPrerequFeat = { ...mockFeat, prerequisites: [] }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: noPrerequFeat }
    })

    // Should not show red "Prerequisites" badge, but may show "No Prerequisites"
    const html = wrapper.html()
    expect(html.includes('>Prerequisites<')).toBe(false)
  })

  it('shows "No Prerequisites" badge when feat has no requirements', async () => {
    const noPrerequFeat = { ...mockFeat, prerequisites: [] }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: noPrerequFeat }
    })

    expect(wrapper.text()).toContain('No Prerequisites')
  })

  it('displays single ability score prerequisite', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    expect(wrapper.text()).toContain('INT 13+')
  })

  it('displays multiple prerequisites count', async () => {
    const multiPrerequFeat = {
      ...mockFeat,
      prerequisites: [
        { ability_score: { id: 1, code: 'STR', name: 'Strength' }, minimum_value: 13 },
        { ability_score: { id: 2, code: 'DEX', name: 'Dexterity' }, minimum_value: 13 }
      ]
    }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: multiPrerequFeat }
    })

    expect(wrapper.text()).toContain('2 prerequisites')
  })

  it('displays description prerequisite when no ability score', async () => {
    const descPrerequFeat = {
      ...mockFeat,
      prerequisites: [{ description: 'Must be proficient with heavy armor' }]
    }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: descPrerequFeat }
    })

    expect(wrapper.text()).toContain('Must be proficient with heavy armor')
  })

  it('shows generic text when prerequisite has no details', async () => {
    const vaguePrerequFeat = {
      ...mockFeat,
      prerequisites: [{}]
    }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: vaguePrerequFeat }
    })

    expect(wrapper.text()).toContain('Prerequisites required')
  })

  it('shows modifiers count when modifiers exist', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    expect(wrapper.text()).toContain('2 Bonuses')
  })

  it('uses singular form for single modifier', async () => {
    const oneModFeat = {
      ...mockFeat,
      modifiers: [
        { modifier_type: 'ability_score', ability_score: { id: 1, code: 'STR', name: 'Strength' }, value: 1 }
      ]
    }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: oneModFeat }
    })

    expect(wrapper.text()).toContain('1 Bonus')
  })

  it('hides modifiers count when none exist', async () => {
    const noModsFeat = { ...mockFeat, modifiers: [] }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: noModsFeat }
    })

    const text = wrapper.text()
    expect(text).not.toContain('Bonus')
    expect(text).not.toContain('Bonuses')
  })

  it('renders description when provided', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    expect(wrapper.text()).toContain('You have practiced casting spells')
  })

  it('shows default description when not provided', async () => {
    const featWithoutDescription = { ...mockFeat, description: undefined }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: featWithoutDescription }
    })

    expect(wrapper.text()).toContain('A feat that provides special abilities or bonuses')
  })

  it('truncates long descriptions', async () => {
    const longDescription = 'A'.repeat(200)
    const longFeat = { ...mockFeat, description: longDescription }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: longFeat }
    })

    const text = wrapper.text()
    expect(text).toContain('...')
    expect(text.length).toBeLessThan(longDescription.length + 100)
  })

  it('does not truncate short descriptions', async () => {
    const shortDescription = 'Short feat description'
    const shortFeat = { ...mockFeat, description: shortDescription }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: shortFeat }
    })

    expect(wrapper.text()).toContain(shortDescription)
    expect(wrapper.text()).not.toContain('...')
  })

  it('links to feat detail page with slug', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/feats/war-caster')
  })

  it('applies hover effects for interactivity', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    const html = wrapper.html()
    expect(html).toContain('hover')
  })

  it('uses card component with border', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    const html = wrapper.html()
    expect(html).toContain('border')
  })

  it('renders with proper spacing structure', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    const html = wrapper.html()
    expect(html).toContain('space-y-3')
  })

  it('renders sources footer', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    expect(wrapper.text()).toContain('Player\'s Handbook')
  })

  it('handles feats without sources', async () => {
    const featWithoutSources = { ...mockFeat, sources: undefined }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: featWithoutSources }
    })

    expect(wrapper.text()).toContain('War Caster')
  })

  it('displays all key information in organized layout', async () => {
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: mockFeat }
    })

    const text = wrapper.text()
    expect(text).toContain('War Caster')
    expect(text).toContain('Prerequisites')
    expect(text).toContain('INT 13+')
    expect(text).toContain('2 Bonuses')
  })

  it('handles long feat names with line clamp', async () => {
    const longName = 'Very Long Feat Name That Should Be Truncated With Line Clamp'
    const longNameFeat = { ...mockFeat, name: longName }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: longNameFeat }
    })

    const html = wrapper.html()
    expect(html).toContain('line-clamp-2')
  })

  it('handles feats with all optional fields', async () => {
    const fullFeat = {
      ...mockFeat,
      prerequisites: [{ ability_score: { id: 1, code: 'STR', name: 'Strength' }, minimum_value: 13 }],
      modifiers: [{ modifier_type: 'ability_score', ability_score: { id: 1, code: 'STR', name: 'Strength' }, value: 1 }],
      description: 'Full description',
      sources: [{ code: 'PHB', name: 'Player\'s Handbook', pages: '170' }]
    }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: fullFeat }
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('handles feats with minimal fields', async () => {
    const minimalFeat = {
      id: 1,
      name: 'Lucky',
      slug: 'lucky',
      prerequisites: [],
      modifiers: []
    }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: minimalFeat }
    })

    expect(wrapper.text()).toContain('Lucky')
    expect(wrapper.text()).toContain('No Prerequisites')
  })

  it('handles feats with high ability score requirements', async () => {
    const highReqFeat = {
      ...mockFeat,
      prerequisites: [
        { ability_score: { id: 1, code: 'STR', name: 'Strength' }, minimum_value: 20 }
      ]
    }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: highReqFeat }
    })

    expect(wrapper.text()).toContain('STR 20+')
  })

  it('handles feats with many modifiers', async () => {
    const manyModsFeat = {
      ...mockFeat,
      modifiers: [
        { modifier_type: 'ability_score', value: 1 },
        { modifier_type: 'ability_score', value: 1 },
        { modifier_type: 'ability_score', value: 1 },
        { modifier_type: 'ability_score', value: 1 }
      ]
    }
    const wrapper = await mountSuspended(FeatCard, {
      props: { feat: manyModsFeat }
    })

    expect(wrapper.text()).toContain('4 Bonuses')
  })
})
