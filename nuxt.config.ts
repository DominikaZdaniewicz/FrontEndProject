export default ({
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
    strategy: 'prefix_except_default',
    messages: {
      pl: {
        dataTable: { itemsPerPage: 'Wyświetl na stronę' }
      },
      en: {
        dataTable: { itemsPerPage: 'Items per page' }
      }
    }
  }
})
