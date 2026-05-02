# Monitoring and Observability

MFTPlus provides built-in health check endpoints and observability features to help you monitor your deployment.

## Health Check Endpoints

MFTPlus exposes three health check endpoints for monitoring and orchestrator integration.

### `/api/health`

Comprehensive health check that returns detailed system status.

```bash
curl http://localhost:3000/api/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "0.1.0",
  "setup_complete": true,
  "checks": {
    "database": {
      "status": "pass",
      "latency": 5
    },
    "memory": {
      "status": "pass",
      "used": 512,
      "total": 2048,
      "percentage": 25
    },
    "disk": {
      "status": "pass",
      "used": 512,
      "total": 1024,
      "percentage": 50
    }
  },
  "metrics": {
    "activeAgents": 3,
    "activeTransfers": 2,
    "pendingJobs": 5
  }
}
```

**Health Status:**
- `healthy` - All checks passing
- `degraded` - Some checks warn but service is functional
- `unhealthy` - Critical failures, returns HTTP 503

### `/api/health/ready`

Readiness probe - checks if the service is ready to accept requests. Use this for Kubernetes readiness probes.

```bash
curl http://localhost:3000/api/health/ready
```

**Response:**

```json
{
  "status": "ready"
}
```

### `/api/health/live`

Liveness probe - checks if the service is alive. Use this for Kubernetes liveness probes.

```bash
curl http://localhost:3000/api/health/live
```

**Response:**

```json
{
  "status": "alive"
}
```

## Docker Container Health

MFTPlus includes a built-in Docker `HEALTHCHECK` instruction that queries the `/api/health` endpoint.

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"
```

View container health status:

```bash
docker ps
```

Output includes `healthy` or `unhealthy` status:

```
CONTAINER ID   IMAGE          STATUS                    NAMES
abc123def456   mftplus:latest   Up 1 hour (healthy)       mftplus
```

Inspect detailed health output:

```bash
docker inspect mftplus | jq '.[0].State.Health'
```

## Docker Compose Health Check

When using Docker Compose, health checks enable proper service dependencies:

```yaml
services:
  mftplus:
    image: mftplus:latest
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

  # Service that depends on MFTPlus being healthy
  dashboard:
    image: mftplus-dashboard:latest
    depends_on:
      mftplus:
        condition: service_healthy
```

## Log Access

### Docker Logs

View container logs:

```bash
docker logs mftplus
```

Follow logs in real-time:

```bash
docker logs -f mftplus
```

View last 100 lines:

```bash
docker logs --tail 100 mftplus
```

View logs with timestamps:

```bash
docker logs -t mftplus
```

### Docker Compose Logs

View logs for a specific service:

```bash
docker compose logs -f mftplus
```

View logs for all services:

```bash
docker compose logs -f
```

### Log Levels

MFTPlus uses standard log levels:
- `error` - Critical failures requiring attention
- `warn` - Warnings that don't stop operation
- `info` - Informational messages about normal operations
- `debug` - Detailed debugging information (in development mode)

### Interpreting Logs

Common log patterns:

```
[INFO] Starting MFTPlus server on port 3000
[INFO] Database connected successfully
[INFO] Agent abc123 connected from 192.168.1.100
[INFO] Transfer started: abc123 → /remote/path/file.txt
[INFO] Transfer completed: 1024 bytes in 1.2s
[WARN] High memory usage: 85%
[ERROR] Database connection failed: Connection timeout
```

## Key Metrics to Monitor

Track these metrics for optimal performance:

### System Health
- **Database latency** - Target < 50ms
- **Memory usage** - Warn at 75%, fail at 90%
- **Disk usage** - Warn at 80%, fail at 90%
- **Uptime** - Track for availability reporting

### Transfer Metrics
- **Active transfers** - Current concurrent transfers
- **Transfer success rate** - % of completed transfers
- **Transfer duration** - Time to complete transfers

### Agent Metrics
- **Active agents** - Number of connected agents
- **Agent status** - Online/offline/healthy

### Job Metrics
- **Pending jobs** - Number of enabled scheduled jobs
- **Job execution rate** - % of jobs running on schedule

## External Monitoring Tools

MFTPlus health endpoints work with standard monitoring tools:

### Prometheus

Use the `/api/health` endpoint as a scrape target:

```yaml
scrape_configs:
  - job_name: 'mftplus'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/health'
```

### Grafana

Create dashboards visualizing health metrics. Use Prometheus as a data source or query the health endpoint directly.

### Uptime Monitoring

Configure uptime monitoring services (UptimeRobot, Pingdom, etc.) to check:
- `https://your-mftplus-domain.com/api/health` - For full health checks
- `https://your-mftplus-domain.com/api/health/live` - For simple liveness

### Kubernetes Probes

For Kubernetes deployments:

```yaml
livenessProbe:
  httpGet:
    path: /api/health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5

startupProbe:
  httpGet:
    path: /api/health/live
    port: 3000
  initialDelaySeconds: 0
  periodSeconds: 5
  failureThreshold: 30
```

## Alerting Recommendations

Configure alerts for:

| Condition | Severity | Action |
|-----------|----------|--------|
| `/api/health` returns 503 | Critical | Immediate investigation |
| Database latency > 500ms | Warning | Check database performance |
| Memory usage > 85% | Warning | Monitor for memory leaks |
| Disk usage > 85% | Warning | Plan capacity expansion |
| No active agents for > 5min | Warning | Check agent connectivity |
| Transfer success rate < 95% | Warning | Review transfer failures |

## Troubleshooting

### Health Check Returns 503

1. Check database connectivity
2. Verify sufficient system resources
3. Review logs for specific failure reasons

### Container Shows Unhealthy

1. Inspect health check logs: `docker inspect mftplus | jq '.[0].State.Health.Log'`
2. Verify the service is running: `docker ps`
3. Check if the health check endpoint is accessible

### High Memory Usage

1. Review active transfers and agents
2. Check for memory leaks in long-running processes
3. Consider increasing container memory limits
