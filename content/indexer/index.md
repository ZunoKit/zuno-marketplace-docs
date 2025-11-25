---
title: "Zuno Marketplace Indexer"
package: "indexer"
lastUpdated: "2025-11-25"
changeFrequency: "monthly"
scope: "guide"
context: "standalone"
complexity: "intermediate"
tokenEstimate: 370
category: "overview"
navigation: false
relatedTopics:
  - "domain-architecture"
  - "api-endpoints"
  - "features"
---

<div class="flex gap-2 mb-6 flex-wrap">
  <UBadge color="blue" variant="subtle">Ponder</UBadge>
  <UBadge color="green" variant="subtle">TypeScript 5.3</UBadge>
  <UBadge color="purple" variant="subtle">PostgreSQL</UBadge>
  <UBadge color="gray" variant="subtle">GraphQL</UBadge>
  <UBadge color="orange" variant="subtle">Event-First</UBadge>
</div>

> **Enterprise-grade blockchain event indexer for Zuno NFT Marketplace**

A high-performance blockchain event indexer that tracks and indexes all Zuno NFT Marketplace events across multiple chains. Built with **Domain-Driven Design (DDD)** architecture, featuring automatic configuration generation from the Zuno Marketplace ABIs API and comprehensive event processing across trading, collections, offers, and auctions.

## ✨ Features

### Core Features

- ✅ **Multi-chain Support** - Indexes events across multiple EVM chains (Ethereum, Polygon, Base, Optimism, Arbitrum & more)
- ✅ **Real-time Indexing** - Tracks all marketplace events in real-time with block reorganization handling
- ✅ **Dynamic Configuration** - Automatically fetches and generates contract ABIs and configurations from Zuno API
- ✅ **PostgreSQL Database** - High-performance database with comprehensive schema for all marketplace data

### Domain-Driven Architecture

- ✅ **Domain Separation** - Clean separation into Trading, Collection, Offer, and Auction domains
- ✅ **Event Handlers** - Specialized handlers for each marketplace event type
- ✅ **Repository Pattern** - Data access layer with base repository and specialized implementations
- ✅ **Type Safety** - Full TypeScript with strict typing and comprehensive event type definitions

### Infrastructure & Monitoring

- ✅ **Error Handling** - Comprehensive error handling with retry logic and monitoring
- ✅ **Event Logging** - Detailed event tracking and processing logs with structured logging
- ✅ **Metrics & Monitoring** - Built-in metrics tracking for performance monitoring
- ✅ **Handler Wrapping** - Automatic error handling and metrics collection for all event handlers

### API & Integration

- ✅ **GraphQL API** - Flexible querying with built-in GraphQL endpoint
- ✅ **REST API** - RESTful endpoints for collections, tokens, trades, accounts, events, and stats
- ✅ **Hono Framework** - High-performance API server with CORS and logging middleware
- ✅ **Zuno API Integration** - Dynamic ABI fetching and configuration generation

## 📚 Documentation

::card-grid
  ::card{icon="i-heroicons-rocket-launch" title="Getting Started" to="/indexer/getting-started/installation"}
  Install and configure the indexer
  ::
  ::card{icon="i-heroicons-cube" title="Domain Architecture" to="/indexer/domain-architecture/event-first"}
  Event-first architecture and domain design
  ::
  ::card{icon="i-heroicons-globe-americas" title="API Endpoints" to="/indexer/api-endpoints/rest-api"}
  REST and GraphQL API access
  ::
::

## 🗄️ Architecture Highlights

### Event-First Architecture

The indexer uses a **pure event-sourcing architecture** with minimal tables for maximum efficiency:

- **Events are the ONLY source of truth** - no projections, no duplicates
- **83% reduction** in schema complexity (from 12 tables to 2)
- **Real-time accuracy** - always up-to-date
- **Flexible queries** - filter by any dimension

### Domain Separation

- **Trading Domain**: Handles NFT listings, purchases, and cancellations
- **Collection Domain**: Manages ERC721/ERC1155 collection creation and minting
- **Auction Domain**: Processes auction creation, bidding, and settlement

## 🚀 Quick Start

```bash
git clone https://github.com/ZunoKit/zuno-marketplace-indexer.git
cd zuno-marketplace-indexer
npm install
npm run generate-config
npm run dev
```

## See Also

- **[SDK](/sdk/core-modules/exchange)** - Use indexer data with the SDK
- **[ABIs Service](/abis/api-reference/abis-endpoints)** - Contract ABIs used by indexer
- **[Metadata Service](/metadata/api-reference/metadata-endpoints)** - NFT metadata management
