---
title: "Domain Architecture Overview"
package: "indexer"
lastUpdated: "2025-11-25"
scope: "guide"
complexity: "intermediate"
category: "architecture"
relatedTopics:
  - "event-first"
  - "domains"
  - "event-handlers"
---

Understand the high-level architecture of the Zuno Marketplace Indexer.

## Architecture Philosophy

The Indexer is built on **Domain-Driven Design (DDD)** principles with an **Event-First Architecture**. Every marketplace activity is captured as an immutable event, enabling real-time accuracy and flexible queries.

## Core Principles

### 1. Event-First Design
- **Events are the single source of truth** for all marketplace data
- All state is derived from events
- No data duplication or eventual consistency issues
- Perfect for activity feeds and marketplace displays

### 2. Domain Separation
Clean boundaries between distinct business domains:

- **Trading Domain**: NFT listings, purchases, and cancellations
- **Collection Domain**: ERC721/ERC1155 collection creation and minting
- **Auction Domain**: Auction creation, bidding, and settlement
- **Offer Domain**: Direct offer creation, acceptance, and cancellation

### 3. Event Handlers
Each domain has specialized handlers:

- **Auction Handlers**: `auction_created`, `bid_placed`, `auction_settled`, `auction_cancelled`
- **Offer Handlers**: `offer_created`, `offer_accepted`, `offer_cancelled`
- **Listing Handlers**: `listing_created`, `listing_cancelled`, `listing_filled`
- **Trade Handlers**: `nft_purchased`, `bundle_purchased`
- **Mint Handlers**: `nft_minted`, `batch_minted`
- **Collection Handlers**: `collection_created`

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Blockchain Networks                             │
│          (Ethereum, Polygon, Base, Optimism, Arbitrum, etc.)         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Ponder Indexer Framework                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │         Event Handlers (Smart Contract Events)               │   │
│  │  ┌──────────────┬──────────────┬──────────────┐              │   │
│  │  │    Trading   │  Collection  │   Auction    │              │   │
│  │  │    Handlers  │   Handlers   │   Handlers   │              │   │
│  │  └──────────────┴──────────────┴──────────────┘              │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       PostgreSQL Database                            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Event Table: Single source of truth for all marketplace data   │ │
│  │ Account Table: User activity cache                             │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │ Comprehensive Indexes:                                         │ │
│  │ - Single field: eventType, category, actor, timestamp, etc.    │ │
│  │ - Composite: actor+timestamp, collection+timestamp, etc.       │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API Layer                                     │
│  ┌────────────────────────┐    ┌──────────────────────────────┐    │
│  │    GraphQL API         │    │      REST API Endpoints      │    │
│  │  (Apollo Server)       │    │  - /api/collections          │    │
│  │  Full query support    │    │  - /api/tokens               │    │
│  │  for all events        │    │  - /api/trades               │    │
│  │                        │    │  - /api/accounts             │    │
│  │                        │    │  - /api/events               │    │
│  │                        │    │  - /api/stats                │    │
│  └────────────────────────┘    └──────────────────────────────┘    │
│              (Hono Framework - High-performance)                    │
└─────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
zuno-marketplace-indexer/
├── src/
│   ├── api/                    # REST API endpoints (Hono framework)
│   │   ├── collections.ts      # Collections endpoints
│   │   ├── tokens.ts           # Token endpoints
│   │   ├── trades.ts           # Trade endpoints
│   │   ├── accounts.ts         # Account endpoints
│   │   ├── events.ts           # Event endpoints
│   │   ├── stats.ts            # Statistics endpoints
│   │   └── status.ts           # Health check
│   │
│   ├── config/                 # Configuration management
│   │   ├── config.generator.ts # Automatic config generation
│   │   └── ponder.config.ts    # Ponder configuration
│   │
│   ├── domain/                 # Domain-driven design modules
│   │   ├── auction/            # Auction domain & handlers
│   │   │   ├── handlers.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── collection/         # Collection domain & handlers
│   │   │   ├── handlers.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── trading/            # Trading domain & handlers
│   │   │   ├── handlers.ts
│   │   │   └── types.ts
│   │   │
│   │   └── offer/              # Offer domain & handlers
│   │       ├── handlers.ts
│   │       └── types.ts
│   │
│   ├── infrastructure/         # Infrastructure layer
│   │   ├── external/           # External services (Zuno API)
│   │   │   └── zuno-client.ts
│   │   │
│   │   ├── logging/            # Event logging
│   │   │   └── event-logger.ts
│   │   │
│   │   └── monitoring/         # Error handling & metrics
│   │       ├── error-handler.ts
│   │       └── metrics.ts
│   │
│   ├── repositories/           # Data access layer
│   │   ├── base.repository.ts  # Base repository
│   │   ├── event.repository.ts
│   │   └── account.repository.ts
│   │
│   ├── shared/                 # Shared utilities & types
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   └── index.ts                # Main entry point
│
├── ponder.schema.ts            # Database schema definition
├── ponder.config.ts            # Ponder configuration
└── package.json                # Dependencies & scripts
```

## Key Features

### Multi-Chain Support
Indexes events across multiple EVM chains:
- Ethereum Mainnet
- Polygon
- Base
- Optimism
- Arbitrum
- And more...

### Real-Time Indexing
- Processes events as they occur on blockchain
- Handles block reorganizations gracefully
- Maintains data consistency across chains

### Dynamic Configuration
- Automatically fetches contract ABIs from Zuno API
- Generates configuration without manual setup
- Supports custom contract configurations

### Comprehensive Event Processing
- 100+ event types across all domains
- Type-safe event handlers with TypeScript
- Flexible JSONB data storage for event details

## Next Steps

- Explore [Event-First Architecture](/indexer/domain-architecture/event-first) in detail
- Learn about [Domain Separation](/indexer/domain-architecture/domains)
- Review [Domain Handlers and Implementation](/indexer/domain-architecture/event-first#event-handlers)
- Check the [API Endpoints](/indexer/api-endpoints/rest-api)
