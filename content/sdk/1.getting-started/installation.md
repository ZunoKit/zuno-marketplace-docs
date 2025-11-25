---
title: "Installation"
package: "sdk"
lastUpdated: "2024-11-24"
scope: "guide"
complexity: "beginner"
category: "installation"
relatedTopics:
  - "quick-start"
  - "configuration"
---

Get started with the Zuno Marketplace SDK for building NFT marketplace applications with type-safe, React-first integration.

## Prerequisites

Before installing the SDK, ensure you have:

- **Node.js** 18+
- **npm**, **pnpm**, or **yarn**
- **React** 19+ (for React hooks)
- **TypeScript** 5.6+ (recommended)

## Install Package

Install the SDK along with required peer dependencies:

::code-group

```bash [npm]
npm install zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

```bash [pnpm]
pnpm add zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

```bash [yarn]
yarn add zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

::

### Dependencies Explained

| Package | Purpose | Version |
|---------|---------|---------|
| `zuno-marketplace-sdk` | Core SDK with TypeScript APIs | Latest |
| `ethers` | Ethereum library for contract interactions | v6.x |
| `@tanstack/react-query` | Data fetching & caching for React | Latest |
| `wagmi` | React hooks for Ethereum | Latest |
| `viem` | TypeScript Ethereum library | Latest |

## Verify Installation

Check that the SDK is installed correctly:

```bash
npm list zuno-marketplace-sdk
```

You should see output similar to:

```
zuno-marketplace-sdk@1.1.4
```

## What's Included

The SDK provides:

- 🎨 **Complete NFT Marketplace** - Exchange, Auctions, Offers, Bundles
- ⚛️ **React Integration** - 21+ hooks with Wagmi & React Query
- 🔐 **Type-Safe** - Full TypeScript support with strict typing
- 📦 **Smart Caching** - Built-in ABI caching with TanStack Query
- 🎯 **Modular Design** - Use only what you need

## Next Steps

After installation, proceed with:

- [Quick Start Guide](/sdk/getting-started/quick-start) - Set up your first marketplace integration
- [Core Modules](/sdk/core-modules/exchange) - Learn about Exchange, Collection, Auction modules
- [React Hooks](/sdk/react-hooks/overview) - Explore React hooks for wallet and contract interactions

## Troubleshooting

::collapse{title="Peer dependency warnings"}
If you see peer dependency warnings, ensure you're using compatible versions:

- React 19+
- Ethers 6.x (not v5)
- Node.js 18+

Install missing peer dependencies as indicated in the warning messages.
::

::collapse{title="TypeScript errors"}
Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true
  }
}
```
::
