import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClassJourneyOptionsSection from '~/components/class/journey/OptionsSection.vue'
import type { OptionalFeatureResource } from '~/types/api/entities'

const mockOptions: OptionalFeatureResource[] = [
  {
    id: 1,
    slug: 'agonizing-blast',
    name: 'Agonizing Blast',
    feature_type: 'eldritch_invocation',
    feature_type_label: 'Eldritch Invocation',
    level_requirement: null,
    prerequisite_text: 'Eldritch Blast cantrip',
    description: 'Add CHA to damage'
  },
  {
    id: 2,
    slug: 'armor-of-shadows',
    name: 'Armor of Shadows',
    feature_type: 'eldritch_invocation',
    feature_type_label: 'Eldritch Invocation',
    level_requirement: null,
    prerequisite_text: null,
    description: 'Cast mage armor at will'
  },
  {
    id: 3,
    slug: 'improved-pact-weapon',
    name: 'Improved Pact Weapon',
    feature_type: 'eldritch_invocation',
    feature_type_label: 'Eldritch Invocation',
    level_requirement: null,
    prerequisite_text: 'Pact of the Blade feature',
    description: 'Use pact weapon as focus'
  }
]

describe('ClassJourneyOptionsSection', () => {
  it('renders nothing when options array is empty', async () => {
    const wrapper = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: [],
        level: 2
      }
    })

    // Vue renders a comment for v-if conditions
    expect(wrapper.html()).toBe('<!--v-if-->')
    expect(wrapper.find('details').exists()).toBe(false)
  })

  it('displays section header with count badge', async () => {
    const wrapper = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: mockOptions,
        level: 2
      }
    })

    expect(wrapper.text()).toContain('Available Options')
    expect(wrapper.text()).toContain('3')
  })

  it('groups options by prerequisite', async () => {
    const wrapper = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: mockOptions,
        level: 2
      }
    })

    // Should have ClassOptionsGroup components
    const groups = wrapper.findAllComponents({ name: 'ClassOptionsGroup' })
    expect(groups.length).toBe(3) // No Prerequisites, Eldritch Blast cantrip, Pact of the Blade feature
  })

  it('shows "No Prerequisites" group first', async () => {
    const wrapper = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: mockOptions,
        level: 2
      }
    })

    const groups = wrapper.findAllComponents({ name: 'ClassOptionsGroup' })
    expect(groups[0].props('title')).toBe('No Prerequisites')
    expect(groups[0].props('options')).toHaveLength(1)
    expect(groups[0].props('options')[0].name).toBe('Armor of Shadows')
  })

  it('groups other options by prerequisite with "Requires" prefix', async () => {
    const wrapper = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: mockOptions,
        level: 2
      }
    })

    const groups = wrapper.findAllComponents({ name: 'ClassOptionsGroup' })

    // Find the group for "Eldritch Blast cantrip"
    const eldritchBlastGroup = groups.find(g =>
      g.props('title') === 'Requires Eldritch Blast cantrip'
    )
    expect(eldritchBlastGroup).toBeDefined()
    expect(eldritchBlastGroup?.props('options')).toHaveLength(1)
    expect(eldritchBlastGroup?.props('options')[0].name).toBe('Agonizing Blast')

    // Find the group for "Pact of the Blade feature"
    const pactGroup = groups.find(g =>
      g.props('title') === 'Requires Pact of the Blade feature'
    )
    expect(pactGroup).toBeDefined()
    expect(pactGroup?.props('options')).toHaveLength(1)
    expect(pactGroup?.props('options')[0].name).toBe('Improved Pact Weapon')
  })

  it('is collapsible using details element', async () => {
    const wrapper = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: mockOptions,
        level: 2
      }
    })

    const details = wrapper.find('details')
    expect(details.exists()).toBe(true)
  })

  it('respects defaultOpen prop', async () => {
    const wrapperClosed = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: mockOptions,
        level: 2,
        defaultOpen: false
      }
    })

    const detailsClosed = wrapperClosed.find('details')
    expect(detailsClosed.attributes('open')).toBeUndefined()

    const wrapperOpen = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: mockOptions,
        level: 2,
        defaultOpen: true
      }
    })

    const detailsOpen = wrapperOpen.find('details')
    expect(detailsOpen.attributes('open')).toBe('')
  })

  it('sorts groups alphabetically after "No Prerequisites"', async () => {
    const moreOptions: OptionalFeatureResource[] = [
      ...mockOptions,
      {
        id: 4,
        slug: 'another-option',
        name: 'Another Option',
        feature_type: 'eldritch_invocation',
        feature_type_label: 'Eldritch Invocation',
        level_requirement: null,
        prerequisite_text: 'Armor of Shadows',
        description: 'Test'
      }
    ]

    const wrapper = await mountSuspended(ClassJourneyOptionsSection, {
      props: {
        options: moreOptions,
        level: 2
      }
    })

    const groups = wrapper.findAllComponents({ name: 'ClassOptionsGroup' })

    // First should be "No Prerequisites"
    expect(groups[0].props('title')).toBe('No Prerequisites')

    // Rest should be alphabetically sorted
    expect(groups[1].props('title')).toBe('Requires Armor of Shadows')
    expect(groups[2].props('title')).toBe('Requires Eldritch Blast cantrip')
    expect(groups[3].props('title')).toBe('Requires Pact of the Blade feature')
  })
})
