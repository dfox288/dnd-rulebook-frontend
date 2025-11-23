<script setup lang="ts">
import type { BadgeColor } from '~/utils/badgeColors'

// Generic item with name property (classes, languages, etc.)
interface NamedItem {
  name?: string
  language?: { name: string }
  is_choice?: boolean
}

type BadgeVariant = 'solid' | 'outline' | 'soft' | 'subtle'

interface Props {
  items: NamedItem[]
  color?: BadgeColor
  variant?: BadgeVariant
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'soft'
})
</script>

<template>
  <div class="p-4">
    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="(item, index) in items"
        :key="index"
        :color="color"
        :variant="variant"
      >
        {{ item.name || item.language?.name || (item.is_choice ? 'Choose any language' : 'Unknown') }}
      </UBadge>
    </div>
  </div>
</template>
