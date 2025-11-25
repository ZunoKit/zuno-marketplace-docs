---
title: "Metadata Endpoints"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "api-reference"
complexity: "intermediate"
category: "api"
relatedTopics:
  - "authentication"
  - "media-endpoints"
  - "opensea-format"
---

RESTful API for creating and managing NFT metadata.

## Metadata Management

Core endpoints for CRUD operations on NFT metadata.

### List Metadata

List all metadata with pagination and search.

```bash
GET /api/metadata?page=1&limit=20&search=Awesome
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `search` (string) - Search term for metadata name/description

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### Create Metadata

Create a new NFT metadata entry.

```bash
POST /api/metadata
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
Content-Type: application/json

{
  "name": "Awesome NFT #1",
  "description": "A unique digital collectible",
  "image": "https://your-cdn.com/image.png",
  "animation_url": "https://your-cdn.com/animation.mp4",
  "external_url": "https://your-website.com",
  "attributes": [
    { "trait_type": "Rarity", "value": "Legendary" },
    { "trait_type": "Power", "value": 95 }
  ],
  "creators": [
    { "address": "0x1234...", "share": 100 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "ipfsHash": "QmXxxx...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Batch Create Metadata

Create multiple metadata entries efficiently.

```bash
POST /api/metadata/batch
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
Content-Type: application/json

{
  "items": [
    { "name": "NFT #1", ... },
    { "name": "NFT #2", ... }
  ]
}
```

### Get Metadata by ID

Retrieve a specific metadata entry.

```bash
GET /api/metadata/[id]
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Awesome NFT #1",
    "description": "...",
    "image": "...",
    "ipfsHash": "QmXxxx...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update Metadata

Update an existing metadata entry.

```bash
PUT /api/metadata/[id]
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "attributes": [...]
}
```

### Delete Metadata

Delete a metadata entry.

```bash
DELETE /api/metadata/[id]
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
```

**Response:**
```json
{
  "success": true,
  "message": "Metadata deleted successfully"
}
```

## OpenSea-Compatible Metadata Format

All metadata should follow the OpenSea metadata standard for maximum compatibility.

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "animation_url": "https://example.com/video.mp4",
  "external_url": "https://example.com",
  "attributes": [
    { "trait_type": "Color", "value": "Blue" },
    { "trait_type": "Level", "value": 5 }
  ],
  "creators": [
    { "address": "0x...", "share": 100 }
  ]
}
```

### Required Fields

- `name` (string) - NFT name
- `image` (string) - Image URL

### Optional Fields

- `description` (string) - NFT description
- `animation_url` (string) - Animation/video URL
- `external_url` (string) - External link
- `attributes` (array) - Trait attributes
- `creators` (array) - Creator information

### Creator Shares Rule

When specifying multiple creators, share percentages must sum to exactly 100:

```json
{
  "creators": [
    { "address": "0x1111...", "share": 50 },
    { "address": "0x2222...", "share": 50 }
  ]
}
```

## Health Check

System health check endpoint (no authentication required).

```bash
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "services": {
      "database": "healthy",
      "redis": "healthy",
      "imagekit": "healthy",
      "pinata": "healthy",
      "queue": "healthy"
    }
  }
}
```

## See Also

- [Authentication](/metadata/api-reference/authentication)
- [Media Endpoints](/metadata/api-reference/media-endpoints)
- [Error Handling](#error-handling)
