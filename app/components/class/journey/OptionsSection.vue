<script setup lang="ts">
import type { OptionalFeatureResource } from '~/types/api/entities'

interface Props {
  options: OptionalFeatureResource[]
  level: number
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
})

// Group options by prerequisite
const groupedOptions = computed(() => {
  if (props.options.length === 0) {
    return []
  }

  // Create a map of prerequisite -> options
  const groups = new Map<string, OptionalFeatureResource[]>()

  props.options.forEach((option) => {
    const key = option.prerequisite_text || '_no_prerequisites'
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(option)
  })

  // Convert to array and sort
  const groupsArray = Array.from(groups.entries()).map(([prerequisite, options]) => ({
    title: prerequisite === '_no_prerequisites'
      ? 'No Prerequisites'
      : `Requires ${prerequisite}`,
    options,
    sortKey: prerequisite === '_no_prerequisites' ? '' : prerequisite
  }))

  // Sort: "No Prerequisites" first (empty sortKey), then alphabetically
  groupsArray.sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  return groupsArray
})
</script>

<template>
  <details
    v-if="options.length > 0"
    :open="defaultOpen"
    class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
  >
    <summary class="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 select-none flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-chevron-right"
          class="w-5 h-5 transition-transform [[open]_&]:rotate-90"
        />
        <span class="font-semibold text-gray-900 dark:text-gray-100">Available Options</span>
        <UBadge variant="subtle">
          {{ options.length }}
        </UBadge>
      </div>
    </summary>

    <div class="border-t border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
      <ClassOptionsGroup
        v-for="group in groupedOptions"
        :key="group.title"
        :title="group.title"
        :options="group.options"
      />
    </div>
  </details>
</template>
