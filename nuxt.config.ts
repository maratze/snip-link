import { defineNuxtConfig } from 'nuxt/config'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    modules: [
        '@sidebase/nuxt-auth',
        '@vueuse/nuxt',
    ],

    auth: {
        isEnabled: true,
        globalAppMiddleware: true,
        baseURL: process.env.AUTH_ORIGIN || 'http://localhost:3000'
    },

    csrf: {
        cookieKey: 'x-csrf-token',
        headerKey: 'x-csrf-token',
        https: process.env.NODE_ENV === 'production'
    },

    middleware: ['auth', 'rateLimit', 'securityHeaders'],

    // Enable vueuse
    vueuse: {
        ssrHandlers: true,
    },

    // Enable vuetify
    build: {
        transpile: ['vuetify'], // Make sure this is here
    },

    css: [
        'vuetify/styles',
        '@mdi/font/css/materialdesignicons.min.css',
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

    // Vuetify theme configuration
    vuetify: {
        theme: {
            defaultTheme: 'light',
            themes: {
                light: {
                    colors: {
                        primary: '#673AB7',
                        secondary: '#FF4081',
                        accent: '#7C4DFF',
                        error: '#FF5252',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FFC107',
                        background: '#FAFAFA',
                        text: '#212121',
                    },
                },
                dark: {
                    colors: {
                        primary: '#2196F3',
                        secondary: '#BB86FC',
                        accent: '#82B1FF',
                        error: '#FF5252',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FFC107',
                        background: '#303030',
                        text: '#FAFAFA',
                    },
                },
            },
        },
    },

    compatibilityDate: '2025-03-16',
})