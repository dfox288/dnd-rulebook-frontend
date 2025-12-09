import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WizardChoiceGrid from '~/components/character/wizard/WizardChoiceGrid.vue'

describe('WizardChoiceGrid', () => {
  const mockOptions = [
    { id: 'athletics', name: 'Athletics' },
    { id: 'acrobatics', name: 'Acrobatics' },
    { id: 'stealth', name: 'Stealth' },
    { id: 'perception', name: 'Perception' }
  ]

  describe('structure', () => {
    it('renders grid container', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      const grid = wrapper.find('[data-testid="wizard-choice-grid"]')
      expect(grid.exists()).toBe(true)
    })

    it('applies grid classes', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      const grid = wrapper.find('[data-testid="wizard-choice-grid"]')
      expect(grid.classes()).toContain('grid')
      expect(grid.classes()).toContain('gap-3')
    })

    it('renders a button for each option', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      const buttons = wrapper.findAll('[data-testid^="choice-option-"]')
      expect(buttons).toHaveLength(4)
    })
  })

  describe('option rendering', () => {
    it('displays option names', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      expect(wrapper.text()).toContain('Athletics')
      expect(wrapper.text()).toContain('Acrobatics')
      expect(wrapper.text()).toContain('Stealth')
      expect(wrapper.text()).toContain('Perception')
    })

    it('renders checkbox icon for each option', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      const icons = wrapper.findAll('[data-testid^="choice-icon-"]')
      expect(icons).toHaveLength(4)
    })
  })

  describe('selection state', () => {
    it('shows unselected icon when option not selected', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      const button = wrapper.find('[data-testid="choice-option-athletics"]')
      expect(button.classes()).not.toContain('border-primary')
      expect(button.classes()).not.toContain('bg-primary/10')
    })

    it('shows selected styling when option is selected', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set(['athletics'])
        }
      })

      const button = wrapper.find('[data-testid="choice-option-athletics"]')
      expect(button.classes()).toContain('border-primary')
      expect(button.classes()).toContain('bg-primary/10')
    })

    it('multiple options can be selected', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set(['athletics', 'stealth'])
        }
      })

      const athleticsBtn = wrapper.find('[data-testid="choice-option-athletics"]')
      const stealthBtn = wrapper.find('[data-testid="choice-option-stealth"]')
      const acrobaticsBtn = wrapper.find('[data-testid="choice-option-acrobatics"]')

      expect(athleticsBtn.classes()).toContain('border-primary')
      expect(stealthBtn.classes()).toContain('border-primary')
      expect(acrobaticsBtn.classes()).not.toContain('border-primary')
    })
  })

  describe('disabled state', () => {
    it('disables options in disabledIds', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>(),
          disabledIds: new Set(['athletics'])
        }
      })

      const button = wrapper.find('[data-testid="choice-option-athletics"]')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('applies disabled styling', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>(),
          disabledIds: new Set(['athletics'])
        }
      })

      const button = wrapper.find('[data-testid="choice-option-athletics"]')
      expect(button.classes()).toContain('opacity-50')
      expect(button.classes()).toContain('cursor-not-allowed')
    })

    it('displays disabled reason when provided', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>(),
          disabledIds: new Set(['athletics']),
          disabledReasons: { athletics: 'Already selected elsewhere' }
        }
      })

      const reason = wrapper.find('[data-testid="choice-reason-athletics"]')
      expect(reason.exists()).toBe(true)
      expect(reason.text()).toBe('Already selected elsewhere')
    })

    it('hides disabled reason when not provided', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>(),
          disabledIds: new Set(['athletics'])
        }
      })

      const reason = wrapper.find('[data-testid="choice-reason-athletics"]')
      expect(reason.exists()).toBe(false)
    })
  })

  describe('click events', () => {
    it('emits toggle event with option id when clicked', async () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      const button = wrapper.find('[data-testid="choice-option-athletics"]')
      await button.trigger('click')

      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')![0]).toEqual(['athletics'])
    })

    it('emits toggle for different options', async () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      await wrapper.find('[data-testid="choice-option-athletics"]').trigger('click')
      await wrapper.find('[data-testid="choice-option-stealth"]').trigger('click')

      expect(wrapper.emitted('toggle')).toHaveLength(2)
      expect(wrapper.emitted('toggle')![0]).toEqual(['athletics'])
      expect(wrapper.emitted('toggle')![1]).toEqual(['stealth'])
    })

    it('does not emit toggle when disabled option clicked', async () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>(),
          disabledIds: new Set(['athletics'])
        }
      })

      const button = wrapper.find('[data-testid="choice-option-athletics"]')
      await button.trigger('click')

      expect(wrapper.emitted('toggle')).toBeFalsy()
    })
  })

  describe('responsive columns', () => {
    it('has responsive grid column classes', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: mockOptions,
          selectedIds: new Set<string>()
        }
      })

      const grid = wrapper.find('[data-testid="wizard-choice-grid"]')
      // Default should have responsive columns
      expect(grid.classes()).toContain('grid-cols-2')
      expect(grid.classes()).toContain('md:grid-cols-3')
      expect(grid.classes()).toContain('lg:grid-cols-4')
    })
  })

  describe('edge cases', () => {
    it('handles empty options array', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: [],
          selectedIds: new Set<string>()
        }
      })

      const buttons = wrapper.findAll('[data-testid^="choice-option-"]')
      expect(buttons).toHaveLength(0)
    })

    it('handles options with special characters in id', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: [{ id: 'common-language', name: 'Common' }],
          selectedIds: new Set(['common-language'])
        }
      })

      const button = wrapper.find('[data-testid="choice-option-common-language"]')
      expect(button.exists()).toBe(true)
      expect(button.classes()).toContain('border-primary')
    })

    it('handles options with long names', () => {
      const wrapper = mount(WizardChoiceGrid, {
        props: {
          options: [{ id: 'long', name: 'This is a very long option name that might wrap' }],
          selectedIds: new Set<string>()
        }
      })

      expect(wrapper.text()).toContain('This is a very long option name that might wrap')
    })
  })
})
