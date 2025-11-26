# Test Helpers

Reusable test utilities that reduce boilerplate and ensure consistent test patterns across the codebase.

## Available Helpers

### `storeSetup.ts` - Pinia Store Setup

```typescript
import { usePiniaSetup, createTestStore } from './storeSetup'

// In describe block - sets up fresh Pinia before each test
describe('MyStore', () => {
  usePiniaSetup()
  // ...
})

// One-off store creation
const store = createTestStore(useMyStore)
```

### `mockFactories.ts` - Entity Mock Data

```typescript
import { createMockSpell, createMockItem, createMockMonster } from './mockFactories'

// Use defaults
const spell = createMockSpell()

// Override specific fields
const cantrip = createMockSpell({ level: 0, name: 'Fire Bolt' })
const magicSword = createMockItem({ is_magic: true, rarity: 'legendary' })
```

**Available factories:**
- `createMockSpell()` - Default: Fireball (Level 3 Evocation)
- `createMockItem()` - Default: Longsword (Martial Weapon)
- `createMockMonster()` - Default: Ancient Red Dragon (CR 24)
- `createMockClass()` - Default: Wizard (d6, INT caster)
- `createMockRace()` - Default: Elf (Medium, 30ft speed)
- `createMockBackground()` - Default: Acolyte
- `createMockFeat()` - Default: War Caster

### `filterStoreBehavior.ts` - Filter Store Test Generators

```typescript
import { testHasActiveFilters, testClearAllAction } from './filterStoreBehavior'

describe('useSpellFiltersStore', () => {
  usePiniaSetup()

  testHasActiveFilters(useSpellFiltersStore, [
    { field: 'searchQuery', value: 'fireball' },
    { field: 'selectedLevels', value: ['3'] },
  ])

  testClearAllAction(useSpellFiltersStore, {
    setFilters: (store) => { store.searchQuery = 'test' },
    expectedDefaults: { searchQuery: '' },
    preservedFields: [{ field: 'filtersOpen', value: true }]
  })
})
```

**Available generators:**
- `testInitialState()` - Tests default store values
- `testHasActiveFilters()` - Tests hasActiveFilters getter
- `testActiveFilterCount()` - Tests activeFilterCount getter
- `testClearAllAction()` - Tests clearAll action
- `testSetFromUrlQuery()` - Tests URL query parsing
- `testToUrlQuery()` - Tests URL query generation

### `filterChipBehavior.ts` - Filter Chip Test Generators

```typescript
import { testFilterChipBehavior } from './filterChipBehavior'

testFilterChipBehavior({
  name: 'Alignment',
  mountPage: () => mountSuspended(MonstersPage),
  testId: 'alignment-filter-chip',
  storeField: 'selectedAlignments',
  singleValue: ['Lawful Good'],
  multipleValues: ['Lawful Good', 'Chaotic Evil'],
  expectedSingleText: 'Alignment',
  expectedMultipleText: 'Alignments'
})
```

### `cardBehavior.ts` - Card Component Test Helpers

```typescript
import { testCardLinkBehavior, testCardHoverEffects } from './cardBehavior'

testCardLinkBehavior(mountCard, '/spells/fireball')
testCardHoverEffects(mountCard)
testCardBorderStyling(mountCard)
```

### `descriptionBehavior.ts` - Description Truncation Tests

```typescript
import { testDescriptionTruncation } from './descriptionBehavior'

testDescriptionTruncation(mountLongDescription, mountShortDescription)
```

### `sourceBehavior.ts` - Source Footer Tests

```typescript
import { testSourceFooter, testOptionalSourceFooter } from './sourceBehavior'

testSourceFooter(mountCard, 'Player\'s Handbook')
testOptionalSourceFooter(mountCardWithoutSource, 'Fireball')
```

## Benefits

- **~500 lines saved** across store tests
- **~300 lines saved** in mock data
- **Consistent patterns** across all entity tests
- **Declarative configs** instead of imperative test code
- **Easy to extend** - adding new filters is one config line
