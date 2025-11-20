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

// Get current route for active link highlighting
const route = useRoute()

// Dark mode
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Navigation items
const navItems = [
  { label: 'Spells', to: '/spells' },
  { label: 'Items', to: '/items' },
  { label: 'Races', to: '/races' },
  { label: 'Classes', to: '/classes' },
  { label: 'Backgrounds', to: '/backgrounds' },
  { label: 'Feats', to: '/feats' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <!-- Navigation Bar -->
    <nav class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Site Title (Left) -->
          <div class="flex-shrink-0">
            <NuxtLink
              to="/"
              class="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              D&D 5e Compendium
            </NuxtLink>
          </div>

          <!-- Navigation Links (Center) - Desktop -->
          <div class="hidden md:flex items-center space-x-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="route.path.startsWith(item.to)
                ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              {{ item.label }}
            </NuxtLink>
          </div>

          <!-- Dark Mode Toggle (Right) -->
          <div class="flex items-center space-x-4">
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
              color="gray"
              variant="ghost"
              aria-label="Toggle dark mode"
              @click="toggleColorMode"
            />
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden pb-3 space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="route.path.startsWith(item.to)
              ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>
  </div>
</template>
