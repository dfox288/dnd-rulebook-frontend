<script setup lang="ts">
interface Source {
  id?: number
  code?: string
  name: string
  abbreviation?: string
  pages?: string | null
  page_number?: number
}

interface Modifier {
  modifier_category: string
  ability_score?: { code: string, name?: string }
  value: string | number
}

interface Subrace {
  id: number | string
  slug: string
  name: string
  description?: string
  sources?: Source[]
  modifiers?: Modifier[]
}

interface Props {
  subraces: Subrace[]
  basePath: string
}

defineProps<Props>()

/**
 * Get background image path for subrace (uses race images)
 */
const { getImagePath } = useEntityImage()
const getBackgroundImage = (slug: string): string | null => {
  return getImagePath('races', slug, 256)
}

/**
 * Get source abbreviation for display
 */
const getSourceAbbreviation = (subrace: Subrace): string | null => {
  if (!subrace.sources || subrace.sources.length === 0) return null
  const source = subrace.sources[0]
  return source?.abbreviation || source?.code || null
}

/**
 * Get ASI (Ability Score Increase) summary
 * Returns formatted string like "INT +1" or "WIS +1, CHA +1"
 */
const getAsiSummary = (subrace: Subrace): string | null => {
  if (!subrace.modifiers || subrace.modifiers.length === 0) return null

  const asiModifiers = subrace.modifiers.filter(
    m => m.modifier_category === 'ability_score' && m.ability_score
  )

  if (asiModifiers.length === 0) return null

  return asiModifiers
    .map((m) => {
      const code = m.ability_score!.code
      const value = typeof m.value === 'string' ? m.value : m.value.toString()
      return `${code} +${value}`
    })
    .join(', ')
}

/**
 * Get brief description preview (first ~100 characters)
 */
const getDescriptionPreview = (subrace: Subrace): string | null => {
  const desc = subrace.description
  if (!desc) return null

  // Remove "Source:" references if present
  const sourceIndex = desc.indexOf('\n\nSource:')
  const cleanDesc = sourceIndex > 0 ? desc.substring(0, sourceIndex) : desc

  // Take first sentence only (up to 120 chars)
  const firstSentence = cleanDesc.split('.')[0]
  if (firstSentence && firstSentence.length < 120) {
    return firstSentence + '.'
  }

  // Or truncate at 100 chars
  if (cleanDesc.length > 100) {
    return cleanDesc.substring(0, 97) + '...'
  }

  return cleanDesc
}

/**
 * Get source category for color coding
 */
const getSourceCategory = (subrace: Subrace): 'core' | 'expansion' | 'setting' => {
  const source = subrace.sources?.[0]
  if (!source) return 'core'

  const abbr = source.abbreviation || source.code || ''
  const coreBooks = ['PHB', 'DMG', 'MM']
  const expansionBooks = ['XGE', 'TCE', 'FTD', 'SCC', 'VGTM', 'MTOF']

  if (coreBooks.includes(abbr)) return 'core'
  if (expansionBooks.includes(abbr)) return 'expansion'
  return 'setting'
}

/**
 * Get badge color based on source category
 */
type BadgeColor = 'success' | 'info' | 'warning' | 'secondary'

const getSourceBadgeColor = (subrace: Subrace): BadgeColor => {
  const category = getSourceCategory(subrace)
  switch (category) {
    case 'core': return 'success'
    case 'expansion': return 'info'
    case 'setting': return 'warning'
    default: return 'secondary'
  }
}
</script>

<template>
  <div
    v-if="subraces.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <NuxtLink
      v-for="subrace in subraces"
      :key="subrace.id"
      :to="`${basePath}/${subrace.slug}`"
      class="block h-full group"
    >
      <UCard
        class="relative overflow-hidden h-full transition-all duration-200 border-2 border-race-300 dark:border-race-700 hover:border-race-500 hover:shadow-lg"
      >
        <!-- Background Image Layer -->
        <div
          class="absolute inset-0 bg-cover bg-center opacity-15 transition-all duration-300 group-hover:opacity-30 group-hover:scale-110 group-hover:rotate-3"
          :style="{ backgroundImage: `url(${getBackgroundImage(subrace.slug)})` }"
        />

        <!-- Content Layer -->
        <div class="relative z-10 space-y-3">
          <!-- Subrace Name -->
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-race-600 dark:group-hover:text-race-400 transition-colors">
            {{ subrace.name }}
          </h4>

          <!-- Meta Info Row -->
          <div class="flex items-center gap-2 flex-wrap text-sm">
            <!-- Source Badge (color-coded by category) -->
            <UBadge
              v-if="getSourceAbbreviation(subrace)"
              :color="getSourceBadgeColor(subrace)"
              variant="subtle"
              size="md"
            >
              {{ getSourceAbbreviation(subrace) }}
            </UBadge>

            <!-- ASI Badges -->
            <UBadge
              v-if="getAsiSummary(subrace)"
              color="info"
              variant="soft"
              size="md"
            >
              {{ getAsiSummary(subrace) }}
            </UBadge>
          </div>

          <!-- Brief Description Preview -->
          <p
            v-if="getDescriptionPreview(subrace)"
            class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
          >
            {{ getDescriptionPreview(subrace) }}
          </p>
        </div>

        <template #footer>
          <div class="relative z-10 flex items-center justify-end text-sm text-race-600 dark:text-race-400">
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
