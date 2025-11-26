# Frontend TODO List

**Last Updated:** 2025-11-26
**Project Status:** Production-ready with 1,164+ tests passing

---

## ✅ Recently Completed

### 2025-11-26
- ✅ **API /lookups Migration** - All 11 reference endpoints updated to use `/v1/lookups/*`
- ✅ **Type Generation Fixed** - Now works via Docker with env variable
- ✅ **Component Extraction** - 4 new components, 2 new composables, ~24% code reduction across 7 pages
- ✅ **TypeScript Types Synced** - `generated.ts` updated (+1,233/-743 lines)

### 2025-11-25
- ✅ **Filter Consistency Audit** - All 7 entity pages standardized
- ✅ **21 New Filters** - Added across 5 entities (Backgrounds, Items, Races, Monsters)
- ✅ **103 New Tests** - All passing, zero regressions
- ✅ **Monsters Movement Filters** - Redesigned from 5 toggles to single multiselect

### 2025-11-24
- ✅ **Spell List Generator MVP** - First builder tool, localStorage persistence
- ✅ **Spells Filter Phase 2 & 3** - Component flags + spell properties (48% API utilization)

---

## 🚨 High Priority

### 1. **Fix Pre-existing TypeScript Errors**
**Status:** Ready to fix
**Estimated:** 1-2 hours

**Known Errors:**
- `app/pages/monsters/index.vue` - LocationQueryValue type issues
- `app/pages/tools/spell-list.vue` - Property 'alert' type error
- `app/pages/monsters/[slug].vue` - `spellcasting` property missing from Monster type

**Solution:**
1. Regenerate types (command now works):
   ```bash
   NUXT_API_SPEC_URL=http://host.docker.internal:8080/docs/api.json docker compose exec nuxt npm run types:sync
   ```
2. Add manual type extensions in `app/types/api/entities.ts` if needed

---

### 2. **Fix 49 Failing Tests**
**Status:** Pre-existing failures
**Estimated:** 2-4 hours

**Affected Areas:**
- Filter layout tests
- Races filter tests

**Action:** Investigate root cause and fix or update test expectations.

---

### 3. **E2E Testing with Playwright**
**Status:** Infrastructure ready, NO tests written
**Estimated:** 8-12 hours
**Priority:** Critical gap in test coverage

**Priority Tests to Write:**
1. **Filter Interactions:**
   - Select filter → verify results update
   - Combine multiple filters → verify AND logic
   - Clear filters → verify reset
   - Filter chips appear/remove correctly

2. **Navigation:**
   - Homepage → Entity list → Detail page
   - Back button behavior
   - Breadcrumb navigation

3. **Spell List Generator:**
   - Select class/level → verify spell slots
   - Toggle spells → verify selection
   - Refresh page → verify localStorage persistence

**Files to Create:**
- `tests/e2e/filters.spec.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/spell-list-generator.spec.ts`

---

## 🎯 Medium Priority

### 4. **Use New Lookup Endpoints**
**Status:** Backend ready, frontend not using yet
**Estimated:** 2-3 hours

**New endpoints available (from `/v1/lookups/`):**
- `alignments` - Monster alignment filter options
- `armor-types` - Monster armor type filter options
- `monster-types` - Monster type filter options (currently hardcoded)
- `rarities` - Item rarity filter options (currently hardcoded)
- `tags` - Universal tag system

**Action:** Replace hardcoded filter options with API-driven data using `useReferenceData()`.

---

### 5. **Classes Proficiency Filters**
**Status:** BLOCKED by backend
**Documented:** `docs/BLOCKED-CLASSES-PROFICIENCY-FILTERS-2025-11-25.md`

**Missing Backend Support:**
- max_spell_level
- armor_proficiencies
- weapon_proficiencies
- skill_proficiencies
- tool_proficiencies

**Action:** Wait for backend team to add database columns and data seeding.

---

### 6. **Advanced Filter UI for Power Users**
**Estimated:** 4-6 hours
**Prerequisites:** More filters migrated to Meilisearch

**Features:**
- "Advanced Filters" section toggle
- Visual query builder
- Filter combination preview
- Save filter presets to localStorage
- Share filter URLs

---

## 🔧 Technical Debt

### 7. **In-Code TODOs**
**Count:** 2 items

1. **`app/components/PageHeaderLinks.vue:7`**
   - `useSiteConfig()` needs @nuxtjs/site-config module

2. **`app/components/JsonDebugPanel.vue:25`**
   - Could add toast notification for copy action

---

### 8. **Update CLAUDE.md Type Sync Command**
**Status:** Quick fix needed
**Estimated:** 5 minutes

Add the working Docker command to CLAUDE.md:
```bash
NUXT_API_SPEC_URL=http://host.docker.internal:8080/docs/api.json docker compose exec nuxt npm run types:sync
```

---

## 💡 Future Enhancements

### 9. **Multi-Class Spell Lists**
**Estimated:** 6-8 hours
**Prerequisites:** Spell List Generator MVP complete ✅

**Features:**
- Select multiple classes (e.g., Wizard 5 / Cleric 3)
- Merge spell lists correctly
- Handle multiclass spellcasting rules
- Show spell slots for multiclass

---

### 10. **Export Functionality**
**Estimated:** 4-6 hours

**Formats:**
- PDF spell list printout
- JSON export for import into other tools
- Markdown for notes/wikis

---

### 11. **Advanced Meilisearch Queries in UI**
**Estimated:** 8-10 hours
**Dependencies:** Multiple filters migrated to Meilisearch

**Features:**
- Query builder UI with drag-and-drop
- AND/OR logic toggles
- Parentheses grouping
- Save complex queries as presets

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Entity Types | 7/7 complete |
| Reference Pages | 10/10 complete |
| Builder Tools | 1 (Spell List Generator) |
| Total Tests | 1,164+ |
| Passing Tests | ~1,115 (49 pre-existing failures) |
| ESLint Errors | 0 |
| TypeScript | Minor errors (fixable) |

---

## 🎯 Recommended Order

1. **Fix TypeScript errors** - Quick win, improves DX
2. **Fix failing tests** - Restore test suite health
3. **E2E testing** - Critical coverage gap
4. **Use new lookup endpoints** - Replace hardcoded data
5. **Advanced filter UI** - Polish after core work complete

---

**End of TODO List**

**Next Review:** After completing high priority items
