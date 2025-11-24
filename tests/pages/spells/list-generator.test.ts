import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Spell List Generator Page', () => {
  const pageContent = readFileSync(
    join(process.cwd(), 'app/pages/spells/list-generator.vue'),
    'utf-8'
  )

  it('renders the page with heading', () => {
    expect(pageContent).toContain('<h1')
    expect(pageContent).toContain('Spell List Generator')
  })

  it('displays class and level dropdowns', () => {
    // Check for both USelectMenu components (class and level dropdowns)
    const selectMenuCount = (pageContent.match(/USelectMenu/g) || []).length
    expect(selectMenuCount).toBeGreaterThanOrEqual(2)

    // Verify the dropdowns have proper labels
    expect(pageContent).toContain('Class')
    expect(pageContent).toContain('Level')
  })
})
