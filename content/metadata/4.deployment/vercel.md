---
title: "Vercel Deployment"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "deployment"
complexity: "intermediate"
category: "deployment"
relatedTopics:
  - "production-checklist"
  - "docker-deployment"
  - "environment-configuration"
---

Deploy the Metadata service to Vercel, optimized for Next.js applications.

## Why Vercel?

Vercel is recommended for Next.js deployments:

- **Optimal Performance** - Built specifically for Next.js
- **Edge Network** - Global CDN for fast content delivery
- **Serverless** - Automatic scaling without server management
- **Zero Configuration** - Minimal setup required
- **Environment Management** - Easy variable configuration
- **Instant Rollbacks** - Quick deployment reversions

## Prerequisites

- GitHub/GitLab/Bitbucket repository with Metadata service code
- Vercel account (free tier available)
- PostgreSQL database (Supabase, Railway, etc.)
- Redis instance (Upstash, Railway, etc.)

## Initial Setup

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your Git repository
4. Import the repository

### 2. Configure Project

Vercel automatically detects Next.js:

```
Framework: Next.js
Root Directory: ./
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm install --frozen-lockfile
```

## Environment Variables

### Add to Vercel

1. Go to **Project Settings → Environment Variables**
2. Add all required variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key

# Redis Cache (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Media Processing
IMAGEKIT_PUBLIC_KEY=your-key
IMAGEKIT_PRIVATE_KEY=your-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# IPFS Storage
PINATA_JWT=your-jwt
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs

# Authentication
BETTER_AUTH_SECRET=your-secret-min-32-chars
BETTER_AUTH_URL=https://your-domain.vercel.app

# Application
NODE_ENV=production
CORS_ORIGINS=https://your-domain.vercel.app
LOG_LEVEL=info
CRON_SECRET=your-cron-secret

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

### Variable Scopes

Set environment scope for different stages:

- **Production** - Used in production deployments
- **Preview** - Used in preview/staging deployments
- **Development** - Used locally with `vercel env pull`

## Deploy

### Automatic Deployment

Vercel automatically deploys when you push to main/develop branch:

```bash
git push origin main
```

### Manual Deployment

Deploy from Vercel dashboard:

1. Go to your project
2. Click **"Deployments"**
3. Click **"Create Deployment"**
4. Select branch
5. Click **"Deploy"**

### Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Deploy staging
vercel
```

## Post-Deployment

### Run Database Migrations

Since Vercel is serverless, run migrations before first deployment:

```bash
# Via Vercel CLI function
vercel env pull

# Connect to your database and run migrations
pnpm db:migrate

# Create admin user
pnpm db:create-admin
```

### Update Domain

1. Go to **Project Settings → Domains**
2. Add your custom domain
3. Configure DNS records:

```dns
CNAME your-domain.com vercel.app
```

### SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.

1. Add domain in **Project Settings → Domains**
2. Vercel automatically creates and renews certificates

## Background Workers

**Important**: Vercel is serverless, so background workers cannot run on Vercel.

Deploy workers separately to:

- **Railway** - Full-stack hosting with workers
- **AWS Lambda** - Serverless compute with SQS queue
- **Google Cloud Run** - Managed container service
- **Separate VPS** - Traditional server with cron jobs

### Example: Railway Workers

```bash
# Create new Railway service for workers
railway add

# Select "Generic" service
# Paste this command as startup:
pnpm workers

# Set environment variables to match main app
# Deploy
railway up
```

## Cron Jobs

Configure cron jobs for maintenance tasks:

### Using External Cron Service

1. Use [EasyCron](https://www.easycron.com/) or similar
2. Configure webhook to: `https://your-domain.com/api/cron/pin-metadata`
3. Add cron secret header: `Authorization: Bearer YOUR_CRON_SECRET`

### Example Cron Configuration

```bash
# Pin metadata to IPFS - Every hour
https://your-domain.com/api/cron/pin-metadata
Header: Authorization: Bearer YOUR_CRON_SECRET

# Cleanup jobs - Daily at 2 AM UTC
https://your-domain.com/api/cron/cleanup
Header: Authorization: Bearer YOUR_CRON_SECRET
```

## Custom Domain Configuration

### Nameserver Setup

1. Get Vercel's nameservers from domain settings
2. Update your domain registrar nameservers
3. Wait for DNS propagation (can take 24 hours)

### CNAME Setup

If you can't change nameservers:

1. Add CNAME record:
   ```
   www CNAME vercel.app
   ```
2. Add TXT verification record (Vercel provides)
3. Verify in Vercel dashboard

## Monitoring & Analytics

### Vercel Analytics

1. Go to **Analytics** tab
2. View real-time performance metrics:
   - Page performance
   - Core Web Vitals
   - Response times
   - Request volume

### Logging

View deployment and runtime logs:

1. Go to **Deployments**
2. Click deployment
3. View **Build Logs** or **Runtime Logs**

### Edge Functions Monitoring

Monitor Edge Functions and middleware execution.

## Scaling & Performance

### Automatic Scaling

Vercel automatically scales based on traffic:

- **Unlimited functions** - Serverless functions scale automatically
- **Global CDN** - Content cached at edge locations
- **Automatic optimization** - Image and font optimization

### Limits

Vercel Free tier limits:

- 100 GB bandwidth/month
- 1000 serverless function invocations/day
- 12 concurrent executions

Upgrade to Pro for higher limits.

## Environment Variables for Different Stages

### Production Environment

```env
NODE_ENV=production
LOG_LEVEL=info
BETTER_AUTH_URL=https://your-domain.com
CORS_ORIGINS=https://your-domain.com,https://app.your-domain.com
```

### Preview Environment

```env
NODE_ENV=production
LOG_LEVEL=debug
BETTER_AUTH_URL=https://preview.your-domain.com
CORS_ORIGINS=https://preview.your-domain.com
```

## Troubleshooting

### Build Failures

Check build logs:

1. Go to **Deployments**
2. Click failed deployment
3. View **Build Logs**

Common issues:

- Missing environment variables
- TypeScript errors
- Missing dependencies
- Invalid configuration

### Runtime Errors

View runtime logs:

1. Go to **Deployments**
2. Click active deployment
3. View **Runtime Logs**
4. Check application logs for errors

### Database Connection Issues

Test database connectivity:

```bash
# Via CLI
vercel env pull
psql $DATABASE_URL -c "SELECT 1"

# Check connection string format
# postgresql://user:password@host:5432/database
```

## Rollback

To revert to previous deployment:

1. Go to **Deployments**
2. Find previous working deployment
3. Click **Three dots → Promote to Production**

## See Also

- [Production Checklist](/metadata/deployment/production-checklist)
- [Docker Deployment](/metadata/deployment/docker)
- [Environment Configuration](/metadata/getting-started/configuration)
- [Vercel Documentation](https://vercel.com/docs)
