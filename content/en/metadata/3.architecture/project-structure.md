---
title: "Project Structure"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "architecture"
complexity: "intermediate"
category: "architecture"
relatedTopics:
  - "clean-architecture"
  - "file-organization"
  - "code-organization"
---

# Project Structure

Understanding the Metadata service's directory organization.

## Directory Tree

```
zuno-marketplace-metadata/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── admin/             # Admin dashboard pages
│   │   └── api/               # API endpoints
│   ├── components/            # React components
│   ├── core/                  # Business logic (Clean Architecture)
│   │   ├── domain/            # Domain entities and repositories
│   │   ├── services/          # Business services
│   │   └── use-cases/         # Application use cases
│   ├── infrastructure/        # External services and adapters
│   │   ├── auth/              # Authentication
│   │   ├── database/          # Database configuration
│   │   ├── services/          # External service integrations
│   │   └── repositories/      # Repository implementations
│   └── shared/                # Shared utilities and types
├── public/                    # Static assets
├── .env.example              # Example environment variables
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
├── drizzle.config.ts         # Drizzle ORM configuration
└── README.md                 # Project documentation
```

## Key Directories

### `src/app`

Next.js App Router directory containing pages and API routes.

#### Admin Dashboard

```
src/app/admin/
├── layout.tsx                # Admin layout wrapper
├── page.tsx                  # Dashboard home
├── metadata/
│   ├── page.tsx             # Metadata listing
│   └── [id]/                # Metadata detail page
├── media/
│   ├── page.tsx             # Media gallery
│   └── [id]/                # Media detail page
├── api-keys/
│   ├── page.tsx             # API keys management
│   └── [id]/                # API key detail
└── settings/
    └── page.tsx             # Admin settings
```

#### API Endpoints

```
src/app/api/
├── health.ts                # Health check endpoint
├── metadata/
│   ├── route.ts            # GET /api/metadata, POST /api/metadata
│   ├── batch/
│   │   └── route.ts        # POST /api/metadata/batch
│   └── [id]/
│       └── route.ts        # GET/PUT/DELETE /api/metadata/[id]
├── media/
│   ├── route.ts            # GET /api/media, POST /api/media
│   ├── batch/
│   │   └── route.ts        # POST /api/media/batch
│   └── [id]/
│       └── route.ts        # GET/DELETE /api/media/[id]
└── cron/
    ├── pin-metadata.ts     # IPFS pinning cron job
    └── cleanup.ts          # Cleanup jobs
```

### `src/core`

Business logic following Clean Architecture pattern.

#### Domain Layer

```
src/core/domain/
├── entities/
│   ├── metadata.ts         # Metadata entity
│   ├── media.ts            # Media entity
│   └── api-key.ts          # API key entity
├── repositories/
│   ├── metadata.repository.ts
│   ├── media.repository.ts
│   └── api-key.repository.ts
└── errors/
    └── domain.errors.ts    # Custom domain errors
```

**Responsibility:** Defines business entities and repository contracts.

#### Services Layer

```
src/core/services/
├── metadata.service.ts     # Metadata business logic
├── media.service.ts        # Media business logic
├── api-key.service.ts      # API key business logic
├── auth.service.ts         # Authentication logic
├── storage.service.ts      # IPFS & CDN logic
└── cache.service.ts        # Caching logic
```

**Responsibility:** Implements core business logic and operations.

#### Use Cases Layer

```
src/core/use-cases/
├── create-metadata.use-case.ts
├── update-metadata.use-case.ts
├── delete-metadata.use-case.ts
├── list-metadata.use-case.ts
├── upload-media.use-case.ts
├── batch-create.use-case.ts
└── batch-upload.use-case.ts
```

**Responsibility:** Orchestrates services for specific user actions.

### `src/infrastructure`

External service adapters and integrations.

#### Authentication

```
src/infrastructure/auth/
├── better-auth.ts         # Better Auth configuration
├── api-key.auth.ts        # API key authentication
└── guards.ts              # Auth middleware
```

#### Database

```
src/infrastructure/database/
├── drizzle/
│   ├── schema/
│   │   ├── metadata.schema.ts
│   │   ├── media.schema.ts
│   │   ├── api-keys.schema.ts
│   │   ├── audit-logs.schema.ts
│   │   └── users.schema.ts
│   ├── migrations/         # Database migrations
│   └── client.ts           # Drizzle client setup
└── connection.ts           # Database connection
```

#### Caching

```
src/infrastructure/cache/
├── redis.cache.ts         # Redis implementation
└── cache.interface.ts      # Cache contract
```

#### Queue System

```
src/infrastructure/queue/
├── bullmq.queue.ts        # BullMQ setup
├── workers/
│   ├── ipfs-pin.worker.ts
│   └── cleanup.worker.ts
└── queue.interface.ts      # Queue contract
```

#### External Services

```
src/infrastructure/services/
├── imagekit.service.ts    # ImageKit integration
├── pinata.service.ts      # Pinata IPFS integration
├── logger.ts              # Structured logging
└── health.service.ts      # Health monitoring
```

#### Repository Implementations

```
src/infrastructure/repositories/
├── metadata.repository.ts
├── media.repository.ts
└── api-key.repository.ts
```

**Responsibility:** Implements repository interfaces using Drizzle ORM.

### `src/shared`

Shared utilities, types, and constants.

```
src/shared/
├── types/
│   ├── api.types.ts        # API request/response types
│   ├── domain.types.ts     # Domain model types
│   └── index.ts            # Type exports
├── constants/
│   ├── api.constants.ts    # API constants
│   ├── errors.constants.ts # Error messages
│   └── permissions.ts      # Permission scopes
├── utils/
│   ├── validators.ts       # Zod validation schemas
│   ├── helpers.ts          # Utility functions
│   ├── formatters.ts       # Data formatters
│   └── crypto.ts           # Encryption utilities
└── errors/
    ├── api.error.ts        # API error handler
    └── error.codes.ts      # Error code definitions
```

### `src/components`

Reusable React components for admin dashboard.

```
src/components/
├── common/
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── layout.tsx
├── metadata/
│   ├── metadata-list.tsx
│   ├── metadata-form.tsx
│   └── metadata-detail.tsx
├── media/
│   ├── media-upload.tsx
│   ├── media-gallery.tsx
│   └── media-preview.tsx
└── ui/
    ├── buttons.tsx
    ├── modals.tsx
    └── forms.tsx
```

## Configuration Files

### `tsconfig.json`

TypeScript configuration with path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/core/*": ["src/core/*"],
      "@/infrastructure/*": ["src/infrastructure/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

### `drizzle.config.ts`

Database migration configuration:

```typescript
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/database/drizzle/schema",
  out: "./src/infrastructure/database/drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### `next.config.js`

Next.js application configuration.

### `.env.example`

Template for environment variables.

## File Naming Conventions

- **Components**: PascalCase with `.tsx` extension (e.g., `MetadataList.tsx`)
- **Functions**: camelCase with `.ts` extension (e.g., `validateMetadata.ts`)
- **Types**: PascalCase with `.types.ts` suffix (e.g., `api.types.ts`)
- **Classes**: PascalCase (e.g., `MetadataService`)
- **Interfaces**: PascalCase with I prefix (e.g., `IMetadataRepository`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_TIMEOUT`)

## Module Aliases

Import paths use aliases for cleaner code:

```typescript
// Instead of relative imports
import { MetadataService } from '../../../core/services/metadata.service';

// Use aliases
import { MetadataService } from '@/core/services/metadata.service';
import { validateMetadata } from '@/shared/utils/validators';
```

## See Also

- [Clean Architecture](/en/metadata/architecture/clean-architecture)
- [Code Standards](/en/metadata/development/code-standards)
- [Development Workflow](/en/metadata/development/workflow)
