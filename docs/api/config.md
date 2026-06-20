---
title: Configuration Options - MFTPlus Documentation
description: "Configure MFTPlus agent behavior: server URLs, credentials, retry policies, logging levels, and security settings. Complete configuration reference."
---

# MFTPlus Configuration

MFTPlus configuration options for `mftctl` CLI.

## mftctl CLI Configuration

### Config File Location

- **Linux/macOS**: `~/.mftctl/config.json`
- **Windows**: `%USERPROFILE%\.mftctl\config.json`

### Config File Format

```json
{
  "server-url": "https://dashboard.mftplus.co.za",
  "api-key": "",
  "jwt": ""
}
```

## Configuration via CLI

Use `mftctl config` commands to manage settings:

```bash
# Initialize config file
mftctl config init

# Set server URL
mftctl config set server-url https://dashboard.mftplus.co.za

# View all config values
mftctl config list

# Get a specific value
mftctl config get server-url

# Export configuration
mftctl config export
```

### Configuration Keys

| Key | Description | Default |
|-----|-------------|---------|
| `server_url` | MFTPlus dashboard server URL | `http://localhost:3001` |
| `api_key` | Admin API key for authentication | (empty) |
| `jwt_token` | JWT token for session-based auth | (empty) |

### Configuration via CLI

```bash
# Server
MFTPLUS_SERVER_URL=https://dashboard.mftplus.co.za
MFTPLUS_API_KEY=pc-api-xxxxxxxxxxxxxxxx
```

## MFTPlus Agent Configuration

The agent runtime uses a separate configuration file in TOML format.

### Config File Location

## Next Steps

- [CLI Commands](./cli) - CLI reference for managing configuration
- [Plugin API](../plugins/api) - Plugin development
- [Installation](../guide/installation) - Setup guide for new deployments
