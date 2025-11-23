import { describe, it, expect } from 'vitest'
import type { SearchResultData, EntityType } from '~/types/search'

describe('Search Types', () => {
  it('supports monsters in SearchResultData', () => {
    const mockData: SearchResultData = {
      spells: [],
      items: [],
      races: [],
      classes: [],
      backgrounds: [],
      feats: [],
      monsters: [] // Should not cause TypeScript error
    }

    expect(mockData.monsters).toBeDefined()
  })

  it('includes monsters in EntityType', () => {
    const entityTypes: EntityType[] = [
      'spells',
      'items',
      'races',
      'classes',
      'backgrounds',
      'feats',
      'monsters' // Should not cause TypeScript error
    ]

    expect(entityTypes).toContain('monsters')
  })
})
