---
title: "Domain Separation"
package: "indexer"
lastUpdated: "2025-11-25"
scope: "guide"
complexity: "intermediate"
category: "architecture"
relatedTopics:
  - "overview"
  - "event-first"
  - "event-handlers"
---

Understand how the Indexer uses Domain-Driven Design to organize business logic into independent domains.

## What is Domain-Driven Design?

Domain-Driven Design (DDD) is an architectural approach that organizes code around distinct business domains. Each domain encapsulates its own:

- **Business Logic** - Rules and operations for that domain
- **Event Handlers** - Processing logic for domain events
- **Repository Layer** - Data access for domain entities
- **Type Definitions** - Domain-specific TypeScript types

## The Four Domains

### 1. Trading Domain

Handles all NFT trading operations including listings, purchases, and cancellations.

**Key Entities:**
- Listings (active, cancelled, filled)
- Trades (purchases, sales)
- Bundle purchases

**Event Types:**
- `listing_created` - New NFT listing created
- `listing_filled` - Listing purchased
- `listing_cancelled` - Listing removed by owner
- `nft_purchased` - Single NFT purchased
- `bundle_purchased` - Multiple NFTs purchased in one transaction

**Business Rules:**
- Only active listings can be purchased
- Listing creator can cancel anytime
- Price must be in valid ERC20 token

**Repository Methods:**
```typescript
class TradingRepository {
  async getActiveListing(collectionAddress: string, tokenId: string)
  async getTradingVolume(userAddress: string, timeRange: 'day'|'week'|'month')
  async getUserTrades(userAddress: string, limit: number)
  async getMarketStats(collectionAddress: string)
}
```

### 2. Collection Domain

Manages ERC721/ERC1155 collection creation and minting operations.

**Key Entities:**
- Collections (ERC721, ERC1155)
- Mints (single and batch)
- Collection metadata

**Event Types:**
- `collection_created` - New NFT collection deployed
- `nft_minted` - Single NFT minted
- `batch_minted` - Multiple NFTs minted in one transaction

**Business Rules:**
- Collections must have valid ERC721/ERC1155 interface
- Mint operations must come from authorized minters
- Batch mints must maintain consistent token properties

**Repository Methods:**
```typescript
class CollectionRepository {
  async getCollection(collectionAddress: string)
  async getCollectionStats(collectionAddress: string)
  async getMintedTokens(collectionAddress: string)
  async getMinterStats(minterAddress: string)
}
```

### 3. Auction Domain

Processes auction operations including creation, bidding, settlement, and cancellation.

**Key Entities:**
- Auctions (active, settled, cancelled)
- Bids
- Auction metadata

**Event Types:**
- `auction_created` - New auction created
- `bid_placed` - Bid placed on active auction
- `auction_settled` - Auction ended, highest bid wins
- `auction_cancelled` - Auction cancelled by creator

**Business Rules:**
- Auction must have valid start and end times
- End time must be after start time
- New bids must exceed current highest bid (by minimum increment)
- Only ongoing auctions can receive bids
- Settlement only allowed after end time

**Repository Methods:**
```typescript
class AuctionRepository {
  async getActiveAuctions()
  async getAuctionBids(auctionId: string)
  async getUserAuctions(userAddress: string)
  async getAuctionStats(auctionId: string)
}
```

### 4. Offer Domain

Manages direct offers between users including creation, acceptance, and cancellation.

**Key Entities:**
- Offers (active, accepted, cancelled)
- Offer metadata

**Event Types:**
- `offer_created` - New offer made
- `offer_accepted` - Offer accepted by counterparty
- `offer_cancelled` - Offer cancelled

**Business Rules:**
- Offer must have valid expiration time
- Offer price must be positive
- Only active (non-expired) offers can be accepted
- Only offer creator can cancel
- Offer can only be accepted by collection owner

**Repository Methods:**
```typescript
class OfferRepository {
  async getActiveOffers(collectionAddress?: string)
  async getUserOffers(userAddress: string, type: 'sent'|'received')
  async getOfferStats(collectionAddress: string)
}
```

## Domain Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│            Zuno Marketplace Domains                    │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Trading    │  │  Collection  │  │   Auction   │  │
│  │   Domain     │  │   Domain     │  │   Domain    │  │
│  ├──────────────┤  ├──────────────┤  ├─────────────┤  │
│  │ Events:      │  │ Events:      │  │ Events:     │  │
│  │ • listing_*  │  │ • collection_*│  │ • auction_* │  │
│  │ • *_purchase │  │ • *_minted   │  │ • bid_*     │  │
│  │ • bundle_*   │  │              │  │             │  │
│  │              │  │              │  │             │  │
│  │ Handlers:    │  │ Handlers:    │  │ Handlers:   │  │
│  │ • Price calc │  │ • Mint track │  │ • Bid logic │  │
│  │ • Volume     │  │ • Stats gen  │  │ • Settlement│  │
│  │ • Floor      │  │              │  │ • Auction   │  │
│  │   price      │  │              │  │   state     │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
│                           │                            │
│  ┌──────────────┐         │                            │
│  │   Offer      │◄────────┘                            │
│  │   Domain     │                                      │
│  ├──────────────┤                                      │
│  │ Events:      │                                      │
│  │ • offer_*    │                                      │
│  │              │                                      │
│  │ Handlers:    │                                      │
│  │ • Offer      │                                      │
│  │   matching   │                                      │
│  │ • Expiration │                                      │
│  │   tracking   │                                      │
│  └──────────────┘                                      │
│                                                         │
└────────────────────────────────────────────────────────┘
                          ▼
        ┌────────────────────────────────┐
        │    Event Repository Layer      │
        │   (Single Event Table)          │
        │   (Account Cache Table)         │
        └────────────────────────────────┘
```

## Benefits of Domain Separation

### Code Organization
- Each domain has its own directory and files
- Easy to locate domain-specific logic
- Clear responsibility boundaries

### Independent Development
- Teams can work on different domains in parallel
- Minimal merge conflicts
- Domain expertise localized

### Type Safety
- Domain-specific types prevent cross-domain data mixing
- TypeScript compiler catches issues at compile time
- Self-documenting code

### Testing
- Easier to unit test domain logic in isolation
- Mock repositories per domain
- Clear test boundaries

### Scalability
- Domains can be independently scaled
- Event handlers can be parallelized by domain
- Repository queries can be optimized per domain

## Cross-Domain Queries

While domains are separated, queries can span multiple domains:

```typescript
// Find users who both traded and created auctions
SELECT DISTINCT actor FROM event
WHERE category IN ('trade', 'auction') AND eventType = 'auction_created'

// Get collection stats (trading + minting)
SELECT
  collection,
  COUNT(CASE WHEN category = 'trade' THEN 1 END) as tradeCount,
  COUNT(CASE WHEN category = 'mint' THEN 1 END) as mintCount,
  SUM(CASE WHEN category = 'trade' THEN CAST(data->>'price' AS BIGINT) ELSE 0 END) as tradingVolume
FROM event
WHERE collection = $1
GROUP BY collection
```

## Next Steps

- Explore the [Event-First Architecture](/en/indexer/2.domain-architecture/event-first) in detail
- Review the [Architecture Overview](/en/indexer/2.domain-architecture/overview) for the complete picture
- Check how events are processed in each domain
- Review the [REST API](/en/indexer/3.api-endpoints/rest-api) endpoints for domain queries
