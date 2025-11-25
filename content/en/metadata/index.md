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
- [Installation Guide](/en/metadata/1.getting-started/installation) - Set up the Metadata service
- [Configuration](/en/metadata/1.getting-started/configuration) - Configure environment and database

### API Reference
- [Authentication](/en/metadata/2.api-reference/authentication) - API key and session authentication
- [Metadata Endpoints](/en/metadata/2.api-reference/metadata-endpoints) - CRUD operations for NFT metadata
- [Media Endpoints](/en/metadata/2.api-reference/media-endpoints) - Upload and manage media files

### Architecture
- [Clean Architecture](/en/metadata/3.architecture/clean-architecture) - Design patterns and principles
- [Project Structure](/en/metadata/3.architecture/project-structure) - Directory organization

### Deployment
- [Production Checklist](/en/metadata/4.deployment/production-checklist) - Pre-deployment requirements
- [Docker Deployment](/en/metadata/4.deployment/docker) - Container deployment guide
- [Vercel Deployment](/en/metadata/4.deployment/vercel) - Next.js cloud deployment

### Security
- [Security Best Practices](/en/metadata/5.security/best-practices) - Comprehensive security guidelines

## Getting Started

```bash
git clone https://github.com/ZunoKit/zuno-marketplace-metadata.git
cd zuno-marketplace-metadata
pnpm install
```

See the [Installation Guide](/en/metadata/getting-started/installation) for complete setup.
