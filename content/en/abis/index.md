---
title: "Zuno Marketplace ABIs"
package: "abis"
lastUpdated: "2024-11-24"
scope: "guide"
complexity: "intermediate"
category: "overview"
relatedTopics:
  - "installation"
  - "api-reference"
  - "authentication"
---

<div class="flex gap-2 mb-6 flex-wrap">
  <UBadge color="blue" variant="subtle">TypeScript 5.9</UBadge>
  <UBadge color="green" variant="subtle">Next.js 15</UBadge>
  <UBadge color="purple" variant="subtle">React 19</UBadge>
  <UBadge color="gray" variant="subtle">PostgreSQL</UBadge>
  <UBadge color="orange" variant="subtle">Redis</UBadge>
</div>

> **Enterprise-grade ABI marketplace and API service for Ethereum smart contracts**

**Zuno Marketplace ABIs** is a production-ready, scalable platform providing comprehensive API access to verified Ethereum smart contract ABIs across multiple EVM-compatible networks. Built with Next.js 15, featuring enterprise authentication, IPFS storage, intelligent caching, and a powerful admin interface.

### 🎯 Built For

- **Blockchain Developers**: Instant access to verified contract ABIs without manual etherscan scraping
- **DApp Projects**: Reliable ABI versioning and multi-network support for production applications
- **Development Teams**: Self-hosted ABI repository with audit trails and access control
- **API Consumers**: Tiered API access (Public/Free/Pro/Enterprise) with comprehensive rate limiting

## ✨ Features

### 🎨 Core Capabilities

| Feature | Description | Status |
|---------|-------------|--------|
| **RESTful API** | Version-controlled endpoints for ABIs, contracts, and networks | ✅ Production |
| **Multi-Authentication** | Session-based (cookies) + API key authentication with scoped permissions | ✅ Production |
| **Tiered Rate Limiting** | Dual-layer rate limiting: IP-based (DDoS protection) + API key tiers | ✅ Production |
| **IPFS Storage** | Decentralized, immutable ABI storage via Pinata with content addressing | ✅ Production |
| **Redis Caching** | High-performance distributed caching with Upstash (60%+ cache hit rate) | ✅ Production |
| **Admin Dashboard** | Full-featured UI for ABIs, contracts, networks, API keys, and user management | ✅ Production |
| **Audit Logging** | Complete activity tracking with timestamp, user, action, and metadata | ✅ Production |
| **Multi-Network** | Ethereum, Polygon, BSC, Arbitrum, Optimism, Base, Sepolia + custom networks | ✅ Production |
| **ABI Versioning** | Track multiple ABI versions per contract with rollback capability | ✅ Production |
| **Search & Filter** | Advanced filtering by network, address, name, verification status | ✅ Production |

### 🏗️ Technical Architecture

**Frontend**
- ⚡ Next.js 15 with Turbopack
- ⚛️ React 19 with Server Components
- 🎨 TailwindCSS v4 + shadcn/ui
- 📊 TanStack React Query v5
- 🎯 TypeScript 5.9 (strict mode)
- 📱 Responsive design with dark mode

**Backend**
- 🗄️ PostgreSQL 14+ with Drizzle ORM
- ⚡ Upstash Redis for caching
- 🔐 Better Auth for authentication
- 📦 Pinata for IPFS storage
- 🏗️ Clean Architecture (Hexagonal)
- 🧪 Jest + Playwright for testing

### 🚀 Production-Ready Features

- ✅ **Health Monitoring**: `/api/health` endpoint with database, cache, and IPFS checks
- ✅ **Error Tracking**: Structured error handling with request IDs for tracing
- ✅ **Database Migrations**: Versioned schema migrations with Drizzle Kit
- ✅ **Type Generation**: Automatic TypeScript types from database schema
- ✅ **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- ✅ **Input Validation**: Zod schemas for all API inputs with detailed error messages
- ✅ **API Versioning**: Header-based versioning with backward compatibility
- ✅ **Backup/Restore**: Database backup and restore endpoints for disaster recovery
- ✅ **Connection Pooling**: Optimized PostgreSQL connection management
- ✅ **Graceful Shutdown**: Clean resource cleanup on deployment updates

## 📚 Documentation

::card-grid
  ::card{icon="i-heroicons-rocket-launch" title="Getting Started" to="/abis/getting-started/installation"}
  Install and configure the ABIs service
  ::
  ::card{icon="i-heroicons-globe-americas" title="API Reference" to="/abis/api-reference/abis-endpoints"}
  Complete REST API documentation
  ::
  ::card{icon="i-heroicons-shield-check" title="Authentication" to="/abis/api-reference/authentication"}
  API key and session authentication
  ::
  ::card{icon="i-heroicons-server" title="Deployment" to="/abis/deployment/vercel"}
  Production deployment guides
  ::
::

## 🌐 Base URLs

| Environment | Base URL | Notes |
|-------------|----------|-------|
| **Production** | `https://api.zuno-marketplace.com` | Replace with your domain |
| **Development** | `http://localhost:3000` | Local development |

## 🚀 Quick Start

```bash
git clone https://github.com/ZunoKit/zuno-marketplace-abis.git
cd zuno-marketplace-abis

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local

# Setup database
pnpm db:generate && pnpm db:migrate

# Start development server
pnpm dev
```

## 🎯 Use Cases

### Smart Contract Integration

```typescript
// Fetch ABI dynamically
const response = await fetch('/api/contracts/0x1234.../abi');
const abi = await response.json();

// Use with ethers.js
const contract = new ethers.Contract(address, abi, provider);
```

### Multi-Network Support

```bash
# Get ABIs for multiple networks
curl "https://api.zuno-marketplace.com/api/contracts/0x1234.../abi?network=ethereum"
curl "https://api.zuno-marketplace.com/api/contracts/0x1234.../abi?network=polygon"
```

### API Key Authentication

```bash
# API key-based access
curl -H "x-api-key: YOUR_API_KEY" \
     -H "x-api-version: v1" \
     "https://api.zuno-marketplace.com/api/contracts/0x1234..."
```

## See Also

- **[SDK](/sdk/core-modules/exchange)** - Use ABIs with the SDK
- **[Indexer](/indexer/domain-architecture/event-first)** - Event indexing with these ABIs
- **[Metadata Service](/metadata/api-reference/metadata-endpoints)** - NFT metadata management
