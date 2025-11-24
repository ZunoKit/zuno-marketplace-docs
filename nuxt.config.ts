// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxtjs/mdc'
  ],

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', dir: 'ltr' },
      { code: 'fr', name: 'Français', dir: 'ltr' }
    ],
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  css: ['@/assets/css/main.css'],

  compatibilityDate: '2024-11-24',

  devtools: {
    enabled: true
  }
})
