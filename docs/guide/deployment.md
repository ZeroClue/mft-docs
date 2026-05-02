# Production Deployment Guide

Deploy MFTPlus in production using Docker and Docker Compose for a scalable, maintainable setup.

## Prerequisites

- **Docker**: 20.10+ with Docker Compose v2
- **System**: Linux (recommended), macOS, or Windows with WSL2
- **Hardware**: Minimum 2 CPU cores, 4GB RAM, 20GB disk
- **Network**: Public IP with DNS configured (for production)
- **TLS Certificate**: Valid SSL certificate for HTTPS

---

## Quick Start: Docker Compose

### 1. Create Project Directory

```bash
mkdir mftplus-production
cd mftplus-production
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  mftplus-db:
    image: postgres:16-alpine
    container_name: mftplus-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-mftplus}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME:-mftplus}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-mftplus}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - mftplus-network

  mftplus-server:
    image: mftplus/server:latest
    container_name: mftplus-server
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      # Database
      DB_HOST: mftplus-db
      DB_PORT: 5432
      DB_USER: ${DB_USER:-mftplus}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME:-mftplus}

      # Server
      MFTPLUS_SERVER_URL: ${MFTPLUS_SERVER_URL:-https://mftplus.example.com}
      MFTPLUS_SERVER_TIMEOUT: 60s

      # Security
      MFTPLUS_SECRET_KEY: ${MFTPLUS_SECRET_KEY}
      MFTPLUS_TLS_CERT: /certs/fullchain.pem
      MFTPLUS_TLS_KEY: /certs/privkey.pem

      # Logging
      MFTPLUS_LOG_LEVEL: ${LOG_LEVEL:-info}
    volumes:
      - ./certs:/certs:ro
      - mftplus_data:/data
    depends_on:
      mftplus-db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - mftplus-network

  mftplus-agent:
    image: mftplus/agent:latest
    container_name: mftplus-agent
    restart: unless-stopped
    environment:
      MFTPLUS_SERVER_URL: http://mftplus-server:8080
      MFTPLUS_AGENT_ID: ${AGENT_ID}
      MFTPLUS_AGENT_TOKEN: ${AGENT_TOKEN}
    volumes:
      - ./jobs:/jobs
      - mftplus_transfers:/transfers
    depends_on:
      - mftplus-server
    networks:
      - mftplus-network

volumes:
  postgres_data:
    driver: local
  mftplus_data:
    driver: local
  mftplus_transfers:
    driver: local

networks:
  mftplus-network:
    driver: bridge
```

### 3. Create Environment File

```bash
# .env
DB_PASSWORD=changeme_secure_password_here
MFTPLUS_SECRET_KEY=changeme_secret_key_here
MFTPLUS_SERVER_URL=https://mftplus.example.com
AGENT_ID=your-agent-id
AGENT_TOKEN=your-agent-token
LOG_LEVEL=info
```

::: warning Security
Replace all placeholder values with strong, unique passwords and keys before deploying to production.
:::

### 4. Create Certificates Directory

```bash
mkdir -p certs
# Copy your TLS certificates to certs/fullchain.pem and certs/privkey.pem
# See TLS/HTTPS Configuration section for details
```

### 5. Start the Services

```bash
docker compose up -d
```

### 6. Verify Deployment

```bash
# Check service health
docker compose ps

# View logs
docker compose logs -f

# Test health endpoint
curl http://localhost:8080/health
```

---

## Environment Variable Reference

### Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | Yes | `localhost` | PostgreSQL host |
| `DB_PORT` | No | `5432` | PostgreSQL port |
| `DB_USER` | Yes | `mftplus` | Database username |
| `DB_PASSWORD` | Yes | - | Database password |
| `DB_NAME` | No | `mftplus` | Database name |
| `DB_SSL_MODE` | No | `require` | SSL mode (`disable`, `require`, `verify-ca`, `verify-full`) |

### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MFTPLUS_SERVER_URL` | Yes | `http://localhost:8080` | Public server URL |
| `MFTPLUS_SERVER_TIMEOUT` | No | `30s` | Request timeout |
| `MFTPLUS_SECRET_KEY` | Yes | - | Secret key for JWT/encryption |
| `MFTPLUS_BIND_ADDRESS` | No | `0.0.0.0:8080` | Bind address |
| `MFTPLUS_MAX_UPLOAD_SIZE` | No | `10GB` | Maximum upload size |

### Security Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MFTPLUS_TLS_CERT` | Production | - | Path to TLS certificate |
| `MFTPLUS_TLS_KEY` | Production | - | Path to TLS private key |
| `MFTPLUS_CA_CERT` | No | - | Path to CA certificate (mTLS) |
| `MFTPLUS_ENCRYPTION_KEY` | No | - | Additional encryption key |

### Transfer Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MFTPLUS_TRANSFER_TIMEOUT` | No | `5m` | Transfer operation timeout |
| `MFTPLUS_CHUNK_SIZE` | No | `10MB` | File chunk size for transfers |
| `MFTPLUS_RETRY_COUNT` | No | `3` | Automatic retry attempts |
| `MFTPLUS_PARALLEL_TRANSFERS` | No | `2` | Concurrent transfer limit |

### Logging Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LOG_LEVEL` | No | `info` | Log level (`debug`, `info`, `warn`, `error`) |
| `LOG_FORMAT` | No | `text` | Log format (`text`, `json`) |
| `LOG_FILE` | No | - | Log file path (empty = stdout) |

### Agent Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MFTPLUS_SERVER_URL` | Yes | - | Dashboard server URL |
| `MFTPLUS_AGENT_ID` | Yes | - | Unique agent identifier |
| `MFTPLUS_AGENT_TOKEN` | Yes | - | Agent authentication token |

---

## TLS/HTTPS Configuration

### Option A: Let's Encrypt (Recommended)

Use Caddy as a reverse proxy for automatic HTTPS:

```yaml
# Add to docker-compose.yml
  caddy:
    image: caddy:2-alpine
    container_name: mftplus-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./caddy_data:/data
      - ./caddy_config:/config
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
    environment:
      ACME_AGREE: "true"
    networks:
      - mftplus-network
```

Create `Caddyfile`:

```caddyfile {
    email your-email@example.com
}

mftplus.example.com {
    reverse_proxy mftplus-server:8080

    # Increase timeouts for large file transfers
    reverse_proxy mftplus-server:8080 {
        transport http {
            read_timeout 3600
            write_timeout 3600
        }
    }
}
```

### Option B: Custom Certificates

Place your certificates in the `certs/` directory:

```bash
certs/
├── fullchain.pem  # Full certificate chain
└── privkey.pem    # Private key (chmod 600)
```

Set proper permissions:

```bash
chmod 644 certs/fullchain.pem
chmod 600 certs/privkey.pem
```

### Option C: Self-Signed Certificates (Development Only)

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout certs/privkey.pem -out certs/fullchain.pem -days 365 -nodes
```

::: warning
Self-signed certificates are not suitable for production and will cause security warnings in browsers and agents.
:::

---

## Database Setup and Migrations

### Initial Database Setup

The database is automatically initialized on first startup. To run migrations manually:

```bash
# Run migrations
docker compose exec mftplus-server mftplus migrate up

# Check migration status
docker compose exec mftplus-server mftplus migrate status

# Rollback last migration
docker compose exec mftplus-server mftplus migrate down
```

### Database Backup

Create automated backups using cron:

```bash
# Add to crontab (crontab -e)
# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

Backup script `backup-script.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/mftplus"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# Backup database
docker compose exec -T mftplus-db pg_dump -U mftplus mftplus | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Backup volumes
docker run --rm -v mftplus_data:/data -v "$BACKUP_DIR":/backup alpine tar czf "/backup/data_$DATE.tar.gz" -C /data .

# Keep last 30 days
find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +30 -delete
find "$BACKUP_DIR" -name "data_*.tar.gz" -mtime +30 -delete
```

### Database Recovery

```bash
# Stop services
docker compose down

# Restore database
gunzip < /backups/mftplus/db_20260426_020000.sql.gz | docker compose exec -T mftplus-db psql -U mftplus mftplus

# Restore volumes
docker run --rm -v mftplus_data:/data -v /backups/mftplus:/backup alpine tar xzf /backup/data_20260426_020000.tar.gz -C /data

# Start services
docker compose up -d
```

---

## Monitoring and Health Checks

### Health Endpoints

MFTPlus provides built-in health endpoints:

```bash
# Basic health check
curl http://localhost:8080/health

# Detailed health check
curl http://localhost:8080/health/detailed

# Readiness check (for orchestrators)
curl http://localhost:8080/ready
```

Response format:

```json
{
  "status": "healthy",
  "timestamp": "2026-04-26T10:00:00Z",
  "components": {
    "database": "healthy",
    "storage": "healthy",
    "transfers": "healthy"
  }
}
```

### Docker Health Checks

Health checks are configured in `docker-compose.yml`:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

View health status:

```bash
docker compose ps
docker inspect mftplus-server | jq '.[0].State.Health'
```

### Monitoring with Prometheus (Optional)

Add Prometheus and Grafana to your stack:

```yaml
  prometheus:
    image: prom/prometheus:latest
    container_name: mftplus-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    networks:
      - mftplus-network

  grafana:
    image: grafana/grafana:latest
    container_name: mftplus-grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - mftplus-network
```

### Log Aggregation

View logs in real-time:

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f mftplus-server

# Last 100 lines
docker compose logs --tail=100 mftplus-server
```

Configure structured logging (JSON format):

```yaml
environment:
  LOG_FORMAT: json
```

---

## Scaling Considerations

### Vertical Scaling (Single Server)

For small to medium deployments (up to 100 concurrent transfers):

| Component | Minimum | Recommended | High Load |
|-----------|---------|-------------|-----------|
| **CPU** | 2 cores | 4 cores | 8+ cores |
| **Memory** | 4 GB | 8 GB | 16+ GB |
| **Disk** | 20 GB SSD | 50 GB SSD | 100+ GB NVMe |
| **Network** | 100 Mbps | 1 Gbps | 10+ Gbps |

### Horizontal Scaling (Multiple Servers)

For large deployments, use a load balancer:

```yaml
# Add HAProxy or nginx load balancer
  haproxy:
    image: haproxy:2.9-alpine
    container_name: mftplus-lb
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8404:8404"  # Stats
    volumes:
      - ./haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro
    networks:
      - mftplus-network

# Scale server instances
  mftplus-server:
    # ... (same config)
    deploy:
      replicas: 3
```

HAProxy configuration `haproxy.cfg`:

```
defaults
    timeout connect 10s
    timeout client 3600s
    timeout server 3600s

frontend mftplus-in
    bind *:80
    bind *:443 ssl crt /certs/fullchain.pem
    default_backend mftplus-servers

backend mftplus-servers
    balance roundrobin
    server mft1 mftplus-server:8080 check
    server mft2 mftplus-server-2:8080 check
    server mft3 mftplus-server-3:8080 check

listen stats
    bind *:8404
    stats enable
    stats uri /
```

### Database Scaling

For high database load:

1. **Connection Pooling**: Use PgBouncer
   ```yaml
     pgbouncer:
       image: edoburu/pgbouncer:latest
       environment:
         DATABASES_HOST: mftplus-db
         DATABASES_PORT: 5432
         POOL_MODE: transaction
         MAX_CLIENT_CONN: 200
   ```

2. **Read Replicas**: Configure PostgreSQL streaming replication
3. **External Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)

### Storage Scaling

For large file storage:

1. **Object Storage**: Use S3-compatible storage via plugins
2. **Network Storage**: Mount NFS/SMB volumes
3. **CDN**: Distribute transfer files via CDN

Example S3 storage configuration:

```yaml
volumes:
  s3_data:
    driver: local
    driver_opts:
      type: none
      device: /mnt/s3-bucket
      o: bind
```

---

## Production Checklist

Before going live, verify:

- [ ] Strong passwords in `.env` file
- [ ] Valid TLS certificates installed
- [ ] Firewall rules configured (ports 80, 443)
- [ ] Database backups automated
- [ ] Health checks configured
- [ ] Monitoring and alerting set up
- [ ] Log rotation configured
- [ ] Disaster recovery tested
- [ ] DNS properly configured
- [ ] Security headers enabled
- [ ] Rate limiting configured (optional)

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs mftplus-server

# Check resource usage
docker stats

# Verify disk space
df -h
```

### Database Connection Issues

```bash
# Test database connectivity
docker compose exec mftplus-server ping mftplus-db

# Check database logs
docker compose logs mftplus-db

# Verify database is accepting connections
docker compose exec mftplus-db psql -U mftplus -c "SELECT 1"
```

### High Memory Usage

1. Check connection limits
2. Reduce `MFTPLUS_PARALLEL_TRANSFERS`
3. Enable `MFTPLUS_COMPRESS=true` for transfers
4. Add memory limits to docker-compose.yml:

```yaml
deploy:
  resources:
    limits:
      memory: 2G
    reservations:
      memory: 512M
```

---

## Security Best Practices

1. **Secrets Management**: Use Docker secrets or external secret managers (HashiCorp Vault, AWS Secrets Manager)
2. **Network Isolation**: Use Docker networks to isolate services
3. **Regular Updates**: Keep images updated with security patches
4. **Access Control**: Implement proper authentication and authorization
5. **Audit Logging**: Enable and regularly review audit logs
6. **Vulnerability Scanning**: Regularly scan images for vulnerabilities
7. **Least Privilege**: Run containers as non-root user when possible

---

## Upgrading

To upgrade to a new version:

```bash
# Pull new images
docker compose pull

# Stop services
docker compose down

# Backup database and volumes (see Backup section)
./backup-script.sh

# Start with new version
docker compose up -d

# Run migrations
docker compose exec mftplus-server mftplus migrate up
```

---

## Next Steps

- [Installation](./installation) — Install MFTPlus agents
- [Configuration](../api/config) — Advanced configuration
- [CLI Reference](../api/cli) — Command-line interface
- [Architecture](./architecture) — System architecture

## Need Help?

- 📖 [docs.mftplus.co.za](https://docs.mftplus.co.za)
- 📧 [support@mftplus.co.za](mailto:support@mftplus.co.za)
