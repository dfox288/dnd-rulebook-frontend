import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import RaceViewNavigation from '~/components/race/ViewNavigation.vue'

/**
 * Race View Navigation Tests
 *
 * Tests the navigation component for race detail pages.
 * Races have 2 views (Overview, Reference) - no Journey view like classes.
 */

describe('RaceViewNavigation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // ============================================================================
  // Component Mounting
  // ============================================================================

  describe('Component Mounting', () => {
    it('mounts without errors', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('requires slug prop', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })
      expect(wrapper.props('slug')).toBe('elf')
    })
  })

  // ============================================================================
  // View Tabs
  // ============================================================================

  describe('View Tabs', () => {
    it('renders exactly 2 navigation tabs', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const links = wrapper.findAll('a')
      expect(links).toHaveLength(2)
    })

    it('renders Overview tab first', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const firstLink = wrapper.findAll('a')[0]
      expect(firstLink.text()).toContain('Overview')
      expect(firstLink.attributes('href')).toBe('/races/elf')
    })

    it('renders Reference tab second', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const secondLink = wrapper.findAll('a')[1]
      expect(secondLink.text()).toContain('Reference')
      expect(secondLink.attributes('href')).toBe('/races/elf/reference')
    })

    it('does NOT render Journey tab', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const html = wrapper.html()
      expect(html).not.toContain('Journey')
    })
  })

  // ============================================================================
  // Tab Icons
  // ============================================================================

  describe('Tab Icons', () => {
    it('shows squares icon for Overview', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const html = wrapper.html()
      expect(html).toContain('i-heroicons-squares-2x2')
    })

    it('shows table cells icon for Reference', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const html = wrapper.html()
      expect(html).toContain('i-heroicons-table-cells')
    })
  })

  // ============================================================================
  // Active State
  // ============================================================================

  describe('Active State', () => {
    it('has isActive function to determine active state', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      // Component should render with active state classes
      const links = wrapper.findAll('a')
      expect(links.length).toBe(2)

      // Check that each link has styling classes (active or inactive)
      links.forEach((link) => {
        const classes = link.classes()
        expect(classes).toContain('px-4')
        expect(classes).toContain('py-2')
        expect(classes).toContain('rounded-md')
      })
    })

    it('applies conditional styling based on route', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const links = wrapper.findAll('a')

      // Both links should have base transition classes
      links.forEach((link) => {
        expect(link.classes()).toContain('transition-colors')
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================================================
  // Dynamic Slug Handling
  // ============================================================================

  describe('Dynamic Slug Handling', () => {
    it('generates correct paths for different slugs', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'dwarf' }
      })

      const overviewLink = wrapper.findAll('a')[0]
      const referenceLink = wrapper.findAll('a')[1]

      expect(overviewLink.attributes('href')).toBe('/races/dwarf')
      expect(referenceLink.attributes('href')).toBe('/races/dwarf/reference')
    })

    it('handles multi-word slugs correctly', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'high-elf' }
      })

      const overviewLink = wrapper.findAll('a')[0]
      const referenceLink = wrapper.findAll('a')[1]

      expect(overviewLink.attributes('href')).toBe('/races/high-elf')
      expect(referenceLink.attributes('href')).toBe('/races/high-elf/reference')
    })
  })

  // ============================================================================
  // Styling
  // ============================================================================

  describe('Styling', () => {
    it('has navigation wrapper with proper styling', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const nav = wrapper.find('nav')
      const classes = nav.classes()

      expect(classes).toContain('flex')
      expect(classes).toContain('gap-1')
      expect(classes).toContain('p-1')
      expect(classes).toContain('rounded-lg')
    })

    it('all links have proper base styling', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const links = wrapper.findAll('a')

      links.forEach((link) => {
        const classes = link.classes()
        expect(classes).toContain('px-4')
        expect(classes).toContain('py-2')
        expect(classes).toContain('rounded-md')
        expect(classes).toContain('transition-colors')
        expect(classes).toContain('flex')
        expect(classes).toContain('items-center')
        expect(classes).toContain('gap-2')
        expect(classes).toContain('text-sm')
        expect(classes).toContain('font-medium')
      })
    })

    it('applies icon styling to all icons', async () => {
      const wrapper = await mountSuspended(RaceViewNavigation, {
        props: { slug: 'elf' }
      })

      const html = wrapper.html()
      // Both icons should have w-4 h-4 classes
      expect(html).toContain('w-4')
      expect(html).toContain('h-4')
    })
  })
})
