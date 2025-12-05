import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import WizardLayout from '~/components/character/wizard/WizardLayout.vue'

// Mock the child components
vi.mock('~/components/character/wizard/WizardSidebar.vue', () => ({
  default: {
    name: 'CharacterWizardWizardSidebar',
    template: '<aside data-test="sidebar">Sidebar</aside>'
  }
}))

vi.mock('~/components/character/wizard/WizardFooter.vue', () => ({
  default: {
    name: 'CharacterWizardWizardFooter',
    template: '<footer data-test="footer">Footer</footer>'
  }
}))

describe('WizardLayout', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('structure', () => {
    it('renders the sidebar', async () => {
      const wrapper = await mountSuspended(WizardLayout, {
        slots: {
          default: '<div data-test="content">Test Content</div>'
        }
      })

      expect(wrapper.find('[data-test="sidebar"]').exists()).toBe(true)
    })

    it('renders the footer', async () => {
      const wrapper = await mountSuspended(WizardLayout, {
        slots: {
          default: '<div data-test="content">Test Content</div>'
        }
      })

      expect(wrapper.find('[data-test="footer"]').exists()).toBe(true)
    })

    it('renders slot content in main area', async () => {
      const wrapper = await mountSuspended(WizardLayout, {
        slots: {
          default: '<div data-test="content">Test Content</div>'
        }
      })

      expect(wrapper.find('[data-test="content"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Test Content')
    })
  })

  describe('layout', () => {
    it('uses flex layout for sidebar and content', async () => {
      const wrapper = await mountSuspended(WizardLayout, {
        slots: {
          default: '<div>Content</div>'
        }
      })

      // Root element should have flex
      expect(wrapper.classes()).toContain('flex')
    })

    it('has min-height to fill viewport', async () => {
      const wrapper = await mountSuspended(WizardLayout, {
        slots: {
          default: '<div>Content</div>'
        }
      })

      expect(wrapper.classes()).toContain('min-h-screen')
    })
  })
})
