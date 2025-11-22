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
  } catch (error) {
    const err = error as { response?: { status?: number }, message?: string }
    throw createError({
      statusCode: err.response?.status || 404,
      statusMessage: err.message || 'Item not found'
    })
  }
})
