/**
 * Get character summary endpoint - Proxies to Laravel backend
 *
 * Returns character creation status, pending choices count,
 * and completion status for the wizard.
 *
 * @example GET /api/characters/1/summary
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}/summary`)
  return data
})
