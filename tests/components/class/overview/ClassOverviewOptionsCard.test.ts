import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClassOverviewOptionsCard from '~/components/class/overview/OptionsCard.vue'
import type { OptionalFeatureResource } from '~/types/api/entities'

const mockFeaturesByType = new Map([
  ['Eldritch Invocation', [
    { id: 1, name: 'Agonizing Blast', feature_type_label: 'Eldritch Invocation' } as OptionalFeatureResource,
    { id: 2, name: 'Armor of Shadows', feature_type_label: 'Eldritch Invocation' } as OptionalFeatureResource
  ]]
])

const mockMultipleTypes = new Map([
  ['Eldritch Invocation', [
    { id: 1, name: 'Agonizing Blast', feature_type_label: 'Eldritch Invocation' } as OptionalFeatureResource
  ]],
  ['Pact Boon', [
    { id: 2, name: 'Pact of the Blade', feature_type_label: 'Pact Boon' } as OptionalFeatureResource
  ]]
])

describe('ClassOverviewOptionsCard', () => {
  it('renders nothing when no optional features', async () => {
    const wrapper = await mountSuspended(ClassOverviewOptionsCard, {
      props: {
        optionalFeaturesByType: new Map(),
        slug: 'warlock'
      }
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('displays "Class Options" header', async () => {
    const wrapper = await mountSuspended(ClassOverviewOptionsCard, {
      props: {
        optionalFeaturesByType: mockFeaturesByType,
        slug: 'warlock'
      }
    })

    expect(wrapper.text()).toContain('Class Options')
  })

  it('displays feature type and count', async () => {
    const wrapper = await mountSuspended(ClassOverviewOptionsCard, {
      props: {
        optionalFeaturesByType: mockFeaturesByType,
        slug: 'warlock'
      }
    })

    expect(wrapper.text()).toContain('Eldritch Invocation')
    expect(wrapper.text()).toContain('2')
  })

  it('links to journey view', async () => {
    const wrapper = await mountSuspended(ClassOverviewOptionsCard, {
      props: {
        optionalFeaturesByType: mockFeaturesByType,
        slug: 'warlock'
      }
    })

    const link = wrapper.find('a[href="/classes/warlock/journey"]')
    expect(link.exists()).toBe(true)
  })

  it('handles multiple feature types', async () => {
    const wrapper = await mountSuspended(ClassOverviewOptionsCard, {
      props: {
        optionalFeaturesByType: mockMultipleTypes,
        slug: 'warlock'
      }
    })

    expect(wrapper.text()).toContain('Eldritch Invocation')
    expect(wrapper.text()).toContain('Pact Boon')
    expect(wrapper.text()).toContain('1')
  })

  it('displays counts for each feature type', async () => {
    const wrapper = await mountSuspended(ClassOverviewOptionsCard, {
      props: {
        optionalFeaturesByType: mockMultipleTypes,
        slug: 'warlock'
      }
    })

    const badges = wrapper.findAll('.badge')
    expect(badges.length).toBe(2)
  })
})
