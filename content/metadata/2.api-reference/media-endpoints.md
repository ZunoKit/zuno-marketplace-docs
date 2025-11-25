---
title: "Media Endpoints"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "api-reference"
complexity: "intermediate"
category: "api"
relatedTopics:
  - "authentication"
  - "metadata-endpoints"
  - "media-processing"
---

Upload and manage media files (images, videos) for your NFTs.

## Media Management

Endpoints for uploading and retrieving media files.

### List Media Files

Retrieve all uploaded media files with pagination.

```bash
GET /api/media
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "url": "https://ik.imagekit.io/...",
        "fileName": "image.png",
        "mimeType": "image/png",
        "size": 1024000,
        "uploadedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

### Upload Media File

Upload a single media file (image or video).

```bash
POST /api/media
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
Content-Type: multipart/form-data

-F "file=@./image.png" \
-F "alt=NFT Image"
```

**Form Fields:**
- `file` (file) - Media file to upload
- `alt` (string) - Alternative text description

**Supported Formats:**
- **Images:** PNG, JPG, JPEG, GIF, WebP
- **Videos:** MP4, WebM

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://ik.imagekit.io/your-endpoint/image.png",
    "fileName": "image.png",
    "size": 1024000,
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Batch Upload Media

Upload multiple media files at once.

```bash
POST /api/media/batch
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
Content-Type: multipart/form-data

-F "files=@./image1.png" \
-F "files=@./image2.png" \
-F "files=@./video.mp4"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploaded": 3,
    "items": [
      { "id": "uuid", "url": "...", "fileName": "image1.png" },
      { "id": "uuid", "url": "...", "fileName": "image2.png" },
      { "id": "uuid", "url": "...", "fileName": "video.mp4" }
    ]
  }
}
```

### Get Media Details

Retrieve details for a specific media file.

```bash
GET /api/media/[id]
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://ik.imagekit.io/...",
    "fileName": "image.png",
    "mimeType": "image/png",
    "size": 1024000,
    "width": 1920,
    "height": 1080,
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Delete Media File

Remove a media file from storage.

```bash
DELETE /api/media/[id]
Authorization: Bearer YOUR_API_KEY
x-api-version: v1
```

**Response:**
```json
{
  "success": true,
  "message": "Media file deleted successfully"
}
```

## Media Processing

Uploaded media is automatically processed via ImageKit:

### Image Optimization

- Automatic format conversion (WebP, AVIF)
- Responsive sizing for different devices
- Compression optimization
- CDN delivery for fast access

### Video Processing

- Automatic quality adjustment
- Thumbnail generation
- Streaming-optimized encoding
- Multi-codec support

## Image Transformation URLs

ImageKit provides powerful URL-based transformations:

```bash
https://ik.imagekit.io/endpoint/image.png?tr=w-500,h-500

# Optimize and compress
https://ik.imagekit.io/endpoint/image.png?tr=f-auto,q-70

# Crop and adjust
https://ik.imagekit.io/endpoint/image.png?tr=x-100,y-100,w-300,h-300
```

## Storage & Retention

- **ImageKit CDN** - Optimized media delivery
- **Pinata IPFS** - Decentralized backup storage
- **Automatic Pinning** - Media hashes saved to IPFS
- **Retention Policy** - Files retained indefinitely

## See Also

- [Authentication](/metadata/api-reference/authentication)
- [Metadata Endpoints](/metadata/api-reference/metadata-endpoints)
- [ImageKit Documentation](https://imagekit.io/documentation/)
