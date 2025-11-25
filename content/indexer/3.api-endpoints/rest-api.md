---
title: "REST API Endpoints"
package: "indexer"
lastUpdated: "2025-11-25"
scope: "reference"
complexity: "intermediate"
category: "api"
relatedTopics:
  - "graphql"
  - "quick-start"
  - "domain-architecture"
---

Complete reference for REST API endpoints available on the Indexer.

## Base URL

```
http://localhost:42069/api
```

## Collections Endpoint

Get NFT collection data and metadata.

### GET `/collections`

Retrieve all indexed collections.

**Query Parameters:**
- `limit` (number) - Results per page (default: 50, max: 1000)
- `offset` (number) - Results offset (default: 0)
- `chainId` (number) - Filter by blockchain network
- `sort` (string) - Sort field: `created_at`, `trade_count`, `volume`
- `order` (string) - Sort order: `asc`, `desc`

**Response:**
```json
{
  "data": [
    {
      "address": "0x123abc...",
      "name": "Zuno Collection",
      "symbol": "ZUNO",
      "type": "ERC721",
      "chainId": 1,
      "contractAddress": "0x456def...",
      "createdAt": "2025-01-15T10:30:00Z",
      "stats": {
        "tokenCount": 10000,
        "floorPrice": "1500000000000000000",
        "volume": "50000000000000000000",
        "owners": 2500
      }
    }
  ],
  "total": 156,
  "limit": 50,
  "offset": 0
}
```

## Tokens Endpoint

Access individual NFT token information.

### GET `/tokens`

Retrieve tokens with advanced filtering.

**Query Parameters:**
- `collection` (string) - Filter by collection address
- `tokenId` (string) - Specific token ID
- `owner` (string) - Filter by owner address
- `chainId` (number) - Filter by blockchain
- `limit` (number) - Results per page
- `offset` (number) - Results offset

**Response:**
```json
{
  "data": [
    {
      "tokenId": "42",
      "collection": "0x456def...",
      "owner": "0xabcdef123...",
      "chainId": 1,
      "metadata": {
        "name": "Zuno NFT #42",
        "description": "Rare collectible",
        "image": "ipfs://..."
      },
      "listing": {
        "price": "2500000000000000000",
        "currency": "0xc02aaa39b223fe8d0a0e8d0d0d0d0d0d",
        "createdAt": "2025-01-15T10:30:00Z"
      }
    }
  ],
  "total": 10000,
  "limit": 50,
  "offset": 0
}
```

## Trades Endpoint

Get trading transaction history.

### GET `/trades`

Retrieve marketplace trades with filtering.

**Query Parameters:**
- `collection` (string) - Filter by collection address
- `seller` (string) - Filter by seller address
- `buyer` (string) - Filter by buyer address
- `startTime` (timestamp) - Start of time range
- `endTime` (timestamp) - End of time range
- `chainId` (number) - Filter by blockchain
- `limit` (number) - Results per page
- `offset` (number) - Results offset

**Response:**
```json
{
  "data": [
    {
      "id": "0x123abc...",
      "collection": "0x456def...",
      "tokenId": "42",
      "seller": "0xseller123...",
      "buyer": "0xbuyer456...",
      "price": "2500000000000000000",
      "currency": "0xc02aaa39b223fe8d0a0e8d0d0d0d0d0d",
      "timestamp": "2025-01-15T10:30:00Z",
      "chainId": 1,
      "transactionHash": "0x789def...",
      "blockNumber": 21000000
    }
  ],
  "total": 25000,
  "limit": 50,
  "offset": 0,
  "stats": {
    "totalVolume": "500000000000000000000",
    "avgPrice": "2000000000000000000",
    "tradeCount": 25000
  }
}
```

## Accounts Endpoint

Access user account and activity data.

### GET `/accounts`

Retrieve user accounts with activity statistics.

**Query Parameters:**
- `address` (string) - Specific user address
- `sortBy` (string) - Sort field: `activity`, `volume`, `tradeCount`
- `limit` (number) - Results per page
- `offset` (number) - Results offset

**Response:**
```json
{
  "data": [
    {
      "address": "0xuser123...",
      "firstSeenAt": "2024-01-15T10:30:00Z",
      "lastActiveAt": "2025-01-15T10:30:00Z",
      "stats": {
        "totalEvents": 156,
        "totalVolume": "25000000000000000000",
        "tradeCount": 45,
        "auctionCount": 12,
        "collectionsOwned": 8
      }
    }
  ],
  "total": 15000,
  "limit": 50,
  "offset": 0
}
```

## Events Endpoint

Access raw event logs from the indexer.

### GET `/events`

Retrieve indexed blockchain events.

**Query Parameters:**
- `type` (string) - Event type filter (e.g., `auction_created`)
- `category` (string) - Event category (e.g., `auction`, `trade`)
- `actor` (string) - Filter by event actor
- `collection` (string) - Filter by collection
- `chainId` (number) - Filter by blockchain
- `startBlock` (number) - Start block number
- `endBlock` (number) - End block number
- `limit` (number) - Results per page
- `offset` (number) - Results offset

**Response:**
```json
{
  "data": [
    {
      "id": "evt_123abc",
      "eventType": "auction_created",
      "category": "auction",
      "actor": "0xcreator123...",
      "counterparty": "0xbidder456...",
      "collection": "0x789def...",
      "tokenId": "42",
      "data": {
        "auctionId": "0xauc123...",
        "startPrice": "1000000000000000000",
        "endTime": 1735689600
      },
      "contractAddress": "0xmarketplace...",
      "blockNumber": 21000050,
      "blockTimestamp": 1705310400,
      "transactionHash": "0x456def...",
      "chainId": 1,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 100000,
  "limit": 50,
  "offset": 0
}
```

## Stats Endpoint

Get marketplace-wide statistics and aggregated data.

### GET `/stats`

Retrieve overall marketplace statistics.

**Query Parameters:**
- `chainId` (number) - Filter by blockchain (optional - returns cross-chain if not specified)
- `timeRange` (string) - Time range: `day`, `week`, `month`, `all` (default: `all`)

**Response:**
```json
{
  "marketplace": {
    "totalVolume": "1000000000000000000000",
    "totalTrades": 50000,
    "totalCollections": 156,
    "totalNFTs": 1000000,
    "totalUsers": 15000,
    "floorPrice": "500000000000000000"
  },
  "trends": {
    "volumeChange24h": "+15.5%",
    "volumeChange7d": "+45.2%",
    "tradesChange24h": "+8.3%",
    "usersChange7d": "+230"
  },
  "topCollections": [
    {
      "address": "0x789abc...",
      "name": "Top Collection",
      "volume": "50000000000000000000",
      "trades": 2500,
      "floorPrice": "1500000000000000000"
    }
  ],
  "topTraders": [
    {
      "address": "0xtrader123...",
      "volume": "1000000000000000000",
      "trades": 25
    }
  ]
}
```

## Status Endpoint

Health check and indexer status.

### GET `/status`

Check indexer health and current status.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 86400,
  "synced": true,
  "lastSyncedBlock": {
    "chainId": 1,
    "blockNumber": 21000000,
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "chains": [
    {
      "chainId": 1,
      "name": "Ethereum",
      "status": "synced",
      "currentBlock": 21000000,
      "lastSyncTime": "2025-01-15T10:30:00Z"
    },
    {
      "chainId": 137,
      "name": "Polygon",
      "status": "synced",
      "currentBlock": 65000000,
      "lastSyncTime": "2025-01-15T10:30:00Z"
    }
  ],
  "eventCounts": {
    "total": 1000000,
    "daily": 5000
  }
}
```

## Error Handling

All endpoints return standard error responses:

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid limit parameter",
    "details": {
      "parameter": "limit",
      "reason": "Must be between 1 and 1000"
    }
  }
}
```

**Common Status Codes:**
- `200 OK` - Successful request
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

REST API endpoints have the following rate limits:

- **Standard Tier**: 100 requests per minute
- **Pro Tier**: 1000 requests per minute
- **Enterprise**: Custom limits

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705313400
```

## Pagination

Use `limit` and `offset` parameters for pagination:

```bash
curl "http://localhost:42069/api/collections?limit=50&offset=0"

# Second page
curl "http://localhost:42069/api/collections?limit=50&offset=50"

# Get total count from response metadata
# Use total count to calculate pages: Math.ceil(total / limit)
```

## Next Steps

- Explore the [GraphQL API](/en/indexer/3.api-endpoints/graphql) for flexible querying
- Learn about [Quick Start](/en/indexer/1.getting-started/quick-start) to access these endpoints
- Review [Domain Architecture](/en/indexer/2.domain-architecture/overview) to understand data structure
