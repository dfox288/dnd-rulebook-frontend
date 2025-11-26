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
 * Get computed hit points data (works for both base and subclasses)
 */
const hitPointsData = computed(() => {
  return entity.value?.computed?.hit_points ?? null
})

/**
 * Get computed progression table (works for both base and subclasses)
 */
const progressionTableData = computed(() => {
  return entity.value?.computed?.progression_table ?? null
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
 * Build accordion items with icons
 * For subclasses, uses inherited_data from backend
 */
const accordionItems = computed(() => {
  if (!entity.value) return []

  const items = []
  const isBase = entity.value.is_base_class

  // For subclasses, use inherited_data; for base classes, use entity directly
  const counters = isBase
    ? entity.value.counters
    : entity.value.inherited_data?.counters

  const traits = isBase
    ? entity.value.traits
    : entity.value.inherited_data?.traits

  const levelProgression = isBase
    ? entity.value.level_progression
    : entity.value.inherited_data?.level_progression

  const equipment = isBase
    ? entity.value.equipment
    : entity.value.inherited_data?.equipment

  const proficiencies = isBase
    ? entity.value.proficiencies
    : entity.value.inherited_data?.proficiencies

  // Features are always from the entity itself (subclasses have their own features)
  const features = entity.value.features

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

  // Features section - base class shows all, subclass shows own features
  if (features && features.length > 0) {
    items.push({
      label: `Features (${features.length})`,
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
 * Get data for accordion slots (handles inheritance via inherited_data)
 */
const accordionData = computed(() => {
  if (!entity.value) return {}

  const isBase = entity.value.is_base_class

  return {
    counters: isBase ? entity.value.counters : entity.value.inherited_data?.counters,
    traits: isBase ? entity.value.traits : entity.value.inherited_data?.traits,
    levelProgression: isBase ? entity.value.level_progression : entity.value.inherited_data?.level_progression,
    equipment: isBase ? entity.value.equipment : entity.value.inherited_data?.equipment,
    proficiencies: isBase ? entity.value.proficiencies : entity.value.inherited_data?.proficiencies,
    features: entity.value.features
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

      <!-- Class Progression Table (from computed data) -->
      <div
        v-if="progressionTableData"
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
          :progression-table="progressionTableData"
        />
      </div>

      <!-- Description -->
      <UiDetailDescriptionCard
        v-if="entity.description"
        :description="entity.description"
      />

      <!-- Hit Points Card (from computed data) -->
      <UiClassHitPointsCard
        v-if="hitPointsData"
        :hit-points="hitPointsData"
      />

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
