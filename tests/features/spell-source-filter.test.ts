import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useMeilisearchFilters } from '~/composables/useMeilisearchFilters'

/**
 * Spell Source Filter Integration Tests
 *
 * Tests the integration of source book filtering in the spells page.
 * Verifies that the filter generates correct Meilisearch syntax and
 * handles multi-select correctly.
 */
describe('Spell Source Filter Integration', () => {
  it('generates correct Meilisearch filter for single source', () => {
    const selectedSources = ref(['PHB'])

    const { queryParams } = useMeilisearchFilters([
      { ref: selectedSources, field: 'source_codes', type: 'in' }
    ])

    expect(queryParams.value).toEqual({
      filter: 'source_codes IN [PHB]'
    })
  })

  it('generates correct Meilisearch filter for multiple sources', () => {
    const selectedSources = ref(['PHB', 'XGE', 'TCE'])

    const { queryParams } = useMeilisearchFilters([
      { ref: selectedSources, field: 'source_codes', type: 'in' }
    ])

    expect(queryParams.value).toEqual({
      filter: 'source_codes IN [PHB, XGE, TCE]'
    })
  })

  it('skips filter when no sources selected', () => {
    const selectedSources = ref([])

    const { queryParams } = useMeilisearchFilters([
      { ref: selectedSources, field: 'source_codes', type: 'in' }
    ])

    expect(queryParams.value).toEqual({})
  })

  it('updates filter reactively when sources change', () => {
    const selectedSources = ref(['PHB'])

    const { queryParams } = useMeilisearchFilters([
      { ref: selectedSources, field: 'source_codes', type: 'in' }
    ])

    expect(queryParams.value).toEqual({
      filter: 'source_codes IN [PHB]'
    })

    // Add another source
    selectedSources.value.push('XGE')

    expect(queryParams.value).toEqual({
      filter: 'source_codes IN [PHB, XGE]'
    })

    // Clear all sources
    selectedSources.value = []

    expect(queryParams.value).toEqual({})
  })

  it('combines source filter with other filters', () => {
    const selectedSources = ref(['PHB', 'XGE'])
    const selectedLevel = ref(3)
    const concentrationFilter = ref('1')

    const { queryParams } = useMeilisearchFilters([
      { ref: selectedLevel, field: 'level' },
      { ref: concentrationFilter, field: 'concentration', type: 'boolean' },
      { ref: selectedSources, field: 'source_codes', type: 'in' }
    ])

    expect(queryParams.value).toEqual({
      filter: 'level = 3 AND concentration = true AND source_codes IN [PHB, XGE]'
    })
  })
})
