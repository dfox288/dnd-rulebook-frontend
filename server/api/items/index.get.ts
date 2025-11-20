/**
 * List items endpoint - Proxies to Laravel backend
 *
 * Supports searching, filtering by type/rarity/magic, pagination
 *
 * @example GET /api/items?q=sword&type=1&rarity=rare&is_magic=true
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const data = await $fetch(`${config.apiBaseServer}/items`, { query })
  return data
})
