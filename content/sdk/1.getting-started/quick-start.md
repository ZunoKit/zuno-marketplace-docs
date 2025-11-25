---
title: "Quick Start"
package: "sdk"
lastUpdated: "2024-11-24"
scope: "guide"
complexity: "beginner"
category: "getting-started"
relatedTopics:
  - "installation"
  - "exchange"
  - "wallet-connection"
---

Get your NFT marketplace up and running in minutes with the Zuno Marketplace SDK.

## React with Next.js Setup

### 1. Wrap Your App with ZunoProvider

The SDK requires the `ZunoProvider` wrapper to initialize configuration and provide React context:

```tsx
// app/layout.tsx
import { ZunoProvider } from 'zuno-marketplace-sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ZunoProvider
          config={{
            apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY!,
            network: 'sepolia',
          }}
        >
          {children}
        </ZunoProvider>
      </body>
    </html>
  );
}
```

### 2. Use React Hooks in Your Components

```tsx
// app/page.tsx
'use client';

import { useExchange, useWallet } from 'zuno-marketplace-sdk/react';

export default function HomePage() {
  const { address, connect, isConnected } = useWallet();
  const { listNFT } = useExchange();

  const handleList = async () => {
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });
    console.log('Listed with ID:', listingId, 'TX:', tx.hash);
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <button onClick={handleList}>List NFT</button>
      )}
    </div>
  );
}
```

## Configuration Options

The `ZunoProvider` accepts the following configuration:

```typescript
interface ZunoConfig {
  apiKey: string;           // Your Zuno API key
  network: string;          // Network: 'mainnet' | 'sepolia' | 'polygon' | etc.
  rpcUrl?: string;         // Optional custom RPC URL
  cacheTime?: number;      // Cache duration in ms (default: 300000)
}
```

### Environment Variables

Create a `.env.local` file:

```bash
# Required
NEXT_PUBLIC_ZUNO_API_KEY=your_api_key_here

# Optional
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://your-rpc-url.com
```

## Common Use Cases

### List an NFT for Sale

```tsx
const { listNFT } = useExchange();

const { listingId, tx } = await listNFT.mutateAsync({
  collectionAddress: '0x1234...',
  tokenId: '42',
  price: '1.5',      // Price in ETH
  duration: 86400,   // 24 hours in seconds
});
```

### Buy an NFT

```tsx
const { buyNFT } = useExchange();

const { tx } = await buyNFT.mutateAsync({
  listingId: '0xabcd...',
  value: '1.5',
});
```

### Create an Auction

```tsx
const { createEnglishAuction } = useAuction();

const { auctionId, tx } = await createEnglishAuction.mutateAsync({
  collectionAddress: '0x5678...',
  tokenId: '7',
  startingBid: '1.0',
  duration: 86400 * 7,  // 7 days
});
```

### Place a Bid

```tsx
const { placeBid } = useAuction();

const { tx } = await placeBid.mutateAsync({
  auctionId: '1',
  amount: '1.5',
});
```

## Available Hooks

The SDK provides 21+ React hooks organized by module:

::code-group

```tsx [Exchange]
import {
  useExchange,
  useListNFT,
  useBuyNFT,
  useCancelListing,
  useUpdateListingPrice,
} from 'zuno-marketplace-sdk/react';
```

```tsx [Collection]
import {
  useCollection,
  useCreateERC721,
  useMintERC721,
} from 'zuno-marketplace-sdk/react';
```

```tsx [Auction]
import {
  useAuction,
  useCreateEnglishAuction,
  usePlaceBid,
  useCancelAuction,
} from 'zuno-marketplace-sdk/react';
```

```tsx [Wallet]
import {
  useWallet,
  useAccount,
  useConnect,
  useDisconnect,
} from 'zuno-marketplace-sdk/react';
```

::

## What's New in v1.1.4

- **Standardized Response Format** - All mutation methods now return `{ tx, ...data }` for consistency
- **New Query Methods** - `getActiveListings()`, `getActiveAuctions()`, `getAuctionsBySeller()`
- **New Mutation Methods** - `updateListingPrice()`, `cancelAuction()`
- **Better TypeScript Inference** - Improved type inference for all method responses
- **Listing ID Extraction** - `listNFT()` now returns `{ listingId, tx }` automatically

::alert{type="info"}
**Migration Note**: If upgrading from v1.1.3, update your code to destructure responses. See the [CHANGELOG](https://github.com/ZunoKit/zuno-marketplace-sdk/blob/main/CHANGELOG.md) for details.
::

## Next Steps

Now that you have the basics:

- [Exchange Module](/sdk/core-modules/exchange) - Deep dive into listing and trading
- [Collection Module](/sdk/core-modules/collection) - Create and mint NFT collections
- [Auction Module](/sdk/core-modules/auction) - Implement auction functionality
- [React Hooks](/sdk/react-hooks/overview) - Complete hooks reference

## Need Help?

- **Documentation**: [Full API Reference](https://docs.zuno.com)
- **Examples**: Check the [examples directory](https://github.com/ZunoKit/zuno-marketplace-sdk/tree/main/examples)
- **Support**: Open an issue on [GitHub](https://github.com/ZunoKit/zuno-marketplace-sdk/issues)
