<script setup lang="ts">
/**
 * Background Detail Page
 *
 * Redesigned layout featuring:
 * - Quick Stats grid (skills with abilities, languages, tools, gold)
 * - Feature hero section (signature background ability)
 * - Description card
 * - Suggested Characteristics (2x2 grid of rollable tables)
 * - Collapsible accordions for equipment and sources
 */

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Use the new background detail composable
const {
  entity,
  pending,
  error,
  feature,
  descriptionTrait,
  characteristics,
  dataTables,
  skillsWithAbilities,
  toolProficiencies,
  languageDisplay,
  startingGold,
  equipment,
  equipmentCount,
  sources,
  tags
} = useBackgroundDetail(slug)

/**
 * Get entity image path (512px variant)
 */
const { getImagePath } = useEntityImage()
const imagePath = computed(() => {
  if (!entity.value) return null
  return getImagePath('backgrounds', entity.value.slug, 512)
})

/**
 * Accordion items for collapsed sections
 */
const accordionItems = computed(() => {
  const items = []

  // Equipment (if available)
  if (equipment.value && equipment.value.length > 0) {
    items.push({
      label: 'Starting Equipment',
      icon: 'i-heroicons-cube',
      defaultOpen: false,
      slot: 'equipment'
    })
  }

  // Source (if available)
  if (sources.value && sources.value.length > 0) {
    items.push({
      label: 'Source',
      icon: 'i-heroicons-book-open',
      defaultOpen: false,
      slot: 'source'
    })
  }

  // Tags (if available)
  if (tags.value && tags.value.length > 0) {
    items.push({
      label: 'Tags',
      icon: 'i-heroicons-tag',
      defaultOpen: false,
      slot: 'tags'
    })
  }

  return items
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading -->
    <UiDetailPageLoading
      v-if="pending"
      entity-type="background"
    />

    <!-- Error -->
    <UiDetailPageError
      v-else-if="error"
      entity-type="Background"
    />

    <!-- Content -->
    <div
      v-else-if="entity"
      class="space-y-8"
    >
      <!-- Breadcrumb Navigation -->
      <UiDetailBreadcrumb
        list-path="/backgrounds"
        list-label="Backgrounds"
        :current-label="entity.name"
      />

      <!-- Header -->
      <UiDetailPageHeader
        :title="entity.name"
        :badges="[
          { label: 'Background', color: 'success', variant: 'subtle', size: 'lg' }
        ]"
      />

      <!-- Quick Stats (2/3) + Image (1/3) Side-by-Side -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Stats - 2/3 width on large screens -->
        <div class="lg:col-span-2">
          <BackgroundQuickStats
            :skills="skillsWithAbilities"
            :language-display="languageDisplay"
            :tool-proficiencies="toolProficiencies"
            :starting-gold="startingGold"
            :equipment-count="equipmentCount"
          />
        </div>

        <!-- Standalone Image - 1/3 width on large screens -->
        <div class="lg:col-span-1">
          <UiDetailEntityImage
            v-if="imagePath"
            :image-path="imagePath"
            :image-alt="`${entity.name} background illustration`"
          />
        </div>
      </div>

      <!-- Description (background lore/flavor) -->
      <UiDetailDescriptionCard
        v-if="descriptionTrait?.description"
        :description="descriptionTrait.description"
      />

      <!-- Feature Hero Section (signature background ability) -->
      <BackgroundFeatureCard :feature="feature" />

      <!-- Suggested Characteristics (2x2 grid of rollable tables) -->
      <section v-if="dataTables.length > 0">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <UIcon
            name="i-heroicons-user-circle"
            class="w-6 h-6"
          />
          Suggested Characteristics
        </h2>
        <BackgroundCharacteristicsGrid
          :data-tables="dataTables"
          :description="characteristics?.description"
        />
      </section>

      <!-- Collapsed Accordions -->
      <section v-if="accordionItems.length > 0">
        <UAccordion
          :items="accordionItems"
          type="multiple"
        >
          <!-- Equipment Slot -->
          <template #equipment>
            <UiAccordionEquipmentList
              :equipment="equipment"
              type="background"
            />
          </template>

          <!-- Source Slot -->
          <template #source>
            <UiSourceDisplay :sources="sources" />
          </template>

          <!-- Tags Slot -->
          <template #tags>
            <UiTagsDisplay :tags="tags" />
          </template>
        </UAccordion>
      </section>

      <!-- Bottom Navigation -->
      <UiDetailPageBottomNav
        to="/backgrounds"
        label="Back to Backgrounds"
      />

      <!-- JSON Debug Panel -->
      <JsonDebugPanel
        :data="entity"
        title="Background Data"
      />
    </div>
  </div>
</template>
