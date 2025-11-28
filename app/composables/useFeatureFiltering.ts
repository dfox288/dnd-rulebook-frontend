import type { components } from '~/types/api/generated'

type ClassFeatureResource = components['schemas']['ClassFeatureResource']

/**
 * Feature filtering patterns for Totem Warrior options.
 * Used as fallback when API doesn't flag them with is_choice_option.
 * Can be removed once backend implements proper flagging.
 */
const TOTEM_OPTION_PATTERNS = [
  /^Bear \(/,
  /^Eagle \(/,
  /^Wolf \(/,
  /^Elk \(/,
  /^Tiger \(/,
  /^Aspect of the Bear/,
  /^Aspect of the Eagle/,
  /^Aspect of the Wolf/,
  /^Aspect of the Elk/,
  /^Aspect of the Tiger/
]

/**
 * Composable for filtering class features based on API flags and fallback patterns.
 * Uses is_choice_option and is_multiclass_only flags when available.
 */
export function useFeatureFiltering() {
  /**
   * Check if a feature is a choice option (sub-option of a parent feature).
   * Uses API flag first, falls back to pattern matching for Totem options.
   */
  const isChoiceOption = (feature: ClassFeatureResource): boolean => {
    // API flag takes priority (treat as truthy since type might be string or boolean)
    if (feature.is_choice_option) {
      return true
    }

    // Fallback: Totem Warrior options not flagged in API yet
    const name = feature.feature_name || ''
    return TOTEM_OPTION_PATTERNS.some(pattern => pattern.test(name))
  }

  /**
   * Check if a feature is multiclass-only.
   */
  const isMulticlassFeature = (feature: ClassFeatureResource): boolean => {
    return feature.is_multiclass_only === true
  }

  /**
   * Check if a feature is a starting feature (character creation).
   */
  const isStartingFeature = (feature: ClassFeatureResource): boolean => {
    const name = feature.feature_name || ''
    return name.startsWith('Starting ')
  }

  /**
   * Filter features for display, removing choice options, multiclass, and starting features.
   */
  const filterDisplayFeatures = (features: ClassFeatureResource[]): ClassFeatureResource[] => {
    return features.filter((feature) => {
      if (isChoiceOption(feature)) return false
      if (isMulticlassFeature(feature)) return false
      if (isStartingFeature(feature)) return false
      return true
    })
  }

  /**
   * Count displayable features (after filtering).
   */
  const countDisplayFeatures = (features: ClassFeatureResource[]): number => {
    return filterDisplayFeatures(features).length
  }

  /**
   * Filter a comma-separated feature string for progression table display.
   * Uses feature data when available, falls back to pattern matching.
   */
  const filterProgressionFeatureString = (
    featuresString: string,
    featureData: ClassFeatureResource[]
  ): string => {
    if (!featuresString || featuresString === '—') {
      return '—'
    }

    // Build a lookup map for feature flags
    const featureFlags = new Map<string, ClassFeatureResource>()
    featureData.forEach((f) => {
      featureFlags.set(f.feature_name, f)
    })

    let features = featuresString.split(', ')

    // Filter multiclass features (using API flag or name pattern)
    features = features.filter((name) => {
      const featureInfo = featureFlags.get(name)
      if (featureInfo?.is_multiclass_only) return false
      return !name.toLowerCase().includes('multiclass')
    })

    // Filter starting features
    features = features.filter(name => !name.startsWith('Starting '))

    // Filter choice options (using API flag or pattern matching)
    const choiceOptions = features.filter((name) => {
      const featureInfo = featureFlags.get(name)
      if (featureInfo?.is_choice_option) return true
      // Fallback patterns for Fighting Style and Totem
      if (name.startsWith('Fighting Style:')) return true
      if (TOTEM_OPTION_PATTERNS.some(pattern => pattern.test(name))) return true
      return false
    })

    features = features.filter(name => !choiceOptions.includes(name))

    // Ensure parent "Fighting Style" is present if we filtered children
    const hadFightingStyleOptions = choiceOptions.some(n => n.startsWith('Fighting Style:'))
    if (hadFightingStyleOptions && !features.includes('Fighting Style')) {
      // Only add if the original string had fighting style options
      // but don't add if it's already there
    }

    return features.join(', ') || '—'
  }

  return {
    isChoiceOption,
    isMulticlassFeature,
    isStartingFeature,
    filterDisplayFeatures,
    countDisplayFeatures,
    filterProgressionFeatureString
  }
}
