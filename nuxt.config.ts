export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  modules: ['@nuxtjs/i18n', '@sidebase/nuxt-auth'],

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'pl', name: 'Polski', file: 'pl.json' },
    ],
    langDir: 'locales/',
    defaultLocale: 'en',
    strategy: 'prefix_except_default'
  },

  nitro: {
    routeRules: {
      '/api/**': {
        proxy: 'http://localhost:5056/api/**'
      },
      '/api/import': {
        proxy: 'http://localhost:5056/import'
      }
    }
  },

  auth: {
    baseURL: 'http://localhost:5056',
    sessionRefresh: {
      enableOnWindowFocus: true,
    },
    provider: {
      type: "local",
      endpoints: {
        signIn: {
          path: "/auth/login",
          method: "post",
        },
        getSession: {
          path: "/auth/users/current",
          method: "get",
        },
        signOut: {
          path: "/auth/logout",
          method: "get",
        },
        signUp: {
          path: "/auth/users",
          method: "post",
        },
      },
      token: {
        type: "Bearer",
        signInResponseTokenPointer: "/token",
        headerName: "Authorization",
        cookieName: "auth.token",
        maxAgeInSeconds: 60 * 60 * 8,
        sameSiteAttribute: "lax",
      },
      refresh: {
        isEnabled: true,
        endpoint: {
          path: "auth/refresh-token",
          method: "post",
        },
        refreshOnlyToken: false,
        token: {
          cookieName: "auth.refresh-token",
          maxAgeInSeconds: 60 * 60 * 24 * 7, // 7 dni
          sameSiteAttribute: "lax",
          refreshResponseTokenPointer: "/token",
        },
      },
    },
  },
})