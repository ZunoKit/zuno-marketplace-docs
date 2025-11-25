// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@nuxt/content'
  ],

  vite: {
    plugins: [tailwindcss()]
  },

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

  // Content configuration for search
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: [
        {
          lang: 'json',
          path: 'src/highlights/json.mjs'
        },
        {
          lang: 'bash',
          path: 'src/highlights/bash.mjs'
        },
        {
          lang: 'typescript',
          path: 'src/highlights/typescript.mjs'
        }
      ]
    },
    navigation: {
      fields: ['title', 'description', 'package', 'complexity']
    }
  },

  css: ['@/assets/css/main.css'],

  compatibilityDate: '2024-11-24',

  devtools: {
    enabled: true
  },

  // Runtime config for app config access
  runtimeConfig: {
    // Private keys (only available on server-side)
    // public: {
    //   // Public keys (exposed to client-side)
    // }
  }
})
