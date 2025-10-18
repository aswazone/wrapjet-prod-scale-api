# 🐳 Docker Deployment Guide

This guide provides comprehensive instructions for dockerizing your application with Neon Database support for both development and production environments.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Development Environment](#development-environment)
4. [Production Environment](#production-environment)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

---

## Overview

This project uses a **dual-environment Docker setup**:

- **Development**: Uses **Neon Local** (PostgreSQL proxy) running in Docker for local development
- **Production**: Connects to **Neon Cloud** (serverless PostgreSQL) for production deployments

### Key Features

✅ Multi-stage Dockerfile optimized for both dev and prod  
✅ Separate Docker Compose files for different environments  
✅ Neon Local integration for local development  
✅ Hot-reload enabled in development  
✅ Production-ready with health checks and resource limits  
✅ Non-root user in production for security  
✅ Optimized Docker layer caching

---

## Architecture

### Development Architecture

```
┌─────────────────────────────────────────┐
│   Docker Compose (docker-compose.dev.yml) │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌───────────────┐ │
│  │ Neon Local   │◄──┤ Application   │ │
│  │ (Postgres)   │   │ (Node.js)     │ │
│  │ :5432        │   │ :3000         │ │
│  └──────────────┘   └───────────────┘ │
│         │                    │         │
│         └────────────────────┘         │
│          wrapjet-network               │
└─────────────────────────────────────────┘
```

### Production Architecture

```
┌──────────────────────────────────────────┐
│  Docker Compose (docker-compose.prod.yml) │
├──────────────────────────────────────────┤
│                                          │
│       ┌────────────────┐                │
│       │  Application   │                │
│       │  (Node.js)     │                │
│       │  :3000         │                │
│       └────────┬───────┘                │
│                │                         │
│                │ DATABASE_URL            │
│                │                         │
└────────────────┼─────────────────────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │   Neon Cloud         │
      │   (Serverless PG)    │
      │   neon.tech          │
      └──────────────────────┘
```

---

## Development Environment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Setup Steps

#### 1. Configure Environment Variables

The `.env.development` file is pre-configured:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgres://postgres:postgres@neon-local:5432/wrapjet_dev
```

#### 2. Start Development Environment

```bash
# Build and start all services
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up --build -d
```

#### 3. Run Database Migrations

```bash
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

#### 4. Access Services

- **Application**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Drizzle Studio** (optional): http://localhost:4983

To start Drizzle Studio:

```bash
docker-compose -f docker-compose.dev.yml --profile tools up drizzle-studio
```

#### 5. View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Application only
docker-compose -f docker-compose.dev.yml logs -f app

# Neon Local only
docker-compose -f docker-compose.dev.yml logs -f neon-local
```

#### 6. Stop Development Environment

```bash
# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (deletes database data)
docker-compose -f docker-compose.dev.yml down -v
```

### Development Features

- **Hot Reload**: Source code changes automatically reload the application
- **Volume Mapping**: Local files are mounted into the container
- **Persistent Data**: Database data persists in Docker volumes
- **Isolated Environment**: Each service runs in its own container

---

## Production Environment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Neon Cloud account with database created

### Setup Steps

#### 1. Configure Environment Variables

Update `.env.production` with your Neon Cloud credentials:

```env
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
DATABASE_URL=postgres://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

> ⚠️ **Security Warning**: Never commit `.env.production` with real credentials to version control. Use secrets management instead.

#### 2. Set Database URL (Linux/macOS)

```bash
export DATABASE_URL="postgres://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

#### 2. Set Database URL (Windows PowerShell)

```powershell
$env:DATABASE_URL="postgres://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

#### 3. Start Production Environment

```bash
# Build and start in detached mode
docker-compose -f docker-compose.prod.yml up --build -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

#### 4. Run Database Migrations

```bash
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

#### 5. Monitor Application

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Check health
curl http://localhost:3000/health

# Access shell
docker-compose -f docker-compose.prod.yml exec app sh
```

#### 6. Stop Production Environment

```bash
docker-compose -f docker-compose.prod.yml down
```

### Production Features

- **Optimized Build**: Multi-stage build with production dependencies only
- **Health Checks**: Automatic container health monitoring
- **Resource Limits**: CPU and memory constraints
- **Security**: Runs as non-root user (nodejs:nodejs)
- **Restart Policy**: Automatic restart on failure
- **No Volume Mounts**: Static container with no external dependencies

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution**:

```bash
# Find process using port 3000
# Linux/macOS
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Kill the process or change PORT in .env file
```

#### 2. Database Connection Failed

**Error**: `Error: connect ECONNREFUSED neon-local:5432`

**Solution**:

```bash
# Check if Neon Local is running
docker-compose -f docker-compose.dev.yml ps

# Check logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Restart services
docker-compose -f docker-compose.dev.yml restart
```

#### 3. Permission Denied

**Error**: `EACCES: permission denied, mkdir '/app/logs'`

**Solution**:

```bash
# Create logs directory locally
mkdir logs
chmod 755 logs

# Or rebuild containers
docker-compose -f docker-compose.dev.yml up --build
```

#### 4. Module Not Found

**Error**: `Error: Cannot find module 'express'`

**Solution**:

```bash
# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache

# Restart services
docker-compose -f docker-compose.dev.yml up
```

#### 5. Neon Local Won't Start

**Error**: `neon-local container keeps restarting`

**Solution**:

```bash
# Check platform compatibility (M1/M2 Macs)
# Update docker-compose.dev.yml platform setting

# Remove existing volumes
docker-compose -f docker-compose.dev.yml down -v

# Restart with fresh volumes
docker-compose -f docker-compose.dev.yml up --build
```

---

## Best Practices

### Development

1. **Use `.env.development`**: Keep development configs separate
2. **Volume Mapping**: Mount source code for hot-reload
3. **Named Volumes**: Persist database data across restarts
4. **Health Checks**: Ensure database is ready before starting app
5. **Network Isolation**: Use Docker networks for service communication

### Production

1. **Secrets Management**: Never hardcode credentials

   ```bash
   # Use environment variables
   export DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id prod/db/url)
   ```

2. **Image Optimization**:

   ```dockerfile
   # Multi-stage builds
   # Production dependencies only
   # Minimal base image (alpine)
   ```

3. **Security**:

   ```dockerfile
   # Run as non-root user
   USER nodejs

   # Read-only filesystem (if possible)
   # Scan images for vulnerabilities
   ```

4. **Monitoring**:

   ```bash
   # Enable health checks
   # Log aggregation (ELK, CloudWatch)
   # Resource metrics (Prometheus, Datadog)
   ```

5. **CI/CD Integration**:
   ```yaml
   # Build in CI pipeline
   # Push to registry
   # Deploy with orchestration (K8s, ECS)
   ```

### Docker Compose Tips

```bash
# View resource usage
docker stats

# Clean up unused images
docker image prune -a

# Clean up everything
docker system prune -a --volumes

# Build without cache
docker-compose build --no-cache

# Scale services
docker-compose up --scale app=3
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Neon Cloud Documentation](https://neon.tech/docs)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## Support

For issues and questions:

- GitHub Issues: [wrapjet-prod-scale-api/issues](https://github.com/aswazone/wrapjet-prod-scale-api/issues)
- Neon Support: [neon.tech/docs](https://neon.tech/docs)
- Docker Support: [docs.docker.com](https://docs.docker.com/)
