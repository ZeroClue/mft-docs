import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MFTPlus Documentation',
  description: 'MFTPlus - Managed File Transfer, Reimagined for Modern Teams',
  lang: 'en-US',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Plugins', link: '/plugins/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Transfer Protocol', link: '/guide/protocol' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'CLI Commands', link: '/api/cli' },
            { text: 'Configuration', link: '/api/config' }
          ]
        }
      ],
      '/plugins/': [
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
      { icon: 'github', link: 'https://github.com/ZeroClue/MFTxyz' }
    ],

    search: {
      provider: 'local'
    }
  },

  markdown: {
    lineNumbers: true
  }
})
