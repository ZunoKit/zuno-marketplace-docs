---
title: "React Hooks Overview"
package: "sdk"
lastUpdated: "2024-11-24"
scope: "guide"
complexity: "intermediate"
category: "react-hooks"
relatedTopics:
  - "quick-start"
  - "exchange"
  - "collection"
  - "auction"
---

The Zuno Marketplace SDK provides 21+ React hooks for building marketplace applications with Wagmi and TanStack Query integration.

## Installation

The React hooks are included in the main SDK package:

```bash
npm install zuno-marketplace-sdk @tanstack/react-query wagmi viem
```

## Provider Setup

Wrap your app with `ZunoProvider`:

```tsx
import { ZunoProvider } from 'zuno-marketplace-sdk/react';

function App({ children }) {
  return (
    <ZunoProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY,
        network: 'sepolia',
      }}
    >
      {children}
    </ZunoProvider>
  );
}
```

## Available Hooks

### Exchange Hooks

Hooks for NFT listing and trading:

```tsx
import {
  useExchange,
  useListNFT,
  useBuyNFT,
  useCancelListing,
  useUpdateListingPrice,
  useGetActiveListings,
} from 'zuno-marketplace-sdk/react';
```

**Example:**

```tsx
function ListingComponent() {
  const { listNFT, buyNFT } = useExchange();

  const handleList = async () => {
    const { listingId } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });
  };
}
```

### Collection Hooks

Hooks for creating and minting NFT collections:

```tsx
import {
  useCollection,
  useCreateERC721,
  useMintERC721,
  useCreateERC1155,
} from 'zuno-marketplace-sdk/react';
```

**Example:**

```tsx
function MintComponent() {
  const { createERC721Collection, mintERC721 } = useCollection();

  const handleCreate = async () => {
    const { address } = await createERC721Collection.mutateAsync({
      name: 'My NFTs',
      symbol: 'MNFT',
      baseUri: 'ipfs://...',
      maxSupply: 10000,
    });
  };
}
```

### Auction Hooks

Hooks for auction functionality:

```tsx
import {
  useAuction,
  useCreateEnglishAuction,
  usePlaceBid,
  useCancelAuction,
  useGetActiveAuctions,
} from 'zuno-marketplace-sdk/react';
```

**Example:**

```tsx
function AuctionComponent() {
  const { createEnglishAuction, placeBid } = useAuction();

  const handleCreateAuction = async () => {
    const { auctionId } = await createEnglishAuction.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      startingBid: '1.0',
      duration: 86400 * 7,
    });
  };
}
```

### Wallet Hooks

Hooks for wallet connection and account management:

```tsx
import {
  useWallet,
  useAccount,
  useConnect,
  useDisconnect,
} from 'zuno-marketplace-sdk/react';
```

**Example:**

```tsx
function WalletComponent() {
  const { address, connect, disconnect, isConnected } = useWallet();

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

## Hook Features

All hooks include:

- ✅ **TypeScript Support** - Full type inference
- ✅ **Loading States** - `isLoading`, `isPending`, `isSuccess`
- ✅ **Error Handling** - `error`, `isError`
- ✅ **Caching** - Automatic with TanStack Query
- ✅ **Refetching** - Manual and automatic refetch
- ✅ **Optimistic Updates** - UI updates before confirmation

## Common Patterns

### Loading States

```tsx
function Component() {
  const { listNFT } = useExchange();

  return (
    <button
      onClick={() => listNFT.mutateAsync({...})}
      disabled={listNFT.isPending}
    >
      {listNFT.isPending ? 'Listing...' : 'List NFT'}
    </button>
  );
}
```

### Error Handling

```tsx
function Component() {
  const { buyNFT } = useExchange();

  return (
    <div>
      <button onClick={() => buyNFT.mutateAsync({...})}>
        Buy NFT
      </button>
      {buyNFT.isError && (
        <p className="error">Error: {buyNFT.error.message}</p>
      )}
    </div>
  );
}
```

### Query Hooks

```tsx
function ListingsComponent() {
  const { data, isLoading } = useGetActiveListings(1, 20);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.items.map(listing => (
        <div key={listing.id}>{listing.tokenId}</div>
      ))}
    </div>
  );
}
```

## Best Practices

::alert{type="success"}
**Use mutation hooks for writes:**

```tsx
const { listNFT } = useExchange();
await listNFT.mutateAsync({...});
```
::

::alert{type="success"}
**Use query hooks for reads:**

```tsx
const { data } = useGetActiveListings(1, 20);
```
::

::alert{type="info"}
**Handle loading states:**

```tsx
{mutation.isPending && <Spinner />}
```
::

::alert{type="warning"}
**Always handle errors:**

```tsx
{mutation.isError && <ErrorMessage error={mutation.error} />}
```
::

## Complete Example

```tsx
import {
  useExchange,
  useWallet,
  useCollection,
} from 'zuno-marketplace-sdk/react';

function NFTMarketplace() {
  const { address, connect, isConnected } = useWallet();
  const { listNFT, buyNFT } = useExchange();
  const { mintERC721 } = useCollection();

  const handleList = async () => {
    try {
      const { listingId, tx } = await listNFT.mutateAsync({
        collectionAddress: '0x...',
        tokenId: '1',
        price: '1.5',
        duration: 86400,
      });
      await tx.wait();
      alert(`Listed with ID: ${listingId}`);
    } catch (error) {
      console.error('Failed to list:', error);
    }
  };

  if (!isConnected) {
    return <button onClick={connect}>Connect Wallet</button>;
  }

  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={handleList} disabled={listNFT.isPending}>
        {listNFT.isPending ? 'Listing...' : 'List NFT'}
      </button>
    </div>
  );
}
```

## See Also

- **[Quick Start](/sdk/getting-started/quick-start)** - Setup guide
- **[Exchange Module](/sdk/core-modules/exchange)** - Trading API
- **[Collection Module](/sdk/core-modules/collection)** - NFT creation
- **[Auction Module](/sdk/core-modules/auction)** - Auction API
