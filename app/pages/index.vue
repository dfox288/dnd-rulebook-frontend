<script setup lang="ts">
useHead({
  title: 'D&D 5e Compendium',
  meta: [
    {
      name: 'description',
      content: 'Search and browse D&D 5th Edition spells, items, races, classes, backgrounds, and feats'
    }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        D&D 5e Compendium
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Search and browse thousands of spells, items, races, and more from D&D 5th Edition
      </p>

      <!-- Featured Search -->
      <div class="max-w-2xl mx-auto">
        <SearchInput />
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
      <NuxtLink
        to="/spells"
        class="block"
      >
        <UCard class="hover:shadow-lg transition-shadow h-full">
          <div class="text-center">
            <div class="text-3xl mb-2">✨</div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">Spells</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Browse magic spells</p>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink
        to="/items"
        class="block"
      >
        <UCard class="hover:shadow-lg transition-shadow h-full">
          <div class="text-center">
            <div class="text-3xl mb-2">⚔️</div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">Items</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Equipment & gear</p>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink
        to="/races"
        class="block"
      >
        <UCard class="hover:shadow-lg transition-shadow h-full">
          <div class="text-center">
            <div class="text-3xl mb-2">🧝</div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">Races</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Character races</p>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink
        to="/classes"
        class="block"
      >
        <UCard class="hover:shadow-lg transition-shadow h-full">
          <div class="text-center">
            <div class="text-3xl mb-2">🛡️</div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">Classes</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Character classes</p>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink
        to="/backgrounds"
        class="block"
      >
        <UCard class="hover:shadow-lg transition-shadow h-full">
          <div class="text-center">
            <div class="text-3xl mb-2">📜</div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">Backgrounds</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Character origins</p>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink
        to="/feats"
        class="block"
      >
        <UCard class="hover:shadow-lg transition-shadow h-full">
          <div class="text-center">
            <div class="text-3xl mb-2">💪</div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">Feats</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Special abilities</p>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <!-- Stats Section -->
    <div class="mt-16 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        Powered by D&D 5e API • Over 3,000 entities indexed
      </p>
    </div>
  </div>
</template>
