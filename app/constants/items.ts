/**
 * Item ID Constants
 *
 * These are database IDs for specific items that need to be referenced
 * throughout the application. Using constants prevents magic numbers
 * and makes the codebase more maintainable.
 *
 * NOTE: These IDs come from the backend database and should remain stable.
 * If the backend database is reset or reseeded, these IDs may change.
 *
 * @see http://localhost:8080/api/v1/items
 */

/**
 * Gold Piece (gp) - The standard D&D currency unit
 * Item Name: "Gold (gp)"
 * Item Slug: "gold-gp"
 */
export const ITEM_ID_GOLD_PIECE = 1860 as const

/**
 * Silver Piece (sp) - Common currency
 * Item Name: "Silver (sp)"
 * Item Slug: "silver-sp"
 */
export const ITEM_ID_SILVER_PIECE = 1861 as const

/**
 * Copper Piece (cp) - Lowest value currency
 * Item Name: "Copper (cp)"
 * Item Slug: "copper-cp"
 */
export const ITEM_ID_COPPER_PIECE = 1862 as const

/**
 * Platinum Piece (pp) - Highest value currency
 * Item Name: "Platinum (pp)"
 * Item Slug: "platinum-pp"
 */
export const ITEM_ID_PLATINUM_PIECE = 1863 as const

/**
 * Electrum Piece (ep) - Rare currency
 * Item Name: "Electrum (ep)"
 * Item Slug: "electrum-ep"
 */
export const ITEM_ID_ELECTRUM_PIECE = 1864 as const
