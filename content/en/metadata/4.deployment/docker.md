---
title: "Docker Deployment"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "deployment"
complexity: "intermediate"
category: "deployment"
relatedTopics:
  - "production-checklist"
  - "vercel-deployment"
  - "environment-configuration"
---

# Docker Deployment

Deploy the Metadata service using Docker for self-hosted environments.

## Building Docker Image

Build the production Docker image:

```bash
# Build production image
docker build -t zuno-metadata .

# Tag for registry
docker tag zuno-metadata your-registry.com/zuno-metadata:latest
docker tag zuno-metadata your-registry.com/zuno-metadata:1.0.0
```

## Running with Docker Compose

Create a `docker-compose.yml` file for full-stack deployment:

```yaml
version: '3.8'

services:
  # Next.js Application
  app:
    image: zuno-metadata:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:password@postgres:5432/zuno_metadata
      UPSTASH_REDIS_REST_URL: http://redis:6379
      BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
      BETTER_AUTH_URL: ${BETTER_AUTH_URL}
      IMAGEKIT_PUBLIC_KEY: ${IMAGEKIT_PUBLIC_KEY}
      IMAGEKIT_PRIVATE_KEY: ${IMAGEKIT_PRIVATE_KEY}
      IMAGEKIT_URL_ENDPOINT: ${IMAGEKIT_URL_ENDPOINT}
      PINATA_JWT: ${PINATA_JWT}
      PINATA_GATEWAY_URL: ${PINATA_GATEWAY_URL}
      CORS_ORIGINS: ${CORS_ORIGINS}
      LOG_LEVEL: info
    depends_on:
      - postgres
      - redis
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Background Workers
  workers:
    image: zuno-metadata:latest
    command: pnpm workers
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:password@postgres:5432/zuno_metadata
      UPSTASH_REDIS_REST_URL: http://redis:6379
      PINATA_JWT: ${PINATA_JWT}
      PINATA_GATEWAY_URL: ${PINATA_GATEWAY_URL}
    depends_on:
      - postgres
      - redis
    restart: always

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
      POSTGRES_DB: zuno_metadata
    ports:
      - "5432:5432"
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: always
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: always

volumes:
  postgres_data:
  redis_data:
```

## Running Docker Compose

```bash
# Create .env file with production values
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Dockerfile

The project includes a `Dockerfile` configured for production:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i -g pnpm && pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN npm i -g pnpm

EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
```

## Container Registry

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag zuno-metadata:latest username/zuno-metadata:latest

# Push image
docker push username/zuno-metadata:latest
```

### Push to AWS ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name zuno-metadata

# Login to AWS ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag zuno-metadata:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/zuno-metadata:latest

# Push image
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/zuno-metadata:latest
```

## Docker Network Configuration

```bash
# Create custom network
docker network create zuno-network

# Run services on custom network
docker run \
  --network zuno-network \
  --name zuno-app \
  zuno-metadata:latest
```

## Environment Variables in Docker

```bash
# Method 1: .env file
docker run --env-file .env zuno-metadata:latest

# Method 2: Environment flags
docker run \
  -e DATABASE_URL=postgresql://... \
  -e BETTER_AUTH_SECRET=... \
  zuno-metadata:latest

# Method 3: Docker Compose (in docker-compose.yml)
environment:
  DATABASE_URL: postgresql://...
  BETTER_AUTH_SECRET: ...
```

## Volume Management

```bash
# Named volumes (persistent)
docker run -v postgres_data:/var/lib/postgresql/data postgres:15

# Bind mounts (host directory)
docker run -v $(pwd)/config:/app/config zuno-metadata:latest

# Volume inspection
docker volume inspect postgres_data
```

## Docker Health Checks

The container includes health checks:

```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Manual health check
docker exec zuno-app curl http://localhost:3000/api/health
```

## Scaling with Docker

### Horizontal Scaling

```bash
# Run multiple application instances
docker-compose up -d --scale app=3

# Use load balancer in front of instances
# (Nginx, HAProxy, or cloud load balancer)
```

### Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1024M
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Troubleshooting

### Check Logs

```bash
# Application logs
docker logs zuno-app

# Follow logs
docker logs -f zuno-app

# View last 100 lines
docker logs --tail 100 zuno-app
```

### Access Container Shell

```bash
# Execute bash in running container
docker exec -it zuno-app /bin/sh

# Run database migration
docker exec zuno-app pnpm db:migrate

# Create admin user
docker exec zuno-app pnpm db:create-admin
```

### Container Debugging

```bash
# Inspect container details
docker inspect zuno-app

# Check network connectivity
docker exec zuno-app ping redis

# Test database connection
docker exec zuno-app psql $DATABASE_URL -c "SELECT 1"
```

## Production Considerations

### Security

- Use specific image versions (not `latest`)
- Scan images for vulnerabilities: `docker scan zuno-metadata`
- Don't run containers as root
- Use secrets manager for sensitive data
- Keep images up-to-date

### Performance

- Use Alpine images for smaller sizes
- Enable BuildKit for faster builds: `DOCKER_BUILDKIT=1`
- Use multi-stage builds to reduce image size
- Cache dependencies layer

### Monitoring

- Set up container logging (Docker logs to CloudWatch, ELK, etc.)
- Monitor container metrics (CPU, memory, network)
- Set resource limits to prevent runaway containers
- Use health checks for automatic restarts

## See Also

- [Production Checklist](/en/metadata/deployment/production-checklist)
- [Vercel Deployment](/en/metadata/deployment/vercel)
- [Environment Configuration](/en/metadata/getting-started/configuration)
