import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MFTPlus | Modern Managed File Transfer for DevOps',
  description: 'MFT for the cloud-native era. CLI-first, API-first, deployed in hours. The modern alternative to legacy MFT solutions.',
  lang: 'en-US',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: 'managed file transfer, MFT, secure file transfer, B2B file transfer, DevOps file transfer, API-first MFT, CLI file transfer' }],
    ['meta', { property: 'og:title', content: 'MFTPlus | Modern Managed File Transfer for DevOps' }],
    ['meta', { property: 'og:description', content: 'MFT for the cloud-native era. CLI-first, API-first, deployed in hours.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Product', link: '/product' },
      { text: 'Pricing', link: '/pricing' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Product',
          items: [
            { text: 'Overview', link: '/product' },
            { text: 'Pricing', link: '/pricing' }
          ]
        },
        {
          text: 'Documentation',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Transfer Protocol', link: '/guide/protocol' }
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'CLI Commands', link: '/api/cli' },
            { text: 'Configuration', link: '/api/config' }
          ]
        },
        {
          text: 'Plugin System',
          items: [
            { text: 'Overview', link: '/plugins/' },
            { text: 'Creating Plugins', link: '/plugins/creating' },
            { text: 'Plugin API', link: '/plugins/api' }
          ]
        }
      ]
    },

    socialLinks: [
      // GitHub link removed - repository is private
    ],

    search: {
      provider: 'local'
    }
  },

  markdown: {
    lineNumbers: true
  }
})
