export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: 'Zuno Marketplace Documentation'
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: 'Zuno Marketplace',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/ZunoKit',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `Built with Nuxt UI • © ${new Date().getFullYear()} Zuno Marketplace`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/ZunoKit',
      'target': '_blank',
      'aria-label': 'Zuno on GitHub'
    }]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/ZunoKit/zuno-marketplace-docs/edit/main/content',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/ZunoKit',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'Nuxt UI docs',
        to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
        target: '_blank'
      }]
    }
  },

  // Package repository configuration
  repositories: {
    sdk: 'ZunoKit/zuno-marketplace-sdk',
    metadata: 'ZunoKit/zuno-marketplace-metadata',
    indexer: 'ZunoKit/zuno-marketplace-indexer',
    abis: 'ZunoKit/zuno-marketplace-abis'
  }
})
