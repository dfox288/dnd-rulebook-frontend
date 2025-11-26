# Classes API Enhancement Proposals

**Date:** 2025-11-26
**Status:** Proposal
**API Endpoint:** `/api/v1/classes`
**Overall Assessment:** 🟡 NEEDS IMPROVEMENT - Critical data issues for some base classes

---

## Executive Summary

The Classes API has excellent structure for most classes but contains **critical data gaps** for Cleric and Paladin base classes. The subclass system and feature progression are well-designed, but several base classes are missing essential D&D 5e data.

### Current Strengths
- Excellent subclass nesting with `parent_class_id` relationships
- Comprehensive feature system with level progression
- Good proficiency modeling with skill choices
- Counter system for tracking class resources (Ki, Superiority Dice, etc.)
- Computed progression tables with spell slots for casters

### Critical Issues Found
- **Cleric**: `hit_die: 0`, missing `spellcasting_ability`, empty `proficiencies`
- **Paladin**: `hit_die: 0`, missing `spellcasting_ability`, empty `proficiencies`
- Some classes missing `description` content

---

## 🔴 Critical Issues (High Priority)

### 1. Cleric Base Class Missing Data

**Current State:**
```json
{
  "name": "Cleric",
  "hit_die": 0,
  "spellcasting_ability": null,
  "is_base_class": true,
  "proficiencies": [],
  "traits": [],
  "description": "No description available"
}
```

**Expected (PHB p.56-58):**
```json
{
  "name": "Cleric",
  "hit_die": 8,
  "spellcasting_ability": { "code": "WIS", "name": "Wisdom" },
  "proficiencies": [
    { "type": "armor", "name": "Light Armor" },
    { "type": "armor", "name": "Medium Armor" },
    { "type": "armor", "name": "Shields" },
    { "type": "weapon", "name": "Simple Weapons" },
    { "type": "saving_throw", "name": "Wisdom" },
    { "type": "saving_throw", "name": "Charisma" },
    { "type": "skill", "choices": ["History", "Insight", "Medicine", "Persuasion", "Religion"], "count": 2 }
  ]
}
```

**D&D Impact:**
- Cannot display correct HP calculation (should be d8)
- Cannot show spellcasting ability (Wisdom)
- Cannot display starting proficiencies
- Breaks character builder functionality

---

### 2. Paladin Base Class Missing Data

**Current State:**
```json
{
  "name": "Paladin",
  "hit_die": 0,
  "spellcasting_ability": null,
  "is_base_class": true
}
```

**Expected (PHB p.82-85):**
```json
{
  "name": "Paladin",
  "hit_die": 10,
  "spellcasting_ability": { "code": "CHA", "name": "Charisma" },
  "proficiencies": [
    { "type": "armor", "name": "All Armor" },
    { "type": "armor", "name": "Shields" },
    { "type": "weapon", "name": "Simple Weapons" },
    { "type": "weapon", "name": "Martial Weapons" },
    { "type": "saving_throw", "name": "Wisdom" },
    { "type": "saving_throw", "name": "Charisma" },
    { "type": "skill", "choices": ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"], "count": 2 }
  ]
}
```

**D&D Impact:**
- Paladin is a half-caster starting at level 2 (PHB p.84)
- Hit die d10 is essential for tank role
- Charisma is used for both spellcasting AND class features (Aura of Protection)

---

## Logical Correctness Analysis

### Hit Die Verification (PHB Reference)

| Class | API Value | Expected | Status |
|-------|-----------|----------|--------|
| Artificer | 8 | d8 | ✅ Correct |
| Barbarian | 12 | d12 | ✅ Correct |
| Bard | 8 | d8 | ✅ Correct |
| **Cleric** | **0** | **d8** | ❌ **CRITICAL** |
| Druid | 8 | d8 | ✅ Correct |
| Fighter | 10 | d10 | ✅ Correct |
| Monk | 8 | d8 | ✅ Correct |
| **Paladin** | **0** | **d10** | ❌ **CRITICAL** |
| Ranger | 10 | d10 | ✅ Correct |
| Rogue | 8 | d8 | ✅ Correct |
| Sorcerer | 6 | d6 | ✅ Correct |
| Warlock | 8 | d8 | ✅ Correct |
| Wizard | 6 | d6 | ✅ Correct |

### Spellcasting Ability Verification

| Class | API Value | Expected | Status |
|-------|-----------|----------|--------|
| Artificer | INT | Intelligence | ✅ Correct |
| Bard | - | Charisma | ⚠️ Check |
| **Cleric** | **null** | **Wisdom** | ❌ **CRITICAL** |
| Druid | - | Wisdom | ⚠️ Check |
| **Paladin** | **null** | **Charisma** | ❌ **CRITICAL** |
| Ranger | - | Wisdom | ⚠️ Check |
| Sorcerer | CHA | Charisma | ✅ Correct |
| Warlock | CHA | Charisma | ✅ Correct |
| Wizard | INT | Intelligence | ✅ Correct |

### Subclass Integration Points

| Class | Subclass Level | API Correct | PHB Reference |
|-------|----------------|-------------|---------------|
| Barbarian | 3 | ✅ | Primal Path (PHB p.48) |
| Bard | 3 | ✅ | Bard College (PHB p.54) |
| Cleric | 1 | ✅ | Divine Domain (PHB p.58) |
| Druid | 2 | ✅ | Druid Circle (PHB p.67) |
| Fighter | 3 | ✅ | Martial Archetype (PHB p.72) |
| Monk | 3 | ✅ | Monastic Tradition (PHB p.78) |
| Paladin | 3 | ✅ | Sacred Oath (PHB p.85) |
| Ranger | 3 | ✅ | Ranger Archetype (PHB p.92) |
| Rogue | 3 | ✅ | Roguish Archetype (PHB p.96) |
| Sorcerer | 1 | ✅ | Sorcerous Origin (PHB p.101) |
| Warlock | 1 | ✅ | Otherworldly Patron (PHB p.107) |
| Wizard | 2 | ✅ | Arcane Tradition (PHB p.115) |

---

## Structural Soundness Analysis

### What Works Well ✅

1. **Subclass Relationships**
   - `parent_class_id` correctly links subclasses to base classes
   - `is_base_class` flag properly distinguishes base/sub
   - Subclasses inherit features from parent class

2. **Feature System**
   ```json
   {
     "id": 412,
     "level": 3,
     "feature_name": "Improved Critical (Champion)",
     "description": "...",
     "is_optional": true,
     "sort_order": 44
   }
   ```
   - Level-based features work correctly
   - Optional flag for subclass features
   - Sort order for display

3. **Counter System**
   ```json
   {
     "counter_name": "Superiority Die",
     "counter_value": 4,
     "reset_timing": "Short Rest",
     "level": 3
   }
   ```
   - Tracks class resources (Ki, Superiority Dice, etc.)
   - Handles reset timing (Short/Long Rest)
   - Level-based progression

4. **Proficiency Modeling**
   - Skill choices with `choice_group` and `quantity`
   - Weapon/armor proficiency types
   - Saving throw proficiencies

5. **Computed Data**
   - `computed.progression_table` with full 20-level data
   - Spell slot columns for casters
   - Class-specific columns (Ki, Sneak Attack, etc.)

### Issues Found ⚠️

1. **Inconsistent `inherited_data` on List View**
   - Subclasses in list show `inherited_data.hit_die: 0` when parent is missing data
   - Should compute correctly from parent class

2. **Missing Equipment Data**
   - `equipment` field present but often null
   - Starting equipment is essential for character creation

3. **Sidekick Classes Mixed with Core**
   - Expert/Warrior/Spellcaster Sidekicks appear in main class list
   - Consider separate endpoint or filter

---

## Feature Completeness Analysis

### Essential Fields Present?

| Field | Present | Notes |
|-------|---------|-------|
| name, slug | ✅ | All classes |
| hit_die | ⚠️ | 0 for Cleric/Paladin |
| description | ⚠️ | "No description available" for some |
| primary_ability | ⚠️ | Often null |
| spellcasting_ability | ⚠️ | Missing for Cleric/Paladin |
| proficiencies | ✅ | Complete for most classes |
| features | ✅ | Comprehensive |
| subclasses | ✅ | Well-structured |
| counters | ✅ | Class resources tracked |
| level_progression | ⚠️ | Empty array on some |
| traits | ✅ | Lore/flavor text |
| sources | ⚠️ | Often empty |

---

## Medium Priority Enhancements

### 3. Add `multiclass_requirements` Field

**D&D Context:**
Multiclassing has ability score prerequisites (PHB p.163).

**Proposed Enhancement:**
```json
{
  "multiclass_requirements": {
    "ability_scores": [
      { "ability": "STR", "minimum": 13 },
      { "ability": "CHA", "minimum": 13 }
    ],
    "proficiencies_gained": ["Light Armor", "Medium Armor", "Shields"]
  }
}
```

**Classes with multiclass requirements:**
- Barbarian: STR 13
- Bard: CHA 13
- Cleric: WIS 13
- Druid: WIS 13
- Fighter: STR 13 or DEX 13
- Monk: DEX 13 and WIS 13
- Paladin: STR 13 and CHA 13
- Ranger: DEX 13 and WIS 13
- Rogue: DEX 13
- Sorcerer: CHA 13
- Warlock: CHA 13
- Wizard: INT 13

---

### 4. Add `spellcasting_type` Enum

**D&D Context:**
Different classes cast spells differently.

**Proposed Enhancement:**
```json
{
  "spellcasting_type": "full",  // full, half, third, pact, none
  "spellcasting_start_level": 1,
  "prepares_spells": true,
  "spells_known_type": "all"  // all, known, spellbook
}
```

| Class | Type | Start Level | Prepares | Spells Known |
|-------|------|-------------|----------|--------------|
| Artificer | half | 1 | Yes | All (prepared) |
| Bard | full | 1 | No | Known |
| Cleric | full | 1 | Yes | All (domain) |
| Druid | full | 1 | Yes | All |
| Paladin | half | 2 | Yes | All |
| Ranger | half | 2 | No | Known |
| Sorcerer | full | 1 | No | Known |
| Warlock | pact | 1 | No | Known |
| Wizard | full | 1 | Yes | Spellbook |

---

### 5. Add `starting_equipment` Structured Field

**Current State:** Equipment data often null or missing.

**Proposed Enhancement:**
```json
{
  "starting_equipment": {
    "guaranteed": [
      { "item": "explorer's pack", "quantity": 1 }
    ],
    "choices": [
      {
        "choice_group": 1,
        "options": [
          [{ "item": "longsword", "quantity": 1 }],
          [{ "item": "simple weapon", "quantity": 1 }]
        ]
      }
    ],
    "wealth_alternative": "5d4 × 10 gp"
  }
}
```

---

## Low Priority / Nice-to-Have

### 6. Add `class_features_summary` for Cards

**Purpose:** Quick reference for list views without full feature data.

```json
{
  "class_features_summary": [
    "Rage",
    "Unarmored Defense",
    "Reckless Attack",
    "Danger Sense"
  ]
}
```

---

### 7. Filter Sidekick Classes

**Current:** Sidekick classes appear in main class list.

**Options:**
1. Add `is_sidekick` boolean flag
2. Create separate `/sidekicks` endpoint
3. Add `filter=is_sidekick:false` support

---

### 8. Add `spell_list` Relationship

**Purpose:** Link classes to their spell lists for filtering.

```json
{
  "spell_list": {
    "slug": "wizard-spells",
    "spell_count": 318
  }
}
```

---

## Implementation Priority Matrix

| Enhancement | Effort | Impact | Priority |
|-------------|--------|--------|----------|
| Fix Cleric hit_die/spellcasting | Low | Critical | 🔴 High |
| Fix Paladin hit_die/spellcasting | Low | Critical | 🔴 High |
| Add missing proficiencies | Medium | High | 🔴 High |
| Add multiclass_requirements | Medium | Medium | 🟡 Medium |
| Add spellcasting_type | Low | Medium | 🟡 Medium |
| Add starting_equipment | Medium | Medium | 🟡 Medium |
| Add class_features_summary | Low | Low | 🟢 Low |
| Filter sidekick classes | Low | Low | 🟢 Low |
| Add spell_list relationship | Low | Low | 🟢 Low |

---

## Verification Checklist

The following was verified against official D&D 5e sources:

**Correct:**
- [x] Barbarian: d12, STR/CON saves, correct proficiencies
- [x] Fighter: d10, STR/CON saves, all armor/weapons
- [x] Wizard: d6, INT/WIS saves, INT spellcasting
- [x] Warlock: d8, WIS/CHA saves, CHA spellcasting
- [x] Rogue: d8, DEX/INT saves, Thieves' Tools
- [x] Monk: d8, STR/DEX saves, no armor proficiency

**Issues Found:**
- [ ] Cleric: Should be d8, WIS/CHA saves, WIS spellcasting
- [ ] Paladin: Should be d10, WIS/CHA saves, CHA spellcasting
- [ ] Several classes missing `description`
- [ ] Equipment data incomplete

---

## Related Documentation

- Frontend class pages: `app/pages/classes/`
- Class filter store: `app/stores/classFilters.ts`
- Backend API: `/Users/dfox/Development/dnd/importer`

---

## Summary

The Classes API is **well-architected** with excellent subclass relationships and feature modeling. However, the **Cleric and Paladin base classes have critical data gaps** that must be fixed for the API to be production-ready. These are likely import/seed data issues rather than structural problems.

Once the critical issues are resolved, the medium-priority enhancements would significantly improve the API's utility for character builders and reference applications.
