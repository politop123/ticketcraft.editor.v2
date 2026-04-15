// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  devtools: { enabled: true },
  css: [],
  typescript: {
    strict: true,
    typeCheck: false,
  },
  compatibilityDate: '2026-04-15',
})
