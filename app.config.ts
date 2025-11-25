export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    notifications: {
      position: 'top-right'
    }
  },

  // Package repository configuration
  repositories: {
    sdk: 'ZunoKit/zuno-marketplace-sdk',
    metadata: 'ZunoKit/zuno-marketplace-metadata',
    indexer: 'ZunoKit/zuno-marketplace-indexer',
    abis: 'ZunoKit/zuno-marketplace-abis'
  },

  // Site configuration
  site: {
    name: 'Zuno Marketplace Documentation',
    description: 'Complete documentation for Zuno Marketplace ecosystem',
    url: 'https://docs.zuno-marketplace.com'
  },

  // Package configuration for navigation
  packages: [
    {
      name: 'SDK',
      description: 'TypeScript SDK for NFT marketplace applications',
      icon: 'i-heroicons-code-bracket',
      color: 'blue',
      path: '/en/sdk',
      tags: ['react', 'typescript', 'hooks', 'wagmi']
    },
    {
      name: 'Metadata',
      description: 'Enterprise NFT metadata management service',
      icon: 'i-heroicons-server-stack',
      color: 'green',
      path: '/en/metadata',
      tags: ['api', 'nft', 'metadata', 'ipfs']
    },
    {
      name: 'Indexer',
      description: 'Real-time blockchain event indexer',
      icon: 'i-heroicons-circle-stack',
      color: 'purple',
      path: '/en/indexer',
      tags: ['indexing', 'events', 'postgresql', 'real-time']
    },
    {
      name: 'ABIs',
      description: 'Smart contract ABI marketplace service',
      icon: 'i-heroicons-globe-americas',
      color: 'orange',
      path: '/en/abis',
      tags: ['contracts', 'abis', 'api', 'multi-chain']
    }
  ],

  // Navigation configuration
  navigation: {
    showPackageFilter: true,
    showBreadcrumb: true,
    showProgress: true,
    enableSearch: true,
    searchPlaceholder: 'Search documentation...'
  },

  // Footer links
  footer: {
    links: [
      {
        label: 'GitHub',
        to: 'https://github.com/ZunoKit',
        icon: 'simple-icons-github'
      },
      {
        label: 'Zuno Marketplace',
        to: 'https://zuno-marketplace.com',
        icon: 'i-heroicons-globe-alt'
      },
      {
        label: 'Support',
        to: 'https://github.com/ZunoKit/issues',
        icon: 'i-heroicons-lifebuoy'
      }
    ]
  }
})
