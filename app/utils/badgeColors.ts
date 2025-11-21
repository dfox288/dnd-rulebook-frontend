/**
 * Badge Color Utilities
 *
 * Centralized color mapping functions for entity badges
 * using NuxtUI v4 semantic color system.
 *
 * Color Palette:
 * - error (red): High-level spells, legendary items, weapons
 * - warning (amber): Mid-high spells, rare items, tools
 * - primary (purple/teal): Cantrips, magical items, wondrous items
 * - info (blue): Low-level spells, armor, common magic
 * - success (green): Potions, consumables, uncommon items
 * - neutral (gray): Common items, default fallback
 */

/**
 * Get badge color for spell level (0-9)
 *
 * @param level - Spell level (0 = cantrip, 1-9 = spell levels)
 * @returns NuxtUI v4 semantic color name
 *
 * @example
 * getSpellLevelColor(0) // 'primary' (cantrip)
 * getSpellLevelColor(3) // 'info' (low-mid level)
 * getSpellLevelColor(7) // 'warning' (high level)
 * getSpellLevelColor(9) // 'error' (max level)
 */
export function getSpellLevelColor(level: number): string {
  if (level === 0) return 'primary' // Cantrip
  if (level <= 3) return 'info' // Low-level (1-3)
  if (level <= 6) return 'warning' // Mid-level (4-6)
  return 'error' // High-level (7-9)
}

/**
 * Get badge color for spell school code
 *
 * @param schoolCode - School abbreviation (A, C, D, EN, EV, I, N, T)
 * @returns NuxtUI v4 semantic color name
 *
 * Schools:
 * - A (Abjuration): info
 * - C (Conjuration): primary
 * - D (Divination): info
 * - EN (Enchantment): warning
 * - EV (Evocation): error
 * - I (Illusion): primary
 * - N (Necromancy): neutral
 * - T (Transmutation): success
 *
 * @example
 * getSpellSchoolColor('EV') // 'error' (Evocation - destructive)
 * getSpellSchoolColor('A')  // 'info' (Abjuration - protective)
 */
export function getSpellSchoolColor(schoolCode: string): string {
  const colorMap: Record<string, string> = {
    A: 'info', // Abjuration
    C: 'primary', // Conjuration
    D: 'info', // Divination
    EN: 'warning', // Enchantment
    EV: 'error', // Evocation
    I: 'primary', // Illusion
    N: 'neutral', // Necromancy
    T: 'success' // Transmutation
  }
  return colorMap[schoolCode] || 'info'
}

/**
 * Get badge color for item rarity
 *
 * @param rarity - Item rarity (case-insensitive)
 * @returns NuxtUI v4 semantic color name
 *
 * Rarity Scale (progressive):
 * - Common → neutral (gray)
 * - Uncommon → success (green)
 * - Rare → info (blue)
 * - Very Rare → primary (teal/purple)
 * - Legendary → warning (amber/orange)
 * - Artifact → error (red)
 *
 * @example
 * getItemRarityColor('common')    // 'neutral'
 * getItemRarityColor('legendary') // 'warning'
 * getItemRarityColor('ARTIFACT')  // 'error' (case-insensitive)
 */
export function getItemRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    'common': 'neutral', // Gray - most basic
    'uncommon': 'success', // Green - slightly better
    'rare': 'info', // Blue - notable
    'very rare': 'primary', // Teal/cyan - very valuable
    'legendary': 'warning', // Orange/amber - extremely rare
    'artifact': 'error' // Red - unique/powerful
  }
  return colors[rarity.toLowerCase()] || 'neutral'
}

/**
 * Get badge color for item type based on category
 *
 * @param typeName - Item type name (case-insensitive)
 * @returns NuxtUI v4 semantic color name
 *
 * Categories:
 * - Weapons (sword, axe, bow, etc.) → error (red)
 * - Armor & Shields → info (blue)
 * - Tools & Equipment → warning (amber)
 * - Potions & Consumables → success (green)
 * - Wondrous Items & Magical → primary (teal/purple)
 * - Other → neutral (gray)
 *
 * @example
 * getItemTypeColor('Longsword')      // 'error' (weapon)
 * getItemTypeColor('Plate Armor')    // 'info' (armor)
 * getItemTypeColor('Potion of Healing') // 'success' (potion)
 */
export function getItemTypeColor(typeName: string): string {
  const type = typeName.toLowerCase()

  // Weapons (red/error)
  if (type.includes('weapon') || type.includes('sword') || type.includes('axe')
    || type.includes('bow') || type.includes('dagger') || type.includes('mace')
    || type.includes('spear') || type.includes('hammer')) {
    return 'error'
  }

  // Armor (info/blue)
  if (type.includes('armor') || type.includes('shield')) {
    return 'info'
  }

  // Tools & Equipment (warning/amber)
  if (type.includes('tool') || type.includes('kit') || type.includes('instrument')) {
    return 'warning'
  }

  // Potions & Consumables (success/green)
  if (type.includes('potion') || type.includes('scroll') || type.includes('elixir')) {
    return 'success'
  }

  // Wondrous Items & Magical (primary/teal)
  if (type.includes('wondrous') || type.includes('ring') || type.includes('amulet')
    || type.includes('staff') || type.includes('rod') || type.includes('wand')) {
    return 'primary'
  }

  // Default
  return 'neutral'
}

/**
 * Get badge color for creature size code
 *
 * @param sizeCode - Size abbreviation (T, S, M, L, H, G)
 * @returns NuxtUI v4 semantic color name
 *
 * Size Scale (progressive):
 * - T (Tiny) → neutral (gray)
 * - S (Small) → success (green)
 * - M (Medium) → info (blue)
 * - L (Large) → warning (amber)
 * - H (Huge) → error (red)
 * - G (Gargantuan) → error (red)
 *
 * @example
 * getSizeColor('T') // 'neutral' (Tiny)
 * getSizeColor('M') // 'info' (Medium - standard)
 * getSizeColor('G') // 'error' (Gargantuan)
 */
export function getSizeColor(sizeCode: string): string {
  const colors: Record<string, string> = {
    T: 'neutral', // Tiny - gray
    S: 'success', // Small - green
    M: 'info', // Medium - blue (standard humanoid)
    L: 'warning', // Large - amber
    H: 'error', // Huge - red
    G: 'error' // Gargantuan - red
  }
  return colors[sizeCode] || 'info'
}
