/**
 * List spells endpoint - Proxies to Laravel backend
 *
 * Supports searching, filtering by level/school, pagination
 *
 * @example GET /api/spells?q=fire&level=3&school=1&page=1&per_page=24
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const data = await $fetch(`${config.apiBaseServer}/spells`, { query })
  return data
})
