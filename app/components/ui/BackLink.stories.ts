import type { Meta, StoryObj } from '@storybook/vue3'
import BackLink from './BackLink.vue'

// Component stubs (NuxtLink, UButton) are registered globally in .storybook/preview.ts

const meta: Meta<typeof BackLink> = {
  title: 'UI/Navigation/BackLink',
  component: BackLink,
  tags: ['autodocs'],
  argTypes: {
    to: {
      control: 'text',
      description: 'Destination route path'
    },
    label: {
      control: 'text',
      description: 'Link text to display'
    },
    icon: {
      control: 'text',
      description: 'Heroicons icon class'
    }
  }
}

export default meta
type Story = StoryObj<typeof BackLink>

/**
 * Default back link with standard styling
 */
export const Default: Story = {
  args: {
    to: '/spells',
    label: 'Back to Spells'
  }
}

/**
 * Link to homepage with home icon
 */
export const HomePage: Story = {
  args: {
    to: '/',
    label: 'Home',
    icon: 'i-heroicons-home'
  }
}

/**
 * Link with a very long label to test text wrapping
 */
export const LongLabel: Story = {
  args: {
    to: '/spell-schools',
    label: 'Back to Spell Schools and Arcane Magical Disciplines'
  }
}

/**
 * Back link using default label (derived from props)
 */
export const DefaultLabel: Story = {
  args: {
    to: '/items'
    // label omitted - should use default "Back to Home"
  }
}
