# Character Wizard E2E Test Plan

## Application Overview

The character creation wizard is a multi-step form that guides users through creating a D&D 5e character. The wizard consists of up to 16 potential steps, with dynamic step visibility based on selections (e.g., subrace step only shown if race has subraces, spells step only for spellcasters). Each step validates input and syncs with the backend API before proceeding. The wizard handles complex D&D rules including ability score methods, proficiency choices, equipment packs, spell selection, and more.

## Test Scenarios

### 1. Happy Path - Complete Character Creation

**Seed:** `N/A - Tests start from /characters/new/sourcebooks`

#### 1.1. Create Human Fighter with Standard Array

**File:** `tests/e2e/character-wizard-happy-path.spec.ts`

**Steps:**
  1. Navigate to /characters/new/sourcebooks
  2. Verify sourcebooks step displays with PHB pre-selected
  3. Click Next to proceed to race selection
  4. Search for 'Human' in race search input
  5. Click on Human race card
  6. Click 'Continue with Human' button
  7. Verify URL navigates to /characters/new/class (skips subrace since Human has none)
  8. Search for 'Fighter' in class search
  9. Click on Fighter class card
  10. Click 'Continue with Fighter' button
  11. Verify URL navigates to /characters/new/background (skips subclass since Fighter chooses at level 3)
  12. Click on Soldier background card
  13. Click 'Continue with Soldier' button
  14. Verify URL navigates to /characters/new/abilities
  15. Select 'Standard Array' ability score method
  16. Assign ability scores via dropdown: STR=15, DEX=14, CON=13, INT=12, WIS=10, CHA=8
  17. Click 'Save & Continue' button
  18. Verify URL navigates to proficiencies step
  19. Select 2 skill proficiencies from Fighter's available skills
  20. Click Next to proceed
  21. Complete any language choices if present (background may grant language choice)
  22. Select equipment pack or individual equipment items
  23. Click Next to proceed to details
  24. Enter character name 'Thorin Ironforge'
  25. Select alignment 'Lawful Good'
  26. Click Next to proceed to review
  27. Verify review page shows: Human, Fighter, Soldier, selected ability scores, character name
  28. Click 'Finish' button
  29. Verify redirect to /characters list page
  30. Verify new character appears in the list

**Expected Results:**
  - Character is created successfully with all selections saved
  - Character appears in /characters list with correct name and level 1
  - No validation errors occur during the flow
  - All steps proceed in correct order with appropriate skips

#### 1.2. Create Elf Wizard with Point Buy

**File:** `tests/e2e/character-wizard-happy-path.spec.ts`

**Steps:**
  1. Navigate to /characters/new/sourcebooks
  2. Click Next with PHB selected
  3. Select Elf race
  4. Click 'Continue with Elf'
  5. Verify subrace step appears (Elf has subraces)
  6. Select High Elf subrace
  7. Click 'Continue with High Elf'
  8. Select Wizard class
  9. Click 'Continue with Wizard'
  10. Select Sage background
  11. Click Continue
  12. Select 'Point Buy' ability score method
  13. Adjust point buy scores: STR=8, DEX=14, CON=13, INT=15, WIS=12, CHA=10
  14. Verify remaining points display shows 0
  15. Click 'Save & Continue'
  16. Complete proficiency choices (Wizard gets 2 skills)
  17. Click Next
  18. Complete language choices if present
  19. Click Next
  20. Select equipment (component pouch or arcane focus)
  21. Click Next
  22. Verify spells step appears (Wizard is full spellcaster)
  23. Select 3 cantrips from Wizard spell list
  24. Select 6 level 1 spells for spellbook
  25. Click Next to proceed
  26. Enter character name 'Elara Moonwhisper'
  27. Select alignment
  28. Click Next to review
  29. Verify review shows: High Elf, Wizard, Sage, point buy scores, spells
  30. Click Finish
  31. Verify character created successfully

**Expected Results:**
  - Subrace step appears and allows selection
  - Spells step appears with correct spell slots
  - Point buy validation prevents overspending points
  - All wizard-specific choices (spells, proficiencies) complete successfully
  - Character created with spells in spellbook

#### 1.3. Create Variant Human Cleric with Manual Ability Scores

**File:** `tests/e2e/character-wizard-happy-path.spec.ts`

**Steps:**
  1. Navigate to wizard start
  2. Select PHB, proceed to race
  3. Select Variant Human (if available, or use standard Human)
  4. Click Continue
  5. Select Cleric class
  6. Click Continue
  7. Verify subclass step appears (Cleric chooses at level 1)
  8. Select Life Domain subclass
  9. Click Continue
  10. Select Acolyte background
  11. Click Continue
  12. Select 'Manual' ability score method
  13. Enter manual scores: STR=10, DEX=12, CON=14, INT=8, WIS=15, CHA=13
  14. Verify all scores are within 3-20 range
  15. Click Save & Continue
  16. If Variant Human, verify feats step appears
  17. Select a feat (e.g., War Caster)
  18. Complete proficiency choices (Cleric gets 2 skills)
  19. Complete language choices if present
  20. Select equipment
  21. Verify spells step appears
  22. Select cantrips (if any for Life Cleric)
  23. Prepare spells (Clerics prepare spells daily)
  24. Enter character name
  25. Select alignment
  26. Review and finish
  27. Verify character created with feat and subclass

**Expected Results:**
  - Subclass step appears immediately after class for Cleric
  - Feats step appears if Variant Human selected
  - Manual ability scores accept valid range (3-20)
  - Cleric spell preparation works correctly
  - Character created with subclass at level 1

### 2. Validation Tests

**Seed:** `N/A`

#### 2.1. Sourcebooks - Cannot proceed without selection

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Navigate to /characters/new/sourcebooks
  2. If sourcebooks are deselectable, deselect all
  3. Verify Next button is disabled
  4. Select PHB
  5. Verify Next button becomes enabled

**Expected Results:**
  - Next button is disabled when no sourcebook selected
  - Next button enables when at least one sourcebook selected

#### 2.2. Race - Cannot proceed without selection

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Navigate directly to /characters/new/race
  2. Verify Continue button shows 'Continue with Selection' and is disabled
  3. Click on a race card
  4. Verify Continue button updates to 'Continue with [Race Name]' and becomes enabled
  5. Click elsewhere to deselect (if possible)
  6. Verify button returns to disabled state

**Expected Results:**
  - Cannot proceed without selecting a race
  - Continue button text dynamically updates with race name
  - Button state correctly reflects selection

#### 2.3. Subrace - Validates required vs optional

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Create character and select Elf (has required subraces)
  2. Navigate to subrace step
  3. Verify 'None' option is NOT available
  4. Verify Continue button is disabled until subrace selected
  5. Select High Elf
  6. Verify Continue button enables
  7. Go back and select Tiefling (if available with optional subraces)
  8. Navigate to subrace step
  9. Verify 'None' option IS available
  10. Verify Continue button is enabled even without subrace selection

**Expected Results:**
  - Required subraces (like Elf) must have a subrace selected
  - 'None' option only appears for races with optional subraces
  - Continue button respects required vs optional subrace rules

#### 2.4. Class - Cannot proceed without selection

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Navigate to class step
  2. Verify Continue button is disabled
  3. Click on a class card
  4. Verify Continue button text updates to 'Continue with [Class Name]'
  5. Verify Continue button becomes enabled

**Expected Results:**
  - Cannot proceed without selecting a class
  - Button dynamically shows selected class name

#### 2.5. Abilities - Standard Array validation

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Navigate to abilities step
  2. Select Standard Array method
  3. Verify pre-defined values appear: 15, 14, 13, 12, 10, 8
  4. Verify each value can only be assigned once
  5. Assign values to abilities via dropdowns
  6. Try to assign the same value to two abilities
  7. Verify validation prevents duplicate assignments
  8. Complete all assignments
  9. Verify Save button becomes enabled

**Expected Results:**
  - Standard array values (15,14,13,12,10,8) can only be used once each
  - Cannot save until all six abilities have unique values assigned
  - Dropdowns update to prevent duplicate selection

#### 2.6. Abilities - Point Buy validation

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Navigate to abilities step
  2. Select Point Buy method
  3. Verify starting points available (typically 27)
  4. Increase an ability score to maximum (15 before racial bonuses)
  5. Verify point cost calculation is correct
  6. Try to spend more points than available
  7. Verify validation prevents overspending
  8. Verify abilities cannot go below 8 or above 15 in point buy
  9. Reset to valid point distribution
  10. Verify Save button enables when points = 0

**Expected Results:**
  - Point buy correctly calculates costs (scores 14-15 cost more)
  - Cannot exceed 27 points (or configured max)
  - Cannot set scores below 8 or above 15 before racial bonuses
  - Save button only enables when all points are spent

#### 2.7. Abilities - Manual entry validation

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Navigate to abilities step
  2. Select Manual method
  3. Enter score of 2 (below minimum 3)
  4. Verify validation error appears
  5. Verify Save button is disabled
  6. Enter score of 21 (above maximum 20)
  7. Verify validation error appears
  8. Enter valid score of 10
  9. Complete all six abilities with valid scores (3-20)
  10. Verify Save button becomes enabled

**Expected Results:**
  - Manual entry enforces 3-20 range per ability
  - Validation errors display for out-of-range values
  - Save button only enables when all scores are valid

#### 2.8. Proficiencies - Enforces choice limits

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Create Fighter (gets 2 skill choices)
  2. Navigate to proficiencies step
  3. Verify instruction text shows 'Choose 2 skills'
  4. Select first skill
  5. Select second skill
  6. Verify all other skills become disabled/unselectable
  7. Try to select a third skill
  8. Verify selection is prevented
  9. Verify Next button is enabled (required choices complete)

**Expected Results:**
  - Cannot select more proficiencies than allowed
  - UI disables additional selections when limit reached
  - Next button enables when required proficiency count is met

#### 2.9. Spells - Enforces spell slot limits

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Create Wizard (gets 3 cantrips, 6 level-1 spells)
  2. Navigate to spells step
  3. Verify cantrip section shows 'Choose 3 cantrips'
  4. Select 3 cantrips
  5. Verify additional cantrips become unselectable
  6. Verify level 1 section shows 'Choose 6 spells'
  7. Select 6 level 1 spells
  8. Verify additional level 1 spells become unselectable
  9. Verify Next button is enabled

**Expected Results:**
  - Cannot select more cantrips than class allows
  - Cannot select more spells known than class allows
  - UI correctly disables spells when limit reached
  - Next button enables when all required spell choices complete

#### 2.10. Details - Name is required

**File:** `tests/e2e/character-wizard-validation.spec.ts`

**Steps:**
  1. Navigate to details step
  2. Leave name field empty
  3. Try to click Next
  4. Verify Next button is disabled or validation error appears
  5. Enter a name with special characters '@#$%'
  6. Verify validation (may allow or disallow based on rules)
  7. Enter valid name 'Aragorn'
  8. Verify Next button becomes enabled

**Expected Results:**
  - Name field is required to proceed
  - Character names validate according to business rules
  - Next button only enables with valid name

### 3. Navigation Tests

**Seed:** `N/A`

#### 3.1. Back button is disabled on first step

**File:** `tests/e2e/character-wizard-navigation.spec.ts`

**Steps:**
  1. Navigate to /characters/new/sourcebooks
  2. Locate Back button in wizard footer
  3. Verify Back button is disabled (has disabled attribute or disabled styling)

**Expected Results:**
  - Back button is disabled on the first step (sourcebooks)
  - User cannot go back from first step

#### 3.2. Back button works on subsequent steps

**File:** `tests/e2e/character-wizard-navigation.spec.ts`

**Steps:**
  1. Complete sourcebooks step
  2. Proceed to race step
  3. Verify Back button is enabled
  4. Click Back button
  5. Verify URL returns to /characters/new/sourcebooks
  6. Verify sourcebook selection is preserved

**Expected Results:**
  - Back button is enabled after first step
  - Clicking Back navigates to previous step
  - Previous selections are preserved when going back

#### 3.3. Navigation preserves selections when moving back and forth

**File:** `tests/e2e/character-wizard-navigation.spec.ts`

**Steps:**
  1. Select PHB, proceed to race
  2. Select Human, proceed to class
  3. Select Fighter, proceed to background
  4. Click Back to return to class
  5. Verify Fighter is still shown as selected
  6. Click Back to return to race
  7. Verify Human is still shown as selected (Continue button shows 'Continue with Human')
  8. Click Next to return to class
  9. Verify Fighter is still selected
  10. Click Next to return to background
  11. Verify navigation works bidirectionally with preserved state

**Expected Results:**
  - All selections persist when navigating backwards
  - All selections persist when navigating forwards again
  - No data loss occurs during back/forth navigation
  - Continue buttons show selected entity names when returning to steps

#### 3.4. Direct URL navigation works for valid steps

**File:** `tests/e2e/character-wizard-navigation.spec.ts`

**Steps:**
  1. Navigate directly to /characters/new/race
  2. Verify race selection page loads
  3. Navigate directly to /characters/new/abilities
  4. Verify abilities page loads
  5. Navigate directly to /characters/new/review
  6. Verify review page loads (may be empty if no character in progress)

**Expected Results:**
  - Valid step URLs load correctly when accessed directly
  - Wizard handles direct navigation gracefully
  - No crashes occur from direct URL access

#### 3.5. Invalid step shows 404 error

**File:** `tests/e2e/character-wizard-navigation.spec.ts`

**Steps:**
  1. Navigate to /characters/new/invalid-step-name
  2. Verify 404 error page is displayed
  3. Verify error message indicates unknown wizard step

**Expected Results:**
  - Invalid step URLs return 404 status
  - User-friendly error message is shown
  - Application does not crash

#### 3.6. Sidebar progress indicator shows current step

**File:** `tests/e2e/character-wizard-navigation.spec.ts`

**Steps:**
  1. Navigate to sourcebooks step
  2. Verify progress indicator/bar is visible
  3. Verify sourcebooks step is highlighted as active
  4. Proceed to race step
  5. Verify race step is now highlighted as active
  6. Verify sourcebooks step shows as completed

**Expected Results:**
  - Progress indicator correctly highlights active step
  - Completed steps are visually marked as complete
  - Progress indicator updates as user navigates through wizard

#### 3.7. Clicking completed step in sidebar navigates there

**File:** `tests/e2e/character-wizard-navigation.spec.ts`

**Steps:**
  1. Complete sourcebooks step
  2. Complete race step
  3. Now on class step
  4. Locate sidebar with step list
  5. Click on 'Race' step item in sidebar
  6. Verify navigation to /characters/new/race
  7. Verify race selection is still preserved

**Expected Results:**
  - Sidebar step items are clickable for completed steps
  - Clicking sidebar item navigates to that step
  - Selections remain preserved when navigating via sidebar

#### 3.8. Cannot skip ahead to incomplete steps via sidebar

**File:** `tests/e2e/character-wizard-navigation.spec.ts`

**Steps:**
  1. Start wizard at sourcebooks
  2. Locate sidebar
  3. Attempt to click on 'Abilities' step (far ahead)
  4. Verify click is prevented or does nothing
  5. Verify user remains on current step

**Expected Results:**
  - Future/incomplete steps are disabled in sidebar
  - User cannot skip ahead by clicking sidebar items
  - Wizard enforces sequential completion

### 4. Conditional Step Logic

**Seed:** `N/A`

#### 4.1. Subrace step skipped when race has no subraces

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select Human race (has no subraces)
  2. Click Continue
  3. Verify URL goes directly to /characters/new/class
  4. Verify subrace step was skipped

**Expected Results:**
  - Wizard skips subrace step for races without subraces
  - Navigation proceeds directly from race to class

#### 4.2. Subrace step shown when race has subraces

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select Elf race (has subraces: High Elf, Wood Elf, Dark Elf)
  2. Click Continue
  3. Verify URL goes to /characters/new/subrace
  4. Verify subrace options are displayed
  5. Select High Elf
  6. Click Continue
  7. Verify URL proceeds to /characters/new/class

**Expected Results:**
  - Subrace step appears for races with subraces
  - Subrace options match the selected race
  - After subrace selection, wizard proceeds to class

#### 4.3. Size step shown for races with size choices

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select a race that offers size choice (e.g., Custom Lineage: Small or Medium)
  2. Complete race/subrace steps
  3. Verify size step appears
  4. Verify size options (Small, Medium) are presented
  5. Select Medium
  6. Click Continue
  7. Verify wizard proceeds to next step

**Expected Results:**
  - Size step only appears for races with size choices
  - Correct size options are presented
  - Selection is saved and wizard continues

#### 4.4. Subclass step skipped for classes that choose at level 3

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select Fighter class (chooses subclass at level 3)
  2. Click Continue
  3. Verify URL goes directly to /characters/new/background
  4. Verify subclass step was skipped

**Expected Results:**
  - Subclass step skipped for classes with subclass_level > 1
  - Wizard proceeds from class to background for Fighter

#### 4.5. Subclass step shown for classes that choose at level 1

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select Cleric class (chooses subclass at level 1)
  2. Click Continue
  3. Verify URL goes to /characters/new/subclass
  4. Verify subclass options are displayed (Life, Light, War, etc.)
  5. Select Life Domain
  6. Click Continue
  7. Verify wizard proceeds to background

**Expected Results:**
  - Subclass step appears for Cleric, Sorcerer, Warlock (level 1 subclass)
  - Subclass options match the selected class
  - After subclass selection, wizard proceeds to background

#### 4.6. Feats step shown for Variant Human

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select Variant Human race (grants bonus feat)
  2. Complete race, class, background steps
  3. Complete abilities step
  4. Verify feats step appears after abilities
  5. Verify feat selection options are displayed
  6. Select a feat
  7. Click Continue
  8. Verify wizard proceeds to next step

**Expected Results:**
  - Feats step appears for races that grant bonus feat
  - Feat selection is available and required
  - Wizard continues after feat selection

#### 4.7. Feats step skipped for standard races without feat grants

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select standard Human (no bonus feat)
  2. Complete abilities step
  3. Verify wizard skips feats step
  4. Verify next step is proficiencies or other standard step

**Expected Results:**
  - Feats step is skipped if race doesn't grant bonus feat
  - Wizard proceeds to proficiencies after abilities

#### 4.8. Proficiencies step skipped if no choices

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Create character with race/class/background combo that grants no proficiency choices
  2. Complete abilities step
  3. Verify proficiencies step is skipped or shows 'No proficiency choices' and auto-continues
  4. Verify wizard proceeds to languages or equipment

**Expected Results:**
  - Proficiencies step is skipped if pending_choices.proficiencies == 0
  - Wizard automatically moves to next step

#### 4.9. Languages step skipped if no choices

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Create character with no language choices remaining
  2. Complete proficiencies
  3. Verify languages step is skipped
  4. Verify wizard proceeds directly to equipment

**Expected Results:**
  - Languages step only appears if pending_choices.languages > 0
  - Wizard skips languages if no choices available

#### 4.10. Feature choices step shown for classes with fighting styles

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select Fighter class (grants fighting style choice at level 1)
  2. Complete abilities step
  3. Complete proficiencies
  4. Verify feature-choices step appears
  5. Verify fighting style options are presented
  6. Select a fighting style (e.g., Defense)
  7. Click Continue
  8. Verify wizard proceeds

**Expected Results:**
  - Feature choices step appears for classes with optional features at level 1
  - Fighting style options are correctly displayed
  - Selection is saved and wizard continues

#### 4.11. Spells step shown only for spellcasters

**File:** `tests/e2e/character-wizard-conditional-steps.spec.ts`

**Steps:**
  1. Select Fighter class (not a spellcaster)
  2. Complete all prior steps
  3. Verify spells step is skipped
  4. Verify wizard goes from equipment to details
  5. Go back and create Wizard
  6. Complete all steps up to spells
  7. Verify spells step appears
  8. Verify spell selection is available

**Expected Results:**
  - Spells step only appears for classes with spellcasting
  - Non-spellcasters skip spells step entirely
  - Spellcasters see cantrip and spell selection

### 5. State Persistence

**Seed:** `N/A`

#### 5.1. Wizard state persists across page refresh

**File:** `tests/e2e/character-wizard-persistence.spec.ts`

**Steps:**
  1. Start wizard and complete sourcebooks, race, class steps
  2. Note the character public_id from URL (e.g., /characters/new becomes /characters/{publicId}/edit)
  3. Refresh the page (F5)
  4. Verify wizard loads at current step
  5. Verify race selection is still visible/saved
  6. Verify class selection is still visible/saved
  7. Navigate back to previous steps
  8. Verify all selections are preserved after refresh

**Expected Results:**
  - Wizard state is restored after page refresh
  - User can continue from where they left off
  - All selections remain intact after refresh

#### 5.2. Wizard handles browser back/forward buttons

**File:** `tests/e2e/character-wizard-persistence.spec.ts`

**Steps:**
  1. Complete sourcebooks step, go to race
  2. Select race, go to class
  3. Click browser back button
  4. Verify wizard returns to race step
  5. Verify race selection is preserved
  6. Click browser forward button
  7. Verify wizard returns to class step
  8. Verify wizard state is consistent

**Expected Results:**
  - Browser back/forward buttons work correctly
  - Wizard step changes match browser history
  - State remains consistent with browser navigation

#### 5.3. Multiple wizard sessions can coexist (different tabs)

**File:** `tests/e2e/character-wizard-persistence.spec.ts`

**Steps:**
  1. Start wizard in Tab 1, select Human Fighter
  2. Open new tab (Tab 2), start new wizard
  3. Select Elf Wizard in Tab 2
  4. Return to Tab 1
  5. Verify Tab 1 still shows Human Fighter
  6. Continue Tab 1 wizard to completion
  7. Verify Human Fighter is created
  8. Return to Tab 2
  9. Verify Elf Wizard selections are intact
  10. Complete Tab 2 wizard
  11. Verify Elf Wizard is created as separate character

**Expected Results:**
  - Each wizard session has independent state (different public_ids)
  - Selections in one tab don't affect the other
  - Both characters can be created successfully

### 6. Error Handling

**Seed:** `N/A`

#### 6.1. API failure during race selection shows error

**File:** `tests/e2e/character-wizard-errors.spec.ts`

**Steps:**
  1. Mock API to return 500 error on POST /characters
  2. Select a race
  3. Click Continue
  4. Verify error toast/message appears
  5. Verify error message is user-friendly
  6. Verify user remains on race step
  7. Un-mock API
  8. Click Continue again
  9. Verify successful save and navigation

**Expected Results:**
  - API errors are caught and displayed to user
  - User-friendly error messages shown (not raw API errors)
  - User can retry after fixing issue
  - Wizard doesn't crash on API failure

#### 6.2. Network timeout shows appropriate error

**File:** `tests/e2e/character-wizard-errors.spec.ts`

**Steps:**
  1. Mock API to delay response beyond timeout threshold
  2. Select a class
  3. Click Continue
  4. Verify loading state appears
  5. Wait for timeout
  6. Verify timeout error message appears
  7. Verify user can retry

**Expected Results:**
  - Loading states are shown during API calls
  - Timeout errors are handled gracefully
  - User receives clear feedback about network issues

#### 6.3. Duplicate public_id collision is handled

**File:** `tests/e2e/character-wizard-errors.spec.ts`

**Steps:**
  1. Start wizard
  2. Mock API to return 422 error for public_id collision on first attempt
  3. Mock API to succeed on second attempt
  4. Select race and continue
  5. Verify retry logic automatically generates new public_id
  6. Verify character is created successfully on retry
  7. Verify user doesn't see collision error (handled internally)

**Expected Results:**
  - Public ID collisions are retried automatically (up to 3 times)
  - User doesn't see collision errors (handled transparently)
  - Character creation succeeds on retry

#### 6.4. Invalid character data shows validation errors

**File:** `tests/e2e/character-wizard-errors.spec.ts`

**Steps:**
  1. Navigate to details step
  2. Enter extremely long name (> character limit)
  3. Try to save
  4. Verify validation error appears
  5. Verify specific field is highlighted
  6. Correct the input to valid value
  7. Verify error clears
  8. Verify save succeeds

**Expected Results:**
  - Client-side validation catches invalid input
  - Field-specific error messages are shown
  - Errors clear when input is corrected
  - Save only proceeds with valid data

### 7. Edge Cases

**Seed:** `N/A`

#### 7.1. Changing race after class selection clears dependent choices

**File:** `tests/e2e/character-wizard-edge-cases.spec.ts`

**Steps:**
  1. Select Human race, Fighter class
  2. Complete proficiency choices (select 2 skills)
  3. Navigate back to race step
  4. Change race to Elf
  5. Verify confirmation modal appears warning about changes
  6. Confirm the change
  7. Navigate forward to proficiencies
  8. Verify previous proficiency selections may be cleared/reset
  9. Verify new racial proficiencies are reflected

**Expected Results:**
  - Changing race shows confirmation warning
  - Backend regenerates choices based on new race
  - User is informed about potential data loss
  - Wizard remains in valid state after race change

#### 7.2. Changing class after proficiencies clears class-specific choices

**File:** `tests/e2e/character-wizard-edge-cases.spec.ts`

**Steps:**
  1. Select Fighter class
  2. Complete proficiencies (select Athletics and Acrobatics)
  3. Navigate back to class
  4. Change class to Wizard
  5. Verify confirmation modal appears
  6. Confirm the change
  7. Navigate to proficiencies
  8. Verify proficiency choices are reset (Fighter skills cleared, Wizard skills available)
  9. Complete new proficiency choices

**Expected Results:**
  - Changing class shows confirmation warning
  - Class-specific choices (proficiencies, features) are regenerated
  - User understands previous choices may be lost

#### 7.3. Completing wizard with optional steps skipped

**File:** `tests/e2e/character-wizard-edge-cases.spec.ts`

**Steps:**
  1. Create character with race/class/background that has no language choices
  2. Create character with non-spellcaster class
  3. Complete all required steps
  4. Verify optional steps (languages, spells) are skipped
  5. Reach review step
  6. Verify review shows correct summary without optional sections
  7. Click Finish
  8. Verify character is created successfully with valid data

**Expected Results:**
  - Wizard allows completion even when optional steps are skipped
  - Review accurately reflects what was configured
  - Character is created with all required data

#### 7.4. Search functionality filters entities correctly

**File:** `tests/e2e/character-wizard-edge-cases.spec.ts`

**Steps:**
  1. Navigate to race selection
  2. Type 'Elf' in search box
  3. Verify only Elf races are displayed (Elf, High Elf, Wood Elf, etc.)
  4. Verify Human is not visible
  5. Clear search
  6. Verify all races are displayed again
  7. Type nonsense text 'XYZABC'
  8. Verify empty state is shown (no results)
  9. Verify helpful message like 'No races found'

**Expected Results:**
  - Search filters entity lists in real-time
  - Search is case-insensitive
  - Empty state is shown when no matches found
  - Clearing search restores full list

#### 7.5. Equipment mode choice (starting gold vs equipment pack)

**File:** `tests/e2e/character-wizard-edge-cases.spec.ts`

**Steps:**
  1. Reach equipment step
  2. Verify equipment mode choice is presented (if available)
  3. Select 'Starting Equipment' mode
  4. Verify equipment pack options are shown
  5. Select an equipment pack
  6. Go back to equipment mode
  7. Change to 'Starting Gold' mode
  8. Verify confirmation modal warns about clearing equipment selections
  9. Confirm
  10. Verify starting gold amount is displayed
  11. Verify equipment pack selections are cleared

**Expected Results:**
  - Equipment mode can be changed
  - Changing mode shows confirmation for data loss
  - Starting gold and equipment pack modes are mutually exclusive
  - Wizard respects selected equipment mode

#### 7.6. Ability score bonuses from race are calculated and displayed

**File:** `tests/e2e/character-wizard-edge-cases.spec.ts`

**Steps:**
  1. Select Mountain Dwarf race (+2 STR, +2 CON)
  2. Complete race and class steps
  3. Navigate to abilities step
  4. Select Standard Array
  5. Assign base scores (e.g., STR=15, CON=14)
  6. Verify UI shows racial bonuses applied
  7. Verify final scores are displayed (STR=17, CON=16)
  8. Proceed to review
  9. Verify review shows final ability scores with racial bonuses

**Expected Results:**
  - Racial bonuses are calculated correctly
  - UI clearly shows base score + racial bonus = final score
  - Review step displays final scores after all modifiers

#### 7.7. Review step displays complete character summary

**File:** `tests/e2e/character-wizard-edge-cases.spec.ts`

**Steps:**
  1. Complete entire wizard (Human Fighter with all choices)
  2. Reach review step
  3. Verify race (Human) is displayed
  4. Verify class (Fighter) and level (1) are displayed
  5. Verify background (Soldier) is displayed
  6. Verify ability scores are displayed with modifiers
  7. Verify selected proficiencies are listed
  8. Verify selected equipment is listed
  9. Verify character name is displayed
  10. Verify alignment is displayed
  11. Verify AC, HP, and other stats are shown (if available)
  12. Click 'Edit' links to navigate back to specific steps (if available)
  13. Return to review
  14. Click Finish

**Expected Results:**
  - Review displays comprehensive character summary
  - All selections from wizard are visible on review
  - User can navigate back to edit specific sections
  - Finish button completes character creation

### 8. Accessibility

**Seed:** `N/A`

#### 8.1. Keyboard navigation works throughout wizard

**File:** `tests/e2e/character-wizard-accessibility.spec.ts`

**Steps:**
  1. Navigate to wizard start
  2. Use Tab key to navigate through focusable elements
  3. Verify focus order is logical (top to bottom, left to right)
  4. Use Enter/Space to select race card
  5. Use Tab to reach Continue button
  6. Press Enter to proceed
  7. Verify keyboard-only navigation completes a step

**Expected Results:**
  - All interactive elements are keyboard accessible
  - Focus order follows logical reading order
  - Enter/Space keys activate buttons and selections
  - Wizard can be completed without mouse

#### 8.2. Screen reader announcements for step changes

**File:** `tests/e2e/character-wizard-accessibility.spec.ts`

**Steps:**
  1. Enable screen reader testing mode
  2. Navigate from sourcebooks to race
  3. Verify aria-live region announces step change
  4. Verify step heading has appropriate aria-label or role
  5. Select a race
  6. Verify selection is announced
  7. Proceed to next step
  8. Verify new step is announced

**Expected Results:**
  - Step changes are announced to screen readers
  - Selections are announced when made
  - Form fields have proper labels
  - Error messages are associated with fields via aria-describedby

#### 8.3. Focus management when navigating steps

**File:** `tests/e2e/character-wizard-accessibility.spec.ts`

**Steps:**
  1. Complete race step and proceed to class
  2. Verify focus moves to main heading or first interactive element
  3. Navigate back to race
  4. Verify focus is managed appropriately
  5. Verify user doesn't lose focus or jump to unexpected element

**Expected Results:**
  - Focus is programmatically moved when step changes
  - Focus lands on step heading or first form field
  - Focus doesn't remain on now-hidden elements

#### 8.4. Color contrast meets WCAG standards

**File:** `tests/e2e/character-wizard-accessibility.spec.ts`

**Steps:**
  1. Inspect wizard elements (buttons, text, cards)
  2. Verify text has sufficient contrast ratio (4.5:1 for normal text)
  3. Test disabled state styling has sufficient contrast
  4. Test error state styling has sufficient contrast
  5. Verify focus indicators are visible and meet contrast requirements

**Expected Results:**
  - All text meets WCAG AA contrast requirements
  - Interactive elements have clear visual states
  - Focus indicators are visible against all backgrounds

### 9. Performance

**Seed:** `N/A`

#### 9.1. Race/class/background lists load within acceptable time

**File:** `tests/e2e/character-wizard-performance.spec.ts`

**Steps:**
  1. Navigate to race selection
  2. Measure time for race cards to appear
  3. Verify load time < 2 seconds
  4. Navigate to class selection
  5. Measure load time
  6. Verify < 2 seconds
  7. Navigate to background selection
  8. Measure load time
  9. Verify < 2 seconds

**Expected Results:**
  - Entity lists load quickly (< 2 seconds)
  - Loading states are shown during fetch
  - No unnecessary waterfalls or blocking requests

#### 9.2. Lazy loading of wizard steps

**File:** `tests/e2e/character-wizard-performance.spec.ts`

**Steps:**
  1. Check network tab on wizard start
  2. Verify only sourcebooks step component is loaded initially
  3. Proceed to race step
  4. Verify race step component is loaded on demand
  5. Verify subsequent steps are not pre-loaded
  6. Navigate forward through wizard
  7. Verify each step loads its component only when needed

**Expected Results:**
  - Wizard uses code splitting for step components
  - Only active step is loaded into browser
  - Initial bundle size is minimized
  - No unnecessary JavaScript is loaded upfront

#### 9.3. Spell search and filtering performs well with large lists

**File:** `tests/e2e/character-wizard-performance.spec.ts`

**Steps:**
  1. Create spellcaster (Wizard)
  2. Navigate to spells step
  3. Measure initial render time for spell list (300+ spells)
  4. Type search query 'fire'
  5. Measure time for filtered results to appear
  6. Verify filtering feels instant (< 300ms)
  7. Clear search
  8. Verify full list re-renders quickly

**Expected Results:**
  - Large spell lists render without lag
  - Search/filter is debounced and responsive
  - No perceivable delay when typing
  - Virtualization may be used for long lists
