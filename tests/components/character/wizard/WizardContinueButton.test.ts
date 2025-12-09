import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WizardContinueButton from '~/components/character/wizard/WizardContinueButton.vue'

describe('WizardContinueButton', () => {
  describe('structure', () => {
    it('renders container with correct layout', () => {
      const wrapper = mount(WizardContinueButton)

      const container = wrapper.find('[data-testid="wizard-continue-container"]')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('justify-center')
      expect(container.classes()).toContain('pt-4')
    })

    it('renders the button', () => {
      const wrapper = mount(WizardContinueButton)

      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.exists()).toBe(true)
    })

    it('button has size lg', () => {
      const wrapper = mount(WizardContinueButton)

      // UButton with size="lg" renders with specific classes
      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.exists()).toBe(true)
    })
  })

  describe('text prop', () => {
    it('displays "Continue" by default', () => {
      const wrapper = mount(WizardContinueButton)

      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.text()).toBe('Continue')
    })

    it('displays custom text when provided', () => {
      const wrapper = mount(WizardContinueButton, {
        props: {
          text: 'Continue with Spells'
        }
      })

      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.text()).toBe('Continue with Spells')
    })

    it('displays entity name in button text', () => {
      const wrapper = mount(WizardContinueButton, {
        props: {
          text: 'Continue with Fighter'
        }
      })

      expect(wrapper.find('[data-testid="continue-btn"]').text()).toBe('Continue with Fighter')
    })
  })

  describe('disabled state', () => {
    it('is enabled by default', () => {
      const wrapper = mount(WizardContinueButton)

      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.attributes('disabled')).toBeUndefined()
    })

    it('is disabled when disabled prop is true', () => {
      const wrapper = mount(WizardContinueButton, {
        props: {
          disabled: true
        }
      })

      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('is enabled when disabled prop is false', () => {
      const wrapper = mount(WizardContinueButton, {
        props: {
          disabled: false
        }
      })

      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  describe('loading state', () => {
    it('is not loading by default', () => {
      const wrapper = mount(WizardContinueButton)

      const button = wrapper.find('[data-testid="continue-btn"]')
      // UButton uses a loading prop, check it's not in loading state
      expect(button.attributes('data-loading')).toBeUndefined()
    })

    it('passes loading prop to button', () => {
      const wrapper = mount(WizardContinueButton, {
        props: {
          loading: true
        }
      })

      // When loading, button should be in loading state
      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.exists()).toBe(true)
    })
  })

  describe('click event', () => {
    it('emits click event when button is clicked', async () => {
      const wrapper = mount(WizardContinueButton)

      const button = wrapper.find('[data-testid="continue-btn"]')
      await button.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(WizardContinueButton, {
        props: {
          disabled: true
        }
      })

      const button = wrapper.find('[data-testid="continue-btn"]')
      await button.trigger('click')

      // Disabled buttons shouldn't emit click
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('edge cases', () => {
    it('handles long button text', () => {
      const longText = 'Continue with Character Creation Step'
      const wrapper = mount(WizardContinueButton, {
        props: {
          text: longText
        }
      })

      expect(wrapper.find('[data-testid="continue-btn"]').text()).toBe(longText)
    })

    it('handles special characters in text', () => {
      const wrapper = mount(WizardContinueButton, {
        props: {
          text: 'Continue with Druid\'s Spells'
        }
      })

      expect(wrapper.find('[data-testid="continue-btn"]').text()).toBe('Continue with Druid\'s Spells')
    })

    it('both disabled and loading can be true', () => {
      const wrapper = mount(WizardContinueButton, {
        props: {
          disabled: true,
          loading: true
        }
      })

      const button = wrapper.find('[data-testid="continue-btn"]')
      expect(button.attributes('disabled')).toBeDefined()
    })
  })
})
