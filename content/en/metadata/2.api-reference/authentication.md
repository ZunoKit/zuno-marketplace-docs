---
title: "Authentication"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "api-reference"
complexity: "intermediate"
category: "api"
relatedTopics:
  - "api-endpoints"
  - "api-keys"
  - "authorization"
---

# Authentication

All API endpoints require authentication via API keys or session tokens.

## API Key Authentication

All API endpoints require authentication via **API key** (except health checks):

### Using Authorization Header

```bash
curl -X GET https://your-domain.com/api/metadata \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "x-api-version: v1" \
  -H "Content-Type: application/json"
```

### Using X-API-Key Header

```bash
curl -X GET https://your-domain.com/api/metadata \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-api-version: v1"
```

## API Versioning

Include the API version in all requests using either header:

```bash
# Option 1: x-api-version header
-H "x-api-version: v1"

# Option 2: accept-version header
-H "accept-version: v1"
```

## Authentication Methods

### 1. API Key Authentication

API keys are used for external integrations and programmatic access.

**Features:**
- Scoped permissions (`metadata:read`, `metadata:write`, `media:read`, `media:write`)
- Granular access control
- Rate limiting per key
- Activity logging

**Creating API Keys:**
- Available via admin dashboard
- Set specific scopes for security
- Rotate keys regularly

### 2. Session Authentication

Sessions are used for admin dashboard access via Better Auth.

**Features:**
- Browser-based authentication
- Secure cookie storage
- User identity tracking
- Admin-only endpoint protection

## Permission Scopes

API keys support granular permission scopes:

| Scope | Permission | Use Case |
|-------|-----------|----------|
| `metadata:read` | Read metadata | Fetching NFT metadata |
| `metadata:write` | Create/update metadata | Creating/updating NFTs |
| `media:read` | Read media | Accessing uploaded files |
| `media:write` | Upload media | Uploading new media files |

### Scope Examples

```bash
# Read-only key
scope: "metadata:read media:read"

# Write-only key
scope: "metadata:write media:write"

# Full access
scope: "metadata:read metadata:write media:read media:write"
```

## Public Endpoints

The following endpoints do **not** require authentication:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health check |

## Rate Limiting

API rate limiting is enforced per API key:

- Default: 1000 requests per hour
- Headers indicate current status:
  - `X-RateLimit-Limit` - Maximum requests allowed
  - `X-RateLimit-Remaining` - Requests remaining
  - `X-RateLimit-Reset` - Reset timestamp

## Authentication Errors

### Invalid API Key

```json
{
  "success": false,
  "error": "Invalid or missing API key",
  "code": "UNAUTHORIZED"
}
```

### Missing Version Header

```json
{
  "success": false,
  "error": "API version header required (x-api-version or accept-version)",
  "code": "BAD_REQUEST"
}
```

### Insufficient Permissions

```json
{
  "success": false,
  "error": "Insufficient permissions for this operation",
  "code": "FORBIDDEN"
}
```

## Best Practices

1. **Never expose API keys** in client-side code
2. **Use environment variables** to store keys
3. **Rotate keys regularly** via admin dashboard
4. **Use minimal scopes** for each API key
5. **Monitor usage** via audit logs
6. **Enable HTTPS** in production

## Managing API Keys

### Via Admin Dashboard

1. Navigate to **Settings → API Keys**
2. Click **Create New Key**
3. Set name and required scopes
4. Copy key immediately (not shown again)

### Via API

Coming soon - programmatic API key management endpoints.

## See Also

- [API Endpoints](/en/metadata/api-reference/metadata-endpoints)
- [Security Best Practices](/en/metadata/security/best-practices)
- [Admin Dashboard](/en/metadata)
