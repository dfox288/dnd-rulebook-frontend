/**
 * Create character endpoint - Proxies to Laravel backend
 *
 * @example POST /api/characters { name: "Gandalf" }
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const data = await $fetch(`${config.apiBaseServer}/characters`, {
    method: 'POST',
    body
  })
  return data
})
