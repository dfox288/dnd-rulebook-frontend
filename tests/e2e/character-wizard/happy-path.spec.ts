import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Character Creation Wizard - Happy Path
 *
 * Tests the complete character creation flow from start to finish:
 * - Sourcebook selection
 * - Race selection (Human - no subrace)
 * - Class selection (Fighter - no subclass at level 1)
 * - Background selection (Soldier)
 * - Ability score assignment (Standard Array)
 * - Proficiency choices
 * - Language choices (if applicable)
 * - Equipment selection
 * - Character details (name, alignment)
 * - Review and finish
 *
 * Expected Result: Character appears in character list
 */

test.describe('Happy Path - Complete Character Creation', () => {
  test('Create Human Fighter with Standard Array', async ({ page }) => {
    // 1. Navigate to /characters/new/sourcebooks
    await page.goto('/characters/new/sourcebooks')
    await expect(page).toHaveURL('/characters/new/sourcebooks')

    // 2. Verify sourcebooks step displays
    await expect(page.getByRole('heading', { name: /sourcebooks/i })).toBeVisible()

    // Wait for sources to load (check that count badge is visible)
    await expect(page.locator('text=/\\d+ of \\d+ selected/')).toBeVisible({ timeout: 10000 })

    // 3. Select Player's Handbook (PHB) sourcebook
    // Wait for sources to fully load (may take a moment)
    await page.waitForTimeout(1000)

    // Find and click the PHB sourcebook - look for the text "Player's Handbook"
    const phbSourceItem = page.getByText("Player's Handbook", { exact: false }).first()
    await expect(phbSourceItem).toBeVisible({ timeout: 10000 })
    await phbSourceItem.click()

    // Verify selection count updated to "1 of X selected"
    await expect(page.locator('text=/1 of \\d+ selected/')).toBeVisible()

    // 4. Click Continue to proceed to race selection
    await page.getByRole('button', { name: /continue/i }).click()

    // 5. Verify URL navigates to race step
    await expect(page).toHaveURL('/characters/new/race')
    await expect(page.getByRole('heading', { name: /race/i })).toBeVisible()

    // 6. Search for 'Human' in race search input
    const raceSearchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    await raceSearchInput.fill('Human')
    await page.waitForTimeout(500) // Debounce

    // 7. Click on Human race card (look for card with "Human" as title text)
    // The card contains multiple elements, so we look for the title specifically
    const humanCard = page.locator('h3, h4, [class*="title"]').filter({ hasText: 'Human' }).first()
    await expect(humanCard).toBeVisible()
    await humanCard.click()

    // 8. Click 'Continue with Selection' button (button text doesn't include race name)
    const continueRaceButton = page.getByRole('button', { name: /continue/i })
    await expect(continueRaceButton).toBeEnabled()
    await continueRaceButton.click()

    // 9. Handle subrace step (Human has optional subraces like Variant Human)
    // URL changes to /{publicId}/edit/step after character is created
    await page.waitForURL(/\/characters\/.*\/(edit\/)?subrace/)
    await expect(page.getByRole('heading', { name: 'Choose Your Subrace' })).toBeVisible()

    // "No Subrace" should be pre-selected, just click continue
    const continueSubraceButton = page.getByRole('button', { name: /continue/i })
    await expect(continueSubraceButton).toBeEnabled()
    await continueSubraceButton.click()

    // 10. Verify URL navigates to class step
    await page.waitForURL(/\/characters\/.*\/(edit\/)?class/)
    await expect(page.getByRole('heading', { name: /class/i })).toBeVisible()

    // 10. Search for 'Fighter' in class search
    const classSearchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    await classSearchInput.fill('Fighter')
    await page.waitForTimeout(500)

    // 11. Click on Fighter class card
    const fighterCard = page.locator('h3, h4, [class*="title"]').filter({ hasText: 'Fighter' }).first()
    await expect(fighterCard).toBeVisible()
    await fighterCard.click()

    // 13. Click 'Continue with Selection' button
    const continueClassButton = page.getByRole('button', { name: /continue/i })
    await expect(continueClassButton).toBeEnabled()
    await continueClassButton.click()

    // 14. Verify URL navigates to background step (Fighter skips subclass - chooses at level 3)
    await page.waitForURL(/\/characters\/.*\/(edit\/)?background/)
    await expect(page.getByRole('heading', { name: /background/i })).toBeVisible()

    // 14. Click on Soldier background card
    const soldierCard = page.locator('h3, h4, [class*="title"]').filter({ hasText: 'Soldier' }).first()
    await expect(soldierCard).toBeVisible()
    await soldierCard.click()

    // 16. Click 'Continue with Selection' button
    const continueBackgroundButton = page.getByRole('button', { name: /continue/i })
    await expect(continueBackgroundButton).toBeEnabled()
    await continueBackgroundButton.click()

    // 17. Verify URL navigates to abilities step
    await page.waitForURL(/\/characters\/.*\/(edit\/)?abilities/)
    await expect(page.getByRole('heading', { name: 'Assign Ability Scores' })).toBeVisible()

    // 18. Select 'Standard Array' ability score method
    const standardArrayButton = page.getByRole('button', { name: /Standard Array/i })
    await standardArrayButton.click()
    await page.waitForTimeout(500)

    // 19. Assign ability scores via dropdown: STR=15, DEX=14, CON=13, INT=12, WIS=10, CHA=8
    // Each USelectMenu has a data-testid like "select-strength", "select-dexterity", etc.
    const abilityAssignments = [
      { testId: 'select-strength', value: '15' },
      { testId: 'select-dexterity', value: '14' },
      { testId: 'select-constitution', value: '13' },
      { testId: 'select-intelligence', value: '12' },
      { testId: 'select-wisdom', value: '10' },
      { testId: 'select-charisma', value: '8' },
    ]

    for (const ability of abilityAssignments) {
      // Click the USelectMenu trigger button (it has a button inside with the test ID)
      const selectTrigger = page.getByTestId(ability.testId)
      await expect(selectTrigger).toBeVisible()
      await selectTrigger.click()

      // Select the value from the dropdown options
      await page.getByRole('option', { name: ability.value }).click()
      await page.waitForTimeout(200) // Brief wait for dropdown to close
    }

    // 19. Click 'Save & Continue' button
    const saveAbilitiesButton = page.getByRole('button', { name: /Save.*Continue/i })
    await expect(saveAbilitiesButton).toBeVisible()
    await saveAbilitiesButton.click()

    // Wait for navigation
    await page.waitForTimeout(1000)

    // 20. Handle skills/proficiencies step
    // This step shows automatic proficiencies AND skill choices that need to be made
    let currentUrl = page.url()
    if (currentUrl.includes('/proficiencies') || currentUrl.includes('/skills')) {
      // Wait for the "Additional Choices" section to be visible
      await expect(page.getByRole('heading', { name: 'Additional Choices' })).toBeVisible({ timeout: 5000 })

      // Scroll down to see skill choices section (Fighter gets "Choose 2 skills")
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(500)

      // Look for skill choice buttons by their text content
      // Fighter can choose 2 from: Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival
      // Select Acrobatics and Perception (avoiding Athletics/Intimidation which may conflict with Soldier background)
      await page.getByRole('button', { name: 'Acrobatics', exact: true }).click()
      await page.waitForTimeout(300)
      await page.getByRole('button', { name: 'Perception', exact: true }).click()
      await page.waitForTimeout(300)

      // Verify "2/2 selected" is shown
      await expect(page.getByText('2/2 selected')).toBeVisible({ timeout: 3000 })

      // Click "Continue with Proficiencies" to save choices and proceed
      const continueButton = page.getByRole('button', { name: /Continue with Proficiencies/i })
      await expect(continueButton).toBeEnabled({ timeout: 3000 })
      await continueButton.click()
      await page.waitForTimeout(1000)
      currentUrl = page.url()
    }

    // 21. Handle feature choices step (Fighter has no level 1 feature choices)
    if (currentUrl.includes('/feature-choices') || currentUrl.includes('/features')) {
      await expect(page.getByRole('heading', { name: 'Feature Choices' })).toBeVisible({ timeout: 5000 })

      // Fighter at level 1 has no feature choices - just click Continue
      const continueFeatureButton = page.getByRole('button', { name: 'Continue' })
      await expect(continueFeatureButton).toBeVisible()
      await continueFeatureButton.click()
      await page.waitForTimeout(1000)
      currentUrl = page.url()
    }

    // 22. Handle language choices if present
    if (currentUrl.includes('/languages')) {
      await expect(page.getByRole('heading', { name: 'Choose Your Languages' })).toBeVisible({ timeout: 5000 })

      // Human gets 1 extra language choice - click Elvish button
      const elvishButton = page.getByRole('button', { name: /^Elvish/i })
      await expect(elvishButton).toBeVisible()
      await elvishButton.click()
      await page.waitForTimeout(300)

      // Verify "1/1 selected" is shown
      await expect(page.getByText('1/1 selected')).toBeVisible({ timeout: 3000 })

      // Click "Continue with Languages" to proceed
      const continueLanguagesButton = page.getByRole('button', { name: /Continue with Languages/i })
      await expect(continueLanguagesButton).toBeEnabled({ timeout: 3000 })
      await continueLanguagesButton.click()
      await page.waitForTimeout(1000)
      currentUrl = page.url()
    }

    // 23. Handle equipment step if present
    if (currentUrl.includes('/equipment')) {
      await expect(page.getByRole('heading', { name: 'Choose Your Starting Equipment' })).toBeVisible({ timeout: 5000 })

      // Wait for API calls and Vue to render
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(3000)

      // Debug: Log what buttons exist on the page
      const buttonInfo = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'))
        return buttons
          .filter(b => b.textContent?.includes('chain mail') || b.textContent?.includes('shield') || b.getAttribute('data-testid')?.startsWith('option-'))
          .map(b => ({
            text: b.textContent?.substring(0, 50),
            testid: b.getAttribute('data-testid'),
            class: b.className.substring(0, 50),
            disabled: b.disabled
          }))
      })
      console.log('Equipment buttons found:', JSON.stringify(buttonInfo, null, 2))

      // Try clicking using Playwright's native click with explicit element targeting
      // The equipment choice buttons should have data-testid="option-a", "option-b", etc.
      const optionButtons = page.locator('[data-testid^="option-"]')
      const optionCount = await optionButtons.count()
      console.log(`Found ${optionCount} option buttons`)

      if (optionCount > 0) {
        // Click each option button
        for (let i = 0; i < Math.min(optionCount, 4); i++) {
          await optionButtons.nth(i).click()
          await page.waitForTimeout(500)
        }
      } else {
        // Fallback: click buttons by text content
        console.log('No option-* buttons found, trying text-based click')
        // Skip equipment step for now and just click Next
      }

      // Wait for selections to register
      await page.waitForTimeout(1000)

      // Click "Continue with Equipment" to proceed
      const continueEquipmentButton = page.getByRole('button', { name: /Continue with Equipment/i })
      const isEnabled = await continueEquipmentButton.isEnabled()
      console.log('Continue button enabled:', isEnabled)

      if (isEnabled) {
        await continueEquipmentButton.click()
        await page.waitForTimeout(1000)
        currentUrl = page.url()
      } else {
        // Take a screenshot for debugging
        await page.screenshot({ path: 'equipment-debug.png', fullPage: true })
        throw new Error('Continue button not enabled - equipment selections failed')
      }
    }

    // 24. Handle any additional languages step (some equipment may grant language choices)
    currentUrl = page.url()
    if (currentUrl.includes('/languages')) {
      await expect(page.getByRole('heading', { name: 'Choose Your Languages' })).toBeVisible({ timeout: 5000 })

      // Check if there are language choices to make
      const languageButtons = page.locator('[data-testid^="option-"]')
      const langCount = await languageButtons.count()

      if (langCount > 0) {
        // Select first available language
        await languageButtons.first().click()
        await page.waitForTimeout(500)
      }

      // Click Continue with Languages
      const continueLanguagesBtn = page.getByRole('button', { name: /Continue with Languages/i })
      if (await continueLanguagesBtn.isEnabled()) {
        await continueLanguagesBtn.click()
        await page.waitForTimeout(1000)
      } else {
        // No choices needed, click Next
        await page.getByRole('button', { name: 'Next' }).click()
        await page.waitForTimeout(1000)
      }
    }

    // 25. Verify we're at details step and enter character name
    await expect(page).toHaveURL(/\/details/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: /details/i })).toBeVisible({ timeout: 5000 })

    // Find and fill the character name input using getByLabel
    const nameInput = page.getByLabel(/character name/i).or(page.getByLabel(/^name$/i))
    await expect(nameInput).toBeVisible({ timeout: 5000 })
    await nameInput.clear()
    await nameInput.fill('Thorin Ironforge')
    await page.waitForTimeout(300)

    // 26. Click Continue button to proceed to review
    const continueDetailsButton = page.getByTestId('continue-btn')
    await expect(continueDetailsButton).toBeEnabled({ timeout: 3000 })
    await continueDetailsButton.click()

    // 27. Verify review page shows character preview
    await expect(page).toHaveURL(/\/review/)
    // The review page shows the character sheet preview with character name as the main heading
    await expect(page.getByRole('heading', { name: 'Thorin Ironforge', level: 1 })).toBeVisible({ timeout: 5000 })

    // Verify character info is displayed in subtitle (Human (Medium) • Fighter 1 • Soldier)
    await expect(page.getByText('Human (Medium)')).toBeVisible()
    await expect(page.getByText('Fighter 1')).toBeVisible()
    await expect(page.getByText('Soldier').first()).toBeVisible()

    // 28. Click 'Finish' button to complete character creation
    const finishButton = page.getByRole('button', { name: /finish/i })
    await expect(finishButton).toBeVisible({ timeout: 5000 })
    await finishButton.click()

    // 30. Verify redirect to /characters list page
    await page.waitForTimeout(2000)
    await expect(page).toHaveURL('/characters')

    // 31. Verify new character appears in the list
    await page.waitForSelector('a[href*="/characters/"]', { timeout: 10000 })
    // Use .first() since there may be multiple characters with the same name from previous test runs
    await expect(page.getByText('Thorin Ironforge').first()).toBeVisible()

    // Verify level and class are shown on at least one character card
    await expect(page.getByText('Fighter').first()).toBeVisible()
  })
})
