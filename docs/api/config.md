---
title: Configuration Options - MFTPlus Documentation
description: "Configure MFTPlus agent behavior: server URLs, credentials, retry policies, logging levels, and security settings. Complete configuration reference."
---

# MFTPlus Configuration

MFTPlus configuration options and environment variables.

## Config File Location

Default configuration file location:

- **Linux/macOS**: `~/.config/mftplus/config.yaml`
- **Windows**: `%APPDATA%\mftplus\config.yaml`

## Configuration Structure

```yaml
# Dashboard server configuration
server:
  url: https://dashboard.mftplus.co.za
  timeout: 30s

# Transfer settings
transfer:
  timeout: 5m
  chunk_size: 10MB
  retry_count: 3
  compress: false
  protocol: auto

# Connection settings
connection:
  mode: auto
  parallel: 2
  keepalive: 30s

# Certificate settings
certificates:
  ca_url: https://ca.example.com
  auto_renew: true
  validity: 8760h

# Logging
logging:
  level: info
  format: text
  file: /var/log/mftplus/mftplus.log

# Plugins
plugins:
  enabled:
    - s3-storage
    - auth-oidc
  directory: /usr/local/lib/mftplus/plugins
```

## Environment Variables

Environment variables override config file settings:

```bash
# Server
MFTPLUS_SERVER_URL=https://dashboard.mftplus.co.za
MFTPLUS_SERVER_TIMEOUT=30s

# Transfer
MFTPLUS_TRANSFER_TIMEOUT=5m
MFTPLUS_CHUNK_SIZE=10MB
MFTPLUS_RETRY_COUNT=3
MFTPLUS_COMPRESS=true

# Connection
MFTPLUS_CONNECTION_MODE=direct
MFTPLUS_PARALLEL=4

# Certificates
MFTPLUS_CA_URL=https://ca.example.com
MFTPLUS_AUTO_RENEW=true

# Logging
MFTPLUS_LOG_LEVEL=debug
MFTPLUS_LOG_FILE=/var/log/mftplus/mftplus.log
```

## Configuration Priority

Settings are applied in this order (higher priority overrides lower):

1. Command-line flags
2. Environment variables
3. Config file
4. Default values

## Common Configurations

### Development Environment

```yaml
server:
  url: http://localhost:8080

transfer:
  timeout: 30s
  retry_count: 1

logging:
  level: debug
```

### Production Environment

```yaml
server:
  url: https://dashboard.mftplus.co.za
  timeout: 60s

transfer:
  timeout: 10m
  retry_count: 5
  compress: true

certificates:
  auto_renew: true

logging:
  level: info
  file: /var/log/mftplus/mftplus.log
```

### High-Latency Network

```yaml
transfer:
  timeout: 30m
  chunk_size: 5MB
  retry_count: 10

connection:
  parallel: 4
  keepalive: 60s
```

## Next Steps

- [CLI Commands](./cli) - CLI reference for managing configuration
- [Plugin API](../plugins/api) - Plugin development
- [Installation](../guide/installation) - Setup guide for new deployments
