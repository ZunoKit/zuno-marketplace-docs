---
title: "Configuration"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "guide"
complexity: "intermediate"
category: "configuration"
relatedTopics:
  - "installation"
  - "environment-variables"
  - "database-setup"
---

Configure the Metadata service for your environment.

## Environment Configuration

Edit `.env.local` with your credentials after installation:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Redis Cache (Upstash or self-hosted)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Media Processing (ImageKit)
IMAGEKIT_PUBLIC_KEY=public_key
IMAGEKIT_PRIVATE_KEY=private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# IPFS Storage (Pinata)
PINATA_JWT=your-jwt-token
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs

# Authentication
BETTER_AUTH_SECRET=your-secret-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Application
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=debug
CRON_SECRET=your-cron-secret

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=  # Leave empty for auto-generation
```

## Environment Variables

### Database Configuration

- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL (optional alternative)
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### Caching

- `UPSTASH_REDIS_REST_URL` - Redis instance URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis authentication token

### Media Processing

- `IMAGEKIT_PUBLIC_KEY` - ImageKit public API key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private API key
- `IMAGEKIT_URL_ENDPOINT` - ImageKit CDN endpoint URL

### IPFS Storage

- `PINATA_JWT` - Pinata JWT authentication token
- `PINATA_GATEWAY_URL` - Pinata IPFS gateway base URL

### Authentication

- `BETTER_AUTH_SECRET` - Secret key (minimum 32 characters) for Better Auth
- `BETTER_AUTH_URL` - Application base URL for auth redirects

### Application Settings

- `NODE_ENV` - `development` or `production`
- `CORS_ORIGINS` - Comma-separated allowed origins
- `LOG_LEVEL` - `debug`, `info`, `warn`, or `error`
- `CRON_SECRET` - Secret for cron job endpoints

### Admin Setup

- `ADMIN_EMAIL` - Initial admin user email
- `ADMIN_PASSWORD` - Initial admin password (leave empty for auto-generation)

## Database Setup

After configuring environment variables, set up the database:

```bash
# Run database migrations
pnpm db:migrate

# Create initial admin user
pnpm db:create-admin

# (Optional) Open Drizzle Studio to inspect database
pnpm db:studio
```

### Available Database Commands

```bash
pnpm db:generate      # Generate migrations from schema changes
pnpm db:migrate       # Apply pending migrations
pnpm db:push          # Push schema directly (dev only)
pnpm db:studio        # Open Drizzle Studio (GUI)
pnpm db:create-admin  # Create admin user from .env
```

## Start Development Server

Once configured, start the development server:

```bash
# Terminal 1: Start Next.js app
pnpm dev

# Terminal 2: Start background workers
pnpm workers
```

Visit **http://localhost:3000** to access the application.

Admin dashboard: **http://localhost:3000/admin**

## Verifying Your Setup

Test your configuration with the health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response indicates all services are healthy.

## See Also

- [Installation Guide](/en/metadata/getting-started/installation)
- [API Authentication](/en/metadata/api-reference/authentication)
- [Production Checklist](/en/metadata/deployment/production-checklist)
