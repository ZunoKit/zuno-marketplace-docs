---
title: "Event-First Architecture"
package: "indexer"
lastUpdated: "2025-11-25"
scope: "guide"
complexity: "advanced"
category: "architecture"
relatedTopics:
  - "overview"
  - "domains"
  - "database-schema"
---

Deep dive into the pure event-sourcing architecture that powers the Indexer.

## Philosophy

The Indexer uses a **pure event-sourcing architecture** where:

- **Events are the ONLY source of truth** - no projections, no duplicates
- All data is accessed via event queries - real-time and accurate
- Simplified codebase - 83% reduction in schema complexity
- Perfect for activity feeds and marketplace displays

## Core Benefits

✅ **83% reduction** in schema complexity (from 12 tables to 2)
✅ **No data duplication** - single source of truth
✅ **Real-time accuracy** - always up-to-date
✅ **Flexible queries** - filter by any dimension
✅ **Easier maintenance** - simple, clean, effective

## Database Schema

### 1. Event Table - Single Source of Truth

All blockchain events are indexed in this table. Every marketplace activity is recorded as an event with flexible JSONB data field.

#### Event Categories

- **Auction Events**: `auction_created`, `bid_placed`, `auction_settled`, `auction_cancelled`
- **Offer Events**: `offer_created`, `offer_accepted`, `offer_cancelled`
- **Listing Events**: `listing_created`, `listing_cancelled`, `listing_filled`
- **Trade Events**: `nft_purchased`, `bundle_purchased`
- **Mint Events**: `nft_minted`, `batch_minted`
- **Collection Events**: `collection_created`

#### Key Fields

```typescript
interface Event {
  id: string                    // UUID primary key
  eventType: string             // Event type (e.g., 'auction_created')
  category: string              // Event category (e.g., 'auction')

  // Participants
  actor: string                 // Primary actor (initiator)
  counterparty?: string         // Secondary party if applicable

  // Asset Reference
  collection: string            // NFT collection address
  tokenId?: string              // NFT token ID

  // Event Metadata
  data: Record<string, any>     // JSONB - event-specific flexible schema
  contractAddress: string       // Contract that emitted event
  blockNumber: number           // Block number
  blockTimestamp: number        // Block timestamp (unix)
  transactionHash: string       // Transaction hash
  chainId: number               // Blockchain network ID

  // Indexing
  createdAt: Date               // Indexer creation timestamp
  updatedAt: Date               // Last update timestamp
}
```

#### Comprehensive Indexes

**Single Field Indexes:**
- `eventType` - Query by event type
- `category` - Filter by domain
- `actor` - User activity queries
- `counterparty` - Participant queries
- `collection` - Collection-specific queries
- `blockTimestamp` - Time-based filtering
- `transactionHash` - Transaction lookup
- `chainId` - Chain filtering

**Composite Indexes:**
- `actor + blockTimestamp` - User activity timeline
- `collection + blockTimestamp` - Collection activity timeline
- `category + eventType` - Domain-specific event queries
- `collection + tokenId` - Token-specific events

### 2. Account Table - User Activity Cache

Minimal user data for quick profile lookups. Detailed stats are calculated from events on-demand.

```typescript
interface Account {
  address: string              // Wallet address (primary key)
  firstSeenAt: Date            // First activity timestamp
  lastActiveAt: Date           // Most recent activity
  eventCount: number           // Total event count
}
```

## Query Examples

### Get Active Auctions

```sql
SELECT * FROM event
WHERE eventType = 'auction_created'
  AND NOT EXISTS (
    SELECT 1 FROM event e2
    WHERE e2.eventType IN ('auction_settled', 'auction_cancelled')
      AND JSON_EXTRACT(e2.data, '$.auctionId') = JSON_EXTRACT(event.data, '$.auctionId')
  )
ORDER BY blockTimestamp DESC
```

### User's Trading Volume

```sql
SELECT SUM(CAST(data->>'price' AS BIGINT)) as totalVolume
FROM event
WHERE actor = $1 AND category = 'trade'
```

### Recent Activity Feed

```sql
SELECT eventType, blockTimestamp, data, actor, collection
FROM event
ORDER BY blockTimestamp DESC
LIMIT 50
```

### Collection Floor Price (from trades)

```sql
SELECT
  MIN(CAST(data->>'price' AS BIGINT)) as floorPrice,
  MAX(CAST(data->>'price' AS BIGINT)) as ceilingPrice,
  COUNT(*) as tradeCount
FROM event
WHERE collection = $1
  AND eventType IN ('nft_purchased', 'listing_filled')
  AND blockTimestamp > (NOW() - INTERVAL '30 days')
GROUP BY collection
```

### User to User Transfer Analysis

```sql
SELECT
  actor,
  counterparty,
  COUNT(*) as interactionCount,
  COUNT(DISTINCT collection) as uniqueCollections
FROM event
WHERE category = 'trade'
GROUP BY actor, counterparty
ORDER BY interactionCount DESC
LIMIT 10
```

## Event Data Structure

Each event stores domain-specific data in the JSONB `data` field:

### Auction Event Example
```json
{
  "auctionId": "0x123abc...",
  "nftAddress": "0x456def...",
  "tokenId": "42",
  "startPrice": "1000000000000000000",
  "endTime": 1735689600,
  "bidCount": 5
}
```

### Trade Event Example
```json
{
  "price": "2500000000000000000",
  "buyer": "0xbuyeraddress...",
  "seller": "0xselleraddress...",
  "quantity": 1,
  "paymentToken": "0xerc20address..."
}
```

### Offer Event Example
```json
{
  "offerId": "0x789ghi...",
  "nftAddress": "0x456def...",
  "tokenId": "99",
  "offerPrice": "1500000000000000000",
  "expiresAt": 1735689600,
  "status": "active"
}
```

## Why Not Traditional Normalized Schema?

Traditional approaches with 12+ tables would include:

- Separate tables for each domain (Auctions, Trades, Listings, Offers, Collections, Tokens, Accounts, etc.)
- Denormalized views for quick lookups
- Complex JOIN queries for activity feeds
- Data synchronization issues
- Harder to track historical changes

**Event-First eliminates all of this:**

Instead of maintaining multiple denormalized tables, query events directly. Want floor price? Calculate from trades. Want user stats? Aggregate their events. Want activity feed? Order events by timestamp.

## Performance Considerations

### Read-Heavy Workload
The architecture is optimized for read-heavy marketplace queries:
- Fast timeline queries with indexed timestamp
- Quick user lookups by actor address
- Efficient collection-specific queries

### Write Operations
Each blockchain event creates exactly one database record. No updates, only inserts:
- No write conflicts
- Perfect for concurrent indexing
- Easy to scale horizontally

### Index Strategy
Composite indexes on frequently accessed query patterns:
- User + time for activity feeds
- Collection + time for collection stats
- Category + type for domain-specific queries

## Comparison with Traditional Approach

| Aspect | Event-First | Traditional |
|--------|-----------|-----------|
| **Tables** | 2 | 12+ |
| **Data Duplication** | None | Extensive |
| **Query Complexity** | Simple filtering | Complex JOINs |
| **Real-time Accuracy** | Always accurate | Eventual consistency |
| **Historical Data** | Complete audit trail | Lost on updates |
| **Maintenance** | Simple | Complex |

## Next Steps

- Learn about [Domain Separation](/indexer/2.domain-architecture/domains)
- Explore the [Architecture Overview](/indexer/2.domain-architecture/overview)
- Review [REST API endpoints](/indexer/3.api-endpoints/rest-api) that use this architecture
