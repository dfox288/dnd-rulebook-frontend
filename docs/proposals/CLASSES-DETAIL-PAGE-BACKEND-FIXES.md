# Classes Detail Page: Backend Data Fixes Proposal

**Date**: 2025-11-26
**Author**: Claude (API Verification Audit)
**Status**: Proposed
**Priority**: High

---

## Executive Summary

A comprehensive audit of the Classes detail page API responses revealed several data consistency issues, structural problems, and missing fields that impact the frontend display and D&D 5e rules accuracy. This proposal outlines required backend changes to fix these issues.

### Impact Summary

| Priority | Issues | Effort |
|----------|--------|--------|
| Critical | 3 | Low-Medium |
| High | 4 | Medium |
| Medium | 5 | Medium-High |
| Low | 3 | Low |

---

## Table of Contents

1. [Critical Issues](#1-critical-issues)
   - 1.1 [Subclass hit_die: 0 Bug](#11-subclass-hit_die-0-bug)
   - 1.2 [Subclass Description Placeholder](#12-subclass-description-placeholder)
   - 1.3 [Arcane Recovery Level Incorrect](#13-arcane-recovery-level-incorrect)
2. [High Priority Issues](#2-high-priority-issues)
   - 2.1 [Choice Options as Separate Features](#21-choice-options-as-separate-features)
   - 2.2 [Multiclass Rules Mixed with Core Features](#22-multiclass-rules-mixed-with-core-features)
   - 2.3 [Feature Count Inflation](#23-feature-count-inflation)
   - 2.4 [Progression Table Feature List Cluttered](#24-progression-table-feature-list-cluttered)
3. [Medium Priority Issues](#3-medium-priority-issues)
   - 3.1 [Missing Subclass Entry Level](#31-missing-subclass-entry-level)
   - 3.2 [Counters Not Consolidated](#32-counters-not-consolidated)
   - 3.3 [Irrelevant Progression Columns](#33-irrelevant-progression-columns)
   - 3.4 [Higher Levels Description Incorrect](#34-higher-levels-description-incorrect)
   - 3.5 [Duplicate Description Content](#35-duplicate-description-content)
4. [Low Priority Issues](#4-low-priority-issues)
5. [Implementation Recommendations](#5-implementation-recommendations)
6. [Appendix: Affected Classes/Subclasses](#6-appendix-affected-classessubclasses)

---

## 1. Critical Issues

### 1.1 Subclass hit_die: 0 Bug

**Severity**: Critical
**Affected Endpoints**: `GET /api/v1/classes/{slug}` (subclass responses)

#### Problem

Some subclasses return `hit_die: 0` instead of inheriting from their parent class:

```json
// GET /api/v1/classes/cleric-death-domain
{
  "data": {
    "name": "Death Domain",
    "hit_die": 0,  // ❌ Should be 8 (Cleric's hit die)
    "parent_class_id": 23,
    "computed": {
      "hit_points": null  // ❌ Can't compute without valid hit_die
    }
  }
}
```

#### D&D 5e Rules Reference

> "Your hit points are determined by your Hit Dice. At 1st level, you have 1 Hit Die, and the die type is determined by your class." - PHB p. 12

Subclasses do not have their own hit dice; they use their parent class's hit die.

#### Affected Subclasses

| Subclass | Current hit_die | Parent | Expected |
|----------|-----------------|--------|----------|
| Cleric - Death Domain | 0 | Cleric | 8 |
| Paladin - Oathbreaker | 0 | Paladin | 10 |
| *(potentially others)* | 0 | - | - |

#### Required Fix

**Option A (Preferred)**: Always inherit `hit_die` from parent class during import/save

```php
// In CharacterClass model or ClassResource
public function getHitDieAttribute(): int
{
    if (!$this->is_base_class && $this->hit_die === 0) {
        return $this->parentClass?->hit_die ?? $this->hit_die;
    }
    return $this->hit_die;
}
```

**Option B**: Fix at database level

```sql
UPDATE character_classes
SET hit_die = (
    SELECT parent.hit_die
    FROM character_classes parent
    WHERE parent.id = character_classes.parent_class_id
)
WHERE is_base_class = false AND hit_die = 0;
```

#### Acceptance Criteria

- [ ] All subclasses return non-zero `hit_die` matching parent class
- [ ] `computed.hit_points` is populated for all subclasses
- [ ] `computed.hit_points.higher_levels.description` uses correct hit die

---

### 1.2 Subclass Description Placeholder

**Severity**: Critical
**Affected Endpoints**: `GET /api/v1/classes/{slug}` (subclass responses)

#### Problem

All subclass descriptions are generic placeholders instead of actual content:

```json
// GET /api/v1/classes/wizard-school-of-abjuration
{
  "data": {
    "name": "School of Abjuration",
    "description": "Subclass of Wizard"  // ❌ Not useful
  }
}
```

The actual descriptive content exists in the first feature:

```json
{
  "features": [
    {
      "feature_name": "Arcane Tradition: School of Abjuration",
      "description": "The School of Abjuration emphasizes magic that blocks, banishes, or protects..."  // ✅ This is the real description
    }
  ]
}
```

#### D&D 5e Rules Reference

Each subclass in the PHB has an introductory paragraph explaining its theme and flavor. For School of Abjuration (PHB p. 115):

> "The School of Abjuration emphasizes magic that blocks, banishes, or protects. Detractors of this school say that its tradition is about denial, negation rather than positive assertion..."

#### Required Fix

**Option A (Import-time)**: Extract description from first feature during import

```php
// During class/subclass import
if (!$class->is_base_class) {
    $introFeature = $class->features()
        ->where('feature_name', 'LIKE', '%: ' . $class->name)
        ->orWhere('level', $class->getSubclassLevel())
        ->orderBy('sort_order')
        ->first();

    if ($introFeature && str_starts_with($introFeature->description, 'The ')) {
        // Extract first paragraph as description
        $class->description = $this->extractFirstParagraph($introFeature->description);
    }
}
```

**Option B (Resource-level)**: Generate description dynamically in API response

```php
// In ClassResource
public function toArray($request): array
{
    return [
        'description' => $this->getEffectiveDescription(),
        // ...
    ];
}

protected function getEffectiveDescription(): string
{
    if ($this->is_base_class || $this->description !== "Subclass of {$this->parentClass->name}") {
        return $this->description;
    }

    // Find intro feature and extract description
    $introFeature = $this->features->first();
    if ($introFeature) {
        return $this->extractFirstParagraph($introFeature->description);
    }

    return $this->description;
}
```

#### Acceptance Criteria

- [ ] Subclass `description` contains thematic flavor text
- [ ] Description is 1-3 paragraphs (not the full feature text with Source reference)
- [ ] Placeholder "Subclass of X" is replaced for all subclasses

---

### 1.3 Arcane Recovery Level Incorrect

**Severity**: Critical
**Affected Endpoints**: `GET /api/v1/classes/wizard`

#### Problem

The Arcane Recovery feature is listed at level 6, but per PHB it's a level 1 feature:

```json
{
  "features": [
    {
      "id": 1074,
      "level": 6,  // ❌ Should be 1
      "feature_name": "Arcane Recovery",
      "description": "You have learned to regain some of your Magical energy..."
    }
  ]
}
```

Meanwhile, the progression table correctly shows `arcane_recovery: "1"` at level 1.

#### D&D 5e Rules Reference

PHB p. 115:
> "You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest..."

This is listed under "Arcane Recovery" at 1st level in the class features section.

#### Required Fix

```sql
-- Fix Arcane Recovery level
UPDATE class_features
SET level = 1
WHERE feature_name = 'Arcane Recovery'
  AND class_id = (SELECT id FROM character_classes WHERE slug = 'wizard');
```

Or during re-import, ensure the level parsing correctly identifies this as a level 1 feature.

#### Acceptance Criteria

- [ ] Arcane Recovery feature has `level: 1`
- [ ] Progression table and features list are consistent

---

## 2. High Priority Issues

### 2.1 Choice Options as Separate Features

**Severity**: High
**Affected Endpoints**: All class detail endpoints

#### Problem

Features that represent choices (pick one option) are stored as separate features, inflating feature counts and cluttering the UI:

```json
// Fighter at Level 1
{
  "features": [
    { "feature_name": "Fighting Style" },
    { "feature_name": "Fighting Style: Archery" },
    { "feature_name": "Fighting Style: Defense" },
    { "feature_name": "Fighting Style: Dueling" },
    { "feature_name": "Fighting Style: Great Weapon Fighting" },
    { "feature_name": "Fighting Style: Protection" },
    { "feature_name": "Fighting Style: Two-Weapon Fighting" }
  ]
}
// Shows as 7 features, but player only GETS 1 choice
```

Similarly for:
- Totem Warrior: Bear, Eagle, Wolf options at levels 3, 6, 14
- Eldritch Invocations: Many options listed separately
- Maneuvers: Listed as separate "spells"

#### D&D 5e Rules Reference

PHB p. 72 (Fighting Style):
> "You adopt a particular style of fighting as your specialty. Choose one of the following options."

The key word is **choose one** - these are options, not separate features gained.

#### Required Fix

**Add new fields to `class_features` table:**

```sql
ALTER TABLE class_features ADD COLUMN is_choice_option BOOLEAN DEFAULT FALSE;
ALTER TABLE class_features ADD COLUMN parent_feature_id BIGINT UNSIGNED NULL;
ALTER TABLE class_features ADD COLUMN choice_group VARCHAR(50) NULL;

-- Add foreign key
ALTER TABLE class_features
ADD CONSTRAINT fk_parent_feature
FOREIGN KEY (parent_feature_id) REFERENCES class_features(id);

-- Create index
CREATE INDEX idx_choice_group ON class_features(class_id, choice_group);
```

**Update data:**

```sql
-- Mark Fighting Style options
UPDATE class_features
SET is_choice_option = TRUE,
    parent_feature_id = (
        SELECT id FROM class_features f2
        WHERE f2.class_id = class_features.class_id
        AND f2.feature_name = 'Fighting Style'
        AND f2.level = class_features.level
    ),
    choice_group = 'fighting_style'
WHERE feature_name LIKE 'Fighting Style: %';

-- Mark Totem options
UPDATE class_features
SET is_choice_option = TRUE,
    choice_group = 'totem_spirit_3'
WHERE feature_name IN ('Bear (Path of the Totem Warrior)', 'Eagle (Path of the Totem Warrior)', 'Wolf (Path of the Totem Warrior)')
AND level = 3;
```

**Update ClassFeatureResource:**

```php
class ClassFeatureResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'level' => $this->level,
            'feature_name' => $this->feature_name,
            'description' => $this->description,
            'is_optional' => $this->is_optional,
            'is_choice_option' => $this->is_choice_option,  // NEW
            'parent_feature_id' => $this->parent_feature_id,  // NEW
            'choice_group' => $this->choice_group,  // NEW
            'choice_options' => $this->when(
                $this->childOptions->isNotEmpty(),
                ClassFeatureResource::collection($this->childOptions)
            ),  // NEW: nested options
            // ...
        ];
    }
}
```

#### Expected API Response

```json
{
  "features": [
    {
      "id": 100,
      "level": 1,
      "feature_name": "Fighting Style",
      "is_choice_option": false,
      "choice_options": [
        { "id": 101, "feature_name": "Fighting Style: Archery", "is_choice_option": true, "parent_feature_id": 100 },
        { "id": 102, "feature_name": "Fighting Style: Defense", "is_choice_option": true, "parent_feature_id": 100 }
        // ... other options nested
      ]
    }
    // Fighting Style options no longer appear as top-level features
  ]
}
```

#### Acceptance Criteria

- [ ] `is_choice_option` field added to features
- [ ] Choice options have `parent_feature_id` linking to parent
- [ ] Options can be nested under parent feature in response
- [ ] Feature count excludes choice options by default

---

### 2.2 Multiclass Rules Mixed with Core Features

**Severity**: High
**Affected Endpoints**: All base class detail endpoints

#### Problem

Multiclass rules appear as Level 1 "features" alongside core class features:

```json
{
  "level": 1,
  "features": "Starting Wizard, Multiclass Wizard, Multiclass Features, Spellcasting"
}
```

Multiclassing is an **optional rule** (PHB p. 163) that many tables don't use. It shouldn't be presented as a primary feature.

#### D&D 5e Rules Reference

PHB p. 163:
> "Multiclassing allows you to gain levels in multiple classes... This rule is an **optional rule**. Ask your DM before using this rule."

#### Required Fix

**Add field to distinguish optional rules:**

```sql
ALTER TABLE class_features ADD COLUMN is_optional_rule BOOLEAN DEFAULT FALSE;

-- Mark multiclass features
UPDATE class_features
SET is_optional_rule = TRUE
WHERE feature_name LIKE '%Multiclass%';
```

**Update ClassResource to filter/separate:**

```php
class ClassResource extends JsonResource
{
    public function toArray($request): array
    {
        $features = $this->features;

        return [
            // Core features (default view)
            'features' => ClassFeatureResource::collection(
                $features->where('is_optional_rule', false)
                         ->where('is_choice_option', false)
            ),

            // Optional rule features (separate section)
            'optional_rule_features' => ClassFeatureResource::collection(
                $features->where('is_optional_rule', true)
            ),

            // ...
        ];
    }
}
```

#### Acceptance Criteria

- [ ] Multiclass features marked with `is_optional_rule: true`
- [ ] Core features separated from optional rules in response
- [ ] Progression table excludes optional rule features

---

### 2.3 Feature Count Inflation

**Severity**: High
**Affected Endpoints**: All class list and detail endpoints

#### Problem

Feature counts include choice options, making classes appear to have more features than they actually do:

| Class/Subclass | Current Count | Actual Features |
|----------------|---------------|-----------------|
| Fighter | 25+ | ~12 |
| Champion | 13 | 6 |
| Totem Warrior | 15 | 7 |

#### Required Fix

**Add computed field for countable features:**

```php
// In ClassResource or as model accessor
'feature_count' => $this->features
    ->where('is_choice_option', false)
    ->where('is_optional_rule', false)
    ->count(),

'total_feature_count' => $this->features->count(),  // includes everything
```

#### Acceptance Criteria

- [ ] `feature_count` excludes choice options and optional rules
- [ ] `total_feature_count` available if full count needed
- [ ] List endpoints show accurate feature counts

---

### 2.4 Progression Table Feature List Cluttered

**Severity**: High
**Affected Endpoints**: All class detail endpoints (computed.progression_table)

#### Problem

The progression table's "Features" column includes everything:

```json
{
  "level": 1,
  "features": "Starting Fighter, Multiclass Fighter, Multiclass Features, Second Wind, Fighting Style, Fighting Style: Archery, Fighting Style: Defense, Fighting Style: Dueling, Fighting Style: Great Weapon Fighting, Fighting Style: Protection, Fighting Style: Two-Weapon Fighting"
}
```

This is unreadable and incorrect - players don't gain all fighting styles.

#### Required Fix

When generating progression table, filter the features column:

```php
// In progression table generation
$featureNames = $levelFeatures
    ->where('is_choice_option', false)
    ->where('is_optional_rule', false)
    ->pluck('feature_name')
    ->join(', ');

// For choice features, show parent with indicator
// Result: "Fighting Style (choose 1), Second Wind"
```

#### Expected Output

```json
{
  "level": 1,
  "features": "Second Wind, Fighting Style"
}
```

Or with choice indicator:

```json
{
  "level": 1,
  "features": "Second Wind, Fighting Style (choose 1)"
}
```

#### Acceptance Criteria

- [ ] Progression table features exclude choice options
- [ ] Progression table features exclude optional rules
- [ ] Choice parent features optionally show "(choose N)" indicator

---

## 3. Medium Priority Issues

### 3.1 Missing Subclass Entry Level

**Severity**: Medium
**Affected Endpoints**: Base class detail endpoints

#### Problem

There's no field indicating at what level a class gets to choose their subclass:

- Cleric: Level 1 (Divine Domain)
- Fighter: Level 3 (Martial Archetype)
- Wizard: Level 2 (Arcane Tradition)

#### D&D 5e Rules Reference

Different classes get subclasses at different levels:

| Class | Subclass Name | Level |
|-------|---------------|-------|
| Barbarian | Primal Path | 3 |
| Bard | Bard College | 3 |
| Cleric | Divine Domain | 1 |
| Druid | Druid Circle | 2 |
| Fighter | Martial Archetype | 3 |
| Monk | Monastic Tradition | 3 |
| Paladin | Sacred Oath | 3 |
| Ranger | Ranger Archetype | 3 |
| Rogue | Roguish Archetype | 3 |
| Sorcerer | Sorcerous Origin | 1 |
| Warlock | Otherworldly Patron | 1 |
| Wizard | Arcane Tradition | 2 |

#### Required Fix

**Add field to base classes:**

```sql
ALTER TABLE character_classes ADD COLUMN subclass_level TINYINT UNSIGNED NULL;

-- Populate
UPDATE character_classes SET subclass_level = 1 WHERE slug = 'cleric';
UPDATE character_classes SET subclass_level = 1 WHERE slug = 'sorcerer';
UPDATE character_classes SET subclass_level = 1 WHERE slug = 'warlock';
UPDATE character_classes SET subclass_level = 2 WHERE slug = 'druid';
UPDATE character_classes SET subclass_level = 2 WHERE slug = 'wizard';
UPDATE character_classes SET subclass_level = 3 WHERE slug IN ('barbarian', 'bard', 'fighter', 'monk', 'paladin', 'ranger', 'rogue');
```

**Also add subclass_name for display:**

```sql
ALTER TABLE character_classes ADD COLUMN subclass_name VARCHAR(50) NULL;

UPDATE character_classes SET subclass_name = 'Divine Domain' WHERE slug = 'cleric';
UPDATE character_classes SET subclass_name = 'Arcane Tradition' WHERE slug = 'wizard';
UPDATE character_classes SET subclass_name = 'Martial Archetype' WHERE slug = 'fighter';
-- etc.
```

#### Expected API Response

```json
{
  "data": {
    "name": "Wizard",
    "subclass_level": 2,
    "subclass_name": "Arcane Tradition",
    "subclasses": [...]
  }
}
```

#### Acceptance Criteria

- [ ] `subclass_level` field added to base classes
- [ ] `subclass_name` field added to base classes
- [ ] Values populated for all 12 base classes

---

### 3.2 Counters Not Consolidated

**Severity**: Medium
**Affected Endpoints**: Class detail endpoints (counters array)

#### Problem

Counters that scale with level appear as separate entries:

```json
{
  "counters": [
    { "level": 3, "counter_name": "Superiority Die", "counter_value": 4 },
    { "level": 7, "counter_name": "Superiority Die", "counter_value": 5 },
    { "level": 15, "counter_name": "Superiority Die", "counter_value": 6 }
  ]
}
```

#### Required Fix

**Option A**: Add computed consolidated counters

```php
// In ClassResource
'counters' => ClassCounterResource::collection($this->counters),
'consolidated_counters' => $this->getConsolidatedCounters(),

// Method
protected function getConsolidatedCounters(): array
{
    return $this->counters
        ->groupBy('counter_name')
        ->map(function ($group, $name) {
            return [
                'counter_name' => $name,
                'reset_timing' => $group->first()->reset_timing,
                'progression' => $group->map(fn ($c) => [
                    'level' => $c->level,
                    'value' => $c->counter_value
                ])->values()
            ];
        })
        ->values();
}
```

#### Expected API Response

```json
{
  "consolidated_counters": [
    {
      "counter_name": "Superiority Die",
      "reset_timing": "Short Rest",
      "progression": [
        { "level": 3, "value": 4 },
        { "level": 7, "value": 5 },
        { "level": 15, "value": 6 }
      ]
    }
  ]
}
```

#### Acceptance Criteria

- [ ] Counters with same name consolidated into progression array
- [ ] Original `counters` array preserved for backward compatibility

---

### 3.3 Irrelevant Progression Columns

**Severity**: Medium
**Affected Endpoints**: Subclass detail endpoints (computed.progression_table)

#### Problem

Progression tables include columns specific to other subclasses:

- Oathbreaker (Paladin) shows `undying_sentinel` column (Oath of the Ancients feature)
- All Wizard subclasses show identical spell slot columns (correct, but redundant)

#### Required Fix

Generate progression table columns based on the specific class/subclass:

```php
// When building progression table
$columns = $this->getBaseColumns(); // level, proficiency, features

// Add class-specific columns
if ($this->hasSpellcasting()) {
    $columns = array_merge($columns, $this->getSpellSlotColumns());
}

// Add subclass-specific columns (only if this subclass has them)
foreach ($this->getClassCounters() as $counter) {
    if ($this->counters->contains('counter_name', $counter)) {
        $columns[] = $this->getCounterColumn($counter);
    }
}
```

#### Acceptance Criteria

- [ ] Subclass progression tables only show relevant columns
- [ ] Class-specific counters only appear if that class/subclass has them

---

### 3.4 Higher Levels Description Incorrect

**Severity**: Medium
**Affected Endpoints**: Subclass detail endpoints (computed.hit_points)

#### Problem

The `higher_levels.description` uses subclass name instead of class name:

```json
{
  "computed": {
    "hit_points": {
      "higher_levels": {
        "description": "1d6 (or 4) + your Constitution modifier per school of abjuration level after 1st"
      }
    }
  }
}
```

Should be "per **Wizard** level" since hit points are based on class levels.

#### Required Fix

```php
// In hit points computation
$className = $this->is_base_class ? $this->name : $this->parentClass->name;

$higherLevels['description'] = sprintf(
    '%s (or %d) + your Constitution modifier per %s level after 1st',
    $this->computed->hit_points->hit_die,
    $averageRoll,
    strtolower($className)
);
```

#### Acceptance Criteria

- [ ] Subclass hit points description references parent class name
- [ ] Base class hit points description unchanged

---

### 3.5 Duplicate Description Content

**Severity**: Medium
**Affected Endpoints**: Base class detail endpoints

#### Problem

Base class `description` duplicates the first trait's content:

```json
{
  "description": "Clad in the silver robes that denote her station...",
  "traits": [
    {
      "name": "Wizard",
      "description": "Clad in the silver robes that denote her station..."  // Same text
    }
  ]
}
```

#### Required Fix

**Option A**: Remove duplicate trait

```sql
DELETE FROM class_traits
WHERE name = class_name
AND description = (SELECT description FROM character_classes WHERE id = class_traits.class_id);
```

**Option B**: Keep both but mark trait as intro (frontend can hide)

```sql
ALTER TABLE class_traits ADD COLUMN is_intro_trait BOOLEAN DEFAULT FALSE;

UPDATE class_traits t
SET is_intro_trait = TRUE
WHERE t.sort_order = 0
AND EXISTS (
    SELECT 1 FROM character_classes c
    WHERE c.id = t.class_id
    AND t.description = c.description
);
```

#### Acceptance Criteria

- [ ] Intro trait either removed or marked distinctly
- [ ] No visible duplication in frontend display

---

## 4. Low Priority Issues

### 4.1 Spellcasting Ability Inheritance

Some subclasses don't inherit `spellcasting_ability` from parent.

**Fix**: Ensure subclass detail includes parent's spellcasting ability if not overridden.

### 4.2 Sort Order Inconsistencies

Features at the same level sometimes have non-sequential sort_order values.

**Fix**: Ensure sort_order is sequential within each level during import.

### 4.3 Source Reference in Descriptions

Many feature descriptions end with "Source: Player's Handbook (2014) p. X" which should be in a separate field.

**Fix**: Parse and move to `source` relationship during import.

---

## 5. Implementation Recommendations

### Migration Order

1. **Phase 1 - Data Fixes** (no schema changes)
   - Fix `hit_die: 0` values
   - Fix Arcane Recovery level
   - Populate subclass descriptions

2. **Phase 2 - Schema Additions**
   - Add `is_choice_option`, `parent_feature_id`, `choice_group` to features
   - Add `is_optional_rule` to features
   - Add `subclass_level`, `subclass_name` to classes

3. **Phase 3 - Data Population**
   - Mark choice options
   - Mark optional rules
   - Populate subclass levels

4. **Phase 4 - API Updates**
   - Update ClassResource with new fields
   - Update ClassFeatureResource with nesting
   - Update progression table generation

### Testing Requirements

- [ ] All 12 base classes return valid data
- [ ] All subclasses return valid `hit_die` and `hit_points`
- [ ] Feature counts match expected values
- [ ] Progression tables are readable
- [ ] Backward compatibility maintained (no breaking changes to existing fields)

### Frontend Coordination

After backend changes, frontend will need to:

1. Update TypeScript types for new fields
2. Collapse choice options under parent features
3. Move multiclass rules to separate section
4. Show subclass entry level on base class pages

---

## 6. Appendix: Affected Classes/Subclasses

### Subclasses with hit_die: 0

Run this query to find all affected:

```sql
SELECT c.slug, c.name, c.hit_die, p.name as parent_name, p.hit_die as parent_hit_die
FROM character_classes c
LEFT JOIN character_classes p ON c.parent_class_id = p.id
WHERE c.is_base_class = false AND c.hit_die = 0;
```

### Classes with Choice Features

| Class | Choice Feature | Options Count |
|-------|---------------|---------------|
| Fighter | Fighting Style | 6 |
| Paladin | Fighting Style | 4 |
| Ranger | Fighting Style | 3 |
| Champion | Additional Fighting Style | 6 |
| Totem Warrior | Totem Spirit | 3 |
| Totem Warrior | Aspect of the Beast | 3 |
| Totem Warrior | Totemic Attunement | 3 |
| Battle Master | Maneuvers | 16+ |
| Warlock | Eldritch Invocations | 20+ |
| Warlock | Pact Boon | 3 |

### Multiclass Features to Mark

```sql
SELECT id, class_id, feature_name
FROM class_features
WHERE feature_name LIKE '%Multiclass%'
ORDER BY class_id, level;
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-11-26 | Claude | Initial proposal based on API verification audit |
