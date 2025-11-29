import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClassOptionCard from '~/components/class/OptionCard.vue'
import type { OptionalFeatureResource } from '~/types/api/entities'

const mockOption: OptionalFeatureResource = {
  id: 1,
  slug: 'agonizing-blast',
  name: 'Agonizing Blast',
  feature_type: 'eldritch_invocation',
  feature_type_label: 'Eldritch Invocation',
  level_requirement: null,
  prerequisite_text: 'Eldritch Blast cantrip',
  description: 'When you cast eldritch blast, add your Charisma modifier to the damage it deals on a hit.',
  sources: [{ code: 'PHB', name: 'Player\'s Handbook (2014)', pages: '110' }]
}

const mockOptionWithLevel: OptionalFeatureResource = {
  id: 2,
  slug: 'lifedrinker',
  name: 'Lifedrinker',
  feature_type: 'eldritch_invocation',
  feature_type_label: 'Eldritch Invocation',
  level_requirement: 12,
  prerequisite_text: 'Pact of the Blade feature',
  description: 'When you hit a creature with your pact weapon, the creature takes extra necrotic damage equal to your Charisma modifier.',
  sources: [{ code: 'PHB', name: 'Player\'s Handbook (2014)', pages: '111' }]
}

const mockOptionNoPrereq: OptionalFeatureResource = {
  id: 3,
  slug: 'armor-of-shadows',
  name: 'Armor of Shadows',
  feature_type: 'eldritch_invocation',
  feature_type_label: 'Eldritch Invocation',
  level_requirement: null,
  prerequisite_text: null,
  description: 'You can cast mage armor on yourself at will, without expending a spell slot or material components.',
  sources: [{ code: 'PHB', name: 'Player\'s Handbook (2014)', pages: '110' }]
}

describe('ClassOptionCard', () => {
  it('displays option name', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOption }
    })
    expect(wrapper.text()).toContain('Agonizing Blast')
  })

  it('displays prerequisite when present', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOption }
    })
    expect(wrapper.text()).toContain('Eldritch Blast cantrip')
  })

  it('does not show prerequisite section when null', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOptionNoPrereq }
    })
    expect(wrapper.text()).not.toContain('Prerequisite')
  })

  it('displays description', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOption }
    })
    expect(wrapper.text()).toContain('When you cast eldritch blast, add your Charisma modifier to the damage it deals on a hit.')
  })

  it('shows level requirement badge when present', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOptionWithLevel }
    })
    expect(wrapper.text()).toContain('Level 12')
  })

  it('does not show level badge when no requirement', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOption }
    })
    expect(wrapper.text()).not.toContain('Level')
  })

  it('is collapsible when compact prop is true', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOption, compact: true }
    })
    const details = wrapper.find('details')
    expect(details.exists()).toBe(true)
    expect(details.find('summary').text()).toContain('Agonizing Blast')
  })

  it('is not collapsible when compact prop is false', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOption, compact: false }
    })
    const details = wrapper.find('details')
    expect(details.exists()).toBe(false)
  })

  it('is not collapsible by default', async () => {
    const wrapper = await mountSuspended(ClassOptionCard, {
      props: { option: mockOption }
    })
    const details = wrapper.find('details')
    expect(details.exists()).toBe(false)
  })
})
