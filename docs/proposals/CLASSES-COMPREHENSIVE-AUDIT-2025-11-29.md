# Classes API Comprehensive Audit Report

**Date**: 2025-11-29
**Author**: Claude (D&D 5e Rules Audit)
**Status**: Action Required
**Priority**: Critical
**Methodology**: Parallel subagent audit of all 13 base classes against official source material

---

## Executive Summary

A comprehensive rules-accuracy audit of all 13 base classes and their subclasses was conducted against official D&D 5e source material (PHB, DMG, XGE, TCE, SCAG, EGtW, FToD, VRGtR). Each class was audited by a specialized agent verifying hit dice, proficiencies, features, progression tables, and subclass completeness.

### Overall Results

| Score | Classes | Count |
|-------|---------|-------|
| 10/10 | Cleric, Paladin | 2 |
| 9-9.9 | Barbarian, Bard, Druid | 3 |
| 8-8.9 | Ranger, Sorcerer | 2 |
| 7-7.9 | Wizard, Artificer, Fighter | 3 |
| 6-6.9 | Monk | 1 |
| 5-5.9 | Rogue | 1 |
| <5 | Warlock | 1 |

**Classes Requiring Immediate Fixes**: Rogue, Warlock, Wizard, Monk, Artificer, Fighter

---

## Critical Issues (Game-Breaking)

### 1. Rogue: Sneak Attack Progression Broken

**Severity**: 🔴 CRITICAL
**Impact**: High-level rogues deal 1-4 dice less damage than intended
**Source**: PHB p.96

**Problem**: Sneak Attack damage is stuck at 9d6 for levels 10-20.

**Current (WRONG)**:
| Level | Sneak Attack |
|-------|--------------|
| 9 | 5d6 |
| 10 | 9d6 |
| 11 | 9d6 |
| ... | 9d6 |
| 20 | 9d6 |

**Expected (PHB p.96)**:
| Level | Sneak Attack |
|-------|--------------|
| 9 | 5d6 |
| 10 | 5d6 |
| 11 | 6d6 |
| 13 | 7d6 |
| 15 | 8d6 |
| 17 | 9d6 |
| 19 | 10d6 |

**Formula**: Sneak Attack = ceil(level / 2) d6

**Fix Required**: Update `sneak_attack` column generation in progression table to use correct formula.

---

### 2. Rogue: Thief Subclass Feature Contamination

**Severity**: 🔴 CRITICAL
**Impact**: Thief has wrong feature, data integrity issue

**Problem**: Thief subclass at level 17 has TWO features:
1. ✅ "Thief's Reflexes" (correct)
2. ❌ "Spell Thief (Arcane Trickster)" (WRONG - belongs to Arcane Trickster only)

**Expected**: Thief should ONLY have "Thief's Reflexes" at level 17.

**Root Cause**: Likely a join/relationship issue in the import that's pulling Arcane Trickster features into Thief.

**Fix Required**: Remove "Spell Thief" from Thief subclass features. Investigate if similar contamination exists in other subclasses.

---

### 3. Warlock: Zero Eldritch Invocations Available

**Severity**: 🔴 CRITICAL
**Impact**: Warlocks cannot function - invocations are a core class mechanic
**Source**: PHB p.107-111

**Problem**: The "Eldritch Invocations" feature at level 2 exists with correct progression (2→8 known), but the `choice_options` array contains ZERO actual invocations.

**Expected**: ~50+ invocations across PHB, XGE, TCE including:
- Agonizing Blast (add CHA to eldritch blast)
- Armor of Shadows (mage armor at will)
- Devil's Sight (see in magical darkness)
- Eldritch Spear (300 ft eldritch blast)
- Mask of Many Faces (disguise self at will)
- Repelling Blast (push 10 ft)
- And many more...

**Fix Required**:
1. Import all Eldritch Invocations from PHB p.110-111, XGE, TCE
2. Link them as choice_options to the "Eldritch Invocations" feature
3. Include level prerequisites where applicable (e.g., "Lifedrinker" requires 12th level)
4. Include pact boon prerequisites where applicable (e.g., "Thirsting Blade" requires Pact of the Blade)

---

### 4. Wizard: Arcane Recovery at Wrong Level

**Severity**: 🔴 CRITICAL
**Impact**: Wizards miss their primary resource recovery feature for 5 levels
**Source**: PHB p.115

**Problem**: Arcane Recovery appears at Level 6 instead of Level 1.

**Evidence from PHB p.115**:
> "You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover."

The PHB class table (p.113) clearly shows this as a 1st-level feature.

**Current**: L1: Spellcasting | L6: Arcane Recovery, Tradition Feature
**Expected**: L1: Spellcasting, Arcane Recovery | L6: Tradition Feature

**Fix Required**: Move Arcane Recovery from level 6 to level 1 in the features table.

---

### 5. Monk: Way of Four Elements Missing 8 Base Disciplines

**Severity**: 🔴 CRITICAL
**Impact**: Subclass unplayable at level 3 - no valid choices available
**Source**: PHB p.80-81

**Problem**: Only high-level elemental disciplines (L6, L11, L17) are present. All 8 base disciplines available at level 3 are missing.

**Missing Disciplines (all available at L3)**:
1. Elemental Attunement (always known, no ki cost)
2. Fangs of the Fire Snake (1 ki)
3. Fist of Four Thunders (2 ki, thunderwave)
4. Fist of Unbroken Air (2 ki)
5. Rush of the Gale Spirits (2 ki, gust of wind)
6. Shape the Flowing River (1 ki)
7. Sweeping Cinder Strike (2 ki, burning hands)
8. Water Whip (2 ki)

**Present Disciplines** (higher level only):
- L6: Clench of the North Wind, Gong of the Summit
- L11: Flames of the Phoenix, Mist Stance, Ride the Wind
- L17: Breath of Winter, Eternal Mountain Defense, River of Hungry Flame, Wave of Rolling Earth

**Fix Required**: Import all 8 base disciplines from PHB p.81 and add them to Way of Four Elements features at level 3.

---

### 6. Artificer: No Infusions Available

**Severity**: 🔴 CRITICAL
**Impact**: Core class feature non-functional from level 2
**Source**: TCE p.12-14

**Problem**: The "Infuse Item" feature at level 2 exists with correct progression (Known: 4→12, Active: 2→6), but NO actual infusion options are available to select.

**Expected Infusions** (TCE p.12-14):
| Infusion | Level Req |
|----------|-----------|
| Armor of Magical Strength | 2nd |
| Enhanced Arcane Focus | 2nd |
| Enhanced Defense | 2nd |
| Enhanced Weapon | 2nd |
| Homunculus Servant | 2nd |
| Mind Sharpener | 2nd |
| Repeating Shot | 2nd |
| Replicate Magic Item | 2nd |
| Returning Weapon | 2nd |
| Boots of the Winding Path | 6th |
| Radiant Weapon | 6th |
| Resistant Armor | 6th |
| Spell-Refueling Ring | 6th |
| Helm of Awareness | 10th |
| Arcane Propulsion Armor | 14th |

**Fix Required**: Import all infusions from TCE and link them as selectable options with level prerequisites.

---

## High Priority Issues

### 7. Monk: Tool Proficiency Data Corruption

**Severity**: 🟠 HIGH
**Impact**: Data integrity issue, may affect other classes

**Problem**: Monk's tool proficiency (ID 127) has correct name "Any one type of Artisan's Tools or any one Musical Instrument of your choice" but is incorrectly linked to proficiency_type_id 44 which references "Net" (a weapon).

**Expected**: Should reference a tool proficiency type, not a weapon.

**Fix Required**: Correct the proficiency_type_id relationship for Monk tool proficiency.

---

### 8. Fighter: Eldritch Knight Missing Spell Slots in Progression Table

**Severity**: 🟠 HIGH
**Impact**: Cannot reference spell slot progression for this 1/3 caster subclass
**Source**: PHB p.75

**Problem**: Eldritch Knight's `computed.progression_table` only shows level/proficiency/features columns. It should include spell slot columns for this spellcasting subclass.

**Current Columns**: level, proficiency_bonus, features
**Expected Columns**: level, proficiency_bonus, features, cantrips_known, spell_slots_1st, spell_slots_2nd, spell_slots_3rd, spell_slots_4th

**Note**: The Spellcasting feature description contains a Spells Known table, but spell slots should also be in the computed progression.

**Fix Required**: Generate spell slot columns in progression_table for Eldritch Knight (and Arcane Trickster, if same issue).

---

### 9. Artificer: Battle Smith Missing Steel Defender Stat Block

**Severity**: 🟠 HIGH
**Impact**: Cannot reference companion creature stats
**Source**: TCE p.19

**Problem**: The "Steel Defender" feature description references "See its game statistics in the Steel Defender stat block" but no stat block is provided in data_tables.

**Expected Stat Block** (TCE p.19):
- Medium construct
- AC 15 (natural armor)
- HP = 2 + INT modifier + 5 × artificer level
- Speed 40 ft
- STR 14, DEX 12, CON 14, INT 4, WIS 10, CHA 6
- Saving Throws: DEX +3, CON +4
- Skills: Athletics +4, Perception +4
- Damage Immunities: poison
- Condition Immunities: charmed, exhaustion, poisoned
- Senses: darkvision 60 ft, passive Perception 14
- Actions: Force-Empowered Rend, Repair
- Reactions: Deflect Attack

**Fix Required**: Add Steel Defender stat block to Battle Smith's data_tables.

---

### 10. Barbarian: Level 20 Rage Should Show "Unlimited"

**Severity**: 🟡 MEDIUM
**Impact**: Display inconsistency with PHB
**Source**: PHB p.48

**Problem**: The rage column at level 20 shows "6" but per PHB p.48, Primal Champion grants "unlimited" rages.

**Current**: L20 rage = "6"
**Expected**: L20 rage = "Unlimited" or "∞"

**Fix Required**: Update progression table to show "Unlimited" for L20 rage value.

---

## Missing Subclasses

### 11. Missing Official Subclasses

**Severity**: 🟡 MEDIUM
**Impact**: Incomplete content coverage

| Class | Missing Subclass | Source Book | Features Expected |
|-------|------------------|-------------|-------------------|
| Fighter | Echo Knight | Explorer's Guide to Wildemount | Manifest Echo, Unleash Incarnation (3), Echo Avatar (7), Shadow Martyr (10), Reclaim Potential (15), Legion of One (18) |
| Ranger | Drakewarden | Fizban's Treasury of Dragons | Drakewarden Magic, Drake Companion (3), Bond of Fang and Scale (7), Drake's Breath (11), Perfected Bond (15) |
| Warlock | The Undead | Van Richten's Guide to Ravenloft | Form of Dread (1), Grave Touched (6), Necrotic Husk (10), Spirit Projection (14) |
| Wizard | Chronurgy Magic | Explorer's Guide to Wildemount | Chronal Shift, Temporal Awareness (2), Momentary Stasis (6), Arcane Abeyance (10), Convergent Future (14) |
| Wizard | Graviturgy Magic | Explorer's Guide to Wildemount | Adjust Density (2), Gravity Well (6), Violent Attraction (10), Event Horizon (14) |

**Fix Required**: Import these subclasses from their respective source books.

---

### 12. Warlock: Missing Pact of the Talisman

**Severity**: 🟡 MEDIUM
**Impact**: Missing TCE content
**Source**: TCE p.70

**Problem**: Only 3 Pact Boons available (Chain, Blade, Tome). Pact of the Talisman from Tasha's Cauldron of Everything is missing.

**Expected Feature** (L3):
> "Your patron gives you an amulet, a talisman that can aid the wearer when the need is great. When the wearer fails an ability check, they can add a d4 to the roll, potentially turning the roll into a success. This benefit can be used a number of times equal to your proficiency bonus, and all expended uses are restored when you finish a long rest."

**Fix Required**: Add Pact of the Talisman as a Pact Boon option at level 3.

---

## Low Priority Issues

### 13. Wizard: Illusory Self Named "Illusory Step"

**Severity**: 🟢 LOW
**Impact**: Naming inconsistency with PHB

**Problem**: School of Illusion's 10th-level feature is named "Illusory Step" but PHB p.118 calls it "Illusory Self".

**Fix Required**: Rename feature to "Illusory Self".

---

### 14. Progression Table Missing Columns

**Severity**: 🟢 LOW
**Impact**: Incomplete data display (data exists elsewhere)

Several classes are missing "Spells Known" columns in their progression tables, though this data exists in the Spellcasting feature description:
- Bard: Missing spells_known (should show 4→22)
- Sorcerer: Missing spells_known (should show 2→15)
- Ranger: Missing spells_known (should show 2→11)

**Fix Required**: Add spells_known column to progression_table for known-caster classes.

---

### 15. Sorcerer: Font of Magic Shows "2" at Level 1

**Severity**: 🟢 LOW
**Impact**: Minor display issue

**Problem**: Font of Magic column shows "2" at level 1, but Font of Magic is a level 2 feature. Level 1 should show "—".

**Fix Required**: Display "—" for Font of Magic/Sorcery Points at level 1.

---

### 16. Artificer: Typo "Elixer" vs "Elixir"

**Severity**: 🟢 LOW
**Impact**: Typo only

**Problem**: Alchemist's data_tables has table named "Experimental Elixer" (should be "Elixir").

**Fix Required**: Rename to "Experimental Elixir".

---

## Pattern Analysis

### Common Root Causes Identified

1. **Choice-Based Content Import Issue**

   Multiple classes are missing their selectable options:
   - Warlock: 0 Eldritch Invocations
   - Artificer: 0 Infusions
   - Monk: 0 base Elemental Disciplines

   **Hypothesis**: The import process may not be correctly handling features that have many selectable options stored in a separate relationship table.

2. **Feature Level Assignment**

   Some features are at wrong levels:
   - Wizard: Arcane Recovery at L6 instead of L1

   **Hypothesis**: Level assignment may be getting confused with tradition features.

3. **Subclass Feature Bleeding**

   Thief has Arcane Trickster's feature:

   **Hypothesis**: Join query may be pulling features from sibling subclasses.

---

## Verification Queries

### Sneak Attack Progression
```sql
SELECT level, sneak_attack
FROM class_progression
WHERE class_id = (SELECT id FROM character_classes WHERE slug = 'rogue')
ORDER BY level;
```

### Eldritch Invocations Check
```sql
SELECT f.feature_name, COUNT(co.id) as option_count
FROM class_features f
LEFT JOIN choice_options co ON co.feature_id = f.id
WHERE f.feature_name = 'Eldritch Invocations'
GROUP BY f.id;
```

### Arcane Recovery Level Check
```sql
SELECT feature_name, level
FROM class_features
WHERE class_id = (SELECT id FROM character_classes WHERE slug = 'wizard')
AND feature_name LIKE '%Arcane Recovery%';
```

---

## Implementation Priority

### Phase 1: Critical Fixes (Game-Breaking)
1. Fix Rogue Sneak Attack progression (affects all rogues)
2. Add Eldritch Invocations to Warlock (class non-functional without)
3. Move Wizard Arcane Recovery to level 1
4. Add 8 base disciplines to Way of Four Elements
5. Add Artificer Infusions
6. Fix Thief feature contamination

### Phase 2: High Priority
7. Fix Monk tool proficiency data
8. Add spell slot columns to Eldritch Knight/Arcane Trickster
9. Add Steel Defender stat block
10. Fix Barbarian L20 rage display

### Phase 3: Content Additions
11. Add missing subclasses (Echo Knight, Drakewarden, Undead, Chronurgy, Graviturgy)
12. Add Pact of the Talisman

### Phase 4: Polish
13. Fix naming inconsistencies
14. Add missing progression table columns
15. Fix minor display issues

---

## Appendix: Full Class Scores

| Class | Score | Notes |
|-------|-------|-------|
| Cleric | 10/10 | Perfect. All 14 domains complete. Gold standard. |
| Paladin | 10/10 | Perfect. All 9 oaths complete with Channel Divinity. |
| Barbarian | 9.5/10 | Excellent. 8 paths complete. L20 rage display issue. |
| Bard | 9.5/10 | Excellent. 7 colleges complete. Minor progression table gap. |
| Druid | 9.5/10 | Excellent. 7 circles complete. All land types present. |
| Ranger | 8.5/10 | Very good. Missing Drakewarden. Hunter choices complete. |
| Sorcerer | 8.5/10 | Very good. 7 origins complete. Minor display issues. |
| Wizard | 7.5/10 | Needs fix. Arcane Recovery wrong level. Missing 2 EGtW subclasses. |
| Artificer | 7.5/10 | Needs fix. No infusions. Missing Steel Defender stats. |
| Fighter | 7/10 | Needs fix. EK spell slots missing. Echo Knight missing. Duplicate Banneret. |
| Monk | 6.5/10 | Needs fix. Four Elements incomplete. Tool proficiency corrupted. |
| Warlock | 6/10 | Broken. Zero invocations. Missing Talisman and Undead. |
| Rogue | 5/10 | Broken. Sneak Attack wrong. Thief contaminated. |

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-11-29 | Claude | Initial comprehensive audit of all 13 classes |
