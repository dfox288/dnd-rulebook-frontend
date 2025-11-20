export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Race slug required' })
  const data = await $fetch(`${config.apiBaseServer}/races/${slug}`)
  return data
})
