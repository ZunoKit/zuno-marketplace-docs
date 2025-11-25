---
title: "Installation"
description: "Get the Zuno Marketplace ABIs service running in minutes with comprehensive setup guide."
package: "abis"
lastUpdated: "2024-11-24"
scope: "guide"
complexity: "beginner"
category: "installation"
relatedTopics:
  - "quick-start"
  - "authentication"
  - "configuration"
---

## Prerequisites

| Requirement | Minimum Version | Recommended | Purpose |
|-------------|----------------|-------------|---------|
| **Node.js** | 18.x | 20.x LTS | Runtime environment |
| **pnpm** | 8.x | 9.x | Package manager |
| **PostgreSQL** | 14.x | 16.x | Primary database |
| **Upstash Redis** | - | Cloud | Caching & rate limiting |
| **Pinata Account** | - | Cloud | IPFS storage |

## 🔑 Get Free Credentials

**Required Services (Free Tiers Available):**

- **[Upstash Redis](https://console.upstash.com)** - Free tier: 10K requests/day
- **[Pinata](https://app.pinata.cloud)]** - Free tier: 1GB storage

## 📦 Installation Steps

### 1️⃣ Clone & Install Dependencies

```bash
git clone https://github.com/ZunoKit/zuno-marketplace-abis.git
cd zuno-marketplace-abis

pnpm install
```

### 2️⃣ Configure Environment Variables

Create `.env.local` file in project root:

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/zuno_marketplace"

# Authentication (Required - Generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET="your-secret-key-min-32-characters-long"
BETTER_AUTH_URL="http://localhost:3000"

# Cache - Upstash Redis (Required - Free tier available)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# IPFS Storage - Pinata (Required - Free tier available)
PINATA_JWT="your-pinata-jwt-token"
PINATA_GATEWAY_URL="https://gateway.pinata.cloud"

# Client-Side (Optional - defaults to localhost:3000)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin Account (Optional - for seeding)
DEFAULT_ADMIN_EMAIL="admin@example.com"
DEFAULT_ADMIN_PASSWORD="admin123"
```

### 3️⃣ Setup Database

```bash
# Generate authentication types
pnpm auth:generate

# Generate database migrations and TypeScript types
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database with networks, admin user, and test data
pnpm db:seed
```

### 4️⃣ Start Development Server

```bash
# Start with Turbopack (fast HMR)
pnpm dev
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Public marketplace (coming soon) |
| **Admin Dashboard** | http://localhost:3000/admin | ABI management interface |
| **API** | http://localhost:3000/api | RESTful API endpoints |
| **Health Check** | http://localhost:3000/api/health | System status & version |
| **Database Studio** | `pnpm db:studio` | Visual database browser |

## 🔐 Default Admin Credentials

```
Email: admin@example.com
Password: admin123
```

**⚠️ IMPORTANT**: Change these credentials immediately in production!

```bash
# Login at http://localhost:3000/admin
# Go to Settings > Account > Change Password
```

## ✅ Verify Installation

```bash
# Type check
pnpm typecheck

# Run tests
pnpm test

# Health check
curl http://localhost:3000/api/health
```

**Expected Output:**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-24T...",
  "version": "v1",
  "services": {
    "database": "connected",
    "cache": "connected",
    "ipfs": "connected"
  }
}
```

## 🛠️ Available Scripts

### Application

```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server
```

### Code Quality

```bash
pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Run ESLint
pnpm test             # Run all tests
```

### Database

```bash
pnpm db:generate      # Generate migrations from schema changes
pnpm db:migrate       # Apply pending migrations
pnpm db:push          # Push schema directly (dev only)
pnpm db:studio        # Open Drizzle Studio (GUI)
pnpm db:create-admin  # Create admin user from .env
```

### Utilities

```bash
pnpm init-versions    # Initialize API version data
```

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `BETTER_AUTH_SECRET` | Auth secret (32+ chars) | `generated-with-openssl` |
| `BETTER_AUTH_URL` | Auth base URL | `http://localhost:3000` |
| `UPSTASH_REDIS_REST_URL` | Redis endpoint | `https://your-redis.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token | `your-upstash-token` |
| `PINATA_JWT` | Pinata JWT token | `your-pinata-jwt` |
| `PINATA_GATEWAY_URL` | IPFS gateway | `https://gateway.pinata.cloud` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Client-side app URL | `http://localhost:3000` |
| `DEFAULT_ADMIN_EMAIL` | Initial admin email | - |
| `DEFAULT_ADMIN_PASSWORD` | Initial admin password | Auto-generated |
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging verbosity | `debug` |

## 🚀 Production Setup

### Database Setup

```bash
# Production database (PostgreSQL recommended)
createdb zuno_marketplace_prod

# Set up connection
DATABASE_URL="postgresql://user:password@host:5432/zuno_marketplace_prod"
```

### Production Environment

```bash
# Production environment variables
NODE_ENV=production
LOG_LEVEL=info

# Security - Generate new secrets
BETTER_AUTH_SECRET="<strong-random-secret>"
DEFAULT_ADMIN_PASSWORD="<secure-password>"

# Production URLs
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build and Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🐛 Troubleshooting

### Database Connection Issues

::collapse{title="PostgreSQL connection failed"}

```bash
# Test connection
psql postgresql://user:password@localhost:5432/zuno_marketplace

# Common fixes:
# 1. Check PostgreSQL is running
# 2. Verify database exists
# 3. Check credentials
# 4. Ensure proper port (5432)
```
::

### Redis Connection Issues

::collapse{title="Upstash Redis connection failed"}

```bash
# Test Redis connection
curl -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
     https://your-redis.upstash.io/ping

# Common fixes:
# 1. Verify REST URL is correct
# 2. Check token is valid
# 3. Ensure Redis is active in Upstash console
```
::

### Pinata Issues

::collapse{title="IPFS upload failed"}

```bash
# Test Pinata JWT
curl -H "Authorization: Bearer $PINATA_JWT" \
     https://api.pinata.cloud/data/testAuthentication

# Common fixes:
# 1. Verify JWT token is valid
# 2. Check Pinata account status
# 3. Ensure IPFS plan is active
```
::

### Build Errors

::collapse{title="TypeScript compilation failed"}

```bash
# Check TypeScript version
pnpm exec tsc --version

# Fix TypeScript issues
pnpm typecheck
pnpm lint --fix
```
::

## Next Steps

After successful installation:

- **[Quick Start](/abis/getting-started/quick-start)** - Configure and verify setup
- **[API Authentication](/abis/api-reference/authentication)** - Set up API keys and sessions
- **[Admin Dashboard](/)** - Explore the web interface
- **[Production Deployment](/abis/deployment/vercel)** - Deploy to production

## Performance Tips

::alert{type="success"}
**Use connection pooling** for PostgreSQL in production:

```bash
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=20"
```
::

::alert{type="info"}
**Enable Redis persistence** for better cache hit rates:

```bash
# In Upstash console, enable persistence
# This maintains cache across restarts
```
::

::alert{type="warning"}
**Monitor memory usage** - Next.js can use significant memory:

```bash
# Add to package.json scripts
"dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev"
```
::

## See Also

- **[API Reference](/abis/api-reference/abis-endpoints)** - Complete API documentation
- **[Deployment Guide](/abis/deployment/vercel)** - Production deployment
- **[Authentication](/abis/api-reference/authentication)** - API key and session auth
