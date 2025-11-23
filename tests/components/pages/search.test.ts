import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

// Tests to verify search.vue has monster support
describe('Search Page - Monster Filter Support', () => {
  it('should include Monsters in filterOptions', () => {
    // Read the actual search.vue file
    const searchPagePath = join(process.cwd(), 'app/pages/search.vue')
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    // Check if Monsters filter is in the filterOptions
    // Look for the line: { label: `Monsters (${getCount('monsters')})`, value: 'monsters', disabled: getCount('monsters') === 0 }
    const hasMonsterFilter = searchPageContent.includes('Monsters (') && searchPageContent.includes("value: 'monsters'")

    expect(hasMonsterFilter).toBe(true)
  })

  it('should include monster in getFilterColor mapping', () => {
    // Read the actual search.vue file
    const searchPagePath = join(process.cwd(), 'app/pages/search.vue')
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    // Check if monsters: 'monster' is in the entityColors mapping
    const hasMonsterColor = searchPageContent.includes("monsters: 'monster'")

    expect(hasMonsterColor).toBe(true)
  })
})

describe('Search Page - Specialized Card Rendering', () => {
  const searchPagePath = join(process.cwd(), 'app/pages/search.vue')

  it('imports SpellCard component', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const hasSpellCardImport = searchPageContent.includes("import SpellCard from '~/components/spell/SpellCard.vue'")
    expect(hasSpellCardImport).toBe(true)
  })

  it('imports ItemCard component', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const hasItemCardImport = searchPageContent.includes("import ItemCard from '~/components/item/ItemCard.vue'")
    expect(hasItemCardImport).toBe(true)
  })

  it('imports RaceCard component', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const hasRaceCardImport = searchPageContent.includes("import RaceCard from '~/components/race/RaceCard.vue'")
    expect(hasRaceCardImport).toBe(true)
  })

  it('imports ClassCard component', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const hasClassCardImport = searchPageContent.includes("import ClassCard from '~/components/class/ClassCard.vue'")
    expect(hasClassCardImport).toBe(true)
  })

  it('imports BackgroundCard component', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const hasBackgroundCardImport = searchPageContent.includes("import BackgroundCard from '~/components/background/BackgroundCard.vue'")
    expect(hasBackgroundCardImport).toBe(true)
  })

  it('imports FeatCard component', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const hasFeatCardImport = searchPageContent.includes("import FeatCard from '~/components/feat/FeatCard.vue'")
    expect(hasFeatCardImport).toBe(true)
  })

  it('imports MonsterCard component', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const hasMonsterCardImport = searchPageContent.includes("import MonsterCard from '~/components/monster/MonsterCard.vue'")
    expect(hasMonsterCardImport).toBe(true)
  })

  it('uses SpellCard for spell results', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const usesSpellCard = searchPageContent.includes('<SpellCard') &&
                         searchPageContent.includes(':spell="spell"')
    expect(usesSpellCard).toBe(true)
  })

  it('uses ItemCard for item results', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const usesItemCard = searchPageContent.includes('<ItemCard') &&
                        searchPageContent.includes(':item="item"')
    expect(usesItemCard).toBe(true)
  })

  it('uses MonsterCard for monster results', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const usesMonsterCard = searchPageContent.includes('<MonsterCard') &&
                           searchPageContent.includes(':monster="monster"')
    expect(usesMonsterCard).toBe(true)
  })

  it('does not use SearchResultCard component', () => {
    const searchPageContent = readFileSync(searchPagePath, 'utf-8')

    const usesSearchResultCard = searchPageContent.includes('<SearchResultCard')
    expect(usesSearchResultCard).toBe(false)
  })
})
