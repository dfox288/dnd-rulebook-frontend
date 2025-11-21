<script setup lang="ts">
interface Item {
  id: number
  name: string
}

interface Props {
  items: Item[]
  color?: string
  variant?: string
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
        v-for="item in items"
        :key="item.id"
        :color="color"
        :variant="variant"
      >
        {{ item.name }}
      </UBadge>
    </div>
  </div>
</template>
