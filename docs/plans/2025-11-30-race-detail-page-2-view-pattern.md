# Race Detail Page 2-View Pattern

**GitHub Issue:** [#2 - Apply 3-view pattern to Race detail page](https://github.com/dfox288/dnd-rulebook-project/issues/2)
**Created:** 2025-11-30
**Status:** Planning

---

## D&D Nerd Analysis: Ideal Race Detail Page

### What a D&D Player Needs from a Race Page

When choosing a race, players care about:

1. **Quick Decision Data** (at-a-glance)
   - Size & Speed (combat positioning)
   - Ability Score Increases (build optimization)
   - Senses (darkvision = dungeon utility)

2. **Character Identity** (roleplay & story)
   - Description/Lore (who are these people?)
   - Languages (communication & secrets)
   - Subraces (regional/cultural variants)

3. **Mechanical Benefits** (the crunch)
   - Racial Traits (features, abilities)
   - Proficiencies (weapons, armor, tools, skills)
   - Spells (innate magic like Drow, Tiefling)
   - Condition Immunities/Resistances (defensive bonuses)

---

## Class 3-View Pattern Analysis

| View | Purpose | Races Equivalent? |
|------|---------|-------------------|
| **Overview** | Quick combat stats, resources, subclass gallery | ✅ **Yes** - Quick stats, ASIs, subrace gallery |
| **Journey** | Level 1-20 progression timeline | ❌ **No** - Races don't progress by level |
| **Reference** | Complete data dump, all features expanded | ✅ **Yes** - All traits, full descriptions |

### Conclusion: Races Need a **2-View Pattern**

Classes have a *progression* structure (level 1-20), while Races have a *static* structure (all traits available at character creation). This fundamental difference means the "Journey" view doesn't make sense for races - you don't "progress" through racial traits.

---

## Reusable Components from Classes

| Component | Classes Usage | Races Usage |
|-----------|---------------|-------------|
| `DetailHeader` | Name, badges, parent link | ✅ Same pattern (subrace of parent) |
| `ViewNavigation` | Overview/Journey/Reference tabs | ✅ Overview/Reference tabs (2 views) |
| `SubclassCards` / `SubraceCards` | Gallery of subclasses | ✅ Gallery of subraces |
| `QuickStatsCard` | HP, saving throws, armor/weapons | ✅ Size, Speed, Senses |
| `DescriptionCard` | Class lore | ✅ Race description |
| `AccordionTraitsList` | Class features | ✅ Racial traits |
| `AccordionBulletList` | Proficiencies, equipment | ✅ Proficiencies |
| `AccordionBadgeList` | - | ✅ Languages, Spells |
| `AccordionConditions` | - | ✅ Condition immunities |
| `SourceDisplay` | Source books | ✅ Source books |
| `ProgressionTable` | Level 1-20 table | ❌ Not applicable |
| `Timeline/LevelNode` | Journey view | ❌ Not applicable |
| `CombatBasicsGrid` | HP, saves, proficiencies | ⚠️ Could adapt for races |
| `ResourcesCard` | Ki, Rage, etc. | ❌ Not applicable |

---

## Race-Specific Components Needed

| Component | Purpose |
|-----------|---------|
| `RaceDetailHeader` | Shared header with size badge, parent race link |
| `RaceViewNavigation` | 2-tab navigation (Overview / Reference) |
| `RaceOverviewAbilityScores` | Prominent ASI display (the most important info!) |
| `RaceOverviewSenses` | Darkvision/Blindsight display with range |
| `RaceOverviewTraitsPreview` | Top 3-5 traits with "see all" link |
| `RaceSubraceCards` | Gallery cards for subraces (reuse `UiClassSubclassCards` pattern) |

---

## Proposed Race 2-View Architecture

### Overview View (`/races/[slug]`)

```
┌─────────────────────────────────────────────────┐
│ [Breadcrumb: Races > Elf > High Elf]            │
├─────────────────────────────────────────────────┤
│ HIGH ELF                        [Medium] [Subrace]│
│ Subrace of Elf                                  │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────┐  ┌────────────────────┐ │
│ │ ABILITY SCORES      │  │ [Image]            │ │
│ │ DEX +2  INT +1      │  │                    │ │
│ ├─────────────────────┤  │                    │ │
│ │ Speed: 30 ft.       │  │                    │ │
│ │ Darkvision: 60 ft.  │  └────────────────────┘ │
│ └─────────────────────┘                         │
├─────────────────────────────────────────────────┤
│ [OVERVIEW]  [REFERENCE]                         │
├─────────────────────────────────────────────────┤
│ ┌─── Description ───────────────────────────┐   │
│ │ High elves are graceful and intelligent...│   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ KEY TRAITS                                      │
│ • Fey Ancestry - Advantage on charm saves      │
│ • Trance - 4 hours instead of 8 hours sleep    │
│ • Cantrip - Learn one wizard cantrip           │
│ [View all 5 traits →]                          │
├─────────────────────────────────────────────────┤
│ LANGUAGES                                       │
│ [Common] [Elvish] [+1 of choice]               │
├─────────────────────────────────────────────────┤
│ SUBRACES (if base race)                        │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │High Elf │ │Wood Elf │ │Dark Elf │            │
│ └─────────┘ └─────────┘ └─────────┘            │
└─────────────────────────────────────────────────┘
```

### Reference View (`/races/[slug]/reference`)

```
┌─────────────────────────────────────────────────┐
│ [Same header]                                   │
│ [OVERVIEW]  [REFERENCE] ← active                │
├─────────────────────────────────────────────────┤
│ ALL RACIAL TRAITS                               │
│ ───────────────────────────────────────────────│
│ Fey Ancestry                                    │
│   You have advantage on saving throws against   │
│   being charmed, and magic can't put you to     │
│   sleep.                                        │
│ ───────────────────────────────────────────────│
│ Trance                                          │
│   Elves do not sleep. Instead they meditate... │
│ ───────────────────────────────────────────────│
│ [etc - all traits fully expanded]               │
├─────────────────────────────────────────────────┤
│ [Accordion: Proficiencies]                      │
│ [Accordion: Spells]                             │
│ [Accordion: Condition Immunities]               │
│ [Accordion: Source]                             │
└─────────────────────────────────────────────────┘
```

---

## Implementation Checklist

### New Files to Create

- [ ] `app/pages/races/[slug]/index.vue` (Overview)
- [ ] `app/pages/races/[slug]/reference.vue` (Reference)
- [ ] `app/composables/useRaceDetail.ts` (shared data)
- [ ] `app/components/race/DetailHeader.vue`
- [ ] `app/components/race/ViewNavigation.vue`
- [ ] `app/components/race/overview/AbilityScoresCard.vue`
- [ ] `app/components/race/overview/SensesCard.vue`
- [ ] `app/components/race/overview/TraitsPreview.vue`
- [ ] `app/components/race/overview/LanguagesCard.vue`

### Files to Refactor

- [ ] Move current `app/pages/races/[slug].vue` → `[slug]/index.vue`
- [ ] Extract reusable `UiSubraceCards` from classes pattern

### Can Reuse As-Is

- `UiDetailPageHeader`
- `UiDetailQuickStatsCard`
- `UiDetailDescriptionCard`
- `UiDetailEntityImage`
- `UiDetailBreadcrumb`
- `UiAccordionTraitsList`
- `UiAccordionBadgeList`
- `UiAccordionBulletList`
- `UiAccordionConditions`
- `UiSourceDisplay`

---

## Key Differences from Classes

| Aspect | Classes | Races |
|--------|---------|-------|
| Views | 3 (Overview/Journey/Reference) | 2 (Overview/Reference) |
| Progression | Level 1-20 | Static (creation only) |
| Primary stat | Hit Die + Saving Throws | Ability Score Increases |
| Resources | Ki, Rage, Spell Slots | None |
| Spellcasting | Class feature | Innate (racial spells) |
| Subentities | Subclasses (choose later) | Subraces (choose at creation) |
| Senses | N/A | Darkvision, Blindsight, etc. |

---

## Implementation Order

1. **Phase 1: Foundation**
   - Create `useRaceDetail.ts` composable (following `useClassDetail.ts` pattern)
   - Create shared components (`RaceDetailHeader`, `RaceViewNavigation`)

2. **Phase 2: Overview View**
   - Convert current `[slug].vue` to `[slug]/index.vue`
   - Add ability scores card
   - Add senses display
   - Add traits preview
   - Add subrace gallery

3. **Phase 3: Reference View**
   - Create `[slug]/reference.vue`
   - Full traits expansion
   - All accordion sections

4. **Phase 4: Polish**
   - Ensure subrace → parent race navigation works
   - Test all race types (base races, subraces)
   - Mobile responsiveness
   - Write tests

---

## API Data Available (RaceResource)

```typescript
RaceResource: {
  id: number;
  slug: string;
  name: string;
  size?: SizeResource;
  speed: number;
  is_subrace: string;
  traits?: TraitResource[];
  modifiers?: ModifierResource[];
  sources?: EntitySourceResource[];
  parent_race?: RaceResource;
  subraces?: RaceResource[];
  proficiencies?: ProficiencyResource[];
  languages?: EntityLanguageResource[];
  conditions?: EntityConditionResource[];
  spells?: EntitySpellResource[];
  senses?: EntitySenseResource[];  // NEW - from recent API sync
  tags?: TagResource[];
}
```

---

## Notes

- The "Journey" view is intentionally omitted because races don't have level progression
- Senses field was recently added to API (issue #39 covers displaying it)
- Consider linking racial spells to the spells page
- Subraces should inherit and display parent race traits where appropriate
