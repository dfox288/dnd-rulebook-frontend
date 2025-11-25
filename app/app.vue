<script setup lang="ts">
// SEO metadata
const title = 'D&D 5e Compendium'
const description = 'Search and browse thousands of D&D 5th Edition spells, items, races, classes, backgrounds, and feats'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// Force dark mode only
const colorMode = useColorMode()
colorMode.preference = 'dark'
</script>

<template>
  <UApp>
    <!-- Layer 0: Animated gradient background (fixed, covers viewport only) -->
    <div
      class="fixed inset-0 animated-gradient"
      style="z-index: 0; height: 100vh; overflow: hidden;"
    />

    <!-- Layer 1: Animated canvas (positioned absolutely to prevent scroll issues) -->
    <ClientOnly>
      <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; pointer-events: none;">
        <AnimatedBackground />
      </div>
    </ClientOnly>

    <!-- Layer 10: Main content -->
    <div
      class="text-gray-900 dark:text-gray-100 relative"
      style="z-index: 10;"
    >
      <!-- Navigation -->
      <AppNavbar />

      <!-- Main Content -->
      <UMain>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UMain>
    </div>
  </UApp>
</template>

<style>
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background: linear-gradient(
    -45deg,
    #faf5ff,  /* purple-50 */
    #faf5ff,  /* purple-50 */
    #eef2ff,  /* indigo-50 */
    #ede9fe,  /* violet-50 */
    #faf5ff   /* purple-50 */
  );
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}

.dark .animated-gradient {
  background: linear-gradient(
    -45deg,
    #0a0a0c,  /* Very dark warm neutral */
    #1a1a1f,  /* Dark warm gray */
    #1c1928,  /* Dark with subtle purple */
    #15141a,  /* Dark warm with hint of purple */
    #0a0a0c   /* Very dark warm neutral */
  );
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}

/* Make all content semi-transparent to show animation through */
/* Use global selectors without :deep() for better specificity */
</style>
