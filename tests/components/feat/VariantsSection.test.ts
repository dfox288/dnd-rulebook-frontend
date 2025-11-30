import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FeatVariantsSection from '~/components/feat/VariantsSection.vue'

const mockVariants = [
  { id: 1, slug: 'resilient-strength', name: 'Resilient (Strength)', is_half_feat: true },
  { id: 2, slug: 'resilient-dexterity', name: 'Resilient (Dexterity)', is_half_feat: true },
  { id: 3, slug: 'resilient-constitution', name: 'Resilient (Constitution)', is_half_feat: true }
]

describe('FeatVariantsSection', () => {
  it('renders all variant cards', async () => {
    const wrapper = await mountSuspended(FeatVariantsSection, {
      props: {
        variants: mockVariants,
        currentSlug: 'resilient-constitution'
      }
    })

    expect(wrapper.text()).toContain('Resilient (Strength)')
    expect(wrapper.text()).toContain('Resilient (Dexterity)')
    expect(wrapper.text()).toContain('Resilient (Constitution)')
  })

  it('highlights current variant', async () => {
    const wrapper = await mountSuspended(FeatVariantsSection, {
      props: {
        variants: mockVariants,
        currentSlug: 'resilient-constitution'
      }
    })

    expect(wrapper.text()).toContain('(current)')
  })

  it('shows correct other variants count', async () => {
    const wrapper = await mountSuspended(FeatVariantsSection, {
      props: {
        variants: mockVariants,
        currentSlug: 'resilient-constitution'
      }
    })

    expect(wrapper.text()).toContain('2 others')
  })

  it('hides section when only one variant (current)', async () => {
    const wrapper = await mountSuspended(FeatVariantsSection, {
      props: {
        variants: [mockVariants[0]],
        currentSlug: 'resilient-strength'
      }
    })

    expect(wrapper.text()).not.toContain('Related Variants')
  })

  it('hides section when no variants', async () => {
    const wrapper = await mountSuspended(FeatVariantsSection, {
      props: {
        variants: [],
        currentSlug: 'lucky'
      }
    })

    expect(wrapper.text()).not.toContain('Related Variants')
  })
})
