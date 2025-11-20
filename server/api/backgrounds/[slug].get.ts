export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Background slug required' })
  const data = await $fetch(`${config.apiBaseServer}/backgrounds/${slug}`)
  return data
})
