<script setup lang="ts">
interface Props {
  repository?: string
}

const props = defineProps<Props>()

// Fake changelog data
const fakeVersions = ref([
  {
    tag: 'v1.2.0',
    title: 'v1.2.0 - Enhanced Features & Performance',
    date: '2024-11-20T10:00:00Z',
    markdown: `
## 🚀 New Features

- **Enhanced SDK Integration**: Improved TypeScript SDK with better type safety and autocomplete
- **Advanced Caching**: Implemented Redis-based caching for faster API responses
- **Batch Operations**: Added support for batch NFT operations
- **WebSocket Support**: Real-time updates for marketplace events

## 🐛 Bug Fixes

- Fixed issue with NFT metadata not updating correctly
- Resolved authentication token expiration handling
- Fixed race condition in auction bidding system
- Corrected pagination edge cases in collection listings

## 📚 Documentation

- Added comprehensive API examples
- Updated installation guides
- Improved TypeScript type definitions documentation

## ⚡ Performance

- Reduced API response time by 40%
- Optimized database queries for collection fetching
- Improved image loading with lazy loading and CDN integration
    `
  },
  {
    tag: 'v1.1.4',
    title: 'v1.1.4 - Bug Fixes & Improvements',
    date: '2024-11-10T14:30:00Z',
    markdown: `
## 🐛 Bug Fixes

- Fixed critical bug in NFT transfer validation
- Resolved issue with IPFS metadata pinning
- Fixed authentication refresh token flow
- Corrected timezone handling in auction end times

## 🔧 Improvements

- Enhanced error messages for better debugging
- Improved logging for production environments
- Updated dependencies to latest stable versions
- Better handling of network failures
    `
  },
  {
    tag: 'v1.1.0',
    title: 'v1.1.0 - Major Feature Release',
    date: '2024-10-25T09:00:00Z',
    markdown: `
## 🎉 Major Features

- **Auction System**: Complete auction functionality with English and Dutch auction support
- **Offer System**: Users can now make offers on NFTs
- **Bundle Sales**: Support for selling multiple NFTs as a bundle
- **Advanced Filtering**: Enhanced search and filter capabilities

## 🔐 Security

- Implemented rate limiting on all API endpoints
- Added request signing for sensitive operations
- Enhanced input validation and sanitization
- Security audit completed with no critical issues

## 🌐 Multi-chain Support

- Added support for Polygon network
- Binance Smart Chain integration
- Improved chain switching UX in SDK

## 📊 Analytics

- New analytics dashboard for marketplace metrics
- User activity tracking
- Sales volume and trending collections
    `
  },
  {
    tag: 'v1.0.5',
    title: 'v1.0.5 - Stability Update',
    date: '2024-10-15T11:00:00Z',
    markdown: `
## 🐛 Bug Fixes

- Fixed wallet connection issues with MetaMask
- Resolved gas estimation errors
- Fixed NFT image display on mobile devices
- Corrected collection statistics calculation

## 🔧 Improvements

- Optimized contract interaction gas costs
- Improved mobile responsiveness
- Better error handling for failed transactions
- Enhanced logging for easier troubleshooting
    `
  },
  {
    tag: 'v1.0.0',
    title: 'v1.0.0 - Initial Release 🎊',
    date: '2024-10-01T08:00:00Z',
    markdown: `
## 🎉 Initial Release

Welcome to Zuno Marketplace! This is our first stable release.

### Core Features

- **NFT Marketplace**: Full-featured NFT marketplace with buy, sell, and transfer functionality
- **TypeScript SDK**: Comprehensive SDK for easy integration
- **React Hooks**: Ready-to-use React hooks for common marketplace operations
- **Smart Contracts**: Audited and optimized smart contracts
- **Metadata Service**: Scalable metadata management with IPFS integration
- **Indexer**: Real-time blockchain event indexing

### Supported Chains

- Ethereum Mainnet
- Ethereum Goerli (Testnet)

### Documentation

- Complete API reference
- Integration guides
- Code examples and tutorials
- Architecture documentation

### Developer Tools

- CLI for contract deployment
- Testing utilities
- Local development environment setup

---

Thank you for using Zuno Marketplace! 🚀
    `
  }
])
</script>

<template>
  <UChangelogVersions
    as="main"
    :indicator-motion="false"
    :ui="{
      root: 'py-16 sm:py-24 lg:py-32',
      indicator: 'inset-y-0'
    }"
  >
    <UChangelogVersion
      v-for="version in fakeVersions"
      :key="version.tag"
      v-bind="version"
      :ui="{
        root: 'flex items-start',
        container: 'max-w-xl',
        header: 'border-b border-default pb-4',
        title: 'text-3xl',
        date: 'text-xs/9 text-highlighted font-mono',
        indicator: 'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32'
      }"
    >
      <template #body>
        <MDC
          v-if="version.markdown"
          :value="version.markdown"
        />
      </template>
    </UChangelogVersion>
  </UChangelogVersions>
</template>
