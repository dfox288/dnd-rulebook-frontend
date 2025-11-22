import { describe, it, expect, vi } from 'vitest'
import { useEntityImage } from '~/composables/useEntityImage'

// Mock runtime config
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      imageProvider: 'stability-ai'
    }
  })
}))

describe('useEntityImage', () => {
  it('generates correct path for 256px size', () => {
    const result = useEntityImage('dragonborn', 'races', '256')
    expect(result).toBe('/images/generated/conversions/256/races/stability-ai/dragonborn.png')
  })

  it('generates correct path for 512px size', () => {
    const result = useEntityImage('dragonborn', 'races', '512')
    expect(result).toBe('/images/generated/conversions/512/races/stability-ai/dragonborn.png')
  })

  it('generates correct path for original size', () => {
    const result = useEntityImage('dragonborn', 'races', 'original')
    expect(result).toBe('/images/generated/races/stability-ai/dragonborn.png')
  })

  it('defaults to 512px when size not provided', () => {
    const result = useEntityImage('dragonborn', 'races')
    expect(result).toBe('/images/generated/conversions/512/races/stability-ai/dragonborn.png')
  })

  it('works with different entity types', () => {
    const races = useEntityImage('dragonborn', 'races', '256')
    const classes = useEntityImage('fighter', 'classes', '256')
    const spells = useEntityImage('fireball', 'spells', '256')

    expect(races).toBe('/images/generated/conversions/256/races/stability-ai/dragonborn.png')
    expect(classes).toBe('/images/generated/conversions/256/classes/stability-ai/fighter.png')
    expect(spells).toBe('/images/generated/conversions/256/spells/stability-ai/fireball.png')
  })

  it('returns null for empty slug', () => {
    const result = useEntityImage('', 'races', '256')
    expect(result).toBeNull()
  })

  it('returns null for invalid entity type', () => {
    // @ts-expect-error - Testing invalid input
    const result = useEntityImage('dragonborn', 'invalid', '256')
    expect(result).toBeNull()
  })

  it('returns null for invalid size', () => {
    // @ts-expect-error - Testing invalid input
    const result = useEntityImage('dragonborn', 'races', '128')
    expect(result).toBeNull()
  })

  it('handles slugs with special characters', () => {
    const result = useEntityImage('abi-dalzims-horrid-wilting', 'spells', '256')
    expect(result).toBe('/images/generated/conversions/256/spells/stability-ai/abi-dalzims-horrid-wilting.png')
  })
})
