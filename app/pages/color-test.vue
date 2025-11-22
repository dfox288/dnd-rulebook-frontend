<script setup lang="ts">
useHead({
  title: 'Color Diagnostic Test',
  meta: [
    { name: 'description', content: 'Side-by-side color comparison: What IS vs What SHOULD BE' }
  ]
})

const colorMode = useColorMode()
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-7xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <UiBackLink to="/" label="Back to Home" />
      </div>
      <UButton
        :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
        color="neutral"
        variant="ghost"
        @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
      >
        {{ colorMode.value === 'dark' ? 'Light' : 'Dark' }} Mode
      </UButton>
    </div>

    <h1 class="text-4xl font-bold mb-4">🔬 Color Diagnostic Test</h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-12">
      Side-by-side comparison of <strong>what IS rendering</strong> vs <strong>what SHOULD render</strong>
    </p>

    <div class="space-y-12">
      <!-- Primary Color -->
      <section class="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          1. Primary Color = Amber
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- What IS -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              ⚙️ What IS (NuxtUI color="primary")
            </h3>
            <div class="space-y-3">
              <UButton color="primary" size="lg">Primary Button</UButton>
              <UBadge color="primary" size="lg">Primary Badge</UBadge>
              <UButton color="primary" variant="outline">Primary Outline</UButton>
            </div>
          </div>

          <!-- What SHOULD BE -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              ✅ What SHOULD BE (Tailwind amber-500)
            </h3>
            <div class="space-y-3">
              <button class="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium">
                Amber Button Reference
              </button>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">
                Amber Badge Reference
              </span>
              <button class="px-4 py-2 border-2 border-amber-500 text-amber-600 dark:text-amber-400 rounded-md text-sm font-medium">
                Amber Outline Reference
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Success Color -->
      <section class="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          2. Success Color = Emerald
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- What IS -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              ⚙️ What IS (NuxtUI color="success")
            </h3>
            <div class="space-y-3">
              <UButton color="success" size="lg">Success Button</UButton>
              <UBadge color="success" size="lg">Success Badge</UBadge>
              <UButton color="success" variant="outline">Success Outline</UButton>
            </div>
            <p class="mt-4 text-sm text-red-600 dark:text-red-400 font-semibold">
              🚨 Currently showing default green, NOT emerald!
            </p>
          </div>

          <!-- What SHOULD BE -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              ✅ What SHOULD BE (Tailwind emerald-500)
            </h3>
            <div class="space-y-3">
              <button class="px-4 py-2 bg-emerald-500 text-white rounded-md text-sm font-medium">
                Emerald Button Reference
              </button>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500 text-white">
                Emerald Badge Reference
              </span>
              <button class="px-4 py-2 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-md text-sm font-medium">
                Emerald Outline Reference
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Neutral Color -->
      <section class="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          3. Neutral Color = Stone
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- What IS -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              ⚙️ What IS (NuxtUI color="neutral")
            </h3>
            <div class="space-y-3">
              <UButton color="neutral" size="lg">Neutral Button</UButton>
              <UBadge color="neutral" size="lg">Neutral Badge</UBadge>
              <UButton color="neutral" variant="outline">Neutral Outline</UButton>
            </div>
            <p class="mt-4 text-sm text-red-600 dark:text-red-400 font-semibold">
              🚨 Currently showing white/transparent, NOT stone gray!
            </p>
          </div>

          <!-- What SHOULD BE -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              ✅ What SHOULD BE (Tailwind stone-500)
            </h3>
            <div class="space-y-3">
              <button class="px-4 py-2 bg-stone-500 text-white rounded-md text-sm font-medium">
                Stone Button Reference
              </button>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-500 text-white">
                Stone Badge Reference
              </span>
              <button class="px-4 py-2 border-2 border-stone-500 text-stone-600 dark:text-stone-400 rounded-md text-sm font-medium">
                Stone Outline Reference
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Warning, Error, Info -->
      <section class="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          4. Other Semantic Colors
        </h2>

        <div class="space-y-6">
          <!-- Warning -->
          <div>
            <h3 class="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Warning = Orange</h3>
            <div class="flex gap-4 items-center">
              <UButton color="warning" size="sm">NuxtUI</UButton>
              <button class="px-3 py-1.5 bg-orange-500 text-white rounded text-sm font-medium">Tailwind Reference</button>
            </div>
          </div>

          <!-- Error -->
          <div>
            <h3 class="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Error = Red</h3>
            <div class="flex gap-4 items-center">
              <UButton color="error" size="sm">NuxtUI</UButton>
              <button class="px-3 py-1.5 bg-red-500 text-white rounded text-sm font-medium">Tailwind Reference</button>
            </div>
          </div>

          <!-- Info -->
          <div>
            <h3 class="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Info = Blue</h3>
            <div class="flex gap-4 items-center">
              <UButton color="info" size="sm">NuxtUI</UButton>
              <button class="px-3 py-1.5 bg-blue-500 text-white rounded text-sm font-medium">Tailwind Reference</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Configuration Display -->
      <section class="border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">
          📋 Current Configuration
        </h2>

        <div class="space-y-4 text-sm">
          <div>
            <p class="font-mono text-amber-800 dark:text-amber-200 font-semibold mb-2">app.config.ts:</p>
            <pre class="bg-white dark:bg-gray-900 p-3 rounded border border-amber-200 dark:border-amber-800 overflow-x-auto"><code>ui: {
  colors: {
    primary: 'amber',
    success: 'emerald',
    warning: 'orange',
    error: 'red',
    info: 'blue',
    neutral: 'stone'
  }
}</code></pre>
          </div>

          <div>
            <p class="font-mono text-amber-800 dark:text-amber-200 font-semibold mb-2">nuxt.config.ts:</p>
            <pre class="bg-white dark:bg-gray-900 p-3 rounded border border-amber-200 dark:border-amber-800 overflow-x-auto"><code>ui: {
  theme: {
    colors: ['primary', 'success', 'warning', 'error', 'info', 'neutral']
  }
}</code></pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
