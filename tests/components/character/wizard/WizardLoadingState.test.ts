import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WizardLoadingState from '~/components/character/wizard/WizardLoadingState.vue'

describe('WizardLoadingState', () => {
  describe('structure', () => {
    it('renders a container with correct layout', () => {
      const wrapper = mount(WizardLoadingState)

      const container = wrapper.find('[data-testid="wizard-loading-state"]')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('justify-center')
      expect(container.classes()).toContain('py-12')
    })

    it('renders the spinner icon', () => {
      const wrapper = mount(WizardLoadingState)

      const icon = wrapper.find('[data-testid="wizard-loading-spinner"]')
      expect(icon.exists()).toBe(true)
    })

    it('spinner has animation class', () => {
      const wrapper = mount(WizardLoadingState)

      const icon = wrapper.find('[data-testid="wizard-loading-spinner"]')
      expect(icon.classes()).toContain('animate-spin')
    })

    it('spinner has correct size', () => {
      const wrapper = mount(WizardLoadingState)

      const icon = wrapper.find('[data-testid="wizard-loading-spinner"]')
      expect(icon.classes()).toContain('w-8')
      expect(icon.classes()).toContain('h-8')
    })
  })

  describe('color prop', () => {
    it('uses primary color by default', () => {
      const wrapper = mount(WizardLoadingState)

      const icon = wrapper.find('[data-testid="wizard-loading-spinner"]')
      expect(icon.classes()).toContain('text-primary-500')
    })

    it('applies race color when specified', () => {
      const wrapper = mount(WizardLoadingState, {
        props: { color: 'race' }
      })

      const icon = wrapper.find('[data-testid="wizard-loading-spinner"]')
      expect(icon.classes()).toContain('text-race-500')
    })

    it('applies class color when specified', () => {
      const wrapper = mount(WizardLoadingState, {
        props: { color: 'class' }
      })

      const icon = wrapper.find('[data-testid="wizard-loading-spinner"]')
      expect(icon.classes()).toContain('text-class-500')
    })

    it('applies spell color when specified', () => {
      const wrapper = mount(WizardLoadingState, {
        props: { color: 'spell' }
      })

      const icon = wrapper.find('[data-testid="wizard-loading-spinner"]')
      expect(icon.classes()).toContain('text-spell-500')
    })

    it('applies background color when specified', () => {
      const wrapper = mount(WizardLoadingState, {
        props: { color: 'background' }
      })

      const icon = wrapper.find('[data-testid="wizard-loading-spinner"]')
      expect(icon.classes()).toContain('text-background-500')
    })
  })

  describe('accessibility', () => {
    it('has accessible role or aria label', () => {
      const wrapper = mount(WizardLoadingState)

      const container = wrapper.find('[data-testid="wizard-loading-state"]')
      // Should have role="status" for accessibility
      expect(container.attributes('role')).toBe('status')
    })

    it('has screen reader text', () => {
      const wrapper = mount(WizardLoadingState)

      // Should have sr-only text for screen readers
      const srText = wrapper.find('.sr-only')
      expect(srText.exists()).toBe(true)
      expect(srText.text()).toBe('Loading...')
    })
  })
})
