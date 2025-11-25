---
title: "Zuno Marketplace SDK"
package: "sdk"
version: "1.1.4"
lastUpdated: "2025-11-25"
changeFrequency: "monthly"
scope: "guide"
context: "standalone"
complexity: "beginner"
tokenEstimate: 350
category: "overview"
navigation: false
relatedTopics:
  - "installation"
  - "quick-start"
  - "react-hooks"
---

<div class="flex gap-2 mb-6 flex-wrap">
  <UBadge color="blue" variant="subtle">TypeScript 5.6</UBadge>
  <UBadge color="green" variant="subtle">React 19</UBadge>
  <UBadge color="purple" variant="subtle">v1.1.4</UBadge>
  <UBadge color="gray" variant="subtle">MIT License</UBadge>
</div>

> **All-in-One NFT Marketplace SDK with Wagmi & React Query built-in**

A comprehensive, type-safe SDK for building NFT marketplace applications on Ethereum and EVM-compatible chains. Built with TypeScript, featuring first-class React support with Wagmi and TanStack Query integration.

## ✨ Features

- 🎨 **Complete NFT Marketplace** - Exchange, Auctions, Offers, Bundles
- ⚛️ **React Integration** - 21+ hooks with Wagmi & React Query
- 🔐 **Type-Safe** - Full TypeScript support with strict typing
- 📦 **Smart Caching** - Built-in ABI caching with TanStack Query
- 🎯 **Modular Design** - Use only what you need
- 🚀 **Production Ready** - Robust error handling and retries
- 🪝 **Modern React** - useCallback, useMemo optimization
- 📱 **Wallet Support** - WalletConnect, MetaMask, Coinbase Wallet

## 🆕 What's New in v1.1.4

- **Standardized Response Format** - All mutation methods now return `{ tx, ...data }` for consistency
- **New Query Methods** - `getActiveListings()`, `getActiveAuctions()`, `getAuctionsBySeller()`
- **New Mutation Methods** - `updateListingPrice()`, `cancelAuction()`
- **Better TypeScript Inference** - Improved type inference for all method responses
- **Listing ID Extraction** - `listNFT()` now returns `{ listingId, tx }` automatically

::alert{type="info"}
**Migration Note**: If upgrading from v1.1.3, update your code to destructure responses.
::

## 📦 Installation

```bash
npm install zuno-marketplace-sdk ethers@6 @tanstack/react-query wagmi viem
```

## 🚀 Quick Start

```tsx
// app/layout.tsx
import { ZunoProvider } from 'zuno-marketplace-sdk/react';

export default function RootLayout({ children }) {
  return (
    <ZunoProvider config={{ apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY!, network: 'sepolia' }}>
      {children}
    </ZunoProvider>
  );
}
```

```tsx
// app/page.tsx
'use client';
import { useExchange, useWallet } from 'zuno-marketplace-sdk/react';

export default function HomePage() {
  const { address, connect } = useWallet();
  const { listNFT } = useExchange();

  const handleList = async () => {
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });
  };

  return <button onClick={handleList}>List NFT</button>;
}
```

## 📖 Documentation

::card-grid
  ::card{icon="i-heroicons-rocket-launch" title="Getting Started" to="/sdk/getting-started/installation"}
  Install and configure the SDK in your project
  ::
  ::card{icon="i-heroicons-cube" title="Core Modules" to="/sdk/core-modules/exchange"}
  Exchange, Collection, and Auction APIs
  ::
  ::card{icon="i-heroicons-code-bracket" title="React Hooks" to="/sdk/react-hooks/overview"}
  21+ React hooks for marketplace features
  ::
::

## See Also

- **[Metadata Service](/metadata/api-reference/metadata-endpoints)** - Manage NFT metadata
- **[ABIs Service](/abis/api-reference/abis-endpoints)** - Contract ABIs and networks
- **[Indexer](/indexer/domain-architecture/event-first)** - Blockchain event indexing
