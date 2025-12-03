/**
 * Get available spells for a character - Proxies to Laravel backend
 *
 * Returns spells that the character can learn based on their class's spell list.
 *
 * @example GET /api/characters/1/available-spells?max_level=1
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  // Build query string for max_level parameter
  const queryString = query.max_level ? `?max_level=${query.max_level}` : ''

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}/available-spells${queryString}`)
  return data
})
