<!-- app/components/character/wizard/WizardLayout.vue -->
<script setup lang="ts">
/**
 * Layout wrapper for the character builder wizard v2.
 *
 * Provides:
 * - Fixed sidebar with step navigation
 * - Scrollable main content area
 * - Fixed footer with navigation buttons
 */
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <CharacterWizardWizardSidebar class="w-64 flex-shrink-0 hidden lg:block" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>

      <!-- Footer -->
      <CharacterWizardWizardFooter />
    </div>
  </div>
</template>
