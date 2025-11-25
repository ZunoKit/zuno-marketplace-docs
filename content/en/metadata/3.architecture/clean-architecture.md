---
title: "Clean Architecture"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "architecture"
complexity: "advanced"
category: "architecture"
relatedTopics:
  - "project-structure"
  - "design-patterns"
  - "code-organization"
---

# Clean Architecture

The Metadata service is built using Clean Architecture principles for testability, maintainability, and scalability.

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes with Clean Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: ImageKit for media processing, Pinata for IPFS
- **Cache**: Redis with Upstash
- **Queue**: BullMQ for background jobs
- **Auth**: Better Auth for authentication
- **UI**: Radix UI with Tailwind CSS

## Core Principles

### 1. Separation of Concerns

Each layer has distinct responsibilities:

- **Domain Layer** - Business entities and rules
- **Application Layer** - Use cases and orchestration
- **Infrastructure Layer** - External integrations
- **Presentation Layer** - API endpoints and UI

### 2. Dependency Inversion

Dependencies flow inward toward the domain layer, never outward.

```
Presentation Layer
    ↓
Application Layer (Use Cases)
    ↓
Domain Layer (Entities, Repositories)
    ↓
Infrastructure Layer (Implementations)
```

### 3. Testability

Clean separation enables comprehensive testing at each layer:

- **Unit Tests** - Domain and application logic
- **Integration Tests** - Infrastructure adapters
- **E2E Tests** - Full request flows

### 4. Maintainability

Clear boundaries make code changes and refactoring safer:

- Changes to external services don't affect business logic
- Easy to locate related code
- Self-documenting structure

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin dashboard pages
│   │   ├── layout.tsx     # Admin layout
│   │   ├── page.tsx       # Dashboard home
│   │   ├── metadata/      # Metadata management pages
│   │   ├── media/         # Media management pages
│   │   ├── api-keys/      # API key management
│   │   └── settings/      # Admin settings
│   └── api/               # API endpoints
│       ├── health.ts      # Health check
│       ├── metadata/      # Metadata endpoints
│       │   ├── route.ts   # GET/POST
│       │   └── [id]/      # GET/PUT/DELETE
│       ├── media/         # Media endpoints
│       │   ├── route.ts   # GET/POST
│       │   └── [id]/      # GET/DELETE
│       └── cron/          # Cron job endpoints
│
├── core/                  # Business logic (Clean Architecture)
│   ├── domain/            # Domain layer - Entities
│   │   ├── entities/
│   │   │   ├── metadata.ts
│   │   │   ├── media.ts
│   │   │   └── api-key.ts
│   │   ├── repositories/  # Repository interfaces
│   │   │   ├── metadata.repository.ts
│   │   │   ├── media.repository.ts
│   │   │   └── api-key.repository.ts
│   │   └── errors/        # Domain errors
│   │       └── domain.errors.ts
│   │
│   ├── services/          # Application layer - Use Cases
│   │   ├── metadata.service.ts
│   │   ├── media.service.ts
│   │   ├── api-key.service.ts
│   │   ├── auth.service.ts
│   │   └── storage.service.ts
│   │
│   └── use-cases/        # Application orchestration
│       ├── create-metadata.use-case.ts
│       ├── upload-media.use-case.ts
│       ├── batch-create.use-case.ts
│       └── delete-metadata.use-case.ts
│
├── infrastructure/        # Infrastructure layer - Adapters
│   ├── auth/             # Authentication adapters
│   │   ├── better-auth.ts
│   │   └── api-key.auth.ts
│   │
│   ├── database/         # Database layer
│   │   ├── drizzle/
│   │   │   ├── schema/
│   │   │   │   ├── metadata.schema.ts
│   │   │   │   ├── media.schema.ts
│   │   │   │   └── api-keys.schema.ts
│   │   │   └── migrations/
│   │   └── connection.ts
│   │
│   ├── cache/            # Caching adapters
│   │   ├── redis.cache.ts
│   │   └── cache.ts
│   │
│   ├── queue/            # Job queue
│   │   └── bullmq.queue.ts
│   │
│   ├── services/         # External service integrations
│   │   ├── imagekit.service.ts
│   │   ├── pinata.service.ts
│   │   └── logger.ts
│   │
│   └── repositories/     # Repository implementations
│       ├── metadata.repository.ts
│       ├── media.repository.ts
│       └── api-key.repository.ts
│
└── shared/               # Shared utilities
    ├── types/            # Shared TypeScript types
    ├── constants/        # Application constants
    ├── utils/            # Utility functions
    └── validators/       # Zod validation schemas
```

## Layer Responsibilities

### Domain Layer

Defines core business concepts and rules:

```typescript
// Entity definition
export class Metadata {
  constructor(
    public id: string,
    public name: string,
    public description?: string,
    public ipfsHash?: string
  ) {}

  validate(): boolean {
    return this.name?.length > 0;
  }
}

// Repository interface (contracts)
export interface MetadataRepository {
  create(metadata: Metadata): Promise<Metadata>;
  findById(id: string): Promise<Metadata | null>;
  update(id: string, metadata: Partial<Metadata>): Promise<Metadata>;
  delete(id: string): Promise<void>;
  list(page: number, limit: number): Promise<Metadata[]>;
}
```

### Application Layer

Implements use cases and orchestrates domain logic:

```typescript
export class CreateMetadataUseCase {
  constructor(
    private metadataRepository: MetadataRepository,
    private ipfsService: IPFSService,
    private cacheService: CacheService
  ) {}

  async execute(input: CreateMetadataInput): Promise<Metadata> {
    // Validate input
    const metadata = new Metadata(
      generateId(),
      input.name,
      input.description
    );

    // Save to database
    const created = await this.metadataRepository.create(metadata);

    // Pin to IPFS
    const ipfsHash = await this.ipfsService.pin(created);

    // Cache result
    await this.cacheService.set(`metadata:${created.id}`, created);

    return { ...created, ipfsHash };
  }
}
```

### Infrastructure Layer

Adapts external services to domain contracts:

```typescript
export class DrizzleMetadataRepository implements MetadataRepository {
  constructor(private db: Database) {}

  async create(metadata: Metadata): Promise<Metadata> {
    const [result] = await this.db
      .insert(metadataTable)
      .values({
        id: metadata.id,
        name: metadata.name,
        description: metadata.description
      })
      .returning();

    return result;
  }

  async findById(id: string): Promise<Metadata | null> {
    const result = await this.db
      .select()
      .from(metadataTable)
      .where(eq(metadataTable.id, id));

    return result[0] || null;
  }
}
```

### Presentation Layer

Handles HTTP requests and responses:

```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = CreateMetadataSchema.parse(body);

    // Dependency injection
    const repository = getMetadataRepository();
    const ipfsService = getIPFSService();
    const cacheService = getCacheService();

    const useCase = new CreateMetadataUseCase(
      repository,
      ipfsService,
      cacheService
    );

    const metadata = await useCase.execute(input);

    return Response.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
```

## Data Flow

### Request Processing Flow

```
1. HTTP Request arrives at API endpoint
   ↓
2. Parse & validate input using Zod schemas
   ↓
3. Instantiate use case with dependencies
   ↓
4. Execute use case (business logic)
   ↓
5. Repository fetches/persists data
   ↓
6. External services (IPFS, ImageKit) process media
   ↓
7. Cache updated with results
   ↓
8. Response returned to client
```

## Benefits

### For Development

- **Clear Structure** - Easy to find code
- **Type Safety** - TypeScript prevents errors
- **Loose Coupling** - Services are independent
- **Easy Testing** - Mock repositories for tests

### For Maintenance

- **Low Risk** - Changes isolated to layers
- **Refactoring Safe** - Interfaces protect contracts
- **Debugging Easy** - Clear data flow
- **Documentation** - Code structure documents design

### For Scaling

- **Add Features** - New use cases without affecting others
- **Replace Services** - Swap implementations (Redis → Memcache)
- **Database Agnostic** - Change ORM without domain changes
- **Distributed** - Services can be extracted to microservices

## See Also

- [Project Structure](/en/metadata/architecture/project-structure)
- [Code Standards](/en/metadata/development/code-standards)
- [Design Patterns](/en/metadata)
