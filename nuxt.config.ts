// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/Budget/'
  },
  nitro: {
    preset: 'github_pages', 
    prerender: {
      routes: ['/']
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }, 
  css: ['@/assets/css/main.css'],
})
