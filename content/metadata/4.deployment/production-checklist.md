---
title: "Production Checklist"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "deployment"
complexity: "intermediate"
category: "deployment"
relatedTopics:
  - "docker-deployment"
  - "vercel-deployment"
  - "environment-configuration"
---

Complete checklist for deploying the Metadata service to production.

## Pre-Deployment Requirements

### Environment Setup

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `BETTER_AUTH_SECRET` (minimum 32 characters)
- [ ] Generate strong `CRON_SECRET` (minimum 32 characters)
- [ ] Set secure `ADMIN_PASSWORD`
- [ ] Verify all required environment variables are configured

### Database

- [ ] Set up PostgreSQL instance (Supabase, Railway, AWS RDS, etc.)
- [ ] Configure `DATABASE_URL` connection string
- [ ] Run database migrations: `pnpm db:migrate`
- [ ] Create admin user: `pnpm db:create-admin`
- [ ] Verify database connectivity from production environment
- [ ] Set up automated backups
- [ ] Configure read replicas if needed (for scaling)

### Caching & Queue

- [ ] Set up Redis instance (Upstash, Railway, AWS ElastiCache, etc.)
- [ ] Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- [ ] Test Redis connectivity
- [ ] Configure Redis persistence
- [ ] Set up Redis monitoring/alerts

### External Services

- [ ] **ImageKit**: Create account and configure keys
  - [ ] Set `IMAGEKIT_PUBLIC_KEY`
  - [ ] Set `IMAGEKIT_PRIVATE_KEY`
  - [ ] Set `IMAGEKIT_URL_ENDPOINT`
  - [ ] Configure CDN settings
  - [ ] Set up image optimization rules

- [ ] **Pinata**: Create account and configure IPFS
  - [ ] Set `PINATA_JWT` token
  - [ ] Set `PINATA_GATEWAY_URL`
  - [ ] Configure pinning rules
  - [ ] Set up IPFS gateway configuration

- [ ] **Better Auth**: Configure authentication
  - [ ] Set `BETTER_AUTH_SECRET` (32+ chars)
  - [ ] Set `BETTER_AUTH_URL` to production domain
  - [ ] Configure email provider (if using email auth)

### Security

- [ ] Enable HTTPS/TLS certificates
  - [ ] Obtain SSL certificate (Let's Encrypt, Cloudflare, etc.)
  - [ ] Configure certificate auto-renewal
  - [ ] Test HTTPS connectivity

- [ ] Configure CORS
  - [ ] Set `CORS_ORIGINS` to allowed domains only
  - [ ] Remove localhost from production config
  - [ ] Test CORS headers

- [ ] API Security
  - [ ] Enable rate limiting (configured by default)
  - [ ] Set up request logging
  - [ ] Configure audit trails
  - [ ] Enable request validation

- [ ] Secrets Management
  - [ ] Use environment variable management service
  - [ ] Never commit `.env` files
  - [ ] Rotate secrets regularly
  - [ ] Use vault/secrets manager for sensitive data

### Monitoring & Logging

- [ ] Set `LOG_LEVEL=info` (not debug)
- [ ] Configure log aggregation service
  - [ ] Datadog, CloudWatch, ELK, etc.
  - [ ] Set up log streaming
  - [ ] Configure alerts

- [ ] Set up application monitoring
  - [ ] Error tracking (Sentry, Rollbar, etc.)
  - [ ] Performance monitoring
  - [ ] Uptime monitoring

- [ ] Configure health checks
  - [ ] Set up periodic `/api/health` checks
  - [ ] Configure alerting on health check failures
  - [ ] Document health check endpoints

## Deployment

### Build & Package

- [ ] Run type checking: `pnpm typecheck`
- [ ] Run linting: `pnpm lint`
- [ ] Run tests: `pnpm test`
- [ ] Build application: `pnpm build`
- [ ] Verify build output is correct
- [ ] Create production Docker image (if using Docker)

### Web Server Deployment

Choose your deployment platform:

- [ ] **Vercel** - Recommended for Next.js
  - [ ] Connect GitHub repository
  - [ ] Set environment variables
  - [ ] Configure build settings
  - [ ] Set up auto-deployment

- [ ] **Railway** - Full-stack deployment
  - [ ] Create Railway project
  - [ ] Connect database service
  - [ ] Set environment variables
  - [ ] Deploy application

- [ ] **Docker** - Self-hosted deployment
  - [ ] Build Docker image
  - [ ] Push to container registry
  - [ ] Configure orchestration (Kubernetes, Docker Compose, etc.)
  - [ ] Set up reverse proxy (Nginx, Caddy, etc.)

### Background Workers

- [ ] Deploy background workers **separately**
  - [ ] Workers run BullMQ job processors
  - [ ] Cannot run on serverless platforms (Vercel)
  - [ ] Deploy to: Railway, AWS Lambda (with SQS), Google Cloud Run, etc.
  - [ ] Configure worker environment variables
  - [ ] Set `pnpm workers` as startup command

- [ ] Verify worker connectivity
  - [ ] Test IPFS pinning jobs
  - [ ] Monitor job queue status
  - [ ] Set up worker monitoring/alerts

### Cron Jobs

- [ ] Configure cron job endpoints
  - [ ] Set up cron trigger service (EasyCron, cron-job.org, etc.)
  - [ ] Configure authentication with `CRON_SECRET`
  - [ ] Set appropriate intervals
  - [ ] Set up failure notifications

- [ ] Available cron endpoints:
  - [ ] `POST /api/cron/pin-metadata` - Pin metadata to IPFS
  - [ ] `POST /api/cron/cleanup` - Cleanup expired items

## Post-Deployment

### Verification

- [ ] Test API endpoints with production URL
- [ ] Test metadata creation flow
- [ ] Test media upload functionality
- [ ] Test authentication (API keys)
- [ ] Verify CORS works correctly
- [ ] Test health check endpoint: `/api/health`

### Admin Dashboard

- [ ] Log in to admin dashboard
- [ ] Verify dashboard functionality
- [ ] Test API key creation
- [ ] Test metadata management
- [ ] Monitor system health

### Data Validation

- [ ] Verify database contains expected data
- [ ] Check IPFS pinning is working
- [ ] Verify ImageKit CDN is serving media
- [ ] Test cache functionality
- [ ] Validate audit logs

## Ongoing Maintenance

### Regular Tasks

- [ ] Monitor logs daily for errors
- [ ] Review health check status
- [ ] Monitor database performance
- [ ] Check Redis memory usage
- [ ] Monitor API rate limits

### Weekly

- [ ] Review audit logs for suspicious activity
- [ ] Check dependency updates
- [ ] Monitor storage usage (IPFS, ImageKit)
- [ ] Review error rates and patterns

### Monthly

- [ ] Rotate API keys
- [ ] Update dependencies: `pnpm update`
- [ ] Review and update security settings
- [ ] Backup and verify database backups
- [ ] Review monitoring and alerting

### Quarterly

- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Disaster recovery testing
- [ ] Capacity planning

## Rollback Procedure

If deployment fails or critical issues occur:

1. Stop traffic to new deployment
2. Revert to previous stable version
3. Notify stakeholders
4. Investigate root cause
5. Fix issues and re-test
6. Re-deploy with fixes

## Environment Variables (Production)

```env
# Critical Secrets (Change These!)
BETTER_AUTH_SECRET=<strong-random-secret-min-32-chars>
CRON_SECRET=<strong-random-secret-min-32-chars>
ADMIN_PASSWORD=<secure-admin-password>

# Database
DATABASE_URL=postgresql://user:password@prod-db.example.com/zuno_metadata
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Caching
UPSTASH_REDIS_REST_URL=https://prod-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Media Processing
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# IPFS
PINATA_JWT=your-jwt-token
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs

# Authentication
BETTER_AUTH_URL=https://your-domain.com
CORS_ORIGINS=https://your-domain.com,https://app.your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Logging
NODE_ENV=production
LOG_LEVEL=info

# Admin
ADMIN_EMAIL=admin@your-domain.com
```

## See Also

- [Docker Deployment](/en/metadata/deployment/docker)
- [Vercel Deployment](/en/metadata/deployment/vercel)
- [Configuration Guide](/en/metadata/getting-started/configuration)
- [Security Best Practices](/en/metadata/security/best-practices)
