# Handover: Subclass Detail Page Enhancement

**Date:** 2025-11-26
**Session Focus:** Enhance subclass detail pages to show inherited parent class data
**Status:** 🟡 **IN PROGRESS** (~70% complete)

---

## Executive Summary

Implementing enhancement to subclass detail pages (`/classes/[subclass-slug]`) so they display inherited parent class data (hit points, proficiencies, features, progression table) alongside subclass-specific content. The API already provides full `parent_class` data - this work surfaces it in the UI.

---

## What's Been Completed ✅

### 1. UiClassParentImageOverlay Component (TDD)
**Commit:** `644d14d`
**Files:**
- `app/components/ui/class/UiClassParentImageOverlay.vue`
- `tests/components/ui/class/UiClassParentImageOverlay.test.ts` (4 tests passing)

Small thumbnail overlay showing parent class image with "Base Class" label, links to parent class page.

### 2. Subclass Detection Logic
**Commit:** `543c4d8`
**File:** `app/pages/classes/[slug].vue`

Added computed properties:
- `isSubclass` - detects if viewing a subclass
- `parentClass` - gets parent class data
- `parentClassImagePath` - parent image path
- `progressionFeatures` - features from parent for subclasses
- `progressionCounters` - counters from parent for subclasses

### 3. Hierarchical Breadcrumb
**Commit:** `40e3f25`

Subclasses now show: `Classes > Rogue > Assassin` instead of just "Back to Classes"

### 4. Interactive "Subclass of X" Badge
**Commit:** `7e6e34b`

Header now shows a clickable badge: `[Subclass of Rogue →]` linking to parent class.

### 5. Dual Image Display
**Commit:** `08e5c52`

Subclass pages show subclass image with parent class thumbnail overlay in bottom-right corner.

### 6. Inherited Hit Points Card
**Commit:** `99c9640`

Subclasses show hit points card with "Inherited from [Parent]" badge.

### 7. Subclass Features Section
**Commit:** `6b32dd5`

Prominent section showing subclass-specific features (e.g., "Assassin Features (4)").

### 8. Plan Documents
**Commit:** `9a94238`
- `docs/plans/2025-11-26-subclass-detail-page-enhancement-design.md`
- `docs/plans/2025-11-26-subclass-detail-page-implementation.md`

---

## What Remains 🔄

### Task 9: Inherited Progression Table
The progression table currently shows for base classes. Need to update it to:
- Use `progressionFeatures` and `progressionCounters` computed properties
- Add "Inherited from [Parent]" header for subclasses

**Current code to replace:**
```vue
<UiClassProgressionTable
  v-if="entity.is_base_class && baseClassFeatures.length > 0"
  :features="baseClassFeatures"
  :counters="entity.counters || []"
/>
```

**Replace with:** See Task 9 in `docs/plans/2025-11-26-subclass-detail-page-implementation.md`

### Task 10: Inherited Accordion Sections
Update accordion items to show inherited content for subclasses:
- Class Counters (Inherited from X)
- Class Traits (Inherited from X)
- Spell Slot Progression (Inherited from X)
- Starting Equipment (Inherited from X)
- Proficiencies (Inherited from X)
- Base Class Features (Inherited from X)

This requires:
1. Updating `accordionItems` computed to add "(Inherited from X)" labels
2. Creating `accordionData` computed to provide correct data source
3. Updating template slots to use `accordionData`

**See Task 10 in implementation plan for complete code.**

### Task 12-13: Verification & CHANGELOG
- Test all subclass pages (rogue-assassin, fighter-champion, wizard-school-of-evocation, etc.)
- Test base class pages still work (no regression)
- Run full test suite
- Update CHANGELOG.md

---

## Quick Resume Instructions

```bash
# 1. Read the implementation plan
cat docs/plans/2025-11-26-subclass-detail-page-implementation.md

# 2. Continue from Task 9 (progression table)
# The code changes are fully documented in the plan

# 3. After all tasks, verify:
curl -s http://localhost:3000/classes/rogue-assassin -o /dev/null -w "%{http_code}"
docker compose exec nuxt npm run test
docker compose exec nuxt npm run typecheck
```

---

## Git Commits This Session

| Commit | Description |
|--------|-------------|
| `644d14d` | feat: Add UiClassParentImageOverlay component (TDD) |
| `543c4d8` | feat: Add subclass detection computed properties |
| `40e3f25` | feat: Add hierarchical breadcrumb for subclass pages |
| `7e6e34b` | feat: Add interactive 'Subclass of X' badge with link |
| `08e5c52` | feat: Add dual image display with parent class overlay |
| `99c9640` | feat: Show inherited Hit Points Card on subclass pages |
| `6b32dd5` | feat: Add prominent subclass features section |
| `9a94238` | docs: Add subclass detail page design and implementation plan |

---

## Key Files

| File | Purpose |
|------|---------|
| `app/pages/classes/[slug].vue` | Main page being modified |
| `app/components/ui/class/UiClassParentImageOverlay.vue` | New component |
| `tests/components/ui/class/UiClassParentImageOverlay.test.ts` | Component tests |
| `docs/plans/2025-11-26-subclass-detail-page-implementation.md` | Full implementation plan |

---

## Current Page Status

**Working features on subclass pages:**
- ✅ Hierarchical breadcrumb
- ✅ "Subclass of X" badge
- ✅ Dual image display with parent overlay
- ✅ Inherited Hit Points Card
- ✅ Subclass-specific features section
- ❌ Inherited Progression Table (shows for base class only)
- ❌ Inherited Accordion Sections (shows base class data incorrectly)

**Test URL:** http://localhost:3000/classes/rogue-assassin

---

## Design Decisions

1. **Integrated sections approach** - Show inherited data inline with "Inherited from X" badges (not tabs or collapsible)
2. **Dual images** - Subclass image large, parent class thumbnail overlay in corner
3. **Subclass features prominent** - Show subclass-specific features before inherited content
4. **Parent class link everywhere** - Breadcrumb, badge, and image overlay all link to parent

---

**End of Handover**
