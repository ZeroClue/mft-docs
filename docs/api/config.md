---
title: Configuration Options - MFTPlus Documentation
description: "Configure MFTPlus: mftctl CLI settings in ~/.mftctl/config.json and agent runtime settings in ~/.config/mft-agent/config.toml."
---

# MFTPlus Configuration

There are two configuration surfaces:

- **`mftctl` CLI** — your saved dashboard connection and credentials
- **Agent runtime** — settings for the headless agent daemon (`mft-agent-cli`)

## mftctl CLI Configuration

### Config File Location

- **Linux/macOS**: `~/.mftctl/config.json`
- **Windows**: `%USERPROFILE%\.mftctl\config.json`

### Config File Format

```json
{
  "serverURL": "https://dashboard.mftplus.co.za",
  "apiKey": "",
  "jwtToken": ""
}
```

You normally don't edit this file by hand — use the commands below.

## Configuration via CLI

Use `mftctl config` commands to manage settings:

```bash
# Initialize an empty config file
mftctl config init

# Set server URL
mftctl config set server-url https://dashboard.mftplus.co.za

# View all config values (secrets are masked)
mftctl config list

# Get a specific value
mftctl config get server-url

# Remove a value
mftctl config unset server-url

# Export configuration
mftctl config export
```

::: tip Fastest path
Running `mftctl login <api-key> --server https://dashboard.mftplus.co.za` validates your key against the dashboard and writes both values to the config file in one step.
:::

### Configuration Keys

| Key | Description | Default |
|-----|-------------|---------|
| `server-url` | Dashboard/API base URL used by all mftctl commands | Falls back to `http://localhost:3001` when unset |
| `api-key` | API key for authentication (`sk_...`, created in the dashboard) | (empty) |
| `jwt` | JWT token for session-based auth | (empty) |

There are no environment-variable overrides — configure via these commands or pass flags per command (for example `mftctl connect --server <url> --token <key>`).

## Agent Runtime Configuration

The headless agent (`mft-agent-cli`) uses a separate TOML file.

### Config File Location

- **Linux**: `~/.config/mft-agent/config.toml`
- **macOS**: `~/Library/Application Support/mft-agent/config.toml`
- **Windows**: `%APPDATA%\mft-agent\config.toml`

### Key Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `dashboard_url` | Dashboard/API base URL the agent connects to | `https://dashboard.mftplus.co.za` |
| `api_key` | Dashboard API key (`sk_...`) | (empty) |
| `telemetry_enabled` | Send anonymous usage telemetry | `true` |
| `receiver_enabled` | Allow incoming transfers on this agent | `true` |
| `bandwidth_limit_mbps` | Cap transfer bandwidth | unlimited |

### Configure via CLI

```bash
# Point the agent at the dashboard and authenticate it
mft-agent-cli configure --dashboard-api-url https://dashboard.mftplus.co.za --dashboard-api-key sk_xxxxxxxxxxxxxxxx

# Check the running agent
mft-agent-cli status

# Run the agent engine in the foreground
mft-agent-cli start
```

For installation of the headless agent on servers, see [Install Agent](../guide/install-agent).

## Next Steps

- [CLI Commands](./cli) - CLI reference for managing configuration
- [Quick Start](../guide/quick-start) - Connect and send your first transfer
- [Plugin API](../plugins/api) - Plugin development
