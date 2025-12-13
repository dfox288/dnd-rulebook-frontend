/**
 * Character revival endpoint - Proxies to Laravel backend
 *
 * Atomic operation that:
 * - Sets is_dead=false
 * - Resets death saves to 0/0
 * - Sets HP (default 1, capped at max)
 * - Optionally clears exhaustion
 *
 * @example POST /api/characters/1/revive              // Revive with 1 HP
 * @example POST /api/characters/1/revive { hit_points: 999 }  // Full HP (True Resurrection)
 *
 * @see #548 - Character revival endpoint
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const data = await $fetch(`${config.apiBaseServer}/characters/${id}/revive`, {
      method: 'POST',
      body: body || {}
    })
    return data
  } catch (error: unknown) {
    const err = error as { statusCode?: number, statusMessage?: string, data?: unknown }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Failed to revive character',
      data: err.data
    })
  }
})
