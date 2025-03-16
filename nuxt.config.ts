import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  server: {
    middleware: ['~/server/middleware/auth'],
  },

  typescript: {
    shim: false
  },

  compatibilityDate: '2025-03-16'
})