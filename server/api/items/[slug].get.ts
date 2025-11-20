/**
 * Get single item endpoint - Proxies to Laravel backend
 *
 * Supports both numeric ID and slug routing
 *
 * @example GET /api/items/123
 * @example GET /api/items/longsword
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item slug or ID is required'
    })
  }

  try {
    const data = await $fetch(`${config.apiBaseServer}/items/${slug}`)
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 404,
      statusMessage: error.message || 'Item not found'
    })
  }
})
