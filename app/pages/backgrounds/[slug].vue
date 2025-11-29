<script setup lang="ts">
import type { Background } from '~/types/api/entities'

const route = useRoute()

// Fetch background data and setup SEO
const { data: entity, loading, error } = useEntityDetail<Background>({
  slug: route.params.slug as string,
  endpoint: '/backgrounds',
  cacheKey: 'background',
  seo: {
    titleTemplate: name => `${name} - D&D 5e Background`,
    descriptionExtractor: (background: unknown) => {
      const b = background as { description?: string }
      return b.description?.substring(0, 160) || ''
    },
    fallbackTitle: 'Background - D&D 5e Compendium'
  }
})

/**
 * Get entity image path (512px variant)
 */
const { getImagePath } = useEntityImage()
const imagePath = computed(() => {
  if (!entity.value) return null
  return getImagePath('backgrounds', entity.value.slug, 512)
})

/**
 * Use composable to extract background stats
 */
const {
  skillProficiencies,
  toolProficiencies,
  languages,
  equipmentCount,
  startingGold
} = useBackgroundStats(entity)

/**
 * Build stats array for UiDetailQuickStatsCard
 */
const statsForDisplay = computed(() => {
  const stats = []

  // Skills (always show if present)
  if (skillProficiencies.value.length > 0) {
    stats.push({
      icon: 'i-heroicons-academic-cap',
      label: 'Skill Proficiencies',
      value: skillProficiencies.value.join(', ')
    })
  }

  // Languages (show actual names)
  if (languages.value.length > 0) {
    stats.push({
      icon: 'i-heroicons-language',
      label: 'Languages',
      value: languages.value.join(', ')
    })
  }

  // Tool Proficiencies (show actual names)
  if (toolProficiencies.value.length > 0) {
    stats.push({
      icon: 'i-heroicons-wrench',
      label: 'Tool Proficiencies',
      value: toolProficiencies.value.join(', ')
    })
  }

  // Equipment + Gold combined
  if (equipmentCount.value > 0 || startingGold.value) {
    const parts = []
    if (equipmentCount.value > 0) parts.push(`${equipmentCount.value} items`)
    if (startingGold.value) parts.push(`${startingGold.value} gp`)

    stats.push({
      icon: 'i-heroicons-shopping-bag',
      label: 'Starting Equipment',
      value: parts.join(' + ')
    })
  }

  return stats
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <UiDetailPageLoading
      v-if="loading"
      entity-type="background"
    />

    <UiDetailPageError
      v-else-if="error"
      entity-type="Background"
    />

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
          <UiDetailQuickStatsCard
            :columns="2"
            :stats="statsForDisplay"
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

      <!-- Description (always visible, outside accordion) -->
      <UiDetailDescriptionCard
        v-if="entity.description"
        :description="entity.description"
      />

      <!-- Single Unified Accordion - ALL expandable sections -->
      <UAccordion
        :items="[
          ...(entity.traits && entity.traits.length > 0 ? [{
            label: 'Background Traits',
            slot: 'traits',
            defaultOpen: false
          }] : []),
          ...(entity.proficiencies && entity.proficiencies.length > 0 ? [{
            label: 'Skill Proficiencies',
            slot: 'proficiencies',
            defaultOpen: false
          }] : []),
          ...(entity.languages && entity.languages.length > 0 ? [{
            label: 'Languages',
            slot: 'languages',
            defaultOpen: false
          }] : []),
          ...(entity.equipment && entity.equipment.length > 0 ? [{
            label: 'Starting Equipment',
            slot: 'equipment',
            defaultOpen: false
          }] : []),
          ...(entity.sources && entity.sources.length > 0 ? [{
            label: 'Source',
            slot: 'source',
            defaultOpen: false
          }] : []),
          ...(entity.tags && entity.tags.length > 0 ? [{
            label: 'Tags',
            slot: 'tags',
            defaultOpen: false
          }] : [])
        ]"
        type="multiple"
      >
        <!-- Traits Slot -->
        <template
          v-if="entity.traits && entity.traits.length > 0"
          #traits
        >
          <UiAccordionTraitsList
            :traits="entity.traits"
            :show-category="true"
          />
        </template>

        <!-- Proficiencies Slot -->
        <template
          v-if="entity.proficiencies && entity.proficiencies.length > 0"
          #proficiencies
        >
          <UiAccordionBulletList :items="entity.proficiencies" />
        </template>

        <!-- Languages Slot -->
        <template
          v-if="entity.languages && entity.languages.length > 0"
          #languages
        >
          <UiAccordionBadgeList
            :items="entity.languages"
            color="neutral"
          />
        </template>

        <!-- Equipment Slot -->
        <template
          v-if="entity.equipment && entity.equipment.length > 0"
          #equipment
        >
          <UiAccordionEquipmentList
            :equipment="entity.equipment"
            type="background"
          />
        </template>

        <!-- Source Slot -->
        <template
          v-if="entity.sources && entity.sources.length > 0"
          #source
        >
          <UiSourceDisplay :sources="entity.sources" />
        </template>

        <!-- Tags Slot -->
        <template
          v-if="entity.tags && entity.tags.length > 0"
          #tags
        >
          <UiTagsDisplay :tags="entity.tags" />
        </template>
      </UAccordion>

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
