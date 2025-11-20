/**
 * List item types endpoint - Proxies to Laravel backend
 *
 * Returns item categories (Weapon, Armor, Potion, etc.)
 * Used for filter dropdowns on items list page
 *
 * @example GET /api/item-types
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const data = await $fetch(`${config.apiBaseServer}/item-types`)
  return data
})
