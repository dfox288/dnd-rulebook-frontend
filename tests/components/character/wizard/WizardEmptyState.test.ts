import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WizardEmptyState from '~/components/character/wizard/WizardEmptyState.vue'

describe('WizardEmptyState', () => {
  describe('structure', () => {
    it('renders container with correct layout', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'No results found'
        }
      })

      const container = wrapper.find('[data-testid="wizard-empty-state"]')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('text-center')
      expect(container.classes()).toContain('py-12')
    })
  })

  describe('icon display', () => {
    it('renders the icon', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'No results found'
        }
      })

      const icon = wrapper.find('[data-testid="wizard-empty-state-icon"]')
      expect(icon.exists()).toBe(true)
    })

    it('applies correct icon styling', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-sparkles',
          title: 'No spells available'
        }
      })

      const icon = wrapper.find('[data-testid="wizard-empty-state-icon"]')
      expect(icon.classes()).toContain('w-12')
      expect(icon.classes()).toContain('h-12')
      expect(icon.classes()).toContain('mx-auto')
      expect(icon.classes()).toContain('mb-4')
    })

    it('uses gray color by default', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'No results'
        }
      })

      const icon = wrapper.find('[data-testid="wizard-empty-state-icon"]')
      expect(icon.classes()).toContain('text-gray-400')
    })

    it('uses success color when iconColor is success', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-check-circle',
          title: 'All done',
          iconColor: 'success'
        }
      })

      const icon = wrapper.find('[data-testid="wizard-empty-state-icon"]')
      expect(icon.classes()).toContain('text-success')
    })
  })

  describe('title display', () => {
    it('renders the title text', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'No races found matching "elf"'
        }
      })

      expect(wrapper.find('[data-testid="wizard-empty-state-title"]').text()).toBe('No races found matching "elf"')
    })

    it('applies correct title styling', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'Test title'
        }
      })

      const title = wrapper.find('[data-testid="wizard-empty-state-title"]')
      expect(title.classes()).toContain('text-gray-600')
    })
  })

  describe('description display', () => {
    it('renders description when provided', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-check-circle',
          title: 'No language choices needed',
          description: 'All your languages have been automatically assigned'
        }
      })

      expect(wrapper.find('[data-testid="wizard-empty-state-description"]').text()).toBe('All your languages have been automatically assigned')
    })

    it('hides description when not provided', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'No results found'
        }
      })

      expect(wrapper.find('[data-testid="wizard-empty-state-description"]').exists()).toBe(false)
    })

    it('hides description when empty string', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'No results found',
          description: ''
        }
      })

      expect(wrapper.find('[data-testid="wizard-empty-state-description"]').exists()).toBe(false)
    })

    it('applies correct description styling', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-check-circle',
          title: 'Done',
          description: 'Additional info'
        }
      })

      const description = wrapper.find('[data-testid="wizard-empty-state-description"]')
      expect(description.classes()).toContain('text-gray-600')
    })
  })

  describe('variant styling', () => {
    it('uses larger title when variant is prominent', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-check-circle',
          title: 'No language choices needed',
          variant: 'prominent'
        }
      })

      const title = wrapper.find('[data-testid="wizard-empty-state-title"]')
      expect(title.classes()).toContain('text-lg')
    })

    it('uses default styling when no variant specified', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'No results found'
        }
      })

      const title = wrapper.find('[data-testid="wizard-empty-state-title"]')
      expect(title.classes()).not.toContain('text-lg')
    })
  })

  describe('edge cases', () => {
    it('handles special characters in title', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-magnifying-glass',
          title: 'No results for "Dragon\'s Breath"'
        }
      })

      expect(wrapper.find('[data-testid="wizard-empty-state-title"]').text()).toBe('No results for "Dragon\'s Breath"')
    })

    it('handles HTML entities in description', () => {
      const wrapper = mount(WizardEmptyState, {
        props: {
          icon: 'i-heroicons-check-circle',
          title: 'Done',
          description: 'Selected 3+ options'
        }
      })

      expect(wrapper.find('[data-testid="wizard-empty-state-description"]').text()).toBe('Selected 3+ options')
    })
  })
})
