import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSearch } from '~/composables/useSearch'
import type { SearchResult } from '~/types/search'

describe('useSearch', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('initializes with null results, not loading, and no error', () => {
    const { results, loading, error } = useSearch()

    expect(results.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('sets loading state while searching', async () => {
    // Mock $fetch to return after a delay
    const mockFetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { spells: [] } }), 100)
      })
    })

    global.$fetch = mockFetch as any

    const { search, loading } = useSearch()

    const searchPromise = search('fireball')
    expect(loading.value).toBe(true)

    await searchPromise
    expect(loading.value).toBe(false)
  })

  it('fetches and returns search results successfully', async () => {
    const mockData: SearchResult = {
      data: {
        spells: [
          {
            id: 1,
            slug: 'fireball',
            name: 'Fireball',
            level: 3,
            casting_time: '1 action',
            range: '150 feet',
            components: 'V, S, M',
            material_components: 'a tiny ball of bat guano and sulfur',
            duration: 'Instantaneous',
            needs_concentration: false,
            is_ritual: false,
            description: 'A bright streak flashes...',
            higher_levels: 'When you cast this spell...',
          },
        ],
      },
    }

    global.$fetch = vi.fn().mockResolvedValue(mockData)

    const { search, results, error } = useSearch()
    await search('fireball')

    expect(results.value).toEqual(mockData)
    expect(error.value).toBeNull()
  })

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Network error'
    global.$fetch = vi.fn().mockRejectedValue(new Error(errorMessage))

    const { search, results, error } = useSearch()
    await search('fireball')

    expect(results.value).toBeNull()
    expect(error.value).toBe(errorMessage)
  })

  it('clears results when query is empty', async () => {
    const { search, results } = useSearch()

    // Initially set some results
    global.$fetch = vi.fn().mockResolvedValue({ data: { spells: [] } })
    await search('fire')
    expect(results.value).not.toBeNull()

    // Search with empty query should clear
    await search('')
    expect(results.value).toBeNull()
  })

  it('passes entity type filters to API', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: {} })
    global.$fetch = mockFetch

    const { search } = useSearch()
    await search('dragon', { types: ['spells', 'items'] })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        query: expect.objectContaining({
          q: 'dragon',
          types: ['spells', 'items'],
        }),
      })
    )
  })

  it('passes limit parameter to API', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: {} })
    global.$fetch = mockFetch

    const { search } = useSearch()
    await search('sword', { limit: 5 })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        query: expect.objectContaining({
          q: 'sword',
          limit: 5,
        }),
      })
    )
  })

  it('clears results using clearResults method', async () => {
    global.$fetch = vi.fn().mockResolvedValue({ data: { spells: [] } })

    const { search, results, clearResults } = useSearch()

    await search('fireball')
    expect(results.value).not.toBeNull()

    clearResults()
    expect(results.value).toBeNull()
  })
})
