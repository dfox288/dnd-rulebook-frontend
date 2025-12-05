// server/api/characters/[id]/languages/populate.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}/languages/populate`, {
    method: 'POST'
  })

  return data
})
