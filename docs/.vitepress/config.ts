import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MFTPlus Documentation - Complete Guides, API Reference & Tutorials',
  description: 'Official MFTPlus documentation. Learn to set up scheduled file transfers, configure SFTP/FTP agents, use the CLI, and build plugins. Get started in 5 minutes.',
  lang: 'en-US',

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'keywords', content: 'MFTPlus documentation, MFT documentation, managed file transfer docs, file transfer API, mft-agent-cli commands, SFTP automation, file transfer scheduling, MFT installation guide' }],
    ['meta', { name: 'author', content: 'MFTPlus' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:title', content: 'MFTPlus Documentation - Complete Guides, API Reference & Tutorials' }],
    ['meta', { property: 'og:description', content: 'Official MFTPlus documentation. Learn to set up scheduled file transfers, configure agents, and build plugins. Get started in 5 minutes.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://docs.mftplus.co.za' }],
    ['meta', { property: 'og:image', content: 'https://docs.mftplus.co.za/og-image.png' }],
    ['meta', { property: 'og:site_name', content: 'MFTPlus Documentation' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'MFTPlus Documentation - Complete Guides & API Reference' }],
    ['meta', { name: 'twitter:description', content: 'Official MFTPlus documentation. Set up scheduled file transfers, configure agents, use the CLI, and build plugins.' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.mftplus.co.za/og-image.png' }]
  ],

  themeConfig: {
    logo: '/brand-assets/logo-full-dark.svg',
    appearance: 'dark',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/openapi-reference' },
      { text: 'Plugins', link: '/plugins/' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Documentation',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'CLI Agent Installation', link: '/guide/agent-installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Production Deployment', link: '/guide/deployment' },
            { text: 'Deployment Runbook', link: '/guide/deployment-runbook' },
            { text: 'Backup and Recovery', link: '/guide/backup-and-recovery' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Transfer Protocol', link: '/guide/protocol' },
            { text: 'Monitoring & Observability', link: '/guide/monitoring' },
            { text: 'Webhooks', link: '/guide/webhooks' },
            { text: 'Security & Authentication', link: '/guide/security' },
            { text: 'Two-Factor Authentication (2FA)', link: '/guide/two-factor-authentication' },
            { text: 'Admin Panel', link: '/guide/admin-panel' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' }
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'REST API', link: '/api/openapi-reference' },
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
  },

  // Ignore dead links (localhost, marketing pages that don't exist in docs yet)
  ignoreDeadLinks: true,

  sitemap: {
    hostname: 'https://docs.mftplus.co.za'
  }
})
