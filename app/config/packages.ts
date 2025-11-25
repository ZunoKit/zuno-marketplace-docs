export interface PackageInfo {
  id: string
  label: string
  icon: string
  description: string
  version?: string
  navigation: NavSection[]
}

export interface NavSection {
  title: string
  icon?: string
  badge?: string
  items: NavItem[]
}

export interface NavItem {
  title: string
  to: string
  icon?: string
}

export const packages: Record<string, PackageInfo> = {
  sdk: {
    id: 'sdk',
    label: 'SDK',
    icon: 'i-lucide-code',
    description: 'TypeScript SDK with React hooks for building NFT marketplaces',
    version: 'v1.1.4',
    navigation: [
      {
        title: 'Getting Started',
        icon: 'i-lucide-rocket',
        items: [
          { title: 'Installation', to: '/sdk/getting-started/installation' },
          { title: 'Quick Start', to: '/sdk/getting-started/quick-start' }
        ]
      },
      {
        title: 'Core Modules',
        icon: 'i-lucide-box',
        items: [
          { title: 'Exchange', to: '/sdk/core-modules/exchange' },
          { title: 'Collection', to: '/sdk/core-modules/collection' },
          { title: 'Auction', to: '/sdk/core-modules/auction' }
        ]
      },
      {
        title: 'React Hooks',
        icon: 'i-lucide-zap',
        items: [
          { title: 'Hooks Overview', to: '/sdk/react-hooks/hooks-overview' }
        ]
      },
      {
        title: 'Changelog',
        icon: 'i-lucide-newspaper',
        badge: 'v1.1.4',
        items: [
          { title: 'View Releases', to: '/sdk/changelog' }
        ]
      }
    ]
  },
  metadata: {
    id: 'metadata',
    label: 'Metadata',
    icon: 'i-lucide-image',
    description: 'Enterprise-grade NFT metadata management with IPFS storage',
    navigation: [
      {
        title: 'Getting Started',
        icon: 'i-lucide-rocket',
        items: [
          { title: 'Installation', to: '/metadata/getting-started/installation' },
          { title: 'Configuration', to: '/metadata/getting-started/configuration' }
        ]
      },
      {
        title: 'API Reference',
        icon: 'i-lucide-book-open',
        items: [
          { title: 'Endpoints', to: '/metadata/api-reference/endpoints' },
          { title: 'Authentication', to: '/metadata/api-reference/authentication' }
        ]
      },
      {
        title: 'Architecture',
        icon: 'i-lucide-boxes',
        items: [
          { title: 'Overview', to: '/metadata/architecture/overview' },
          { title: 'Database Schema', to: '/metadata/architecture/database' }
        ]
      },
      {
        title: 'Changelog',
        icon: 'i-lucide-newspaper',
        items: [
          { title: 'View Releases', to: '/metadata/changelog' }
        ]
      }
    ]
  },
  indexer: {
    id: 'indexer',
    label: 'Indexer',
    icon: 'i-lucide-database',
    description: 'Event-first blockchain indexer with domain-driven design',
    navigation: [
      {
        title: 'Overview',
        icon: 'i-lucide-info',
        items: [
          { title: 'Introduction', to: '/indexer/overview/introduction' },
          { title: 'Features', to: '/indexer/overview/features' }
        ]
      },
      {
        title: 'Domain Architecture',
        icon: 'i-lucide-layers',
        items: [
          { title: 'Trading Domain', to: '/indexer/domain-architecture/trading' },
          { title: 'Collection Domain', to: '/indexer/domain-architecture/collection' }
        ]
      },
      {
        title: 'API Endpoints',
        icon: 'i-lucide-globe',
        items: [
          { title: 'REST API', to: '/indexer/api-endpoints/rest' },
          { title: 'GraphQL', to: '/indexer/api-endpoints/graphql' }
        ]
      },
      {
        title: 'Changelog',
        icon: 'i-lucide-newspaper',
        items: [
          { title: 'View Releases', to: '/indexer/changelog' }
        ]
      }
    ]
  },
  abis: {
    id: 'abis',
    label: 'ABIs',
    icon: 'i-lucide-file-text',
    description: 'ABI marketplace with versioning and multi-network support',
    navigation: [
      {
        title: 'Getting Started',
        icon: 'i-lucide-rocket',
        items: [
          { title: 'Installation', to: '/abis/getting-started/installation' },
          { title: 'Quick Start', to: '/abis/getting-started/quick-start' }
        ]
      },
      {
        title: 'API Reference',
        icon: 'i-lucide-book-open',
        items: [
          { title: 'Endpoints', to: '/abis/api-reference/endpoints' },
          { title: 'Authentication', to: '/abis/api-reference/authentication' }
        ]
      },
      {
        title: 'Deployment',
        icon: 'i-lucide-cloud',
        items: [
          { title: 'Vercel', to: '/abis/deployment/vercel' },
          { title: 'Docker', to: '/abis/deployment/docker' }
        ]
      },
      {
        title: 'Changelog',
        icon: 'i-lucide-newspaper',
        items: [
          { title: 'View Releases', to: '/abis/changelog' }
        ]
      }
    ]
  }
}

export function getPackage(id: string): PackageInfo | undefined {
  return packages[id]
}

export function getAllPackages(): PackageInfo[] {
  return Object.values(packages)
}
