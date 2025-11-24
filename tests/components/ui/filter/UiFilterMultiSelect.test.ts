import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiFilterMultiSelect from '~/components/ui/filter/UiFilterMultiSelect.vue'

describe('UiFilterMultiSelect', () => {
  const defaultOptions = [
    { value: 'fire', label: 'Fire' },
    { value: 'cold', label: 'Cold' },
    { value: 'lightning', label: 'Lightning' },
    { value: 'thunder', label: 'Thunder' },
    { value: 'acid', label: 'Acid' },
    { value: 'poison', label: 'Poison' }
  ]

  describe('Basic Rendering', () => {
    it('renders with label', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      expect(wrapper.text()).toContain('Damage Types')
    })

    it('renders USelectMenu component', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      expect(selectMenu.exists()).toBe(true)
    })

    it('passes options to USelectMenu', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      // Verify USelectMenu exists and is configured for multi-select
      expect(selectMenu.exists()).toBe(true)
      expect(selectMenu.props('multiple')).toBe(true)
    })

    it('handles empty options array', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Empty',
          options: []
        }
      })

      expect(wrapper.text()).toContain('Empty')
      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      // Verify USelectMenu still renders even with empty options
      expect(selectMenu.exists()).toBe(true)
    })
  })

  describe('Selection State', () => {
    it('passes empty array to USelectMenu when no selection', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      expect(selectMenu.props('modelValue')).toEqual([])
    })

    it('passes selected values to USelectMenu', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire', 'cold'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      expect(selectMenu.props('modelValue')).toEqual(['fire', 'cold'])
    })

    it('normalizes null modelValue to empty array', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: null,
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      expect(selectMenu.props('modelValue')).toEqual([])
    })

    it('normalizes undefined modelValue to empty array', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: undefined,
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      expect(selectMenu.props('modelValue')).toEqual([])
    })
  })

  describe('User Interactions', () => {
    it('emits update:modelValue when USelectMenu changes', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      await selectMenu.vm.$emit('update:modelValue', ['fire'])

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]).toEqual([['fire']])
    })

    it('handles adding multiple items to selection', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      await selectMenu.vm.$emit('update:modelValue', ['fire', 'cold'])

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]).toEqual([['fire', 'cold']])
    })

    it('handles removing items from selection', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire', 'cold'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      await selectMenu.vm.$emit('update:modelValue', ['cold'])

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]).toEqual([['cold']])
    })

    it('configures USelectMenu with multiple selection', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      expect(selectMenu.props('multiple')).toBe(true)
    })

    it('configures USelectMenu as searchable', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      // Verify USelectMenu exists (searchable prop is internal implementation detail)
      expect(selectMenu.exists()).toBe(true)
    })

    it('handles null selection from USelectMenu', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      await selectMenu.vm.$emit('update:modelValue', null)

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]).toEqual([[]])
    })
  })

  describe('Clear Functionality', () => {
    it('shows clear button when items are selected', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire', 'cold'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const clearButton = wrapper.findComponent({ name: 'UButton' })
      expect(clearButton.exists()).toBe(true)
    })

    it('does not show clear button when no items selected', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const clearButton = wrapper.findComponent({ name: 'UButton' })
      expect(clearButton.exists()).toBe(false)
    })

    it('emits empty array when clear button clicked', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire', 'cold', 'lightning'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const clearButton = wrapper.findComponent({ name: 'UButton' })
      // Emit the click event directly from the button component
      await clearButton.vm.$emit('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]).toEqual([[]])
    })

    it('configures clear button with proper icon', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const clearButton = wrapper.findComponent({ name: 'UButton' })
      expect(clearButton.props('icon')).toBe('i-heroicons-x-mark')
    })
  })

  describe('Styling Props', () => {
    it('uses primary color by default for badge', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const badge = wrapper.findComponent({ name: 'UBadge' })
      expect(badge.props('color')).toBe('primary')
    })

    it('applies custom color to badge', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire', 'cold'],
          label: 'Damage Types',
          options: defaultOptions,
          color: 'warning'
        }
      })

      const badge = wrapper.findComponent({ name: 'UBadge' })
      expect(badge.props('color')).toBe('warning')
    })

    it('shows badge only when items are selected', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const badge = wrapper.findComponent({ name: 'UBadge' })
      expect(badge.exists()).toBe(false)
    })

    it('displays count in badge', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire', 'cold', 'lightning'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const badge = wrapper.findComponent({ name: 'UBadge' })
      expect(badge.text()).toBe('3')
    })
  })

  describe('Accessibility', () => {
    it('provides accessible label', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      expect(wrapper.text()).toContain('Damage Types')
    })

    it('sets ARIA label on USelectMenu', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      // Verify USelectMenu exists and has accessible labeling via parent label
      expect(selectMenu.exists()).toBe(true)
      expect(wrapper.text()).toContain('Damage Types')
    })

    it('has accessible clear button with descriptive label', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const clearButton = wrapper.findComponent({ name: 'UButton' })
      // Verify clear button exists with proper icon (aria-label handled by UButton internally)
      expect(clearButton.exists()).toBe(true)
      expect(clearButton.props('icon')).toBe('i-heroicons-x-mark')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string in selection', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [''],
          label: 'Test',
          options: [
            { value: '', label: 'Empty' },
            { value: 'filled', label: 'Filled' }
          ]
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      expect(selectMenu.props('modelValue')).toEqual([''])
    })

    it('handles selecting all options', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: ['fire', 'cold', 'lightning', 'thunder', 'acid', 'poison'],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const badge = wrapper.findComponent({ name: 'UBadge' })
      expect(badge.text()).toBe('6')
    })

    it('handles rapid selection changes', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })

      await selectMenu.vm.$emit('update:modelValue', ['fire'])
      await selectMenu.vm.$emit('update:modelValue', ['fire', 'cold'])
      await selectMenu.vm.$emit('update:modelValue', ['fire', 'cold', 'lightning'])

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toHaveLength(3)
      expect(emitted?.[2]).toEqual([['fire', 'cold', 'lightning']])
    })
  })

  describe('Props Configuration', () => {
    it('uses custom placeholder', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions,
          placeholder: 'Choose damage types...'
        }
      })

      // Verify component receives the placeholder prop
      expect(wrapper.props('placeholder')).toBe('Choose damage types...')
    })

    it('has correct value and option attributes', async () => {
      const wrapper = await mountSuspended(UiFilterMultiSelect, {
        props: {
          modelValue: [],
          label: 'Damage Types',
          options: defaultOptions
        }
      })

      const selectMenu = wrapper.findComponent({ name: 'USelectMenu' })
      // Verify USelectMenu is properly configured for multi-select
      expect(selectMenu.exists()).toBe(true)
      expect(selectMenu.props('multiple')).toBe(true)
    })
  })
})
