import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WizardStepHeader from '~/components/character/wizard/WizardStepHeader.vue'

describe('WizardStepHeader', () => {
  describe('title display', () => {
    it('renders the title text', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Choose Your Class'
        }
      })

      expect(wrapper.find('[data-testid="wizard-step-title"]').text()).toBe('Choose Your Class')
    })

    it('renders title in an h2 element', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Choose Your Race'
        }
      })

      const title = wrapper.find('h2')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Choose Your Race')
    })
  })

  describe('description display', () => {
    it('renders description when provided', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Choose Your Class',
          description: 'Your class determines your abilities'
        }
      })

      expect(wrapper.find('[data-testid="wizard-step-description"]').text()).toBe('Your class determines your abilities')
    })

    it('hides description element when not provided', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Choose Your Class'
        }
      })

      expect(wrapper.find('[data-testid="wizard-step-description"]').exists()).toBe(false)
    })

    it('hides description element when empty string', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Choose Your Class',
          description: ''
        }
      })

      expect(wrapper.find('[data-testid="wizard-step-description"]').exists()).toBe(false)
    })
  })

  describe('layout and styling', () => {
    it('has centered text layout', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Test Title'
        }
      })

      const container = wrapper.find('[data-testid="wizard-step-header"]')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('text-center')
    })

    it('applies correct title styling', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Test Title'
        }
      })

      const title = wrapper.find('[data-testid="wizard-step-title"]')
      expect(title.classes()).toContain('text-2xl')
      expect(title.classes()).toContain('font-bold')
    })

    it('applies correct description styling', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Test Title',
          description: 'Test description'
        }
      })

      const description = wrapper.find('[data-testid="wizard-step-description"]')
      expect(description.classes()).toContain('mt-2')
    })
  })

  describe('edge cases', () => {
    it('handles long title text', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines'
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: longTitle
        }
      })

      expect(wrapper.find('[data-testid="wizard-step-title"]').text()).toBe(longTitle)
    })

    it('handles special characters in title', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Druid\'s Wild Shape'
        }
      })

      expect(wrapper.find('[data-testid="wizard-step-title"]').text()).toBe('Druid\'s Wild Shape')
    })

    it('handles HTML entities in description', () => {
      const wrapper = mount(WizardStepHeader, {
        props: {
          title: 'Test',
          description: 'Choose from 3+ options'
        }
      })

      expect(wrapper.find('[data-testid="wizard-step-description"]').text()).toBe('Choose from 3+ options')
    })
  })
})
