/**
 * List characters endpoint - Proxies to Laravel backend
 *
 * @example GET /api/characters
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const data = await $fetch(`${config.apiBaseServer}/characters`, { query })
  return data
})
