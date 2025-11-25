---
title: "Quick Start"
package: "indexer"
lastUpdated: "2025-11-25"
scope: "guide"
complexity: "beginner"
category: "quickstart"
relatedTopics:
  - "installation"
  - "configuration"
  - "environment-variables"
---

# Quick Start

Get the Indexer running in 6 simple steps.

## 1. Installation

First, install the project dependencies:

```bash
npm install
```

See [Installation](/en/indexer/1.getting-started/installation) for detailed setup instructions.

## 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Zuno API Configuration
ZUNO_API_URL=https://zuno-marketplace-abis.vercel.app/api
ZUNO_API_KEY=your_api_key_here

# Database Configuration (optional - uses PGlite by default)
DATABASE_URL=postgresql://user:password@localhost:5432/ponder

# RPC URLs - Add your RPC endpoints for each chain you want to index
# Format: PONDER_RPC_URL_{CHAIN_ID}=<rpc_url>

# Example: Ethereum Mainnet (Chain ID: 1)
PONDER_RPC_URL_1=https://eth-mainnet.g.alchemy.com/v2/your_alchemy_key

# Example: Polygon (Chain ID: 137)
PONDER_RPC_URL_137=https://polygon-mainnet.g.alchemy.com/v2/your_alchemy_key

# Example: Base (Chain ID: 8453)
PONDER_RPC_URL_8453=https://base-mainnet.g.alchemy.com/v2/your_alchemy_key

# Optional: WebSocket URLs for faster syncing
# PONDER_WS_URL_1=wss://eth-mainnet.g.alchemy.com/v2/your_alchemy_key
```

**Note**: You can copy `.env.example` to `.env.local` and fill in your values.

See [Configuration](/en/indexer/4.deployment/configuration) for complete environment variable documentation.

## 3. Generate Configuration

```bash
npm run generate-config
```

This command:

- Fetches all contract ABIs from Zuno API
- Generates `ponder.config.generated.ts` with all configured chains and contracts
- Lists all available networks and contracts

## 4. Copy Generated Config (if needed)

If you want to customize the configuration:

```bash
cp ponder.config.generated.ts ponder.config.ts
```

Otherwise, the generated config will be used automatically.

## 5. Run the Indexer

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run start
```

## 6. Access the APIs

Once running, you can access:

### GraphQL API
- **URL**: `http://localhost:42069/graphql`
- Full query/mutation support for all indexed events

### REST API Endpoints
- **Collections**: `/api/collections` - NFT collections data
- **Tokens**: `/api/tokens` - Individual NFT tokens
- **Trades**: `/api/trades` - Trading transactions
- **Accounts**: `/api/accounts` - User accounts and stats
- **Events**: `/api/events` - Raw event logs
- **Stats**: `/api/stats` - Marketplace statistics
- **Status**: `/api/status` - Health check endpoint

## Available Scripts

```bash
# Development
npm run dev                # Start development server with hot reload
npm run start             # Start production server
npm run serve             # Serve the built indexer

# Database
npm run db               # Database management commands

# Code Generation
npm run codegen          # Generate TypeScript types from schema
npm run generate-config  # Generate Ponder config from Zuno API
npm run setup            # Run generate-config + codegen

# Build & Deployment
npm run build            # Build the project (generate-config + codegen)

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking
```

## Next Steps

- Learn about [Event-First Architecture](/en/indexer/2.domain-architecture/event-first)
- Explore the [Domain Architecture](/en/indexer/2.domain-architecture/overview)
- Check the [REST API](/en/indexer/3.api-endpoints/rest-api) documentation
- Review [Deployment Configuration](/en/indexer/4.deployment/configuration)

## Troubleshooting

If you encounter issues:

1. **Check environment variables** - Ensure all required RPC URLs are set
2. **Verify database connection** - Test your PostgreSQL connection
3. **Clear cache** - Remove `.ponder` directory and regenerate config
4. **Check logs** - Review the output for specific error messages
