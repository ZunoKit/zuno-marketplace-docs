---
title: "Quick Start"
package: "abis"
lastUpdated: "2025-11-25"
scope: "guide"
complexity: "beginner"
category: "getting-started"
relatedTopics:
  - "installation"
  - "verification"
  - "authentication"
---

Get up and running with Zuno Marketplace ABIs in minutes.

## Access Points

Once your development server is running, you can access the following:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Public marketplace (coming soon) |
| **Admin Dashboard** | http://localhost:3000/admin | ABI management interface |
| **API** | http://localhost:3000/api | RESTful API endpoints |
| **Health Check** | http://localhost:3000/api/health | System status & version |
| **Database Studio** | `pnpm db:studio` | Visual database browser |

## Default Admin Credentials

Access the admin dashboard with these default credentials:

```
Email: admin@example.com
Password: admin123
```

::alert{type="warning"}
**IMPORTANT**: Change these credentials immediately in production!
::

### How to Change Admin Password

1. Login at http://localhost:3000/admin
2. Go to **Settings** → **Account**
3. Click **Change Password**
4. Enter new password and confirm
5. Logout and login with new password

## First Steps

### 1. Verify the Installation

Check that all services are running correctly:

```bash
pnpm typecheck

# Run tests
pnpm test

# Health check
curl http://localhost:3000/api/health
```

Expected response indicates healthy services:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T...",
  "version": "v1",
  "services": {
    "database": "connected",
    "cache": "connected",
    "ipfs": "connected"
  }
}
```

### 2. Explore the Admin Dashboard

1. Navigate to http://localhost:3000/admin
2. Login with default credentials
3. Browse sections:
   - **ABIs** - View and manage contract ABIs
   - **Contracts** - Manage smart contracts
   - **Networks** - View supported blockchain networks
   - **API Keys** - Generate API keys for programmatic access
   - **Users** - Manage user accounts and permissions
   - **Settings** - Configure application settings

### 3. Make Your First API Request

Create a `.env.local` file in your project (or skip if testing with curl):

```bash
# Test without authentication (public endpoint)
curl "http://localhost:3000/api/networks"
```

Expected response:

```json
{
  "success": true,
  "data": [
    {
      "id": "network_v1_eth",
      "name": "Ethereum Mainnet",
      "chainId": 1,
      "rpcUrl": "https://eth.llamarpc.com",
      "explorerUrl": "https://etherscan.io",
      "nativeCurrency": {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
      },
      "isTestnet": false
    }
  ]
}
```

## API Key Setup

For programmatic access to protected endpoints:

1. Go to `/admin/api-keys`
2. Click **Create New Key**
3. Select tier (Free/Pro/Enterprise)
4. Set permissions and expiration
5. Copy key immediately (only shown once)

Use the API key in requests:

```bash
curl -H "X-API-Key: sk_live_abc123xyz..." \
     "http://localhost:3000/api/abis?network=ethereum"
```

## Development Commands

Essential commands for development:

::code-group

```bash [Development]
pnpm dev                 # Start dev server with Turbopack
pnpm typecheck          # Type checking
pnpm lint               # ESLint
pnpm format             # Prettier formatting
```

```bash [Database]
pnpm db:generate        # Generate migrations & types
pnpm db:migrate         # Run migrations
pnpm db:studio          # Open Drizzle Studio
pnpm db:seed            # Seed database
pnpm db:check           # Validate data integrity
```

```bash [Testing]
pnpm test               # Unit tests
pnpm test:watch         # Watch mode
pnpm test:coverage      # Coverage report
```

```bash [Build]
pnpm build              # Production build
pnpm start              # Start production server
```

::

## Configuration Files

Key configuration files in the project:

| File | Purpose |
|------|---------|
| `.env` | Environment variables (required) |
| `src/shared/config/app.config.ts` | Application configuration |
| `src/shared/config/env.ts` | Environment validation |
| `nuxt.config.ts` | Nuxt configuration |
| `tsconfig.json` | TypeScript configuration |

## Common First Tasks

### List All Networks

Get all supported blockchain networks:

```bash
curl "http://localhost:3000/api/networks"
```

### Upload an ABI

Create a new ABI entry:

```bash
curl -X POST http://localhost:3000/api/abis \
  -H "X-API-Key: sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x1234567890abcdef...",
    "network": "ethereum",
    "abi": [...],
    "metadata": {
      "compiler": "0.8.19",
      "optimization": true
    }
  }'
```

### Search ABIs

Find ABIs by network:

```bash
curl "http://localhost:3000/api/abis?network=ethereum&page=1&limit=20"
```

## Production Checklist

Before deploying to production, ensure:

- [ ] Changed default admin credentials
- [ ] Generated strong `BETTER_AUTH_SECRET`
- [ ] Configured production database with SSL
- [ ] Setup Upstash Redis (Pro tier recommended)
- [ ] Configured Pinata (sufficient quota)
- [ ] Reviewed security best practices
- [ ] All tests passing (`pnpm test`)
- [ ] Type checking clean (`pnpm typecheck`)

See [Deployment Guide](/abis/deployment/vercel) for complete production setup.

## Getting Help

- **Documentation**: [API Reference](/abis/api-reference/authentication)
- **Tests**: Check `tests/` directory for examples
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
