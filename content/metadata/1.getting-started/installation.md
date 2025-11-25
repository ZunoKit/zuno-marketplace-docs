---
title: "Installation"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "guide"
complexity: "beginner"
category: "installation"
relatedTopics:
  - "configuration"
  - "quick-start"
  - "prerequisites"
---

Get the Metadata service up and running in minutes.

## Prerequisites

Before installing, ensure you have the following installed:

| Requirement | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **PostgreSQL** | 14+ | Primary database |
| **Redis** | 7+ | Caching & job queue |
| **pnpm** | 8+ | Package manager |

### Third-Party Services

The following external services are required for full functionality:

- **[ImageKit](https://imagekit.io/)** - Media CDN and optimization
- **[Pinata](https://pinata.cloud/)** - IPFS pinning service
- **[Upstash](https://upstash.com/)** (optional) - Serverless Redis

## Installation Steps

Follow these steps to install the Metadata service:

```bash
git clone https://github.com/your-org/zuno-marketplace-metadata.git
cd zuno-marketplace-metadata

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
```

## What Gets Installed

The installation process sets up:

- Next.js 16 application framework
- TypeScript compilation toolchain
- PostgreSQL driver and ORM (Drizzle)
- Redis client for caching
- Authentication library (Better Auth)
- UI components (Radix UI + Tailwind CSS)
- Background job processor (BullMQ)

## Next Steps

After installation, proceed with [Environment Configuration](/metadata/getting-started/configuration) to set up your credentials and database.

## See Also

- [Configuration Guide](/metadata/getting-started/configuration)
- [Database Setup](/metadata/getting-started/configuration#database-setup)
- [Development Server](/metadata/getting-started/configuration#start-development-server)
