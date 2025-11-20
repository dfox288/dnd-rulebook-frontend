// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/test-utils'
  ],

  devtools: {
    enabled: true
  },

  css: ['./app/assets/css/main.css'],

  compatibilityDate: '2025-01-15',

  runtimeConfig: {
    // Public keys (exposed to client)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1',
      apiDocsUrl: process.env.NUXT_PUBLIC_API_DOCS_URL || 'http://localhost:8080/docs/api',
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})