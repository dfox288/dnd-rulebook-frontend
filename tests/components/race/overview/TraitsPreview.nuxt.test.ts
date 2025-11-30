import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RaceOverviewTraitsPreview from '~/components/race/overview/TraitsPreview.vue'
import type { components } from '~/types/api/generated'

type TraitResource = components['schemas']['TraitResource']

describe('RaceOverviewTraitsPreview', () => {
  const mockTraits: TraitResource[] = [
    {
      id: '1',
      name: 'Fey Ancestry',
      category: 'species',
      description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.',
      sort_order: '1'
    },
    {
      id: '2',
      name: 'Trance',
      category: 'species',
      description: 'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice.',
      sort_order: '2'
    },
    {
      id: '3',
      name: 'Keen Senses',
      category: 'species',
      description: 'You have proficiency in the Perception skill.',
      sort_order: '3'
    },
    {
      id: '4',
      name: 'Fleet of Foot',
      category: 'species',
      description: 'Your base walking speed increases to 35 feet.',
      sort_order: '4'
    },
    {
      id: '5',
      name: 'Mask of the Wild',
      category: 'species',
      description: 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.',
      sort_order: '5'
    }
  ]

  it('renders section header', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits,
        slug: 'elf'
      }
    })

    expect(wrapper.text()).toContain('Key Racial Traits')
  })

  it('displays first 3 traits by default', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits,
        slug: 'elf'
      }
    })

    // First 3 should be visible
    expect(wrapper.text()).toContain('Fey Ancestry')
    expect(wrapper.text()).toContain('Trance')
    expect(wrapper.text()).toContain('Keen Senses')

    // 4th and 5th should not be visible
    expect(wrapper.text()).not.toContain('Fleet of Foot')
    expect(wrapper.text()).not.toContain('Mask of the Wild')
  })

  it('respects maxDisplay prop', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits,
        slug: 'elf',
        maxDisplay: 2
      }
    })

    // Only first 2 should be visible
    expect(wrapper.text()).toContain('Fey Ancestry')
    expect(wrapper.text()).toContain('Trance')

    // 3rd, 4th, 5th should not be visible
    expect(wrapper.text()).not.toContain('Keen Senses')
    expect(wrapper.text()).not.toContain('Fleet of Foot')
    expect(wrapper.text()).not.toContain('Mask of the Wild')
  })

  it('displays trait names', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits.slice(0, 3),
        slug: 'elf'
      }
    })

    expect(wrapper.text()).toContain('Fey Ancestry')
    expect(wrapper.text()).toContain('Trance')
    expect(wrapper.text()).toContain('Keen Senses')
  })

  it('displays trait descriptions', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits.slice(0, 1),
        slug: 'elf'
      }
    })

    expect(wrapper.text()).toContain('advantage on saving throws against being charmed')
  })

  it('truncates long descriptions to approximately 100 characters', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits.slice(0, 3),
        slug: 'elf'
      }
    })

    const text = wrapper.text()

    // Trance has a long description that should be truncated
    expect(text).toContain('Trance')
    expect(text).toContain('...')

    // The full long text should not be present
    const fullTranceTrait = mockTraits[1]
    expect(text).not.toContain(fullTranceTrait.description)
  })

  it('does not truncate short descriptions', async () => {
    const shortTrait: TraitResource = {
      id: '99',
      name: 'Short Trait',
      category: 'species',
      description: 'This is short.',
      sort_order: '1'
    }

    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: [shortTrait],
        slug: 'test'
      }
    })

    expect(wrapper.text()).toContain('This is short.')
    // Should not have ellipsis since it's already short
    expect(wrapper.text().includes('This is short...')).toBe(false)
  })

  it('displays "View all" link with correct count and URL', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits,
        slug: 'elf'
      }
    })

    expect(wrapper.text()).toContain('View all 5 traits in Reference')

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/races/elf/reference')
  })

  it('shows correct count when traits array is smaller than maxDisplay', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits.slice(0, 2),
        slug: 'elf'
      }
    })

    expect(wrapper.text()).toContain('View all 2 traits in Reference')
  })

  it('displays all traits when count is less than or equal to maxDisplay', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits.slice(0, 3),
        slug: 'elf',
        maxDisplay: 3
      }
    })

    // All 3 should be visible
    expect(wrapper.text()).toContain('Fey Ancestry')
    expect(wrapper.text()).toContain('Trance')
    expect(wrapper.text()).toContain('Keen Senses')
  })

  it('handles empty traits array gracefully', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: [],
        slug: 'elf'
      }
    })

    expect(wrapper.text()).toContain('Key Racial Traits')
    // Should not crash and should not show view all link
    expect(wrapper.text()).not.toContain('View all')
  })

  it('uses accordion-like styling for trait cards', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits.slice(0, 3),
        slug: 'elf'
      }
    })

    // Check for styling classes that indicate card-like appearance
    const html = wrapper.html()
    expect(html).toContain('rounded')
    expect(html).toContain('bg-gray')
  })

  it('displays trait name in bold/semibold font', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits.slice(0, 1),
        slug: 'elf'
      }
    })

    const html = wrapper.html()
    // Check that trait name has font-semibold or font-bold class
    expect(html).toMatch(/font-semibold|font-bold/)
  })

  it('respects sort_order for trait display', async () => {
    const unsortedTraits: TraitResource[] = [
      {
        id: '2',
        name: 'Second Trait',
        category: 'species',
        description: 'This should appear second.',
        sort_order: '2'
      },
      {
        id: '1',
        name: 'First Trait',
        category: 'species',
        description: 'This should appear first.',
        sort_order: '1'
      },
      {
        id: '3',
        name: 'Third Trait',
        category: 'species',
        description: 'This should appear third.',
        sort_order: '3'
      }
    ]

    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: unsortedTraits,
        slug: 'test'
      }
    })

    const text = wrapper.text()
    const firstIndex = text.indexOf('First Trait')
    const secondIndex = text.indexOf('Second Trait')
    const thirdIndex = text.indexOf('Third Trait')

    expect(firstIndex).toBeLessThan(secondIndex)
    expect(secondIndex).toBeLessThan(thirdIndex)
  })

  it('includes arrow icon in "View all" link', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits,
        slug: 'elf'
      }
    })

    const html = wrapper.html()
    // Check for UIcon with arrow-right
    expect(html).toContain('i-heroicons-arrow-right')
  })

  it('has hover state for trait cards', async () => {
    const wrapper = await mountSuspended(RaceOverviewTraitsPreview, {
      props: {
        traits: mockTraits.slice(0, 3),
        slug: 'elf'
      }
    })

    const html = wrapper.html()
    // Check for hover classes
    expect(html).toMatch(/hover:bg/)
  })
})
