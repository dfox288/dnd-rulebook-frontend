export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Class slug required' })
  const data = await $fetch(`${config.apiBaseServer}/classes/${slug}`)
  return data
})
