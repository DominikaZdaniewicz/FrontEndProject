// export default defineNuxtConfig ({
//   compatibilityDate: '2025-07-15',
//   devtools: { enabled: true },
//   build: {
//     transpile: ['vuetify'],
//   },
//   css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
//   modules: ['@nuxtjs/i18n'],
//   i18n: {
//     locales: [
//       { code: 'en', name: 'English', file: 'en.json' },
//       { code: 'pl', name: 'Polski', file: 'pl.json' },
//     ],
//     langDir: 'locales/',
//     defaultLocale: 'en',
//     strategy: 'prefix_except_default',
//   },

//   $development: {
//     routeRules: {
//       '/api/**': {
//         proxy: 'http://localhost:5056/**',
//       }
//     },
//   },
// })

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  modules: ['@nuxtjs/i18n'],

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
      }
    }
  }
})