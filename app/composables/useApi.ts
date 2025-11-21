/**
 * API composable that provides a configured fetch client
 * for calling Nitro API proxy routes.
 *
 * All API calls now go through Nitro server routes (e.g., /api/spells)
 * which proxy to the Laravel backend. This eliminates SSR/CSR URL issues.
 *
 * @example
 * const { apiFetch } = useApi()
 * const data = await apiFetch('/spells', { query: { level: 3 } })
 */
export const useApi = () => {
  /**
   * Create a configured $fetch instance that targets Nitro routes
   * Base URL is '/api' - relative to current origin
   */
  const apiFetch = $fetch.create({
    baseURL: '/api', // Nitro routes (works in both SSR and CSR)
    onRequest({ options }) {
      // Add any auth headers here if needed in the future
      // options.headers = {
      //   ...options.headers,
      //   Authorization: `Bearer ${token}`
      // }
    },
    onResponseError({ response }) {
      // Global error handling
      console.error('API Error:', response.status, response.statusText)
    }
  })

  return {
    apiFetch
  }
}
