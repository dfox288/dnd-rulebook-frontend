/**
 * Update character endpoint - Proxies to Laravel backend
 *
 * @example PATCH /api/characters/1 { race_id: 5 }
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}`, {
    method: 'PATCH',
    body
  })
  return data
})
