<script setup lang="ts">
/**
 * Breadcrumb navigation for detail and list pages.
 *
 * For detail pages: Home → List → [Parent] → Current
 * For list pages (no currentLabel): Home → List (as current)
 */
interface Props {
  listPath: string
  listLabel: string
  currentLabel?: string
  parentPath?: string
  parentLabel?: string
}

defineProps<Props>()
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
  >
    <!-- Home -->
    <NuxtLink
      to="/"
      class="hover:text-gray-700 dark:hover:text-gray-200 flex items-center"
    >
      <UIcon
        name="i-heroicons-home"
        class="w-4 h-4"
      />
      <span class="sr-only">Home</span>
    </NuxtLink>

    <UIcon
      name="i-heroicons-chevron-right"
      class="w-4 h-4"
    />

    <!-- List Page (current if no currentLabel, otherwise link) -->
    <template v-if="currentLabel">
      <NuxtLink
        :to="listPath"
        class="hover:text-gray-700 dark:hover:text-gray-200"
      >
        {{ listLabel }}
      </NuxtLink>

      <UIcon
        name="i-heroicons-chevron-right"
        class="w-4 h-4"
      />

      <!-- Parent (optional, for hierarchical entities) -->
      <template v-if="parentPath && parentLabel">
        <NuxtLink
          :to="parentPath"
          class="hover:text-primary-600 dark:hover:text-primary-400"
        >
          {{ parentLabel }}
        </NuxtLink>

        <UIcon
          name="i-heroicons-chevron-right"
          class="w-4 h-4"
        />
      </template>

      <!-- Current Page -->
      <span
        aria-current="page"
        class="text-gray-900 dark:text-gray-100 font-medium"
      >
        {{ currentLabel }}
      </span>
    </template>

    <!-- List page is current (no currentLabel provided) -->
    <span
      v-else
      aria-current="page"
      class="text-gray-900 dark:text-gray-100 font-medium"
    >
      {{ listLabel }}
    </span>
  </nav>
</template>
