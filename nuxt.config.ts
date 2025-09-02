import type { D1DatabaseConfig } from '@nuxt/content'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxt/fonts'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/reset.css', '~/assets/css/main.css'],

  content: {
    renderer: {
      anchorLinks: false
    },
    database: process.env.NODE_ENV === 'production'
      ? {
          type: 'd1',
          bindingName: process.env.CONTENT_DATABASE_BINDING
        } as D1DatabaseConfig
      : undefined
  },

  runtimeConfig: {
    imageProvider: process.env.IMAGE_PROVIDER
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin-ext', 'latin']
    },
    families: [{ name: 'Inter', provider: 'fontsource' }]
  },

  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: './app/assets/icons'
    }]
  },

  image: {
    cloudflare: {
      baseURL: process.env.BASE_URL
    }
  }
})
