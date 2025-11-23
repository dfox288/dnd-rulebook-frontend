<script setup lang="ts">
/**
 * Displays a list of subclasses with expandable features
 * Used in: Classes detail page
 */

interface Feature {
  id: number | string
  level: number
  feature_name: string
  description: string
  is_optional?: boolean
  sort_order: number
}

interface Subclass {
  id: number | string
  slug: string
  name: string
  description?: string
  features?: Feature[]
}

interface Props {
  subclasses: Subclass[]
  basePath: string
}

defineProps<Props>()

/**
 * Group features by level
 */
function groupFeaturesByLevel(features: Feature[] = []) {
  const grouped = new Map<number, Feature[]>()

  for (const feature of features) {
    const level = feature.level
    if (!grouped.has(level)) {
      grouped.set(level, [])
    }
    grouped.get(level)!.push(feature)
  }

  // Sort each level's features by sort_order
  for (const [, features] of grouped) {
    features.sort((a, b) => a.sort_order - b.sort_order)
  }

  // Convert to sorted array
  return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0])
}
</script>

<template>
  <div class="p-4 space-y-6">
    <div
      v-for="subclass in subclasses"
      :key="subclass.id"
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <!-- Subclass Header -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <NuxtLink
          :to="`${basePath}/${subclass.slug}`"
          class="group"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {{ subclass.name }}
          </h3>
          <p
            v-if="subclass.description"
            class="text-sm text-gray-600 dark:text-gray-400 mt-1"
          >
            {{ subclass.description }}
          </p>
        </NuxtLink>
      </div>

      <!-- Features -->
      <div
        v-if="subclass.features && subclass.features.length > 0"
        class="p-4 space-y-4"
      >
        <div
          v-for="[level, levelFeatures] in groupFeaturesByLevel(subclass.features)"
          :key="`level-${level}`"
          class="space-y-3"
        >
          <!-- Level Header -->
          <div class="flex items-center gap-2">
            <UBadge
              color="primary"
              variant="soft"
              size="sm"
            >
              Level {{ level }}
            </UBadge>
          </div>

          <!-- Features at this level -->
          <div class="space-y-3 pl-4 border-l-2 border-primary-500">
            <div
              v-for="feature in levelFeatures"
              :key="feature.id"
              class="space-y-1"
            >
              <div class="flex items-start gap-2">
                <h4 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {{ feature.feature_name }}
                </h4>
                <UBadge
                  v-if="feature.is_optional"
                  color="info"
                  variant="soft"
                  size="xs"
                >
                  Optional
                </UBadge>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No features message -->
      <div
        v-else
        class="p-4 text-sm text-gray-500 dark:text-gray-400 italic"
      >
        No features available for this subclass
      </div>
    </div>
  </div>
</template>
