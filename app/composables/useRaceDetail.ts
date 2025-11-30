import type { Race } from '~/types/api/entities'
import type { components } from '~/types/api/generated'

type TraitResource = components['schemas']['TraitResource']
type ModifierResource = components['schemas']['ModifierResource']
type ProficiencyResource = components['schemas']['ProficiencyResource']
type EntityLanguageResource = components['schemas']['EntityLanguageResource']
type EntitySenseResource = components['schemas']['EntitySenseResource']
type EntitySpellResource = components['schemas']['EntitySpellResource']
type EntityConditionResource = components['schemas']['EntityConditionResource']

/**
 * Composable for race detail pages.
 *
 * Provides shared data fetching and computed helpers for both race detail views
 * (Overview, Reference). Data is cached across view navigation.
 *
 * @example
 * ```typescript
 * const slug = computed(() => route.params.slug as string)
 * const {
 *   entity,
 *   pending,
 *   error,
 *   isSubrace,
 *   parentRace,
 *   abilityScoreIncreases,
 *   speciesTraits,
 *   // ... more
 * } = useRaceDetail(slug)
 * ```
 */
export function useRaceDetail(slug: Ref<string>) {
  const { apiFetch } = useApi()

  // Fetch race data with caching across all views
  const { data: response, pending, error, refresh } = useAsyncData(
    `race-detail-${slug.value}`,
    async () => {
      const result = await apiFetch<{ data: Race }>(`/races/${slug.value}`)
      return result?.data || null
    },
    { watch: [slug] }
  )

  // Main entity accessor
  const entity = computed(() => response.value as Race | null)

  // ─────────────────────────────────────────────────────────────────────────────
  // Basic computed properties
  // ─────────────────────────────────────────────────────────────────────────────

  const isSubrace = computed(() => entity.value?.is_subrace ?? false)
  const parentRace = computed(() => entity.value?.parent_race ?? null)
  const inheritedData = computed(() => isSubrace.value ? entity.value?.inherited_data : null)

  // ─────────────────────────────────────────────────────────────────────────────
  // Modifiers (ability scores and damage resistances)
  // ─────────────────────────────────────────────────────────────────────────────

  const abilityScoreIncreases = computed<ModifierResource[]>(() => {
    const modifiers = entity.value?.modifiers ?? []
    return modifiers.filter(m => m.modifier_category === 'ability_score')
  })

  const damageResistances = computed<ModifierResource[]>(() => {
    const modifiers = entity.value?.modifiers ?? []
    return modifiers.filter(m => m.modifier_category === 'damage_resistance')
  })

  // ─────────────────────────────────────────────────────────────────────────────
  // Traits (filtered by category)
  // ─────────────────────────────────────────────────────────────────────────────

  const traits = computed<TraitResource[]>(() => entity.value?.traits ?? [])

  const speciesTraits = computed<TraitResource[]>(() =>
    traits.value.filter(t => t.category === 'species')
  )

  const subspeciesTraits = computed<TraitResource[]>(() =>
    traits.value.filter(t => t.category === 'subspecies')
  )

  const descriptionTraits = computed<TraitResource[]>(() =>
    traits.value.filter(t => t.category === 'description')
  )

  const mechanicalTraits = computed<TraitResource[]>(() =>
    traits.value.filter(t => t.category === null)
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // Proficiencies, Languages, Conditions
  // ─────────────────────────────────────────────────────────────────────────────

  const proficiencies = computed<ProficiencyResource[]>(() =>
    entity.value?.proficiencies ?? []
  )

  const languages = computed<EntityLanguageResource[]>(() =>
    entity.value?.languages ?? []
  )

  const conditions = computed<EntityConditionResource[]>(() =>
    entity.value?.conditions ?? []
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // Senses and Spells
  // ─────────────────────────────────────────────────────────────────────────────

  const senses = computed<EntitySenseResource[]>(() =>
    entity.value?.senses ?? []
  )

  const spells = computed<EntitySpellResource[]>(() =>
    entity.value?.spells ?? []
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // Subraces (only for base races)
  // ─────────────────────────────────────────────────────────────────────────────

  const subraces = computed(() => entity.value?.subraces ?? [])

  // ─────────────────────────────────────────────────────────────────────────────
  // SEO
  // ─────────────────────────────────────────────────────────────────────────────

  useSeoMeta({
    title: computed(() =>
      entity.value?.name
        ? `${entity.value.name} - D&D 5e Race`
        : 'Race - D&D 5e Compendium'
    ),
    description: computed(() =>
      entity.value?.description?.substring(0, 160) ?? ''
    )
  })

  useHead({
    title: computed(() =>
      entity.value?.name
        ? `${entity.value.name} - D&D 5e Race`
        : 'Race - D&D 5e Compendium'
    )
  })

  return {
    // Core
    entity,
    pending,
    error,
    refresh,

    // Identity
    isSubrace,
    parentRace,
    inheritedData,

    // Modifiers
    abilityScoreIncreases,
    damageResistances,

    // Traits
    traits,
    speciesTraits,
    subspeciesTraits,
    descriptionTraits,
    mechanicalTraits,

    // Proficiencies & Languages
    proficiencies,
    languages,
    conditions,

    // Senses & Spells
    senses,
    spells,

    // Subraces
    subraces
  }
}
