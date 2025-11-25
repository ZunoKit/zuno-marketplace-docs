---
title: "Authentication"
package: "abis"
lastUpdated: "2025-11-25"
scope: "api-reference"
complexity: "intermediate"
category: "authentication"
relatedTopics:
  - "abis-endpoints"
  - "rate-limiting"
  - "security"
---

# Authentication

Authenticate API requests using one of two methods: API Keys or Session Cookies.

## Authentication Methods

### 1. API Key Authentication (Recommended)

API keys are recommended for programmatic access and server-to-server communication.

#### Header-Based (Recommended)

Send the API key in the `X-API-Key` header:

```bash
curl -H "X-API-Key: sk_live_YOUR_API_KEY_HERE" \
     https://api.zuno-marketplace.com/api/abis
```

#### Query Parameter

API keys can also be passed as query parameters (less secure for production):

```bash
curl "https://api.zuno-marketplace.com/api/abis?api_key=sk_live_YOUR_API_KEY_HERE"
```

::alert{type="warning"}
**Security Warning**: Query parameter API keys are visible in logs and browser history. Use header-based authentication in production.
::

#### Generate API Key

1. Login to Admin Dashboard: `/admin`
2. Navigate to **API Keys** section
3. Click **Create New Key**
4. Select tier (Free/Pro/Enterprise) and permissions
5. Copy key immediately (only shown once)

#### API Key Format

- **Prefix**: `sk_live_` (production) or `sk_test_` (testing)
- **Length**: 40+ characters
- **Example**: `sk_live_YOUR_API_KEY_HERE` (replace with your actual key)

#### API Key Tiers

| Tier           | Monthly Requests | Burst Limit | Price  | Permissions                         |
| -------------- | ---------------- | ----------- | ------ | ----------------------------------- |
| **Free**       | 5,000            | 30/min      | Free   | Read-only ABIs, Contracts, Networks |
| **Pro**        | 50,000           | 100/min     | $29/mo | All read + Create/Update ABIs       |
| **Enterprise** | Unlimited        | Unlimited   | Custom | Full access + Custom features       |

### 2. Session Authentication

Session authentication is used for web UI interactions via session cookies.

#### Login to Create Session

```bash
curl -X POST https://api.zuno-marketplace.com/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=..." \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'
```

#### Response

```json
{
  "success": true,
  "data": {
    "session": {
      "token": "...",
      "expires": "2025-01-26T10:00:00Z"
    },
    "user": {
      "id": "user_v1_123...",
      "email": "user@example.com",
      "name": "User Name",
      "role": "admin"
    }
  }
}
```

#### Use Session Cookie

Include the session cookie in subsequent requests:

```bash
curl -H "Cookie: better-auth.session_token=..." \
     https://api.zuno-marketplace.com/api/abis
```

#### Logout

```bash
curl -X POST https://api.zuno-marketplace.com/api/auth/sign-out \
  -H "Cookie: better-auth.session_token=..."
```

## API Versioning

Specify API version via header (defaults to `v1`):

### Version Header

Explicitly request a specific API version:

```bash
curl -H "X-API-Version: v1" \
     -H "X-API-Key: sk_live_YOUR_API_KEY_HERE" \
     https://api.zuno-marketplace.com/api/abis
```

### Accept-Version Header

Alternative header for API versioning:

```bash
curl -H "Accept-Version: v1" \
     -H "X-API-Key: sk_live_YOUR_API_KEY_HERE" \
     https://api.zuno-marketplace.com/api/abis
```

### Version Behavior

| Scenario           | Behavior                                |
| ------------------ | --------------------------------------- |
| Missing header     | Defaults to `v1`                        |
| Invalid version    | Returns `400 Bad Request`               |
| Deprecated version | Returns `410 Gone` with migration guide |

### Migration Guide

When a version becomes deprecated:

```json
{
  "success": false,
  "error": {
    "code": "VERSION_DEPRECATED",
    "message": "API version v0 is deprecated",
    "statusCode": 410,
    "details": {
      "currentVersion": "v0",
      "recommendedVersion": "v1",
      "migrationUrl": "/docs/migration-guide-v0-to-v1"
    }
  }
}
```

## Environment-Specific Base URLs

| Environment     | Base URL                                   | Purpose                |
| --------------- | ------------------------------------------ | ---------------------- |
| **Production**  | `https://api.zuno-marketplace.com`         | Live applications      |
| **Staging**     | `https://staging-api.zuno-marketplace.com` | Pre-production testing |
| **Development** | `http://localhost:3000`                    | Local development      |

## Authentication Examples

### Example 1: List ABIs with API Key

```bash
curl -H "X-API-Key: sk_live_YOUR_API_KEY_HERE" \
     "https://api.zuno-marketplace.com/api/abis?network=ethereum"
```

### Example 2: Create ABI with Session

```bash
curl -X POST https://api.zuno-marketplace.com/api/abis \
  -H "Cookie: better-auth.session_token=..." \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x1234...",
    "network": "ethereum",
    "abi": [...]
  }'
```

### Example 3: JavaScript/TypeScript

```typescript
// Using API Key
const response = await fetch("https://api.zuno-marketplace.com/api/abis", {
  headers: {
    "X-API-Key": "sk_live_YOUR_API_KEY_HERE",
  },
});

// Using Session
const response = await fetch("https://api.zuno-marketplace.com/api/abis", {
  credentials: "include",
});

const data = await response.json();
```

## Security Best Practices

### API Key Security

1. **Never commit API keys** to version control
2. **Use environment variables** for all credentials
3. **Rotate keys regularly** (quarterly recommended)
4. **Create separate keys** for different environments
5. **Use header-based authentication** in production
6. **Monitor key usage** in admin dashboard
7. **Disable unused keys** immediately
8. **Use the lowest required tier** for each use case

### Session Security

1. **Use HTTPS only** in production
2. **Set short session timeouts** (30 minutes recommended)
3. **Implement logout** on sensitive operations
4. **Clear session cookies** on logout
5. **Use secure cookie flags** (HttpOnly, Secure, SameSite)
6. **Regenerate session IDs** after login
7. **Monitor concurrent sessions** per user

## Error Responses

### Unauthorized (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key",
    "statusCode": 401
  }
}
```

### Forbidden (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions for this operation",
    "statusCode": 403,
    "details": {
      "requiredPermission": "abis:write",
      "currentPermissions": ["abis:read"]
    }
  }
}
```

### Rate Limited (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Upgrade to Pro for higher limits.",
    "statusCode": 429,
    "details": {
      "limit": 500,
      "remaining": 0,
      "resetAt": "2025-01-19T15:30:00Z",
      "tier": "free"
    }
  }
}
```

## Rate Limiting

API requests are rate limited based on your tier and authentication method:

| Tier           | Requests/Hour | Requests/Day | Burst Limit |
| -------------- | ------------- | ------------ | ----------- |
| **Public**     | 100           | 1,000        | 10/min      |
| **Free**       | 500           | 5,000        | 30/min      |
| **Pro**        | 5,000         | 50,000       | 100/min     |
| **Enterprise** | Unlimited     | Unlimited    | Unlimited   |

### Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 487
X-RateLimit-Reset: 1642589432
X-RateLimit-Tier: free
```

See [Rate Limiting Documentation](/en/abis/api-reference/rate-limiting) for complete details.

## Next Steps

- [API Endpoints](/en/abis/api-reference/abis-endpoints) - Core API endpoints
- [Response Format](/en/abis/api-reference/response-format) - API response structure
- [Security Best Practices](/en/abis/security/best-practices) - Security guidelines
