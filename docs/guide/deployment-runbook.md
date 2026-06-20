# Deployment Runbook

This runbook covers deploying the MFTPlus documentation site (VitePress) to production environments.

## Prerequisites

Before deploying, ensure you have:

- **Docker** 20.10+ installed
- **Docker Compose** v2+ installed
- **Domain name** with DNS configured
- **TLS certificate** (certbot/Let's Encrypt recommended)
- **Git** for cloning the repository
- **At least 512MB RAM** and **1GB disk space** available

### DNS Requirements

Configure your domain DNS records:

| Type | Name | Value |
|------|------|-------|
| A | `docs` | Your server IPv4 address |
| AAAA | `docs` | Your server IPv6 address (optional) |

### TLS Certificate

Generate a TLS certificate before running the container:

```bash
# Using certbot for Let's Encrypt
sudo certbot certonly --standalone -d docs.yourdomain.com
```

## Quick Deploy

The fastest way to get the documentation site running:

```bash
# Clone the repository
git clone https://github.com/ZeroClue/mft-docs.git
cd mft-docs

# Build and start
docker compose up -d --build

# Verify
curl -I https://docs.yourdomain.com
```

## Detailed Deployment Steps

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 2. Clone and Configure

```bash
# Clone repository
git clone https://github.com/ZeroClue/mft-docs.git /opt/mft-docs
cd /opt/mft-docs

# Create environment file (see Environment Variables section)
cp .env.example .env
nano .env
```

### 3. Build the Site

```bash
# Build static files
docker compose run --rm docs npm run build

# Verify build output
ls -la docs/.vitepress/dist/
```

### 4. Start Services

```bash
# Start in detached mode
docker compose up -d

# Check service health
docker compose ps
docker compose logs docs
```

### 5. Configure Reverse Proxy

The provided nginx configuration handles:

- TLS termination
- Static file serving
- Cache headers
- Security headers

Apply nginx reload after changes:

```bash
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

## Environment Variables

Create a `.env` file in the project root:

| Variable | Description | Default |
|----------|-------------|---------|
| `DOMAIN` | Your documentation domain | Required |
| `PORT` | Internal container port | `8080` |
| `NODE_ENV` | Environment mode | `production` |
| `SITE_TITLE` | Site title for SEO | `MFTPlus Documentation` |

Example `.env` file:

```env
DOMAIN=docs.yourdomain.com
PORT=8080
NODE_ENV=production
SITE_TITLE=MFTPlus Documentation
```

## Common Failure Modes

### Build Failures

**Symptom**: `docker compose up` fails during build

**Causes**:
- Insufficient disk space
- Network connectivity issues
- Node.js dependency conflicts

**Recovery**:
```bash
# Check disk space
df -h

# Clear Docker cache
docker system prune -af

# Rebuild with no cache
docker compose build --no-cache
```

### Container Won't Start

**Symptom**: Container exits immediately

**Diagnosis**:
```bash
# Check logs
docker compose logs docs

# Inspect container
docker compose ps -a
```

**Recovery**:
```bash
# Restart services
docker compose restart

# Recreate containers
docker compose up -d --force-recreate
```

### TLS Certificate Issues

**Symptom**: Browser shows certificate warnings

**Recovery**:
```bash
# Renew certificate
sudo certbot renew --force-renewal

# Copy certs to project
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/

# Restart nginx
docker compose restart nginx
```

### High Memory Usage

**Symptom**: Container OOM killed

**Recovery**:
```bash
# Check container limits
docker stats

# Add memory limit to docker-compose.yml
# services:
#   docs:
#     mem_limit: 512m
```

## Backup and Restore

### Backup

```bash
# Backup static files
tar -czf mft-docs-backup-$(date +%Y%m%d).tar.gz docs/.vitepress/dist/

# Backup configuration
tar -czf mft-docs-config-$(date +%Y%m%d).tar.gz .env docker-compose.yml nginx/

# Backup to remote
scp mft-docs-*.tar.gz user@backup-server:/backups/
```

### Restore

```bash
# Restore static files
tar -xzf mft-docs-backup-YYYYMMDD.tar.gz -C /opt/mft-docs/

# Restore configuration
tar -xzf mft-docs-config-YYYYMMDD.tar.gz -C /opt/mft-docs/

# Restart services
cd /opt/mft-docs
docker compose up -d
```

## Log Access

### Viewing Logs

```bash
# All logs
docker compose logs

# Specific service
docker compose logs docs
docker compose logs nginx

# Follow logs
docker compose logs -f docs

# Last 100 lines
docker compose logs --tail=100 docs
```

### Log Locations

- **Application logs**: Container stdout/stderr
- **Nginx access logs**: `docker compose exec nginx cat /var/log/nginx/access.log`
- **Nginx error logs**: `docker compose exec nginx cat /var/log/nginx/error.log`

### Log Rotation

The docker-compose configuration includes log rotation:

```yaml
services:
  docs:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Updating Content

### Content Updates

```bash
# Pull latest changes
cd /opt/mft-docs
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Verify deployment
curl -I https://docs.yourdomain.com
```

### Rollback

```bash
# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild
docker compose up -d --build
```

## Monitoring

### Health Checks

```bash
# Check service status
docker compose ps

# HTTP health check
curl -f https://docs.yourdomain.com/health || echo "Health check failed"

# Container resource usage
docker stats
```

### Alerts to Monitor

- Container exit codes (non-zero = failure)
- HTTP 5xx errors in nginx logs
- Disk space > 80% used
- Memory usage approaching limits

## Troubleshooting Commands

```bash
# Enter container shell
docker compose exec docs sh

# Check file permissions
ls -la docs/.vitepress/dist/

# Test nginx config
docker compose exec nginx nginx -t

# View environment variables
docker compose config

# Check port binding
netstat -tlnp | grep :80
```

## Security Checklist

- [ ] TLS certificate valid and not expired
- [ ] No secrets in environment variables
- [ ] Docker images updated regularly
- [ ] Firewall allows only 80/443
- [ ] SSH key-based authentication only
- [ ] Regular backups configured
- [ ] Log rotation enabled
- [ ] HTTP security headers configured

## Support

For issues not covered in this runbook:

1. Check GitHub Issues: https://github.com/ZeroClue/mft-docs/issues
2. Review VitePress docs: https://vitepress.dev
3. Check Docker docs: https://docs.docker.com
