import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import ProgressBar from '~/components/character/builder/ProgressBar.vue'
import type { WizardStep } from '~/composables/useWizardSteps'

const mockSteps: WizardStep[] = [
  { name: 'name', label: 'Name', icon: 'i-heroicons-user', visible: () => true },
  { name: 'race', label: 'Race', icon: 'i-heroicons-globe-alt', visible: () => true },
  { name: 'class', label: 'Class', icon: 'i-heroicons-shield-check', visible: () => true },
  { name: 'review', label: 'Review', icon: 'i-heroicons-check-circle', visible: () => true }
]

describe('ProgressBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('step counter display', () => {
    it('displays step counter with current step number', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 1, // race (0-indexed)
          currentLabel: 'Race'
        }
      })

      expect(wrapper.text()).toContain('Step 2 of 4')
    })

    it('displays current step label', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 2,
          currentLabel: 'Class'
        }
      })

      expect(wrapper.text()).toContain('Class')
    })
  })

  describe('progress dots', () => {
    it('renders a dot for each step', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 1,
          currentLabel: 'Race'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      expect(dots.length).toBe(4)
    })

    it('marks completed steps with filled style (bg-primary)', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 2, // class (0=name, 1=race completed)
          currentLabel: 'Class'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      // First two dots should be completed
      expect(dots[0].classes()).toContain('bg-primary')
      expect(dots[1].classes()).toContain('bg-primary')
    })

    it('marks current step with ring highlight', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 1,
          currentLabel: 'Race'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      // Current dot should have ring styling
      expect(dots[1].classes()).toContain('ring-2')
    })

    it('marks future steps with muted style', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 1,
          currentLabel: 'Race'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      // Future dots should have muted bg
      expect(dots[2].classes()).toContain('bg-gray-300')
      expect(dots[3].classes()).toContain('bg-gray-300')
    })
  })

  describe('click navigation', () => {
    it('emits step-click when clicking a completed dot', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 2,
          currentLabel: 'Class'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      await dots[0].trigger('click') // Click first (completed) dot

      expect(wrapper.emitted('step-click')).toBeTruthy()
      expect(wrapper.emitted('step-click')![0]).toEqual(['name'])
    })

    it('does not emit step-click when clicking current dot', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 1,
          currentLabel: 'Race'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      await dots[1].trigger('click') // Click current dot

      expect(wrapper.emitted('step-click')).toBeFalsy()
    })

    it('does not emit step-click when clicking future dot', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 1,
          currentLabel: 'Race'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      await dots[3].trigger('click') // Click last (future) dot

      expect(wrapper.emitted('step-click')).toBeFalsy()
    })
  })

  describe('accessibility', () => {
    it('disables future dots', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 1,
          currentLabel: 'Race'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      // Future dots should be disabled
      expect(dots[2].attributes('disabled')).toBeDefined()
      expect(dots[3].attributes('disabled')).toBeDefined()
    })

    it('provides title attribute with step label for each dot', async () => {
      const wrapper = await mountSuspended(ProgressBar, {
        props: {
          steps: mockSteps,
          currentIndex: 0,
          currentLabel: 'Name'
        }
      })

      const dots = wrapper.findAll('[data-test="progress-dot"]')
      expect(dots[0].attributes('title')).toBe('Name')
      expect(dots[1].attributes('title')).toBe('Race')
      expect(dots[2].attributes('title')).toBe('Class')
      expect(dots[3].attributes('title')).toBe('Review')
    })
  })
})
