import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    modules: [
        '@sidebase/nuxt-auth',
    ],
    auth: {
        isEnabled: true,
        globalAppMiddleware: true,
        baseURL: 'http://localhost:3000',
    },
    csrf: {
        cookieKey: 'x-csrf-token',
        headerKey: 'x-csrf-token',
        https: process.env.NODE_ENV === 'production'
    },
    middleware: ['auth', 'rateLimit', 'securityHeaders'],
})