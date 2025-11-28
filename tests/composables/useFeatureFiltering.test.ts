import { describe, it, expect } from 'vitest'
import { useFeatureFiltering } from '~/composables/useFeatureFiltering'

describe('useFeatureFiltering', () => {
  // Helper to create feature objects
  const createFeature = (overrides = {}) => ({
    id: 1,
    level: 1,
    feature_name: 'Test Feature',
    description: 'Test description',
    is_optional: false,
    is_multiclass_only: false,
    is_choice_option: false,
    parent_feature_id: null,
    sort_order: 0,
    ...overrides
  })

  describe('isChoiceOption', () => {
    it('returns true when is_choice_option flag is true', () => {
      const { isChoiceOption } = useFeatureFiltering()
      const feature = createFeature({
        feature_name: 'Fighting Style: Archery',
        is_choice_option: true,
        parent_feature_id: 397
      })

      expect(isChoiceOption(feature)).toBe(true)
    })

    it('returns false when is_choice_option flag is false', () => {
      const { isChoiceOption } = useFeatureFiltering()
      const feature = createFeature({
        feature_name: 'Fighting Style',
        is_choice_option: false
      })

      expect(isChoiceOption(feature)).toBe(false)
    })

    it('falls back to pattern matching for Totem features without flag', () => {
      const { isChoiceOption } = useFeatureFiltering()

      // Totem features without is_choice_option flag (backend bug workaround)
      const totemFeatures = [
        createFeature({ feature_name: 'Bear (Path of the Totem Warrior)', is_choice_option: false }),
        createFeature({ feature_name: 'Eagle (Path of the Totem Warrior)', is_choice_option: false }),
        createFeature({ feature_name: 'Wolf (Path of the Totem Warrior)', is_choice_option: false }),
        createFeature({ feature_name: 'Aspect of the Bear (Path of the Totem Warrior)', is_choice_option: false }),
        createFeature({ feature_name: 'Aspect of the Eagle (Path of the Totem Warrior)', is_choice_option: false })
      ]

      totemFeatures.forEach((feature) => {
        expect(isChoiceOption(feature)).toBe(true)
      })
    })

    it('does not match non-totem features with similar names', () => {
      const { isChoiceOption } = useFeatureFiltering()
      const feature = createFeature({
        feature_name: 'Totem Spirit (Path of the Totem Warrior)',
        is_choice_option: false
      })

      expect(isChoiceOption(feature)).toBe(false)
    })
  })

  describe('isMulticlassFeature', () => {
    it('returns true when is_multiclass_only flag is true', () => {
      const { isMulticlassFeature } = useFeatureFiltering()
      const feature = createFeature({
        feature_name: 'Multiclass Fighter',
        is_multiclass_only: true
      })

      expect(isMulticlassFeature(feature)).toBe(true)
    })

    it('returns false when is_multiclass_only flag is false', () => {
      const { isMulticlassFeature } = useFeatureFiltering()
      const feature = createFeature({
        feature_name: 'Second Wind',
        is_multiclass_only: false
      })

      expect(isMulticlassFeature(feature)).toBe(false)
    })
  })

  describe('isStartingFeature', () => {
    it('returns true for features starting with "Starting "', () => {
      const { isStartingFeature } = useFeatureFiltering()
      const feature = createFeature({ feature_name: 'Starting Fighter' })

      expect(isStartingFeature(feature)).toBe(true)
    })

    it('returns false for regular features', () => {
      const { isStartingFeature } = useFeatureFiltering()
      const feature = createFeature({ feature_name: 'Second Wind' })

      expect(isStartingFeature(feature)).toBe(false)
    })
  })

  describe('filterDisplayFeatures', () => {
    it('filters out choice options using API flag', () => {
      const { filterDisplayFeatures } = useFeatureFiltering()
      const features = [
        createFeature({ id: 1, feature_name: 'Fighting Style', is_choice_option: false }),
        createFeature({ id: 2, feature_name: 'Fighting Style: Archery', is_choice_option: true, parent_feature_id: 1 }),
        createFeature({ id: 3, feature_name: 'Fighting Style: Defense', is_choice_option: true, parent_feature_id: 1 }),
        createFeature({ id: 4, feature_name: 'Second Wind', is_choice_option: false })
      ]

      const filtered = filterDisplayFeatures(features)

      expect(filtered).toHaveLength(2)
      expect(filtered.map(f => f.feature_name)).toEqual(['Fighting Style', 'Second Wind'])
    })

    it('filters out multiclass-only features', () => {
      const { filterDisplayFeatures } = useFeatureFiltering()
      const features = [
        createFeature({ id: 1, feature_name: 'Multiclass Fighter', is_multiclass_only: true }),
        createFeature({ id: 2, feature_name: 'Multiclass Features', is_multiclass_only: true }),
        createFeature({ id: 3, feature_name: 'Second Wind', is_multiclass_only: false })
      ]

      const filtered = filterDisplayFeatures(features)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].feature_name).toBe('Second Wind')
    })

    it('filters out starting features', () => {
      const { filterDisplayFeatures } = useFeatureFiltering()
      const features = [
        createFeature({ id: 1, feature_name: 'Starting Fighter' }),
        createFeature({ id: 2, feature_name: 'Second Wind' })
      ]

      const filtered = filterDisplayFeatures(features)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].feature_name).toBe('Second Wind')
    })

    it('filters out Totem options using pattern fallback', () => {
      const { filterDisplayFeatures } = useFeatureFiltering()
      const features = [
        createFeature({ id: 1, feature_name: 'Totem Spirit (Path of the Totem Warrior)', is_choice_option: false }),
        createFeature({ id: 2, feature_name: 'Bear (Path of the Totem Warrior)', is_choice_option: false }),
        createFeature({ id: 3, feature_name: 'Eagle (Path of the Totem Warrior)', is_choice_option: false }),
        createFeature({ id: 4, feature_name: 'Spirit Walker (Path of the Totem Warrior)', is_choice_option: false })
      ]

      const filtered = filterDisplayFeatures(features)

      expect(filtered).toHaveLength(2)
      expect(filtered.map(f => f.feature_name)).toEqual([
        'Totem Spirit (Path of the Totem Warrior)',
        'Spirit Walker (Path of the Totem Warrior)'
      ])
    })

    it('combines all filters correctly', () => {
      const { filterDisplayFeatures } = useFeatureFiltering()
      const features = [
        createFeature({ id: 1, feature_name: 'Starting Fighter' }),
        createFeature({ id: 2, feature_name: 'Multiclass Fighter', is_multiclass_only: true }),
        createFeature({ id: 3, feature_name: 'Fighting Style', is_choice_option: false }),
        createFeature({ id: 4, feature_name: 'Fighting Style: Archery', is_choice_option: true }),
        createFeature({ id: 5, feature_name: 'Second Wind', is_choice_option: false }),
        createFeature({ id: 6, feature_name: 'Bear (Path of the Totem Warrior)', is_choice_option: false })
      ]

      const filtered = filterDisplayFeatures(features)

      expect(filtered).toHaveLength(2)
      expect(filtered.map(f => f.feature_name)).toEqual(['Fighting Style', 'Second Wind'])
    })
  })

  describe('countDisplayFeatures', () => {
    it('returns count of features after filtering', () => {
      const { countDisplayFeatures } = useFeatureFiltering()
      const features = [
        createFeature({ id: 1, feature_name: 'Fighting Style', is_choice_option: false }),
        createFeature({ id: 2, feature_name: 'Fighting Style: Archery', is_choice_option: true }),
        createFeature({ id: 3, feature_name: 'Fighting Style: Defense', is_choice_option: true }),
        createFeature({ id: 4, feature_name: 'Second Wind', is_choice_option: false })
      ]

      expect(countDisplayFeatures(features)).toBe(2)
    })
  })

  describe('filterProgressionFeatureString', () => {
    it('filters out multiclass features from comma-separated string', () => {
      const { filterProgressionFeatureString } = useFeatureFiltering()
      const input = 'Multiclass Fighter, Second Wind, Multiclass Features'

      const result = filterProgressionFeatureString(input, [
        createFeature({ feature_name: 'Multiclass Fighter', is_multiclass_only: true }),
        createFeature({ feature_name: 'Second Wind', is_multiclass_only: false }),
        createFeature({ feature_name: 'Multiclass Features', is_multiclass_only: true })
      ])

      expect(result).toBe('Second Wind')
    })

    it('collapses fighting style options to parent', () => {
      const { filterProgressionFeatureString } = useFeatureFiltering()
      const input = 'Fighting Style, Fighting Style: Archery, Fighting Style: Defense, Second Wind'

      const result = filterProgressionFeatureString(input, [
        createFeature({ feature_name: 'Fighting Style', is_choice_option: false }),
        createFeature({ feature_name: 'Fighting Style: Archery', is_choice_option: true }),
        createFeature({ feature_name: 'Fighting Style: Defense', is_choice_option: true }),
        createFeature({ feature_name: 'Second Wind', is_choice_option: false })
      ])

      expect(result).toBe('Fighting Style, Second Wind')
    })

    it('filters out starting features', () => {
      const { filterProgressionFeatureString } = useFeatureFiltering()
      const input = 'Starting Fighter, Second Wind, Fighting Style'

      const result = filterProgressionFeatureString(input, [])

      expect(result).toBe('Second Wind, Fighting Style')
    })

    it('filters out Totem options using pattern fallback', () => {
      const { filterProgressionFeatureString } = useFeatureFiltering()
      const input = 'Totem Spirit, Bear (Path of the Totem Warrior), Eagle (Path of the Totem Warrior)'

      const result = filterProgressionFeatureString(input, [])

      expect(result).toBe('Totem Spirit')
    })

    it('returns em-dash for empty result', () => {
      const { filterProgressionFeatureString } = useFeatureFiltering()
      const input = 'Starting Fighter, Multiclass Fighter'

      const result = filterProgressionFeatureString(input, [
        createFeature({ feature_name: 'Multiclass Fighter', is_multiclass_only: true })
      ])

      expect(result).toBe('—')
    })

    it('handles em-dash input', () => {
      const { filterProgressionFeatureString } = useFeatureFiltering()

      expect(filterProgressionFeatureString('—', [])).toBe('—')
    })

    it('handles empty input', () => {
      const { filterProgressionFeatureString } = useFeatureFiltering()

      expect(filterProgressionFeatureString('', [])).toBe('—')
    })
  })
})
