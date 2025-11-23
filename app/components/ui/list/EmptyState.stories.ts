import type { Meta, StoryObj } from '@storybook/vue3'
import UiListEmptyState from './EmptyState.vue'

// Component stubs (UCard, UButton, UIcon) are registered globally in .storybook/preview.ts

const meta: Meta<typeof UiListEmptyState> = {
  title: 'UI/List/EmptyState',
  component: UiListEmptyState,
  tags: ['autodocs'],
  argTypes: {
    entityName: {
      control: 'text',
      description: 'Name of entity type (e.g., "spells", "items")'
    },
    message: {
      control: 'text',
      description: 'Custom message (overrides entityName)'
    },
    hasFilters: {
      control: 'boolean',
      description: 'Whether to show "Clear All Filters" button'
    },
    onClearFilters: {
      action: 'clearFilters',
      description: 'Emitted when clear filters button clicked'
    }
  }
}

export default meta
type Story = StoryObj<typeof UiListEmptyState>

/**
 * Default empty state with entity name
 */
export const Default: Story = {
  args: {
    entityName: 'spells'
  }
}

/**
 * Empty state with active filters - shows clear button
 */
export const WithFilters: Story = {
  args: {
    entityName: 'items',
    hasFilters: true
  }
}

/**
 * Custom message instead of entity-based message
 */
export const CustomMessage: Story = {
  args: {
    message: 'Your search didn\'t match any monsters',
    hasFilters: true
  }
}

/**
 * Generic empty state (no entity name)
 */
export const Generic: Story = {
  args: {}
}

/**
 * With filters but custom message
 */
export const CustomWithFilters: Story = {
  args: {
    message: 'No legendary weapons found matching your criteria',
    hasFilters: true
  }
}
