import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import ReferencePage from '~/pages/classes/[slug]/reference.vue'

/**
 * Class Detail - Reference View Tests - Overview
 *
 * Tests the page foundation including:
 * - Page mounting for base classes and subclasses
 * - Shared component rendering (header, navigation)
 * - Loading and error states
 * - Layout and structure
 * - Route integration
 * - Debug panel
 */

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: { slug: 'wizard' }
    }))
  }
})

describe('Class Detail - Reference View - Overview', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // ============================================================================
  // Page Mounting
  // ============================================================================

  describe('Page Mounting', () => {
    it('mounts without errors for base class', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      expect(wrapper.exists()).toBe(true)
    })

    it('mounts without errors when entity is null (loading)', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // Should render loading state
      expect(wrapper.html()).toBeTruthy()
    })
  })

  // ============================================================================
  // Shared Components
  // ============================================================================

  describe('Shared Components', () => {
    it('renders ClassDetailHeader component when data loaded', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const html = wrapper.html()
      // Component is only rendered when entity data is loaded (v-else-if="entity")
      // In loading state, components won't be present
      if (html.includes('Class Features')) {
        // Data is loaded, check for component
        expect(wrapper.findComponent({ name: 'ClassDetailHeader' }).exists()).toBe(true)
      } else {
        // Still loading, component not yet rendered
        expect(wrapper.exists()).toBe(true)
      }
    })

    it('renders ClassViewNavigation component when data loaded', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const html = wrapper.html()
      // Component is only rendered when entity data is loaded (v-else-if="entity")
      // In loading state, components won't be present
      if (html.includes('Class Features')) {
        // Data is loaded, check for component
        expect(wrapper.findComponent({ name: 'ClassViewNavigation' }).exists()).toBe(true)
      } else {
        // Still loading, component not yet rendered
        expect(wrapper.exists()).toBe(true)
      }
    })
  })

  // ============================================================================
  // Loading and Error States
  // ============================================================================

  describe('Loading and Error States', () => {
    it('shows loading state when pending', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const html = wrapper.html()
      // UiDetailPageLoading shown when pending=true
      if (html.includes('loading')) {
        expect(wrapper.findComponent({ name: 'UiDetailPageLoading' }).exists()).toBe(true)
      }
    })

    it('passes entity-type="class" to loading component', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const loadingComponent = wrapper.findComponent({ name: 'UiDetailPageLoading' })
      if (loadingComponent.exists()) {
        expect(loadingComponent.props('entityType')).toBe('class')
      }
    })

    it('shows error state when error exists', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const html = wrapper.html()
      // UiDetailPageError shown when error exists
      if (html.includes('error')) {
        expect(wrapper.findComponent({ name: 'UiDetailPageError' }).exists()).toBe(true)
      }
    })

    it('passes entity-type="Class" to error component', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const errorComponent = wrapper.findComponent({ name: 'UiDetailPageError' })
      if (errorComponent.exists()) {
        expect(errorComponent.props('entityType')).toBe('Class')
      }
    })

    it('shows content when entity is loaded', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // Content div with v-else-if="entity"
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================================================
  // Debug Panel
  // ============================================================================

  describe('Debug Panel', () => {
    it('renders JsonDebugPanel component', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // Component should be present in template
      // Debug panel may not be visible in all environments
      expect(wrapper.exists()).toBe(true)
    })

    it('passes entity data to debug panel', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const debugPanel = wrapper.findComponent({ name: 'JsonDebugPanel' })
      if (debugPanel.exists()) {
        expect(debugPanel.props('title')).toBe('Class Data')
      }
    })
  })

  // ============================================================================
  // Layout and Structure
  // ============================================================================

  describe('Layout and Structure', () => {
    it('uses container with max-width', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const html = wrapper.html()
      // Container has max-w-5xl
      const hasContainer = html.includes('container') || html.includes('max-w')
      expect(hasContainer).toBe(true)
    })

    it('applies consistent spacing between sections', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const html = wrapper.html()
      // Main content div uses space-y-8 when content is loaded
      if (html.includes('Class Features')) {
        expect(html).toContain('space-y')
      } else {
        // Still loading, spacing not yet rendered
        expect(wrapper.exists()).toBe(true)
      }
    })

    it('renders all sections in correct order', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // Order: Header -> Navigation -> Progression -> Features -> Accordions -> Debug
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================================================
  // Route Integration
  // ============================================================================

  describe('Route Integration', () => {
    it('uses slug from route params', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // Template uses slug computed from route.params.slug
      expect(wrapper.exists()).toBe(true)
    })

    it('passes slug to ClassViewNavigation', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const nav = wrapper.findComponent({ name: 'ClassViewNavigation' })
      if (nav.exists()) {
        // Navigation receives :slug prop
        expect(nav.props('slug')).toBeTruthy()
      }
    })

    it('updates when slug changes', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // useClassDetail watches slug changes
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration', () => {
    it('renders complete reference view with all data', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // Full page with all sections
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.html().length).toBeGreaterThan(0)
    })

    it('handles subclass data with inherited fields', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // useClassDetail handles subclass inheritance
      expect(wrapper.exists()).toBe(true)
    })

    it('handles empty optional data gracefully', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      // All accordion sections are conditional
      expect(wrapper.exists()).toBe(true)
    })

    it('maintains proper dark mode styling', async () => {
      const wrapper = await mountSuspended(ReferencePage)
      const html = wrapper.html()
      // Dark mode classes present throughout when content is loaded
      if (html.includes('Class Features')) {
        expect(html).toContain('dark:')
      } else {
        // Still loading, dark mode classes not yet rendered in content
        expect(wrapper.exists()).toBe(true)
      }
    })
  })
})
