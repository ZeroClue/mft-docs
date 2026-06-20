# Hub Deployment Guide

> **The hub is an optional add-on for licensed tiers (Enterprise).** Most users manage agents directly through the [MFTPlus Cloud Dashboard](https://dashboard.mftplus.co.za) without deploying a hub. See [pricing](https://mftplus.co.za/pricing) for tier details.

Deploy an MFTPlus Hub — a local edge proxy that extends the MFTPlus cloud
into your on-premises environment.

> **Phase:** Phase 1 (MVP) — Hub skeleton, phone-home registration, deploy keys.
> See the [Architecture](./architecture) overview for the full design.

---

## Overview

A Hub is a Docker container that runs on your infrastructure and connects
back to the MFTPlus cloud. Agents in your local network connect to the Hub
instead of connecting directly to the cloud. The Hub proxies all traffic
transparently — agents don't need code changes.

```
┌─────────────────────┐       ┌──────────────┐      ┌──────────────────┐
│  Agent (local)      │──────▶│  Hub (your   │─────▶│  MFTPlus Cloud   │
│  mftctl send ...    │       │  network)    │      │  api.mftplus.co.za│
└─────────────────────┘       └──────────────┘      └──────────────────┘
```

### When to use a Hub

- **On-premises compliance** — data never leaves your network for local
  agent-to-agent transfers
- **Air-gapped or restricted environments** — agents can't reach the public
  internet directly
- **Hub-and-spoke topology** — multiple offices, each with its own local Hub,
  managed from a single cloud dashboard

---

## Prerequisites

### Docker

| Requirement | Minimum     | Recommended |
|-------------|-------------|-------------|
| Docker Engine | 24.x     | 26.x        |
| Docker Compose | v2     | v2.30+      |

Check your installed versions:

```bash
docker --version
# Docker version 26.1.4, build 5650f9b

docker compose version
# Docker Compose version v2.30.3
```

### Network

| Port | Protocol | Direction | Purpose |
|------|----------|-----------|---------|
| 3002 | TCP      | Inbound   | Hub HTTP API — agent connections |
| 443  | TCP      | Outbound  | Phone-home to MFTPlus cloud |
| 443  | TCP      | Outbound  | WebSocket relay to MFTPlus cloud |

**Firewall rules** — allow inbound traffic on port `3002` from your agent
subnet(s) to the Hub host.

**Outbound access** — the Hub must reach `api.mftplus.co.za` on port 443
(HTTPS + WSS). If your network uses an outbound proxy, configure Docker
daemon proxy settings.

### DNS

The Hub host must resolve `api.mftplus.co.za` to the MFTPlus cloud API.
Verify before deploying:

```bash
nslookup api.mftplus.co.za
dig +short api.mftplus.co.za
```

If your network uses internal DNS, add an A/AAAA record or CNAME for
`api.mftplus.co.za` pointing to the public MFTPlus cloud endpoint.

### Disk

| Resource | Minimum  | Recommended |
|----------|----------|-------------|
| Free disk | 1 GB    | 10 GB       |
| RAM       | 256 MB  | 512 MB      |
| CPU       | 1 core  | 2 cores     |

The Hub stores an encrypted auth cache and an offline queue in SQLite.
Disk requirements scale with agent count (see [SQLite scale limits](#sqlite-scale-limits)).

---

## Step 1: Generate a Deploy Key

A deploy key is a cryptographic credential that authorises a Hub to
register with your MFTPlus organisation.

1. Log in to the [MFTPlus Cloud Dashboard](https://dashboard.mftplus.co.za).
2. Navigate to **Hubs** → **Deploy Keys**.
3. Click **Generate Deploy Key**.
4. Give the key a label (e.g. `jhb-hub-prod`).
5. Copy the generated key immediately — it is shown once and cannot be
   retrieved later.

::: warning
Treat deploy keys like passwords. If compromised, revoke the key from the
dashboard and generate a new one.
:::

---

## Step 2: Configure Environment Variables

The Hub is configured through the following environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CLOUD_API_URL` | Yes | — | MFTPlus cloud API base URL |
| `HUB_REGISTRATION_KEY` | Yes | — | Deploy key generated in Step 1 |
| `HUB_PORT` | No | `3002` | Port the Hub listens on |
| `HUB_VERSION` | No | `0.1.0` | Hub version identifier |
| `HUB_LICENSE_KEY` | No | — | Enterprise license key (if applicable) |
| `NODE_ENV` | No | `development` | Set to `production` for production deployments |
| `PHONE_HOME_INTERVAL_HOURS` | No | `24` | Hours between cloud re-validation |
| `DIAGNOSE_DISK_PATH` | No | `/` | Mount path for disk diagnostics |

### `CLOUD_API_URL`

The MFTPlus cloud API endpoint for phone-home registration and license
validation.

```
https://api.mftplus.co.za/api
```

For staging or custom deployments, use the appropriate URL.

### `HUB_REGISTRATION_KEY`

The deploy key you generated in Step 1. This is the Hub's identity — it
proves to the cloud that the Hub belongs to your organisation.

### `HUB_PORT`

The TCP port the Hub's HTTP API listens on. Agents connect to this port
via their `server_url` configuration. The default `3002` is suitable for
most deployments.

### `HUB_LICENSE_KEY`

Your MFTPlus Enterprise license key. If you have one, the Hub validates it
during phone-home registration. Without a license key, the Hub operates in
evaluation mode with standard limits.

---

## Step 3: Run the Hub Container

### Using `docker run`

```bash
docker run -d \
  --name mftplus-hub \
  --restart unless-stopped \
  -p 3002:3002 \
  -e CLOUD_API_URL=https://api.mftplus.co.za/api \
  -e HUB_REGISTRATION_KEY=your-deploy-key-here \
  -e HUB_PORT=3002 \
  -e NODE_ENV=production \
  -v mftplus-hub-data:/app/data \
  ghcr.io/zeroclue/mftplus-hub:latest
```

### Using Docker Compose

Create a `docker-compose.yml`:

```yaml
version: "3.9"

services:
  hub:
    image: ghcr.io/zeroclue/mftplus-hub:latest
    container_name: mftplus-hub
    restart: unless-stopped
    ports:
      - "3002:3002"
    environment:
      CLOUD_API_URL: https://api.mftplus.co.za/api
      HUB_REGISTRATION_KEY: ${HUB_REGISTRATION_KEY}
      HUB_PORT: "3002"
      NODE_ENV: production
      PHONE_HOME_INTERVAL_HOURS: "24"
    volumes:
      - mftplus-hub-data:/app/data
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3002/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

volumes:
  mftplus-hub-data:
```

Create a `.env` file in the same directory (do not commit it):

```bash
HUB_REGISTRATION_KEY=your-deploy-key-here
```

Then start the Hub:

```bash
docker compose up -d
```

---

## Step 4: Point Agents at the Hub

Change each agent's `server_url` configuration to point at your Hub
instead of the cloud:

```yaml
# ~/.config/mft-agent/config.yaml
server:
  url: http://hub.yourcompany.com:3002
  timeout: 30s
```

No other agent configuration changes are needed — the Hub proxies all
API calls and WebSocket connections transparently.

---

## Pre-Flight Checklist

Before declaring the deployment complete, verify each item:

### Docker & System

- [ ] Docker Engine 24.x or later is installed
- [ ] Docker Compose v2 is available
- [ ] Container restarts on host reboot (`--restart unless-stopped`)
- [ ] Host has ≥1 GB free disk
- [ ] Host has ≥256 MB RAM available

### Network

- [ ] Port `3002` is open inbound from all agent subnets
- [ ] Outbound HTTPS (port 443) to `api.mftplus.co.za` is allowed
- [ ] Outbound WebSocket (port 443) to `api.mftplus.co.za` is allowed
- [ ] No intermediate proxy strips TLS or WebSocket upgrade headers
- [ ] Firewall rules are persistent across host reboots

### DNS

- [ ] Hub host can resolve `api.mftplus.co.za`
- [ ] Agents can resolve the Hub hostname (if using DNS, not direct IP)
- [ ] DNS resolution works from inside the container

### Configuration

- [ ] Deploy key has been generated from the cloud dashboard
- [ ] `CLOUD_API_URL` is set to `https://api.mftplus.co.za/api`
- [ ] `HUB_REGISTRATION_KEY` is set to the generated deploy key
- [ ] `NODE_ENV` is set to `production`
- [ ] `.env` file (if used) has restricted permissions: `chmod 600`

---

## Verification Steps

### 1. Check Container Status

```bash
docker ps --filter name=mftplus-hub

# Expected output: container is "Up" and healthy
# CONTAINER ID   IMAGE                               STATUS                   ...
# abc12345       ghcr.io/zeroclue/mftplus-hub:latest  Up 2 minutes (healthy)  ...
```

### 2. Verify Health Endpoint

```bash
curl -s http://localhost:3002/health | jq .
```

**Expected response:**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime": 145.23
}
```

### 3. Run Self-Diagnostics

```bash
curl -s http://localhost:3002/hub/diagnose | jq .
```

**Expected response (healthy):**
```json
{
  "timestamp": "2026-05-31T12:00:00.000Z",
  "hostname": "hub-server-01",
  "platform": "linux",
  "uptimeHours": 0.04,
  "config": {
    "hubVersion": "0.1.0",
    "port": 3002,
    "nodeEnv": "production",
    "cloudApiConfigured": true,
    "registrationKeyConfigured": true,
    "licenseKeyConfigured": false,
    "phoneHomeIntervalHours": 24
  },
  "connectivity": {
    "cloudApiReachable": true,
    "cloudApiUrl": "https://api.mftplus.co.za/api",
    "latencyMs": 42
  },
  "disk": {
    "path": "/",
    "totalGb": 40.00,
    "freeGb": 22.50,
    "usedGb": 17.50,
    "usedPercent": 43.8,
    "healthy": true
  },
  "dns": [
    {
      "hostname": "google.com",
      "resolved": ["142.250.80.46"],
      "healthy": true
    },
    {
      "hostname": "api.mftplus.co.za",
      "resolved": ["203.0.113.10"],
      "healthy": true
    }
  ],
  "phoneHome": {
    "registered": true,
    "hubId": "hub_abc123def456",
    "lastRegistered": "2026-05-31T12:00:00.000Z",
    "lastValidated": null,
    "validationError": null
  },
  "healthy": true,
  "issues": []
}
```

**If `healthy` is `false`**, check the `issues` array for specific
failures. Common issues:

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| `Cloud API URL is not configured` | Missing `CLOUD_API_URL` | Set the env var |
| `Registration key is not configured` | Missing `HUB_REGISTRATION_KEY` | Set the env var |
| `Cloud API unreachable` | Network / firewall blocking | Check outbound port 443 |
| `DNS resolution failed for api.mftplus.co.za` | DNS not configured | Check internal DNS |

### 4. Confirm Registration in Cloud Dashboard

1. Log in to the [MFTPlus Cloud Dashboard](https://dashboard.mftplus.co.za).
2. Navigate to **Hubs**.
3. Your Hub should appear in the list with **Status: Online**.
4. Click the Hub to see details: version, hostname, last seen timestamp.

> Registration happens automatically on container start via the phone-home
> protocol. If the Hub doesn't appear within 30 seconds of starting the
> container, run the diagnostics endpoint (step 3) and check the issues.

### 5. Test an Agent Connection

On a machine in the same network as the Hub, configure an agent to point
at the Hub and send a test transfer:

```bash
mftctl transfers create \
  --agent ag-2x8mK9nR \
  --source ./test-file.txt \
  --dest sftp://recipient@example.com/incoming
```

Verify the agent is connected:

```bash
mftctl agents list
```

---

## Logs and Monitoring

View live Hub logs:

```bash
docker logs -f mftplus-hub
```

Sample log output from a healthy startup:

```
[Hub] Server running on port 3002 (production)
[Hub] Version: 0.1.0
[Hub] Cloud API: https://api.mftplus.co.za/api
[PhoneHome] Registering with cloud...
[PhoneHome] Registered successfully — hubId: hub_abc123def456
[PhoneHome] Periodic re-validation every 24h
```

---

## Docker Image Reference

| Tag        | Description                        |
|------------|------------------------------------|
| `latest`   | Latest stable release              |
| `0.1.0`    | Specific version                   |

Images are hosted on GitHub Container Registry:

```
ghcr.io/zeroclue/mftplus-hub:latest
```

---

## SQLite Scale Limits

The Hub uses SQLite for its auth cache and offline queue. These limits
are tested and documented:

| Metric | Supported | Tested maximum |
|--------|-----------|----------------|
| Agents per Hub | 10–50     | 100            |
| Writes/second  | ~200      | WAL mode + connection pooling |

For deployments exceeding 100 agents, a PostgreSQL backend is planned
(enterprise tier).

---

## Container Specifications

The Hub Docker image is built on `gcr.io/distroless/nodejs20-debian12`
(multi-stage build) for a minimal attack surface:

- **Base:** distroless Node.js 20 (Debian 12)
- **User:** non-root (container default)
- **Health check:** HTTP `GET /health` every 30s
- **Signal handling:** Graceful shutdown on `SIGTERM` / `SIGINT`

---

## Upgrading

1. Pull the latest image:
   ```bash
   docker pull ghcr.io/zeroclue/mftplus-hub:latest
   ```

2. Restart the container:
   ```bash
   docker compose up -d --pull always
   ```

3. Verify the new version:
   ```bash
   curl -s http://localhost:3002/health | jq .version
   ```

The Hub's phone-home protocol includes version reporting in every
registration request. The cloud dashboard displays the Hub version
and warns if a Hub is more than two versions behind.

---

## Troubleshooting

### Hub won't start

```bash
# Check container logs
docker logs mftplus-hub

# Verify env vars are set
docker inspect mftplus-hub | jq '.[0].Config.Env'
```

### Hub starts but doesn't appear in dashboard

1. Run diagnostics: `curl http://localhost:3002/hub/diagnose`
2. Check the `connectivity` and `phoneHome` sections
3. Verify `CLOUD_API_URL` is correct
4. Verify the deploy key was not revoked

### Agents can't connect

1. Confirm the Hub is running: `docker ps`
2. Check the Hub health endpoint
3. Verify port `3002` is reachable from the agent machine:
   ```bash
   curl -v http://hub.yourcompany.com:3002/health
   ```
4. Check firewall rules on the Hub host

---

## Next Steps

- [Architecture](./architecture) — Understand the full Hub and Spoke design
- [Transfer Protocol](./protocol) — Deep dive into the protocol
- [Configuration](../api/config) — Agent and Hub configuration reference

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
- **Cloud Dashboard**: [dashboard.mftplus.co.za](https://dashboard.mftplus.co.za)
