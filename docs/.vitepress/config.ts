import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MFTPlus | Modern Managed File Transfer for DevOps',
  description: 'MFT for the cloud-native era. CLI-first, API-first, deployed in hours. The modern alternative to legacy MFT solutions.',
  lang: 'en-US',

  // Sitemap configuration for SEO
  sitemap: {
    hostname: 'https://docs.mftplus.co.za'
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: 'managed file transfer, MFT, secure file transfer, B2B file transfer, DevOps file transfer, API-first MFT, CLI file transfer' }],
    ['meta', { property: 'og:title', content: 'MFTPlus | Modern Managed File Transfer for DevOps' }],
    ['meta', { property: 'og:description', content: 'MFT for the cloud-native era. CLI-first, API-first, deployed in hours.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://docs.mftplus.co.za' }],
    ['meta', { property: 'og:image', content: 'https://docs.mftplus.co.za/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@mftplus' }],
    // JSON-LD Structured Data for Organization
    ['script', {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MFTPlus',
        url: 'https://mftplus.co.za',
        logo: 'https://docs.mftplus.co.za/logo.png',
        description: 'Modern managed file transfer for DevOps. CLI-first, API-first MFT solution.',
        sameAs: [
          'https://mftplus.co.za'
        ]
      })
    }],
    // JSON-LD Structured Data for SoftwareApplication
    ['script', {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'MFTPlus',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, macOS, Linux',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'ZAR'
        },
        description: 'Managed file transfer solution for DevOps teams. Schedule, monitor, and audit file transfers with a lightweight agent.'
      })
    }]
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Plugins', link: '/plugins/' }
    ],

    sidebar: {
      '/': [
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

    socialLinks: [],

    search: {
      provider: 'local'
    }
  },

  markdown: {
    lineNumbers: true
  }
})
