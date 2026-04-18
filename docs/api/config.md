# Configuration

MFT configuration options and environment variables.

## Config File Location

Default configuration file location:

- **Linux/macOS**: `~/.config/mft/config.yaml`
- **Windows**: `%APPDATA%\mft\config.yaml`

## Configuration Structure

```yaml
# Server configuration
server:
  url: https://mft.example.com
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
  file: /var/log/mft/mft.log

# Plugins
plugins:
  enabled:
    - s3-storage
    - auth-oidc
  directory: /usr/local/lib/mft/plugins
```

## Environment Variables

Environment variables override config file settings:

```bash
# Server
MFT_SERVER_URL=https://mft.example.com
MFT_SERVER_TIMEOUT=30s

# Transfer
MFT_TRANSFER_TIMEOUT=5m
MFT_CHUNK_SIZE=10MB
MFT_RETRY_COUNT=3
MFT_COMPRESS=true

# Connection
MFT_CONNECTION_MODE=direct
MFT_PARALLEL=4

# Certificates
MFT_CA_URL=https://ca.example.com
MFT_AUTO_RENEW=true

# Logging
MFT_LOG_LEVEL=debug
MFT_LOG_FILE=/var/log/mft/mft.log
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
  url: https://mft.example.com
  timeout: 60s

transfer:
  timeout: 10m
  retry_count: 5
  compress: true

certificates:
  auto_renew: true

logging:
  level: info
  file: /var/log/mft/mft.log
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

- [CLI Commands](./cli) - CLI reference
- [Plugin API](../plugins/api) - Plugin development
