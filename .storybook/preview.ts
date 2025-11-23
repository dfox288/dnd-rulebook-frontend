import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'

// Note: We don't import Tailwind CSS here because it references Nuxt-specific paths
// Instead, we'll rely on inline Tailwind classes and component stubs
// Tailwind will be processed through Vite's built-in PostCSS

// Setup Vue app (for global plugins, components, etc.)
setup((app) => {
  // NuxtUI components will be imported explicitly in stories
  // This keeps stories self-contained and easier to understand
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
    (story) => ({
      components: { story },
      template: '<div class="p-8 min-h-screen"><story /></div>'
    })
  ]
}

export default preview
