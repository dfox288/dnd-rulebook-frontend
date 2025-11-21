<script setup lang="ts">
import { getSpellLevelColor, getSpellSchoolColor } from '~/utils/badgeColors'

const route = useRoute()

// Fetch spell data and setup SEO
const { data: spell, loading, error, refresh } = useEntityDetail({
  slug: route.params.slug as string,
  endpoint: '/spells',
  cacheKey: 'spell',
  seo: {
    titleTemplate: (name) => `${name} - D&D 5e Spell`,
    descriptionExtractor: (spell) => spell.description?.substring(0, 160) || '',
    fallbackTitle: 'Spell - D&D 5e Compendium'
  }
})

/**
 * Format spell level for display
 */
const spellLevelText = computed(() => {
  if (!spell.value) return ''
  if (spell.value.level === 0) return 'Cantrip'
  const suffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
  return `${spell.value.level}${suffix[spell.value.level]} Level`
})

/**
 * Format components for display
 */
const componentsText = computed(() => {
  if (!spell.value) return ''
  const parts = []
  if (spell.value.components.includes('V')) parts.push('Verbal')
  if (spell.value.components.includes('S')) parts.push('Somatic')
  if (spell.value.components.includes('M')) parts.push(`Material (${spell.value.material_components})`)
  return parts.join(', ')
})

/**
 * Get all effects (damage and other) grouped by spell slot level
 */
const spellEffects = computed(() => {
  if (!spell.value?.effects) return []
  return spell.value.effects
    .sort((a: any, b: any) => a.min_spell_slot - b.min_spell_slot)
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading State -->
    <UiDetailPageLoading v-if="loading" entityType="spell" />

    <!-- Error State -->
    <UiDetailPageError v-else-if="error" entityType="Spell" />

    <!-- Spell Content -->
    <div v-else-if="spell" class="space-y-8">
      <!-- Breadcrumb -->
      <UiBackLink to="/spells" label="Back to Spells" />

      <!-- Header -->
      <UiDetailPageHeader
        :title="spell.name"
        :badges="[
          { label: spellLevelText, color: getSpellLevelColor(spell.level), variant: 'subtle', size: 'lg' },
          { label: spell.school.name, color: getSpellSchoolColor(spell.school.code), variant: 'subtle', size: 'lg' },
          ...(spell.is_ritual ? [{ label: '🔮 Ritual', color: 'info', variant: 'soft', size: 'sm' }] : []),
          ...(spell.needs_concentration ? [{ label: '⭐ Concentration', color: 'warning', variant: 'soft', size: 'sm' }] : [])
        ]"
      />

      <!-- Quick Stats -->
      <UiDetailQuickStatsCard
        :stats="[
          { icon: 'i-heroicons-clock', label: 'Casting Time', value: spell.casting_time },
          { icon: 'i-heroicons-arrow-trending-up', label: 'Range', value: spell.range },
          { icon: 'i-heroicons-sparkles', label: 'Components', value: spell.components, subtext: spell.material_components },
          { icon: 'i-heroicons-clock', label: 'Duration', value: spell.duration }
        ]"
      />

      <!-- Description (Always Visible) -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Description
          </h2>
        </template>
        <div class="prose dark:prose-invert max-w-none">
          <p class="whitespace-pre-line text-base text-gray-700 dark:text-gray-300 leading-relaxed">{{ spell.description }}</p>
        </div>
      </UCard>

      <!-- Additional Details (Accordion) -->
      <UAccordion
        :items="[
          ...(spell.higher_levels ? [{
            label: 'At Higher Levels',
            slot: 'higher-levels',
            defaultOpen: false
          }] : []),
          ...(spellEffects.length > 0 ? [{
            label: 'Effects',
            slot: 'effects',
            defaultOpen: false
          }] : []),
          ...(spell.saving_throws && spell.saving_throws.length > 0 ? [{
            label: 'Saving Throws',
            slot: 'saving-throws',
            defaultOpen: false
          }] : []),
          ...(spell.classes && spell.classes.length > 0 ? [{
            label: 'Available to Classes',
            slot: 'classes',
            defaultOpen: false
          }] : []),
          ...(spell.sources && spell.sources.length > 0 ? [{
            label: 'Source',
            slot: 'source',
            defaultOpen: false
          }] : []),
          ...(spell.random_tables && spell.random_tables.length > 0 ? [{
            label: 'Random Tables',
            slot: 'random-tables',
            defaultOpen: false
          }] : []),
          ...(spell.tags && spell.tags.length > 0 ? [{
            label: 'Tags',
            slot: 'tags',
            defaultOpen: false
          }] : [])
        ]"
        type="multiple"
      >
        <!-- Higher Levels Slot -->
        <template v-if="spell.higher_levels" #higher-levels>
          <div class="p-4">
            <p class="text-gray-700 dark:text-gray-300">{{ spell.higher_levels }}</p>
          </div>
        </template>

        <!-- Effects Slot -->
        <template v-if="spellEffects.length > 0" #effects>
          <UiAccordionDamageEffects :effects="spellEffects" />
        </template>

        <!-- Saving Throws Slot -->
        <template v-if="spell.saving_throws && spell.saving_throws.length > 0" #saving-throws>
          <UiAccordionSavingThrows :saving-throws="spell.saving_throws" />
        </template>

        <!-- Classes Slot -->
        <template v-if="spell.classes && spell.classes.length > 0" #classes>
          <UiAccordionBadgeList :items="spell.classes" color="primary" />
        </template>

        <!-- Random Tables Slot -->
        <template v-if="spell.random_tables && spell.random_tables.length > 0" #random-tables>
          <UiAccordionRandomTablesList :tables="spell.random_tables" />
        </template>

        <!-- Source Slot -->
        <template v-if="spell.sources && spell.sources.length > 0" #source>
          <UiSourceDisplay :sources="spell.sources" />
        </template>

        <!-- Tags Slot -->
        <template v-if="spell.tags && spell.tags.length > 0" #tags>
          <UiTagsDisplay :tags="spell.tags" />
        </template>
      </UAccordion>

      <!-- JSON Debug Panel -->
      <JsonDebugPanel :data="spell" title="Spell Data" />
    </div>
  </div>
</template>
