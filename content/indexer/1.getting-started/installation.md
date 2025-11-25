---
title: "Installation"
package: "indexer"
lastUpdated: "2025-11-25"
scope: "guide"
complexity: "beginner"
category: "installation"
relatedTopics:
  - "quick-start"
  - "configuration"
  - "overview"
---

Get the Zuno Marketplace Indexer up and running in minutes.

## Prerequisites

Before installing, ensure you have the following installed:

| Requirement | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.14+ | Runtime environment |
| **npm/pnpm/yarn** | Latest | Package manager |
| **PostgreSQL** | 14+ | Database (optional - uses PGlite by default) |
| **Anvil** | Latest | Local development and testing |

## Installation Steps

Follow these steps to install the Indexer:

```bash
git clone https://github.com/ZunoKit/zuno-marketplace-indexer.git
cd zuno-marketplace-indexer

# Install dependencies
npm install
```

## What Gets Installed

The installation process sets up:

- Ponder framework for blockchain event indexing
- TypeScript 5.3 compilation toolchain
- PostgreSQL driver and schema management
- Hono framework for REST API server
- GraphQL endpoint with Apollo Server
- Event handlers for DDD domains
- Repository pattern data access layer
- Comprehensive error handling and monitoring

## Next Steps

After installation, proceed with [Quick Start](/indexer/1.getting-started/quick-start) to configure and run the indexer.

## See Also

- [Quick Start Guide](/indexer/1.getting-started/quick-start)
- [Configuration Guide](/indexer/1.getting-started/quick-start#2-configure-environment-variables)
- [Event-First Architecture](/indexer/2.domain-architecture/event-first)
