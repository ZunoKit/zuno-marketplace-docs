---
title: "GraphQL API"
package: "indexer"
lastUpdated: "2025-11-25"
scope: "reference"
complexity: "intermediate"
category: "api"
relatedTopics:
  - "rest-api"
  - "quick-start"
  - "event-first"
---

# GraphQL API

Flexible GraphQL endpoint for powerful queries on marketplace data.

## Base URL

```
http://localhost:42069/graphql
```

## Overview

The GraphQL API provides flexible access to all indexed events and derived data. Query exactly what you need with no over-fetching.

## Core Types

### Event

The central type representing all marketplace activities.

```graphql
type Event {
  id: ID!
  eventType: String!
  category: String!
  actor: String!
  counterparty: String
  collection: String!
  tokenId: String
  data: JSON!
  contractAddress: String!
  blockNumber: Int!
  blockTimestamp: Int!
  transactionHash: String!
  chainId: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Account

User account and activity information.

```graphql
type Account {
  address: String!
  firstSeenAt: DateTime!
  lastActiveAt: DateTime!
  eventCount: Int!
}
```

### Collection

NFT collection metadata.

```graphql
type Collection {
  address: String!
  name: String!
  symbol: String!
  type: String!  # ERC721 or ERC1155
  chainId: Int!
  contractAddress: String!
  createdAt: DateTime!
  stats: CollectionStats!
}

type CollectionStats {
  tokenCount: Int!
  floorPrice: String
  volume: String!
  owners: Int!
}
```

## Query Examples

### Get Recent Trades

```graphql
query GetRecentTrades($limit: Int = 10) {
  events(
    where: { eventType: "nft_purchased" }
    orderBy: blockTimestamp_DESC
    limit: $limit
  ) {
    id
    actor
    counterparty
    collection
    tokenId
    data
    blockTimestamp
  }
}
```

### User Activity Timeline

```graphql
query UserActivityTimeline($address: String!) {
  events(
    where: { actor: $address }
    orderBy: blockTimestamp_DESC
  ) {
    id
    eventType
    category
    data
    blockTimestamp
    collection
    tokenId
  }
}
```

### Collection Statistics

```graphql
query CollectionStats($collection: String!) {
  tradeEvents: events(
    where: {
      collection: $collection
      category: "trade"
    }
  ) {
    id
    data
  }

  mintEvents: events(
    where: {
      collection: $collection
      category: "mint"
    }
  ) {
    id
  }

  collection(address: $collection) {
    name
    symbol
    stats {
      tokenCount
      floorPrice
      volume
      owners
    }
  }
}
```

### Trading Volume Analysis

```graphql
query TradingVolumeByUser {
  users: accounts(limit: 100) {
    address
    eventCount
  }

  userTrades: events(
    where: { category: "trade" }
    groupBy: actor
  ) {
    actor
    volume: sum(field: "data.price")
    count
  }
}
```

### Active Auctions with Bids

```graphql
query ActiveAuctions {
  auctions: events(
    where: {
      eventType: "auction_created"
    }
  ) {
    id
    actor
    collection
    tokenId
    data

    bids: events(
      where: {
        eventType: "bid_placed"
        # Filter bids matching this auction
      }
    ) {
      actor
      data
      blockTimestamp
    }
  }
}
```

### Cross-Domain User Analysis

```graphql
query UserMultiDomainActivity($address: String!) {
  trading: events(
    where: {
      actor: $address
      category: "trade"
    }
  ) {
    count
    data
  }

  auctions: events(
    where: {
      actor: $address
      category: "auction"
    }
  ) {
    count
  }

  offers: events(
    where: {
      actor: $address
      category: "offer"
    }
  ) {
    count
  }

  mints: events(
    where: {
      actor: $address
      category: "mint"
    }
  ) {
    count
  }
}
```

## Filters & Search

### Filter by Event Type

```graphql
query EventsByType($eventType: String!) {
  events(where: { eventType: $eventType }) {
    id
    eventType
    actor
    data
  }
}
```

### Filter by Category

```graphql
query EventsByCategory($category: String!) {
  events(where: { category: $category }) {
    id
    eventType
    actor
  }
}
```

### Filter by Time Range

```graphql
query EventsByTimeRange($startTime: Int!, $endTime: Int!) {
  events(
    where: {
      blockTimestamp_gte: $startTime
      blockTimestamp_lte: $endTime
    }
  ) {
    id
    blockTimestamp
    data
  }
}
```

### Combined Filters

```graphql
query CollectionTradingHistory($collection: String!, $startTime: Int!) {
  events(
    where: {
      collection: $collection
      category: "trade"
      blockTimestamp_gte: $startTime
    }
    orderBy: blockTimestamp_DESC
  ) {
    id
    actor
    counterparty
    data
    blockTimestamp
  }
}
```

## Sorting

Supported sort orders:

```graphql
orderBy: [
  blockTimestamp_ASC
  blockTimestamp_DESC
  eventType_ASC
  actor_ASC
  blockNumber_DESC
]
```

## Pagination

Use `limit` and `offset` for pagination:

```graphql
query PaginatedEvents($limit: Int = 50, $offset: Int = 0) {
  events(limit: $limit, offset: $offset) {
    id
    eventType
  }

  total: eventsConnection {
    totalCount
  }
}
```

## Mutations (if available)

Currently the GraphQL API is read-only. All mutations must go through the REST API.

## Performance Tips

### 1. Request Only Needed Fields

**Bad** - Requests entire event object:
```graphql
query GetEvents {
  events {
    id
    eventType
    category
    actor
    counterparty
    collection
    tokenId
    data
    contractAddress
    blockNumber
    blockTimestamp
    transactionHash
    chainId
    createdAt
    updatedAt
  }
}
```

**Good** - Requests only needed fields:
```graphql
query GetEvents {
  events {
    id
    actor
    data
    blockTimestamp
  }
}
```

### 2. Use Filters Before Pagination

**Bad** - Gets all events then filters:
```graphql
query GetUserTrades {
  events(limit: 1000) {
    id
    actor
    category
  }
}
# Then filter in application
```

**Good** - Filters before pagination:
```graphql
query GetUserTrades($address: String!) {
  events(
    where: {
      actor: $address
      category: "trade"
    }
  ) {
    id
    data
  }
}
```

### 3. Cache Frequently Requested Data

```graphql
query CachedCollectionStats($collection: String!) {
  collection(address: $collection) {
    address
    stats {
      tokenCount
      floorPrice
      volume
    }
  }
}
```

## Introspection

Use the GraphQL playground to explore the schema:

```graphql
query Schema {
  __schema {
    types {
      name
      description
    }
  }
}
```

## Error Handling

GraphQL errors are returned in standard format:

```json
{
  "errors": [
    {
      "message": "Invalid argument: address not a valid Ethereum address",
      "extensions": {
        "code": "INVALID_ARGUMENT"
      }
    }
  ]
}
```

## Tools & Clients

Recommended GraphQL clients:

- **Apollo Client** - React client with caching
- **urql** - Lightweight GraphQL client
- **graphql-request** - Minimal client for Node.js
- **Relay** - Advanced client with optimized caching

## Next Steps

- Explore [REST API Endpoints](/en/indexer/3.api-endpoints/rest-api) for simpler queries
- Learn about [Event-First Architecture](/en/indexer/2.domain-architecture/event-first) for data structure
- Review [Quick Start](/en/indexer/1.getting-started/quick-start) to access the GraphQL endpoint
