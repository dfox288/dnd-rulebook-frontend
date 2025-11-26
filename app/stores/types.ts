export const STORE_KEYS = {
  spells: 'dnd-filters-spells',
  items: 'dnd-filters-items',
  monsters: 'dnd-filters-monsters',
  races: 'dnd-filters-races',
  classes: 'dnd-filters-classes',
  backgrounds: 'dnd-filters-backgrounds',
  feats: 'dnd-filters-feats'
} as const

export type FilterStoreEntityType = keyof typeof STORE_KEYS
