import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiDetailBreadcrumb from '~/components/ui/detail/UiDetailBreadcrumb.vue'

describe('UiDetailBreadcrumb', () => {
  describe('basic rendering', () => {
    it('renders home link as first item', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      const links = wrapper.findAll('a')
      expect(links.length).toBeGreaterThanOrEqual(2)
      // First link should be home
      expect(links[0].attributes('href')).toBe('/')
    })

    it('renders list page link', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      expect(wrapper.text()).toContain('Spells')
      const links = wrapper.findAll('a')
      const spellsLink = links.find(l => l.text() === 'Spells')
      expect(spellsLink?.attributes('href')).toBe('/spells')
    })

    it('renders current page label as non-link', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      expect(wrapper.text()).toContain('Fireball')
      // Current page should be a span, not a link
      const links = wrapper.findAll('a')
      const currentAsLink = links.find(l => l.text() === 'Fireball')
      expect(currentAsLink).toBeUndefined()
    })

    it('renders chevron separators between items', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      // UIcon components render with the icon name attribute
      // For a 3-item breadcrumb (Home > Spells > Fireball), we need 2 separators
      const html = wrapper.html()
      // Count chevron-right icons by checking how many times the icon name appears
      const chevronCount = (html.match(/chevron-right/g) || []).length
      expect(chevronCount).toBeGreaterThanOrEqual(2)
    })
  })

  describe('hierarchical navigation', () => {
    it('renders parent item when provided', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/classes',
          listLabel: 'Classes',
          currentLabel: 'Battle Master',
          parentPath: '/classes/fighter',
          parentLabel: 'Fighter'
        }
      })

      expect(wrapper.text()).toContain('Fighter')
      const links = wrapper.findAll('a')
      const parentLink = links.find(l => l.text() === 'Fighter')
      expect(parentLink?.attributes('href')).toBe('/classes/fighter')
    })

    it('shows 4-level breadcrumb with parent: Home > List > Parent > Current', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/classes',
          listLabel: 'Classes',
          currentLabel: 'Battle Master',
          parentPath: '/classes/fighter',
          parentLabel: 'Fighter'
        }
      })

      // Should have 4 items: Home, Classes, Fighter, Battle Master
      // 3 should be links (Home, Classes, Fighter), 1 should be text (Battle Master)
      const links = wrapper.findAll('a')
      expect(links.length).toBe(3)

      // Verify order via text content
      const text = wrapper.text()
      const classesIndex = text.indexOf('Classes')
      const fighterIndex = text.indexOf('Fighter')
      const battleMasterIndex = text.indexOf('Battle Master')

      expect(classesIndex).toBeLessThan(fighterIndex)
      expect(fighterIndex).toBeLessThan(battleMasterIndex)
    })

    it('works without parent for non-hierarchical entities', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      // Should have 3 items: Home, Spells, Fireball
      // 2 should be links (Home, Spells), 1 should be text (Fireball)
      const links = wrapper.findAll('a')
      expect(links.length).toBe(2)
    })
  })

  describe('styling', () => {
    it('has correct nav element with flex styling', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.classes()).toContain('flex')
      expect(nav.classes()).toContain('items-center')
    })

    it('applies correct text styling for links', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      const links = wrapper.findAll('a')
      // Links should have hover styling classes
      links.forEach((link) => {
        expect(link.classes().some(c => c.includes('hover:'))).toBe(true)
      })
    })

    it('applies correct styling for current item', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      // Current item should be a span with font-medium
      const spans = wrapper.findAll('span')
      const currentSpan = spans.find(s => s.text() === 'Fireball')
      expect(currentSpan).toBeDefined()
      expect(currentSpan?.classes()).toContain('font-medium')
    })
  })

  describe('home icon', () => {
    it('renders home icon in first breadcrumb item', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      // UIcon renders with the icon name in the HTML
      const html = wrapper.html()
      expect(html).toContain('home')
    })
  })

  describe('accessibility', () => {
    it('has aria-label on nav element', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      const nav = wrapper.find('nav')
      expect(nav.attributes('aria-label')).toBe('Breadcrumb')
    })

    it('marks current page with aria-current', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Fireball'
        }
      })

      const currentItem = wrapper.find('[aria-current="page"]')
      expect(currentItem.exists()).toBe(true)
      expect(currentItem.text()).toBe('Fireball')
    })
  })

  describe('list page mode', () => {
    it('renders list label as current page when no currentLabel provided', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells'
          // No currentLabel - this is list page mode
        }
      })

      // Should have 2 items: Home, Spells (as current)
      const links = wrapper.findAll('a')
      expect(links.length).toBe(1) // Only home is a link

      // Spells should be current page (span, not link)
      const currentPage = wrapper.find('[aria-current="page"]')
      expect(currentPage.text()).toBe('Spells')
    })

    it('does not render extra chevron in list mode', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells'
        }
      })

      // Only 1 chevron needed: Home > Spells
      const html = wrapper.html()
      const chevronCount = (html.match(/chevron-right/g) || []).length
      expect(chevronCount).toBe(1)
    })
  })

  describe('edge cases', () => {
    it('handles long labels without breaking', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/spells',
          listLabel: 'Spells',
          currentLabel: 'Mordenkainen\'s Magnificent Mansion'
        }
      })

      expect(wrapper.text()).toContain('Mordenkainen\'s Magnificent Mansion')
      expect(wrapper.exists()).toBe(true)
    })

    it('handles special characters in labels', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/items',
          listLabel: 'Items',
          currentLabel: '+1 Longsword'
        }
      })

      expect(wrapper.text()).toContain('+1 Longsword')
    })

    it('handles empty parent gracefully', async () => {
      const wrapper = await mountSuspended(UiDetailBreadcrumb, {
        props: {
          listPath: '/classes',
          listLabel: 'Classes',
          currentLabel: 'Fighter',
          parentPath: undefined,
          parentLabel: undefined
        }
      })

      expect(wrapper.exists()).toBe(true)
      // Should have 3 items without parent: Home, Classes, Fighter
      const links = wrapper.findAll('a')
      expect(links.length).toBe(2)
    })
  })
})
