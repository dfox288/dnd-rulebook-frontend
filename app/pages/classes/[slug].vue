<script setup lang="ts">
import type { CharacterClass } from '~/types/api/entities'
import type { BadgeColor, BadgeSize, BadgeVariant } from '~/utils/badgeColors'

const route = useRoute()

// Fetch class data and setup SEO
const { data: entity, loading, error } = useEntityDetail<CharacterClass>({
  slug: route.params.slug as string,
  endpoint: '/classes',
  cacheKey: 'class',
  seo: {
    titleTemplate: name => `${name} - D&D 5e Class`,
    descriptionExtractor: (charClass: unknown) => {
      const c = charClass as { description?: string }
      return c.description?.substring(0, 160) || ''
    },
    fallbackTitle: 'Class - D&D 5e Compendium'
  }
})

/**
 * Get entity image path (512px variant)
 */
const { getImagePath } = useEntityImage()
const imagePath = computed(() => {
  if (!entity.value) return null
  return getImagePath('classes', entity.value.slug, 512)
})

/**
 * Get base class features (non-optional) for the progression table
 */
const baseClassFeatures = computed(() => {
  if (!entity.value?.features) return []
  return entity.value.features.filter(f => !f.is_optional)
})

/**
 * Determine if viewing a subclass (not a base class)
 */
const isSubclass = computed(() => entity.value && !entity.value.is_base_class)

/**
 * Get parent class data (only available for subclasses)
 */
const parentClass = computed(() => entity.value?.parent_class)

/**
 * Get parent class image path for overlay
 */
const parentClassImagePath = computed(() => {
  if (!parentClass.value?.slug) return null
  return getImagePath('classes', parentClass.value.slug, 256)
})

/**
 * Get base class features for progression table (from parent for subclasses)
 */
const progressionFeatures = computed(() => {
  if (isSubclass.value && parentClass.value?.features) {
    return parentClass.value.features.filter((f: { is_optional?: boolean }) => !f.is_optional)
  }
  return baseClassFeatures.value
})

/**
 * Get counters for progression table (from parent for subclasses)
 */
const progressionCounters = computed(() => {
  if (isSubclass.value && parentClass.value?.counters) {
    return parentClass.value.counters
  }
  return entity.value?.counters || []
})

/**
 * Build accordion items with icons
 * For subclasses, includes inherited content from parent class
 */
const accordionItems = computed(() => {
  if (!entity.value) return []

  const items = []

  // For base classes: show own content
  // For subclasses: show inherited content from parent

  const counters = entity.value.is_base_class
    ? entity.value.counters
    : parentClass.value?.counters

  const traits = entity.value.is_base_class
    ? entity.value.traits
    : parentClass.value?.traits

  const levelProgression = entity.value.is_base_class
    ? entity.value.level_progression
    : parentClass.value?.level_progression

  const equipment = entity.value.is_base_class
    ? entity.value.equipment
    : parentClass.value?.equipment

  const proficiencies = entity.value.is_base_class
    ? entity.value.proficiencies
    : parentClass.value?.proficiencies

  // Base class features (for subclasses, show parent's features here)
  const baseFeatures = entity.value.is_base_class
    ? entity.value.features
    : parentClass.value?.features

  const inheritedLabel = isSubclass.value && parentClass.value
    ? ` (Inherited from ${parentClass.value.name})`
    : ''

  if (counters && counters.length > 0) {
    items.push({
      label: `Class Counters${inheritedLabel}`,
      slot: 'counters',
      defaultOpen: false,
      icon: 'i-heroicons-calculator'
    })
  }

  if (traits && traits.length > 0) {
    items.push({
      label: `Class Traits (${traits.length})${inheritedLabel}`,
      slot: 'traits',
      defaultOpen: false,
      icon: 'i-heroicons-shield-check'
    })
  }

  if (levelProgression && levelProgression.length > 0) {
    items.push({
      label: `Spell Slot Progression${inheritedLabel}`,
      slot: 'level-progression',
      defaultOpen: false,
      icon: 'i-heroicons-sparkles'
    })
  }

  if (equipment && equipment.length > 0) {
    items.push({
      label: `Starting Equipment${inheritedLabel}`,
      slot: 'equipment',
      defaultOpen: false,
      icon: 'i-heroicons-shopping-bag'
    })
  }

  if (proficiencies && proficiencies.length > 0) {
    items.push({
      label: `Proficiencies (${proficiencies.length})${inheritedLabel}`,
      slot: 'proficiencies',
      defaultOpen: false,
      icon: 'i-heroicons-academic-cap'
    })
  }

  // For base classes: show Features section
  // For subclasses: show Base Class Features (parent's features)
  if (baseFeatures && baseFeatures.length > 0) {
    items.push({
      label: isSubclass.value
        ? `Base Class Features (${baseFeatures.length})${inheritedLabel}`
        : `Features (${baseFeatures.length})`,
      slot: 'features',
      defaultOpen: false,
      icon: 'i-heroicons-star'
    })
  }

  // Source is always from the current entity
  if (entity.value.sources && entity.value.sources.length > 0) {
    items.push({
      label: 'Source',
      slot: 'source',
      defaultOpen: false,
      icon: 'i-heroicons-book-open'
    })
  }

  return items
})

/**
 * Get data for accordion slots (handles inheritance)
 */
const accordionData = computed(() => {
  if (!entity.value) return {}

  const isBase = entity.value.is_base_class
  const parent = parentClass.value

  return {
    counters: isBase ? entity.value.counters : parent?.counters,
    traits: isBase ? entity.value.traits : parent?.traits,
    levelProgression: isBase ? entity.value.level_progression : parent?.level_progression,
    equipment: isBase ? entity.value.equipment : parent?.equipment,
    proficiencies: isBase ? entity.value.proficiencies : parent?.proficiencies,
    features: isBase ? entity.value.features : parent?.features
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <UiDetailPageLoading
      v-if="loading"
      entity-type="class"
    />

    <UiDetailPageError
      v-else-if="error"
      entity-type="Class"
    />

    <div
      v-else-if="entity"
      class="space-y-8"
    >
      <!-- Breadcrumb Navigation -->
      <nav
        v-if="isSubclass && parentClass"
        class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <NuxtLink
          to="/classes"
          class="hover:text-gray-700 dark:hover:text-gray-200"
        >
          Classes
        </NuxtLink>
        <UIcon
          name="i-heroicons-chevron-right"
          class="w-4 h-4"
        />
        <NuxtLink
          :to="`/classes/${parentClass.slug}`"
          class="hover:text-class-600 dark:hover:text-class-400"
        >
          {{ parentClass.name }}
        </NuxtLink>
        <UIcon
          name="i-heroicons-chevron-right"
          class="w-4 h-4"
        />
        <span class="text-gray-900 dark:text-gray-100 font-medium">
          {{ entity.name }}
        </span>
      </nav>
      <UiBackLink
        v-else
        to="/classes"
        label="Back to Classes"
      />

      <!-- Header -->
      <div class="space-y-2">
        <UiDetailPageHeader
          :title="entity.name"
          :badges="[
            ...(entity.is_base_class ? [{ label: 'Base Class', color: 'error' as BadgeColor, variant: 'subtle' as BadgeVariant, size: 'lg' as BadgeSize }] : []),
            ...(entity.spellcasting_ability ? [{ label: `✨ ${entity.spellcasting_ability.name}`, color: 'primary' as BadgeColor, variant: 'soft' as BadgeVariant, size: 'sm' as BadgeSize }] : []),
            ...(!entity.is_base_class && parentClass?.spellcasting_ability && !entity.spellcasting_ability ? [{ label: `✨ ${parentClass.spellcasting_ability.name}`, color: 'primary' as BadgeColor, variant: 'soft' as BadgeVariant, size: 'sm' as BadgeSize }] : [])
          ]"
        />

        <!-- Subclass Parent Link Badge -->
        <div
          v-if="isSubclass && parentClass"
          class="flex items-center gap-2"
        >
          <NuxtLink
            :to="`/classes/${parentClass.slug}`"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 hover:bg-warning-200 dark:hover:bg-warning-800/50 transition-colors text-sm font-medium"
          >
            <span>Subclass of</span>
            <span class="font-semibold">{{ parentClass.name }}</span>
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-4 h-4"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Stats (2/3) + Image (1/3) Side-by-Side -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Stats - 2/3 width on large screens -->
        <div class="lg:col-span-2">
          <UiDetailQuickStatsCard
            :columns="2"
            :stats="[
              ...(entity.hit_die ? [{ icon: 'i-heroicons-heart', label: 'Hit Die', value: `1d${entity.hit_die}` }] : []),
              ...(entity.primary_ability ? [{ icon: 'i-heroicons-star', label: 'Primary Ability', value: entity.primary_ability }] : []),
              ...(entity.spellcasting_ability ? [{ icon: 'i-heroicons-sparkles', label: 'Spellcasting Ability', value: `${entity.spellcasting_ability.name} (${entity.spellcasting_ability.code})` }] : [])
            ]"
          />
        </div>

        <!-- Image Section - 1/3 width on large screens -->
        <div class="lg:col-span-1">
          <!-- Subclass: Dual image display with parent overlay -->
          <div
            v-if="isSubclass && parentClass"
            class="relative"
          >
            <UiDetailEntityImage
              v-if="imagePath"
              :image-path="imagePath"
              :image-alt="`${entity.name} subclass illustration`"
            />
            <!-- Parent Class Overlay -->
            <div class="absolute bottom-2 right-2">
              <UiClassParentImageOverlay
                :parent-slug="parentClass.slug"
                :parent-name="parentClass.name"
              />
            </div>
          </div>

          <!-- Base Class: Single image -->
          <UiDetailEntityImage
            v-else-if="imagePath"
            :image-path="imagePath"
            :image-alt="`${entity.name} class illustration`"
          />
        </div>
      </div>

      <!-- Class Progression Table (base class or inherited) -->
      <div
        v-if="progressionFeatures.length > 0"
        class="space-y-2"
      >
        <div
          v-if="isSubclass && parentClass"
          class="flex items-center gap-2"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon
              name="i-heroicons-table-cells"
              class="w-5 h-5 text-gray-400"
            />
            Class Progression
          </h3>
          <UBadge
            color="neutral"
            variant="subtle"
            size="xs"
          >
            Inherited from {{ parentClass.name }}
          </UBadge>
        </div>
        <UiClassProgressionTable
          :features="progressionFeatures"
          :counters="progressionCounters"
        />
      </div>

      <!-- Description -->
      <UiDetailDescriptionCard
        v-if="entity.description"
        :description="entity.description"
      />

      <!-- Hit Points Card (for base class or inherited) -->
      <div
        v-if="entity.is_base_class && entity.hit_die"
      >
        <UiClassHitPointsCard
          :hit-die="Number(entity.hit_die)"
          :class-name="entity.name"
        />
      </div>

      <!-- Inherited Hit Points Card (for subclasses) -->
      <div
        v-else-if="isSubclass && parentClass?.hit_die"
        class="space-y-2"
      >
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Hit Points
          </h3>
          <UBadge
            color="neutral"
            variant="subtle"
            size="xs"
          >
            Inherited from {{ parentClass.name }}
          </UBadge>
        </div>
        <UiClassHitPointsCard
          :hit-die="Number(parentClass.hit_die)"
          :class-name="parentClass.name"
        />
      </div>

      <!-- Subclass Features (Primary Content for Subclasses) -->
      <div
        v-if="isSubclass && entity.features && entity.features.length > 0"
        class="space-y-4"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <UIcon
            name="i-heroicons-sparkles"
            class="w-5 h-5 text-class-500"
          />
          {{ entity.name }} Features ({{ entity.features.length }})
        </h3>
        <UiAccordionTraitsList
          :traits="entity.features"
          :show-level="true"
          border-color="class-500"
        />
      </div>

      <!-- Subclasses (Card Grid) -->
      <div
        v-if="entity.is_base_class && entity.subclasses && entity.subclasses.length > 0"
        class="space-y-4"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <UIcon
            name="i-heroicons-users"
            class="w-5 h-5 text-gray-400"
          />
          Subclasses ({{ entity.subclasses.length }})
        </h3>
        <UiClassSubclassCards
          :subclasses="entity.subclasses"
          base-path="/classes"
        />
      </div>

      <!-- Additional Details (Accordion) -->
      <UAccordion
        :items="accordionItems"
        type="multiple"
      >
        <!-- Counters Slot -->
        <template
          v-if="accordionData.counters && accordionData.counters.length > 0"
          #counters
        >
          <UiAccordionClassCounters :counters="accordionData.counters" />
        </template>

        <!-- Traits Slot -->
        <template
          v-if="accordionData.traits && accordionData.traits.length > 0"
          #traits
        >
          <UiAccordionTraitsList
            :traits="accordionData.traits"
            border-color="primary-500"
          />
        </template>

        <!-- Level Progression Slot -->
        <template
          v-if="accordionData.levelProgression && accordionData.levelProgression.length > 0"
          #level-progression
        >
          <UiAccordionLevelProgression :level-progression="accordionData.levelProgression" />
        </template>

        <!-- Equipment Slot -->
        <template
          v-if="accordionData.equipment && accordionData.equipment.length > 0"
          #equipment
        >
          <UiAccordionEquipmentList
            :equipment="accordionData.equipment"
            type="class"
          />
        </template>

        <!-- Proficiencies Slot -->
        <template
          v-if="accordionData.proficiencies && accordionData.proficiencies.length > 0"
          #proficiencies
        >
          <UiAccordionBulletList :items="accordionData.proficiencies" />
        </template>

        <!-- Features Slot -->
        <template
          v-if="accordionData.features && accordionData.features.length > 0"
          #features
        >
          <UiAccordionTraitsList
            :traits="accordionData.features"
            :show-level="true"
          />
        </template>

        <!-- Source Slot (always from current entity) -->
        <template
          v-if="entity.sources && entity.sources.length > 0"
          #source
        >
          <UiSourceDisplay :sources="entity.sources" />
        </template>
      </UAccordion>

      <!-- Bottom Navigation -->
      <UiDetailPageBottomNav
        to="/classes"
        label="Back to Classes"
      />

      <!-- JSON Debug Panel -->
      <JsonDebugPanel
        :data="entity"
        title="Class Data"
      />
    </div>
  </div>
</template>
