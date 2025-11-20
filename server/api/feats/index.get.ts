export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const data = await $fetch(`${config.apiBaseServer}/feats`, { query })
  return data
})
