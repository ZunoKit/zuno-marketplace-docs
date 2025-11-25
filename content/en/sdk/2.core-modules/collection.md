---
title: "Collection Module"
package: "sdk"
lastUpdated: "2024-11-24"
scope: "api-reference"
complexity: "intermediate"
category: "core-modules"
relatedTopics:
  - "exchange"
  - "auction"
---

# Collection Module

The Collection module enables creation and minting of ERC721 and ERC1155 NFT collections.

## Overview

Use the Collection module to:

- **Create ERC721 collections** - Standard NFT collections
- **Create ERC1155 collections** - Multi-token standard collections
- **Mint NFTs** - Create individual tokens in collections
- **Batch mint** - Efficiently mint multiple NFTs at once

## API Reference

### Create ERC721 Collection

Deploy a new ERC721 NFT collection contract.

```typescript
const { address, tx } = await sdk.collection.createERC721Collection({
  name: 'My NFTs',
  symbol: 'MNFT',
  baseUri: 'ipfs://QmYourBaseURI/',
  maxSupply: 10000,
});
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Collection name |
| `symbol` | `string` | Token symbol (e.g., "BAYC") |
| `baseUri` | `string` | Base URI for token metadata |
| `maxSupply` | `number` | Maximum tokens that can be minted |

**Returns:**

```typescript
{
  address: string;  // Deployed contract address
  tx: TransactionResponse;
}
```

### Mint ERC721 NFT

Mint a single NFT in an existing collection.

```typescript
const { tokenId, tx } = await sdk.collection.mintERC721({
  collectionAddress: '0x...',
  recipient: '0x...',
  value: '0.1',  // Optional mint price
});
```

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `collectionAddress` | `string` | Collection contract address |
| `recipient` | `string` | Address to receive the NFT |
| `value` | `string` | Optional ETH payment for mint |

**Returns:**

```typescript
{
  tokenId: string;  // Newly minted token ID
  tx: TransactionResponse;
}
```

## React Hooks

Use the `useCollection` hook in React components:

```tsx
import { useCollection } from 'zuno-marketplace-sdk/react';

function CreateCollectionComponent() {
  const { createERC721Collection, mintERC721 } = useCollection();

  const handleCreateCollection = async () => {
    const { address, tx } = await createERC721Collection.mutateAsync({
      name: 'My NFT Collection',
      symbol: 'MNC',
      baseUri: 'ipfs://QmYourHash/',
      maxSupply: 10000,
    });

    console.log('Collection deployed at:', address);
    await tx.wait();
  };

  const handleMint = async (collectionAddress: string) => {
    const { tokenId, tx } = await mintERC721.mutateAsync({
      collectionAddress,
      recipient: '0x...',
      value: '0.05',
    });

    console.log('Minted token ID:', tokenId);
  };

  return (
    <div>
      <button onClick={handleCreateCollection}>
        Create Collection
      </button>
      <button onClick={() => handleMint('0x...')}>
        Mint NFT
      </button>
    </div>
  );
}
```

## Complete Example

```typescript
import { ZunoSDK } from 'zuno-marketplace-sdk';

const sdk = new ZunoSDK({
  apiKey: 'your-api-key',
  network: 'sepolia',
});

async function createAndMintNFT() {
  // Step 1: Create collection
  const { address: collectionAddress, tx: createTx } =
    await sdk.collection.createERC721Collection({
      name: 'Awesome NFTs',
      symbol: 'ANFT',
      baseUri: 'ipfs://QmYourMetadataFolder/',
      maxSupply: 10000,
    });

  console.log('Collection created:', collectionAddress);
  await createTx.wait();

  // Step 2: Mint first NFT
  const { tokenId, tx: mintTx } = await sdk.collection.mintERC721({
    collectionAddress,
    recipient: '0xYourAddress...',
    value: '0.1',  // 0.1 ETH mint price
  });

  console.log('Minted token ID:', tokenId);
  await mintTx.wait();

  return { collectionAddress, tokenId };
}

createAndMintNFT();
```

## Metadata Standards

### ERC721 Token URI Structure

Your `baseUri` should point to a directory containing metadata JSON files:

```
ipfs://QmYourBaseURI/
├── 1.json
├── 2.json
├── 3.json
└── ...
```

Each metadata file should follow the OpenSea standard:

```json
{
  "name": "NFT #1",
  "description": "A unique digital collectible",
  "image": "ipfs://QmImageHash/1.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ]
}
```

## Error Handling

```typescript
try {
  const { address } = await sdk.collection.createERC721Collection({
    name: 'My Collection',
    symbol: 'MC',
    baseUri: 'ipfs://...',
    maxSupply: 10000,
  });
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Not enough ETH for deployment gas');
  } else if (error.message.includes('Symbol already exists')) {
    console.error('Collection symbol must be unique');
  } else {
    console.error('Deployment failed:', error);
  }
}
```

## Best Practices

::alert{type="success"}
**Use IPFS for metadata** - Store your metadata on IPFS for decentralization:

```typescript
const baseUri = 'ipfs://QmYourPinnedFolder/';
```
::

::alert{type="info"}
**Set reasonable max supply** - Consider future demand:

```typescript
// Good: reasonable limit
maxSupply: 10000

// Avoid: unnecessarily high
maxSupply: 1000000
```
::

::alert{type="warning"}
**Test on testnet first** - Always deploy to Sepolia/Goerli before mainnet.
::

## See Also

- **[Exchange Module](/sdk/core-modules/exchange)** - List and sell your NFTs
- **[Auction Module](/sdk/core-modules/auction)** - Auction your NFTs
- **[Metadata Service](/metadata/api-reference/metadata-endpoints)** - Manage NFT metadata
