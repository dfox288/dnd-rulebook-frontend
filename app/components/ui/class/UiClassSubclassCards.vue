<script setup lang="ts">
interface Feature {
  id: number
  level: number
  feature_name: string
}

interface Source {
  id?: number
  code?: string
  name: string
  abbreviation?: string
  pages?: string | null
  page_number?: number
}

interface Subclass {
  id: number | string
  slug: string
  name: string
  description?: string
  features?: Feature[]
  sources?: Source[]
}

interface Props {
  subclasses: Subclass[]
  basePath: string
}

defineProps<Props>()

/**
 * Get background image path for subclass (uses class images)
 */
const { getImagePath } = useEntityImage()
const getBackgroundImage = (slug: string): string => {
  return getImagePath('classes', slug, 256)
}

/**
 * Get source abbreviation for display
 */
const getSourceAbbreviation = (subclass: Subclass): string | null => {
  if (!subclass.sources || subclass.sources.length === 0) return null
  const source = subclass.sources[0]
  return source?.abbreviation || null
}

/**
 * Get feature count text
 */
const getFeatureCountText = (subclass: Subclass): string => {
  const count = subclass.features?.length || 0
  return count === 1 ? '1 feature' : `${count} features`
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <NuxtLink
      v-for="subclass in subclasses"
      :key="subclass.id"
      :to="`${basePath}/${subclass.slug}`"
      class="block h-full group"
    >
      <UCard
        class="relative overflow-hidden h-full transition-all duration-200 border-2 border-class-300 dark:border-class-700 hover:border-class-500 hover:shadow-lg"
      >
        <!-- Background Image Layer -->
        <div
          class="absolute inset-0 bg-cover bg-center opacity-15 transition-all duration-300 group-hover:opacity-30 group-hover:scale-110 group-hover:rotate-3"
          :style="{ backgroundImage: `url(${getBackgroundImage(subclass.slug)})` }"
        />

        <!-- Content Layer -->
        <div class="relative z-10 space-y-3">
          <!-- Subclass Name -->
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-class-600 dark:group-hover:text-class-400 transition-colors">
            {{ subclass.name }}
          </h4>

          <!-- Meta Info -->
          <div class="flex items-center gap-2 flex-wrap text-sm">
            <UBadge
              v-if="getSourceAbbreviation(subclass)"
              color="class"
              variant="subtle"
              size="xs"
            >
              {{ getSourceAbbreviation(subclass) }}
            </UBadge>

            <span class="text-gray-500 dark:text-gray-400">
              {{ getFeatureCountText(subclass) }}
            </span>
          </div>
        </div>

        <template #footer>
          <div class="relative z-10 flex items-center justify-end text-sm text-class-600 dark:text-class-400">
            <span class="group-hover:underline">View Details</span>
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
            />
          </div>
        </template>
      </UCard>
    </NuxtLink>
  </div>
</template>
