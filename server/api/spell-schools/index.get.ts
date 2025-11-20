/**
 * List spell schools endpoint - Proxies to Laravel backend
 *
 * Returns the 8 D&D schools of magic (Abjuration, Conjuration, etc.)
 * Used for filter dropdowns on spell list page
 *
 * @example GET /api/spell-schools
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const data = await $fetch(`${config.apiBaseServer}/spell-schools`)
  return data
})
