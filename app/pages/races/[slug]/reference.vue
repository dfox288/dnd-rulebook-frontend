<script setup lang="ts">
/**
 * Race Detail - Reference View
 *
 * Complete data view with all racial traits expanded,
 * proficiencies, languages, spells, conditions, and source information.
 * Shows both species and subspecies traits with full descriptions.
 */

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const {
  entity,
  pending,
  error,
  isSubrace,
  parentRace,
  speciesTraits,
  subspeciesTraits,
  descriptionTraits,
  abilityScoreIncreases,
  damageResistances,
  proficiencies,
  languages,
  conditions,
  spells,
  senses
} = useRaceDetail(slug)

// Combine all modifiers for accordion display
const allModifiers = computed(() => {
  return [...abilityScoreIncreases.value, ...damageResistances.value]
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <!-- Loading -->
    <UiDetailPageLoading
      v-if="pending"
      entity-type="race"
    />

    <!-- Error -->
    <UiDetailPageError
      v-else-if="error"
      entity-type="Race"
    />

    <!-- Content -->
    <div
      v-else-if="entity"
      class="space-y-8"
    >
      <!-- Shared Header -->
      <RaceDetailHeader
        :entity="entity"
        :is-subrace="isSubrace"
        :parent-race="parentRace"
      />

      <!-- View Navigation -->
      <RaceViewNavigation :slug="slug" />

      <!-- ALL RACIAL TRAITS Section -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          All Racial Traits
        </h2>

        <div class="space-y-6">
          <!-- Species Traits (core racial abilities) -->
          <div
            v-if="speciesTraits.length > 0"
            class="space-y-4"
          >
            <!-- Section Header -->
            <div class="flex items-center gap-3">
              <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Species Traits
              </h3>
              <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            <!-- Traits Display -->
            <div
              v-for="trait in speciesTraits"
              :key="trait.id"
              class="border-l-4 border-race-500 pl-4 py-2 space-y-2"
            >
              <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                {{ trait.name }}
              </h4>
              <div
                v-if="trait.description"
                class="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line"
              >
                {{ trait.description }}
              </div>

              <!-- Data Tables (if any) -->
              <UiAccordionRandomTablesList
                v-if="trait.data_tables && trait.data_tables.length > 0"
                :tables="trait.data_tables"
              />
            </div>
          </div>

          <!-- Subspecies Traits (subrace-specific) -->
          <div
            v-if="subspeciesTraits.length > 0"
            class="space-y-4"
          >
            <!-- Section Header -->
            <div class="flex items-center gap-3">
              <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Subrace Traits
              </h3>
              <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            <!-- Traits Display -->
            <div
              v-for="trait in subspeciesTraits"
              :key="trait.id"
              class="border-l-4 border-race-500 pl-4 py-2 space-y-2"
            >
              <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                {{ trait.name }}
              </h4>
              <div
                v-if="trait.description"
                class="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line"
              >
                {{ trait.description }}
              </div>

              <!-- Data Tables (if any) -->
              <UiAccordionRandomTablesList
                v-if="trait.data_tables && trait.data_tables.length > 0"
                :tables="trait.data_tables"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Accordion Sections -->
      <section>
        <UAccordion
          :items="[
            ...(allModifiers.length > 0 ? [{
              label: 'Modifiers',
              slot: 'modifiers',
              defaultOpen: false
            }] : []),
            ...(proficiencies.length > 0 ? [{
              label: 'Proficiencies',
              slot: 'proficiencies',
              defaultOpen: false
            }] : []),
            ...(languages.length > 0 ? [{
              label: 'Languages',
              slot: 'languages',
              defaultOpen: false
            }] : []),
            ...(spells.length > 0 ? [{
              label: 'Spells',
              slot: 'spells',
              defaultOpen: false
            }] : []),
            ...(senses.length > 0 ? [{
              label: 'Senses',
              slot: 'senses',
              defaultOpen: false
            }] : []),
            ...(conditions.length > 0 ? [{
              label: 'Conditions',
              slot: 'conditions',
              defaultOpen: false
            }] : []),
            ...(descriptionTraits.length > 0 ? [{
              label: 'Lore & Description',
              slot: 'lore',
              defaultOpen: false
            }] : []),
            ...(entity.sources && entity.sources.length > 0 ? [{
              label: 'Source',
              slot: 'source',
              defaultOpen: false
            }] : [])
          ]"
          type="multiple"
        >
          <!-- Modifiers Slot (Ability Scores + Damage Resistances) -->
          <template
            v-if="allModifiers.length > 0"
            #modifiers
          >
            <UiModifiersDisplay :modifiers="allModifiers" />
          </template>

          <!-- Proficiencies Slot -->
          <template
            v-if="proficiencies.length > 0"
            #proficiencies
          >
            <UiAccordionBulletList :items="proficiencies" />
          </template>

          <!-- Languages Slot -->
          <template
            v-if="languages.length > 0"
            #languages
          >
            <UiAccordionBadgeList
              :items="languages"
              color="neutral"
            />
          </template>

          <!-- Spells Slot (Innate Spellcasting) -->
          <template
            v-if="spells.length > 0"
            #spells
          >
            <div class="p-4 space-y-3">
              <div
                v-for="spellRelation in spells"
                :key="spellRelation.id"
                class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                      {{ spellRelation.spell?.name || 'Unknown Spell' }}
                    </h4>
                    <div class="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div v-if="spellRelation.ability_score">
                        Spellcasting ability: {{ spellRelation.ability_score.name }}
                      </div>
                      <div v-if="spellRelation.level_requirement">
                        Unlocked at level {{ spellRelation.level_requirement }}
                      </div>
                      <div v-if="spellRelation.usage_limit">
                        Usage: {{ spellRelation.usage_limit }}
                      </div>
                    </div>
                  </div>
                  <UBadge
                    v-if="spellRelation.is_cantrip"
                    color="spell"
                    variant="soft"
                    size="md"
                  >
                    Cantrip
                  </UBadge>
                </div>
              </div>
            </div>
          </template>

          <!-- Senses Slot -->
          <template
            v-if="senses.length > 0"
            #senses
          >
            <div class="p-4 space-y-3">
              <div
                v-for="sense in senses"
                :key="sense.type"
                class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div class="flex items-start gap-3">
                  <UBadge
                    color="info"
                    variant="soft"
                    size="md"
                  >
                    {{ sense.name }}
                  </UBadge>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Range: {{ sense.range }} ft.
                      <span
                        v-if="sense.is_limited"
                        class="text-gray-500 dark:text-gray-400"
                      >(limited)</span>
                    </div>
                    <div
                      v-if="sense.notes"
                      class="text-sm text-gray-700 dark:text-gray-300 mt-1"
                    >
                      {{ sense.notes }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Conditions Slot -->
          <template
            v-if="conditions.length > 0"
            #conditions
          >
            <UiAccordionConditions
              :conditions="conditions"
              entity-type="race"
            />
          </template>

          <!-- Lore & Description Slot -->
          <template
            v-if="descriptionTraits.length > 0"
            #lore
          >
            <UiAccordionTraitsList :traits="descriptionTraits" />
          </template>

          <!-- Source Slot -->
          <template
            v-if="entity.sources && entity.sources.length > 0"
            #source
          >
            <UiSourceDisplay :sources="entity.sources" />
          </template>
        </UAccordion>
      </section>

      <!-- Debug Panel -->
      <JsonDebugPanel
        :data="entity"
        title="Race Data"
      />
    </div>
  </div>
</template>
