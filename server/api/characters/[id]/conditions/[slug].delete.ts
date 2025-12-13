/**
 * Remove a condition from a character - Proxies to Laravel backend
 *
 * @example DELETE /api/characters/1/conditions/poisoned
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const slug = getRouterParam(event, 'slug')

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}/conditions/${slug}`, {
    method: 'DELETE'
  })
  return data
})
