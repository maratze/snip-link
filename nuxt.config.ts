import { defineNuxtConfig } from 'nuxt/config'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    modules: [
        ['@sidebase/nuxt-auth', {
            baseURL: process.env.AUTH_ORIGIN || 'http://localhost:3000',
            provider: {
                type: 'local',
                endpoints: {
                    session: {
                        path: '/api/auth/session',
                    },
                },
            },
        }],
        '@vueuse/nuxt',
        async (options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                config.plugins?.push(vuetify({ autoImport: true }))
            })
        }
    ],

    runtimeConfig: {
        auth: {
            isEnabled: true,
            globalAppMiddleware: true,
        },
        csrf: {
            cookieKey: 'x-csrf-token',
            headerKey: 'x-csrf-token',
            https: process.env.NODE_ENV === 'production'
        },
    },

    build: {
        transpile: ['vuetify'],
    },

    css: [
        '@mdi/font/css/materialdesignicons.min.css',
        'vuetify/styles',
        '~/assets/main.css'
    ],

    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
        define: {
            'process.env.DEBUG': false,
        },
    },

    compatibilityDate: '2025-03-16',
})