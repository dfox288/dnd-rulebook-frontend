/**
 * Get character ability bonuses endpoint - Proxies to Laravel backend
 *
 * Returns all ability score bonuses from all sources (race, feats, etc.)
 * with metadata about source and whether the bonus came from a choice.
 *
 * @example GET /api/characters/1/ability-bonuses
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}/ability-bonuses`)
  return data
})
