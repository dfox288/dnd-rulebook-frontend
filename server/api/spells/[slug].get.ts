/**
 * Get single spell endpoint - Proxies to Laravel backend
 *
 * Supports both numeric ID and slug routing
 *
 * @example GET /api/spells/123
 * @example GET /api/spells/fireball
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Spell slug or ID is required'
    })
  }

  try {
    const data = await $fetch(`${config.apiBaseServer}/spells/${slug}`)
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 404,
      statusMessage: error.message || 'Spell not found'
    })
  }
})
