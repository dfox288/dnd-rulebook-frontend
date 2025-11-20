/**
 * Global search endpoint - Proxies to Laravel backend
 *
 * Searches across all entity types (spells, items, races, classes, backgrounds, feats)
 * and returns results grouped by type.
 *
 * @example GET /api/search?q=fireball&limit=5
 * @example GET /api/search?q=dragon&types[]=spell&types[]=item
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    // Proxy to Laravel backend using server-side URL
    const data = await $fetch(`${config.apiBaseServer}/search`, {
      query
    })

    return data
  } catch (error: any) {
    // Transform backend errors into H3 errors
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Search failed'
    })
  }
})
