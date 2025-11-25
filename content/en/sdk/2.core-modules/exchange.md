---
title: "Exchange Module"
package: "sdk"
lastUpdated: "2024-11-24"
scope: "api-reference"
complexity: "intermediate"
category: "core-modules"
relatedTopics:
  - "collection"
  - "auction"
  - "offers-bundles"
---

# Exchange Module

The Exchange module handles NFT listings, purchases, price updates, and cancellations in the Zuno Marketplace.

## Overview

The Exchange module provides methods for:

- **Listing NFTs** for sale at fixed prices
- **Buying NFTs** from active listings
- **Updating listing prices** for active listings
- **Canceling listings** to remove NFTs from sale
- **Querying listings** to get active marketplace data

## API Reference

### List NFT for Sale

Create a new fixed-price listing for an NFT.

```typescript
const { listingId, tx } = await sdk.exchange.listNFT({
  collectionAddress: '0x...',
  tokenId: '1',
  price: '1.5',        // Price in ETH
  duration: 86400,     // Duration in seconds (24 hours)
});
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `collectionAddress` | `string` | NFT contract address |
| `tokenId` | `string` | Token ID to list |
| `price` | `string` | Listing price in ETH |
| `duration` | `number` | Listing duration in seconds |

**Returns:**

```typescript
{
  listingId: string;  // Unique listing identifier
  tx: TransactionResponse;  // Ethers transaction object
}
```

### Buy NFT

Purchase an NFT from an active listing.

```typescript
const { tx } = await sdk.exchange.buyNFT({
  listingId: '0x...',
  value: '1.5',  // Must match listing price
});
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `listingId` | `string` | Listing ID to purchase |
| `value` | `string` | Purchase amount in ETH |

**Returns:**

```typescript
{
  tx: TransactionResponse;
}
```

### Update Listing Price

Update the price of an existing listing (new in v1.1.4).

```typescript
const { tx } = await sdk.exchange.updateListingPrice(
  'listingId',
  '2.0'  // New price in ETH
);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | `string` | Listing to update |
| `newPrice` | `string` | New price in ETH |

### Cancel Listing

Remove an NFT from sale by canceling its listing.

```typescript
const { tx } = await sdk.exchange.cancelListing('listingId');
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | `string` | Listing to cancel |

### Get Active Listings

Query active marketplace listings with pagination (new in v1.1.4).

```typescript
const { items, total } = await sdk.exchange.getActiveListings(
  1,   // Page number
  20   // Items per page
);
```

**Returns:**

```typescript
{
  items: Listing[];
  total: number;
  page: number;
  limit: number;
}
```

**Listing Object:**

```typescript
interface Listing {
  id: string;
  seller: string;
  collectionAddress: string;
  tokenId: string;
  price: string;
  expiresAt: number;
  status: 'active' | 'sold' | 'cancelled';
}
```

## React Hooks

For React applications, use the `useExchange` hook:

```tsx
import { useExchange } from 'zuno-marketplace-sdk/react';

function MarketplaceComponent() {
  const {
    listNFT,
    buyNFT,
    updateListingPrice,
    cancelListing
  } = useExchange();

  // List NFT
  const handleList = async () => {
    const { listingId, tx } = await listNFT.mutateAsync({
      collectionAddress: '0x...',
      tokenId: '1',
      price: '1.5',
      duration: 86400,
    });
  };

  // Buy NFT
  const handleBuy = async () => {
    const { tx } = await buyNFT.mutateAsync({
      listingId: '0x...',
      value: '1.5',
    });
  };

  // Update price
  const handleUpdatePrice = async () => {
    const { tx } = await updateListingPrice.mutateAsync({
      listingId: '0x...',
      newPrice: '2.0',
    });
  };

  // Cancel listing
  const handleCancel = async () => {
    const { tx } = await cancelListing.mutateAsync('listingId');
  };
}
```

## Complete Example

```typescript
import { ZunoSDK } from 'zuno-marketplace-sdk';

const sdk = new ZunoSDK({
  apiKey: 'your-api-key',
  network: 'sepolia',
});

// Step 1: List NFT
const { listingId, tx: listTx } = await sdk.exchange.listNFT({
  collectionAddress: '0x1234...',
  tokenId: '42',
  price: '1.5',
  duration: 86400 * 7,  // 7 days
});
console.log('Listed NFT:', listingId);
await listTx.wait();

// Step 2: Update price after 1 day
const { tx: updateTx } = await sdk.exchange.updateListingPrice(
  listingId,
  '2.0'
);
await updateTx.wait();

// Step 3: Get active listings
const { items } = await sdk.exchange.getActiveListings(1, 20);
console.log('Active listings:', items.length);

// Step 4: Cancel listing
const { tx: cancelTx } = await sdk.exchange.cancelListing(listingId);
await cancelTx.wait();
```

## Error Handling

```typescript
try {
  const { tx } = await sdk.exchange.buyNFT({
    listingId: '0x...',
    value: '1.5',
  });
  await tx.wait();
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Insufficient balance');
  } else if (error.message.includes('Listing expired')) {
    console.error('This listing has expired');
  } else {
    console.error('Transaction failed:', error);
  }
}
```

## Best Practices

::alert{type="success"}
**Always approve NFT transfer** before listing:

```typescript
// Approve marketplace contract first
const approval = await nftContract.approve(
  MARKETPLACE_ADDRESS,
  tokenId
);
await approval.wait();

// Then list
const { listingId } = await sdk.exchange.listNFT({...});
```
::

::alert{type="warning"}
**Check listing expiration** before buying:

```typescript
const { items } = await sdk.exchange.getActiveListings(1, 100);
const listing = items.find(l => l.id === listingId);

if (listing.expiresAt < Date.now() / 1000) {
  console.warn('Listing has expired');
}
```
::

## See Also

- **[Collection Module](/sdk/core-modules/collection)** - Create and mint NFT collections
- **[Auction Module](/sdk/core-modules/auction)** - Implement auction functionality
- **[Offers & Bundles](/sdk/core-modules/offers-bundles)** - Handle offers and bundle sales
