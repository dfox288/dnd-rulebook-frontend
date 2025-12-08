import { it, expect, describe } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'

/**
 * Shared test helpers for accordion list components
 *
 * These helpers eliminate redundant tests across accordion components
 * that follow the common name/description pattern.
 *
 * Components suited for these helpers:
 * - UiAccordionAbilitiesList
 * - UiAccordionTraitsList (basic tests only)
 * - UiAccordionPropertiesList (basic tests only)
 * - UiAccordionBulletList (basic tests only)
 *
 * Components with UNIQUE logic that should NOT use these:
 * - UiAccordionEquipmentList (complex choice groups)
 * - UiAccordionDamageEffects (spell slot/character level scaling)
 * - UiAccordionActions (accordion expand behavior, recharge badges)
 *
 * Usage:
 *   testAccordionListBasics({
 *     componentName: 'UiAccordionAbilitiesList',
 *     mountWithItems: (items) => mount(Component, { props: { abilities: items } }),
 *     mockItems: [{ id: 1, name: 'Test', description: 'Test desc' }],
 *     expectedTexts: ['Test', 'Test desc'],
 *     spacingClass: 'space-y-4'
 *   })
 */

interface AccordionListBasicsConfig {
  /** Component name for describe block labels */
  componentName: string
  /** Factory function to mount component with given items */
  mountWithItems: (items: Record<string, unknown>[]) => Promise<VueWrapper> | VueWrapper
  /** Mock items to test with */
  mockItems: Record<string, unknown>[]
  /** Expected text content from mock items */
  expectedTexts: string[]
  /** Expected spacing class (e.g., 'space-y-3', 'space-y-4') */
  spacingClass?: string
  /** Whether component has dark mode support (default: true) */
  hasDarkMode?: boolean
  /** CSS selector to find dark mode elements (default: '.text-gray-700') */
  darkModeSelector?: string
  /** Expected dark mode class (default: 'dark:text-gray-300') */
  darkModeClass?: string
}

/**
 * Tests common accordion list behaviors:
 * - Renders item content
 * - Handles multiple items
 * - Handles empty arrays
 * - Applies correct spacing
 * - Supports dark mode
 */
export function testAccordionListBasics(config: AccordionListBasicsConfig) {
  const {
    componentName,
    mountWithItems,
    mockItems,
    expectedTexts,
    spacingClass = 'space-y-4',
    hasDarkMode = true,
    darkModeSelector = '.text-gray-700',
    darkModeClass = 'dark:text-gray-300'
  } = config

  describe(`${componentName} - Basic List Behavior`, () => {
    it('renders item content', async () => {
      const wrapper = await mountWithItems(mockItems)
      const text = wrapper.text()

      expectedTexts.forEach((expectedText) => {
        expect(text).toContain(expectedText)
      })
    })

    it('renders multiple items', async () => {
      // Only test if we have multiple items
      if (mockItems.length > 1) {
        const wrapper = await mountWithItems(mockItems)
        const text = wrapper.text()

        // All expected texts should be present
        expectedTexts.forEach((expectedText) => {
          expect(text).toContain(expectedText)
        })
      }
    })

    it('applies correct container spacing', async () => {
      const wrapper = await mountWithItems(mockItems)
      const container = wrapper.find('.p-4')

      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain(spacingClass)
    })

    if (hasDarkMode) {
      it('supports dark mode styling', async () => {
        const wrapper = await mountWithItems(mockItems)
        const elements = wrapper.findAll(darkModeSelector)

        expect(elements.length).toBeGreaterThan(0)
        // Check that at least one element has the dark mode class
        const hasDarkModeClass = elements.some(el => el.classes().includes(darkModeClass))
        expect(hasDarkModeClass).toBe(true)
      })
    }
  })
}

/**
 * Tests empty state handling for accordion lists
 */
export function testAccordionEmptyState(
  mountWithItems: (items: Record<string, unknown>[]) => Promise<VueWrapper> | VueWrapper,
  options: {
    /** Expected behavior when empty: 'renders-empty' | 'hides-component' */
    emptyBehavior?: 'renders-empty' | 'hides-component'
    /** Text expected in empty state (if renders-empty) */
    emptyText?: string
  } = {}
) {
  const { emptyBehavior = 'renders-empty', emptyText } = options

  describe('Empty State', () => {
    if (emptyBehavior === 'hides-component') {
      it('does not render when array is empty', async () => {
        const wrapper = await mountWithItems([])
        // Component should render nothing or a v-if comment
        expect(wrapper.html()).toMatch(/^(<!--v-if-->)?$/)
      })
    } else {
      it('handles empty array gracefully', async () => {
        const wrapper = await mountWithItems([])
        // Should render container but no content
        expect(wrapper.find('.p-4').exists()).toBe(true)

        if (emptyText) {
          expect(wrapper.text()).toContain(emptyText)
        }
      })
    }
  })
}

/**
 * Tests name/description pattern common to many accordion lists
 */
export function testNameDescriptionPattern(
  mountWithItem: (item: Record<string, unknown>) => Promise<VueWrapper> | VueWrapper,
  options: {
    /** Field name for the name property (default: 'name') */
    nameField?: string
    /** Field name for the description property (default: 'description') */
    descriptionField?: string
    /** CSS selector for name element (default: '.font-semibold') */
    nameSelector?: string
    /** CSS selector for description element (default: '.text-gray-700') */
    descriptionSelector?: string
  } = {}
) {
  const {
    nameField = 'name',
    descriptionField = 'description',
    nameSelector = '.font-semibold',
    descriptionSelector = '.text-gray-700'
  } = options

  describe('Name/Description Pattern', () => {
    it('renders item name prominently', async () => {
      const mockItem = {
        id: 1,
        [nameField]: 'Test Item Name',
        [descriptionField]: 'Test description'
      }
      const wrapper = await mountWithItem(mockItem)

      const nameElement = wrapper.find(nameSelector)
      expect(nameElement.exists()).toBe(true)
      expect(nameElement.text()).toContain('Test Item Name')
    })

    it('renders item description', async () => {
      const mockItem = {
        id: 1,
        [nameField]: 'Test Item',
        [descriptionField]: 'This is the test description'
      }
      const wrapper = await mountWithItem(mockItem)

      expect(wrapper.text()).toContain('This is the test description')
    })

    it('applies dark mode classes to name', async () => {
      const mockItem = {
        id: 1,
        [nameField]: 'Test',
        [descriptionField]: 'Desc'
      }
      const wrapper = await mountWithItem(mockItem)

      const nameElement = wrapper.find(nameSelector)
      if (nameElement.exists()) {
        expect(nameElement.classes()).toContain('dark:text-gray-100')
      }
    })

    it('applies dark mode classes to description', async () => {
      const mockItem = {
        id: 1,
        [nameField]: 'Test',
        [descriptionField]: 'Desc'
      }
      const wrapper = await mountWithItem(mockItem)

      const descElement = wrapper.find(descriptionSelector)
      if (descElement.exists()) {
        expect(descElement.classes()).toContain('dark:text-gray-300')
      }
    })
  })
}
