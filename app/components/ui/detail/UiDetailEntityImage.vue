<script setup lang="ts">
/**
 * UiDetailEntityImage
 *
 * Displays entity images on detail pages with responsive sizing,
 * rounded corners, and shadow effects. Only renders when imagePath is provided.
 *
 * @example
 * <UiDetailEntityImage
 *   image-path="/images/spells/fireball.jpg"
 *   image-alt="Fireball spell illustration"
 * />
 */

interface Props {
  imagePath: string | null | undefined
  imageAlt: string
}

const props = defineProps<Props>()
</script>

<template>
  <NuxtImg
    v-if="imagePath"
    :src="imagePath"
    :alt="imageAlt"
    class="w-full h-auto rounded-lg shadow-md"
    loading="lazy"
  />
</template>
