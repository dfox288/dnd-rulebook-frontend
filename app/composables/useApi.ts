/**
 * API composable that provides the correct API base URL
 * depending on whether we're in SSR (server-side) or client-side context.
 *
 * - SSR (inside container): Uses host.docker.internal to reach host machine
 * - Client (browser): Uses localhost which the browser can reach
 */
export const useApi = () => {
  const config = useRuntimeConfig()

  /**
   * Get the appropriate API base URL based on execution context
   */
  const getApiBase = () => {
    // During SSR (server-side rendering inside Docker container)
    if (import.meta.server) {
      return 'http://host.docker.internal:8080/api/v1'
    }

    // Client-side (browser)
    return 'http://localhost:8080/api/v1'
  }

  const apiBase = getApiBase()

  /**
   * Create a configured $fetch instance with the correct base URL
   */
  const apiFetch = $fetch.create({
    baseURL: apiBase,
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
    apiBase,
    apiFetch
  }
}
