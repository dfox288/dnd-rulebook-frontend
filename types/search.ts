/**
 * Type definitions for D&D 5e Compendium Search API
 *
 * These types match the backend API response structure from:
 * http://localhost:8080/api/v1/search
 */

export type EntityType = 'spells' | 'items' | 'races' | 'classes' | 'backgrounds' | 'feats'

/**
 * Spell entity from D&D 5e API
 */
export interface Spell {
  id: number
  slug: string
  name: string
  level: number
  casting_time: string
  range: string
  components: string
  material_components: string | null
  duration: string
  needs_concentration: boolean
  is_ritual: boolean
  description: string
  higher_levels: string | null
}

/**
 * Item entity (equipment, magic items, etc.)
 */
export interface Item {
  id: number
  slug: string
  name: string
  item_type_id: number
  rarity: string
  requires_attunement: boolean
  is_magic: boolean
  cost_cp: number | null
  weight: string | null
  description: string
}

/**
 * Race entity (includes subraces)
 */
export interface Race {
  id: number
  slug: string
  name: string
  parent_race_id: number | null
  size_id: number
  speed: number
  description: string
}

/**
 * Character class entity (includes subclasses)
 */
export interface CharacterClass {
  id: number
  slug: string
  name: string
  parent_class_id: number | null
  hit_die: string
  description: string
}

/**
 * Character background entity
 */
export interface Background {
  id: number
  slug: string
  name: string
  description: string
}

/**
 * Feat entity
 */
export interface Feat {
  id: number
  slug: string
  name: string
  description: string
}

/**
 * API response structure from /api/v1/search endpoint
 *
 * The backend returns an object with entity types as keys,
 * each containing an array of matching entities
 */
export interface SearchResult {
  data: {
    spells?: Spell[]
    items?: Item[]
    races?: Race[]
    classes?: CharacterClass[]
    backgrounds?: Background[]
    feats?: Feat[]
  }
}

/**
 * Options for search API calls
 */
export interface SearchOptions {
  /** Filter by specific entity types */
  types?: EntityType[]
  /** Limit results per entity type (for dropdown) */
  limit?: number
}
