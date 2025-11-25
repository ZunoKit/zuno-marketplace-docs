---
title: "Verification"
package: "abis"
lastUpdated: "2025-11-25"
scope: "guide"
complexity: "beginner"
category: "verification"
relatedTopics:
  - "installation"
  - "quick-start"
---

# Verify Installation

Confirm your Zuno Marketplace ABIs installation is working correctly.

## Type Checking

Verify TypeScript compilation without errors:

```bash
pnpm typecheck
```

**Expected Output**:
```
Successfully compiled TypeScript files.
```

If you see TypeScript errors, run:

```bash
pnpm install --force
pnpm db:generate
pnpm auth:generate
pnpm typecheck
```

## Run Tests

Execute the test suite to verify all components:

```bash
pnpm test
```

**Expected Output**:
```
PASS  tests/unit/abi.service.test.ts
PASS  tests/unit/auth.test.ts
PASS  tests/integration/api.test.ts

Test Suites: 3 passed, 3 total
Tests:       24 passed, 24 total
```

### Watch Mode Testing

For continuous testing during development:

```bash
pnpm test:watch
```

### Test Coverage

Generate coverage report:

```bash
pnpm test:coverage
```

Coverage goals:
- **Unit Tests**: >80% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows

## Health Check

Verify all system services are running:

```bash
curl http://localhost:3000/api/health
```

**Expected Response**:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T10:00:00Z",
  "version": "v1",
  "services": {
    "database": "connected",
    "cache": "connected",
    "ipfs": "connected"
  },
  "uptime": 3600
}
```

### Verify Each Service

If health check fails, verify individual services:

::collapse{label="Database Connection"}

```bash
# Check database connection
psql "$DATABASE_URL"

# Expected: PostgreSQL prompt appears
# If failed: Check DATABASE_URL is correct and PostgreSQL is running
```

::

::collapse{label="Redis Cache"}

```bash
# Test Redis connection
redis-cli -u $UPSTASH_REDIS_REST_URL ping

# Expected: PONG
# If failed: Check UPSTASH credentials and network connectivity
```

::

::collapse{label="IPFS/Pinata"}

```bash
# Test Pinata connectivity via API
curl -H "Authorization: Bearer $PINATA_JWT" \
     https://api.pinata.cloud/data/pinList

# Expected: JSON response with file list
# If failed: Check PINATA_JWT is valid
```

::

## Admin Dashboard Access

Verify admin dashboard is accessible:

1. Open http://localhost:3000/admin
2. Login with default credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Confirm you see the dashboard with:
   - **ABIs** section
   - **Contracts** section
   - **Networks** section
   - **API Keys** section

## Database Integrity

Check data integrity and connectivity:

```bash
pnpm db:check
```

This command validates:
- All tables are present
- Required indexes exist
- Foreign key constraints are valid
- Seed data is properly loaded

## API Endpoints Verification

Test critical API endpoints:

### 1. Networks Endpoint

```bash
curl "http://localhost:3000/api/networks"
```

Expected: Returns list of supported networks with chainId, rpcUrl, etc.

### 2. ABIs Listing

```bash
curl -H "X-API-Key: your-api-key" \
     "http://localhost:3000/api/abis?network=ethereum"
```

Expected: Returns paginated list of ABIs.

### 3. Contracts Endpoint

```bash
curl -H "X-API-Key: your-api-key" \
     "http://localhost:3000/api/contracts?network=ethereum"
```

Expected: Returns list of contracts.

## Linting & Code Quality

Verify code quality standards:

```bash
# ESLint check
pnpm lint

# Format check
pnpm format --check

# Run all checks
pnpm lint && pnpm typecheck && pnpm test
```

**Expected Output**:
```
✓ No eslint errors found
✓ All files properly formatted
✓ All tests passing
```

## Database Studio

Inspect your database visually:

```bash
pnpm db:studio
```

Opens Drizzle Studio in your browser. Verify:
- **users** table has admin user
- **networks** table has 8+ networks
- **abis** table is accessible
- **contracts** table is accessible

## Build Verification

Test production build:

```bash
pnpm build
```

**Expected Output**:
```
✓ Collected 150 routes from filesystem
✓ Created 32 module chunks
✓ Optimized 128 images
✓ Compiled successfully
```

If build fails:
```bash
# Clear cache and rebuild
pnpm clean
pnpm install
pnpm build
```

## Common Issues & Solutions

### Port 3000 Already in Use

```bash
# Find and kill process using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Migration Failed

```bash
# Check migration status
pnpm db:status

# If stuck, manually resolve and reset:
pnpm db:migrate:reset  # WARNING: Deletes all data
pnpm db:seed
```

### Cache/Redis Connection Error

```bash
# Verify Upstash credentials
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN

# Test connectivity
redis-cli -u $UPSTASH_REDIS_REST_URL ping
```

### IPFS Upload Failed

```bash
# Verify Pinata JWT is valid
curl -H "Authorization: Bearer $PINATA_JWT" \
     https://api.pinata.cloud/data/pinList

# If 401: Regenerate token at app.pinata.cloud
```

## Verification Checklist

Confirm all items before proceeding:

- [ ] TypeScript compiles without errors
- [ ] Unit tests pass (>80% coverage)
- [ ] Health check returns healthy status
- [ ] Admin dashboard accessible and working
- [ ] Database connected and populated
- [ ] Redis cache connected
- [ ] IPFS/Pinata accessible
- [ ] All API endpoints responding
- [ ] Database integrity verified
- [ ] Code linting passes
- [ ] Production build succeeds

## Next Steps

Once verification is complete:

1. **Start Development** - Begin implementing features
2. **Read API Documentation** - [API Reference](/en/abis/api-reference/authentication)
3. **Configure Settings** - Customize application behavior
4. **Plan Deployment** - [Deployment Guide](/en/abis/deployment/vercel)

## Support

If verification fails:

1. Check all environment variables are set correctly
2. Verify external services (PostgreSQL, Redis, Pinata) are accessible
3. Review the [Installation Guide](/en/abis/getting-started/installation)
4. Check project issues and discussions on GitHub
5. File a new issue with verification output
