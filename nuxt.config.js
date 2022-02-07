export default {
  loading: false,
  components: true,
  target: 'static',
  head: {
    title: 'aep',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      {name:"theme-color", content:"#ffffff"}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com',crossorigin: true },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Rufina:wght@700&display=swap'
      }
    ],
    script: [
      { src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.0/gsap.min.js" },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.0/ScrollTrigger.min.js" }
    ]
  },
  css: [],
  plugins: [
    { src: "@/plugins/eventBus.js", ssr: true },
    { src: "@/plugins/scrollBuddy.js", ssr: false },
    { src: "@/plugins/screenBuddy.js", ssr: false },
    { src: "@/plugins/directives.js", ssr: false },
  ],
  buildModules: ['@nuxtjs/tailwindcss','@nuxtjs/prismic'],
  prismic: {
    endpoint: process.env.PRISMIC_END_POINT,
    modern: true,
    preview: false,
    apiOptions: {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    },
  },
  tailwindcss: {
    exposeConfig: true
  },
  build: {
    postcss: {
      order: "presetEnvAndCssnanoLast",
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
        cssnano: process.env.NODE_ENV === "production" ? {preset: ["default",{discardComments: {removeAll: true,}}]}: false}
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    },
  }
}
