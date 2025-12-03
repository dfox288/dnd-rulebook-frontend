/**
 * Learn a spell for a character - Proxies to Laravel backend
 *
 * Adds a spell to the character's known/prepared spells.
 *
 * @example POST /api/characters/1/spells
 * Body: { spell_id: 42 }
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}/spells`, {
    method: 'POST',
    body
  })
  return data
})
