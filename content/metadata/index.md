---
title: "Zuno Marketplace Metadata"
package: "metadata"
lastUpdated: "2025-11-25"
changeFrequency: "monthly"
scope: "guide"
context: "standalone"
complexity: "beginner"
tokenEstimate: 380
category: "overview"
navigation: false
relatedTopics:
  - "installation"
  - "api-reference"
  - "architecture"
---

Enterprise-grade NFT metadata management service with IPFS storage and OpenSea compatibility.

<div class="flex gap-2 mb-6 flex-wrap">
  <UBadge color="blue" variant="subtle">Next.js 16</UBadge>
  <UBadge color="blue" variant="subtle">React 19</UBadge>
  <UBadge color="orange" variant="subtle">TypeScript 5</UBadge>
  <UBadge color="purple" variant="subtle">PostgreSQL</UBadge>
  <UBadge color="red" variant="subtle">Redis</UBadge>
  <UBadge color="green" variant="subtle">MIT License</UBadge>
</div>

## Overview

Production-ready metadata service providing comprehensive API access to NFT metadata with IPFS storage, intelligent caching, and a powerful admin interface.

## Key Features

- 🎨 **Metadata Management** - Complete CRUD operations for NFT metadata
- 📦 **IPFS Storage** - Decentralized storage via Pinata
- ⚡ **Redis Caching** - High-performance caching with Upstash
- 🔐 **Authentication** - Better Auth with API key support
- 📊 **Admin Dashboard** - Full-featured management interface
- 🌐 **OpenSea Compatible** - Metadata standards compliance

## Quick Links

### Getting Started
- [Installation Guide](/metadata/getting-started/installation) - Set up the Metadata service
- [Configuration](/metadata/getting-started/configuration) - Configure environment and database

### API Reference
- [Authentication](/metadata/api-reference/authentication) - API key and session authentication
- [Metadata Endpoints](/metadata/api-reference/metadata-endpoints) - CRUD operations for NFT metadata
- [Media Endpoints](/metadata/api-reference/media-endpoints) - Upload and manage media files

### Architecture
- [Clean Architecture](/metadata/architecture/clean-architecture) - Design patterns and principles
- [Project Structure](/metadata/architecture/project-structure) - Directory organization

### Deployment
- [Production Checklist](/metadata/deployment/production-checklist) - Pre-deployment requirements
- [Docker Deployment](/metadata/deployment/docker) - Container deployment guide
- [Vercel Deployment](/metadata/deployment/vercel) - Next.js cloud deployment

### Security
- [Security Best Practices](/metadata/security/best-practices) - Comprehensive security guidelines

## Getting Started

```bash
git clone https://github.com/ZunoKit/zuno-marketplace-metadata.git
cd zuno-marketplace-metadata
pnpm install
```

See the [Installation Guide](/metadata/getting-started/installation) for complete setup.
