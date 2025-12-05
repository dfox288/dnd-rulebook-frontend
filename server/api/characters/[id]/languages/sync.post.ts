// server/api/characters/[id]/languages/sync.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  const data = await $fetch(`${config.apiBaseServer}/characters/${id}/languages/sync`, {
    method: 'POST'
  })

  return data
})
