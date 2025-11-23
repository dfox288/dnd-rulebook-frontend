import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'

// Import Tailwind CSS (Storybook-specific version without Nuxt dependencies)
import './preview.css'

// Global component stubs for NuxtUI components
// These are used across multiple stories, so registering globally
const globalStubs = {
  // UCard - Card container with shadows and borders
  UCard: {
    name: 'UCard',
    template: '<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"><slot /></div>'
  },

  // UButton - Button component with various styles
  UButton: {
    name: 'UButton',
    props: ['color', 'variant', 'icon'],
    template: `
      <button
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
        :class="{
          'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md': color === 'primary',
          'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600': !color || color === 'gray'
        }"
        @click="$emit('click', $event)"
      >
        <span v-if="icon" class="w-4 h-4 opacity-70">←</span>
        <slot />
      </button>
    `
  },

  // UIcon - Icon component (using simple SVG placeholder)
  UIcon: {
    name: 'UIcon',
    props: ['name'],
    template: `
      <div class="inline-flex items-center justify-center" :class="$attrs.class">
        <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
    `
  },

  // NuxtLink - Router link (using simple anchor)
  NuxtLink: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to" class="inline-block"><slot /></a>'
  }
}

// Setup Vue app (for global plugins, components, etc.)
setup((app) => {
  // Register global component stubs
  Object.entries(globalStubs).forEach(([name, component]) => {
    app.component(name, component)
  })
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' }
      ]
    }
  },
  // Global decorator to add padding around stories
  decorators: [
    story => ({
      components: { story },
      template: '<div class="p-8 min-h-screen"><story /></div>'
    })
  ]
}

export default preview
