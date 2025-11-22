<script setup lang="ts">
import type { components } from '~/types/api/generated'
import type { BadgeColor } from '~/utils/badgeColors'

// EntityLanguageResource has optional language object and is_choice flag
type EntityLanguageResource = components['schemas']['EntityLanguageResource']

type BadgeVariant = 'solid' | 'outline' | 'soft' | 'subtle'

interface Props {
  items: EntityLanguageResource[]
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
        {{ item.language?.name || (item.is_choice ? 'Choose any language' : 'Unknown') }}
      </UBadge>
    </div>
  </div>
</template>
