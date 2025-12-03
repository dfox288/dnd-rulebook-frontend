/**
 * Unlearn a spell for a character - Proxies to Laravel backend
 *
 * Removes a spell from the character's known/prepared spells.
 *
 * @example DELETE /api/characters/1/spells/42
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const spellId = getRouterParam(event, 'spellId')

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}/spells/${spellId}`, {
    method: 'DELETE'
  })
  return data
})
