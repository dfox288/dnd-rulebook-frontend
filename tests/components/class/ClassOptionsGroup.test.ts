import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClassOptionsGroup from '~/components/class/OptionsGroup.vue'
import type { OptionalFeatureResource } from '~/types/api/entities'

// Stub ClassOptionCard component (will be implemented in Task 7)
const ClassOptionCardStub = {
  name: 'ClassOptionCard',
  props: ['option', 'compact'],
  template: '<div class="option-card">{{ option.name }}</div>'
}

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
    slug: 'repelling-blast',
    name: 'Repelling Blast',
    feature_type: 'eldritch_invocation',
    feature_type_label: 'Eldritch Invocation',
    level_requirement: null,
    prerequisite_text: 'Eldritch Blast cantrip',
    description: 'Push 10 feet'
  }
]

describe('ClassOptionsGroup', () => {
  it('displays group title', async () => {
    const wrapper = await mountSuspended(ClassOptionsGroup, {
      props: {
        title: 'Eldritch Invocations',
        options: mockOptions
      },
      global: {
        stubs: {
          ClassOptionCard: ClassOptionCardStub
        }
      }
    })

    expect(wrapper.text()).toContain('Eldritch Invocations')
  })

  it('displays count badge', async () => {
    const wrapper = await mountSuspended(ClassOptionsGroup, {
      props: {
        title: 'Eldritch Invocations',
        options: mockOptions
      },
      global: {
        stubs: {
          ClassOptionCard: ClassOptionCardStub
        }
      }
    })

    expect(wrapper.text()).toContain('2')
  })

  it('renders all options', async () => {
    const wrapper = await mountSuspended(ClassOptionsGroup, {
      props: {
        title: 'Eldritch Invocations',
        options: mockOptions
      },
      global: {
        stubs: {
          ClassOptionCard: ClassOptionCardStub
        }
      }
    })

    expect(wrapper.text()).toContain('Agonizing Blast')
    expect(wrapper.text()).toContain('Repelling Blast')
  })

  it('is collapsible using details element', async () => {
    const wrapper = await mountSuspended(ClassOptionsGroup, {
      props: {
        title: 'Eldritch Invocations',
        options: mockOptions
      },
      global: {
        stubs: {
          ClassOptionCard: ClassOptionCardStub
        }
      }
    })

    const details = wrapper.find('details')
    expect(details.exists()).toBe(true)
  })

  it('is open by default', async () => {
    const wrapper = await mountSuspended(ClassOptionsGroup, {
      props: {
        title: 'Eldritch Invocations',
        options: mockOptions
      },
      global: {
        stubs: {
          ClassOptionCard: ClassOptionCardStub
        }
      }
    })

    const details = wrapper.find('details')
    expect(details.attributes('open')).toBeDefined()
  })

  it('can be closed by default', async () => {
    const wrapper = await mountSuspended(ClassOptionsGroup, {
      props: {
        title: 'Eldritch Invocations',
        options: mockOptions,
        defaultOpen: false
      },
      global: {
        stubs: {
          ClassOptionCard: ClassOptionCardStub
        }
      }
    })

    const details = wrapper.find('details')
    expect(details.attributes('open')).toBeUndefined()
  })

  it('renders nothing when options empty', async () => {
    const wrapper = await mountSuspended(ClassOptionsGroup, {
      props: {
        title: 'Eldritch Invocations',
        options: []
      },
      global: {
        stubs: {
          ClassOptionCard: ClassOptionCardStub
        }
      }
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('sorts options alphabetically by name', async () => {
    const unsortedOptions: OptionalFeatureResource[] = [
      {
        id: 1,
        slug: 'z-option',
        name: 'Z Option',
        feature_type: 'eldritch_invocation',
        feature_type_label: 'Eldritch Invocation',
        level_requirement: null,
        prerequisite_text: null,
        description: 'Last'
      },
      {
        id: 2,
        slug: 'a-option',
        name: 'A Option',
        feature_type: 'eldritch_invocation',
        feature_type_label: 'Eldritch Invocation',
        level_requirement: null,
        prerequisite_text: null,
        description: 'First'
      }
    ]

    const wrapper = await mountSuspended(ClassOptionsGroup, {
      props: {
        title: 'Test Options',
        options: unsortedOptions
      },
      global: {
        stubs: {
          ClassOptionCard: ClassOptionCardStub
        }
      }
    })

    const text = wrapper.text()
    const aIndex = text.indexOf('A Option')
    const zIndex = text.indexOf('Z Option')
    expect(aIndex).toBeLessThan(zIndex)
  })
})
