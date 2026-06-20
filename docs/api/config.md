# Configuration

MFTPlus consists of two components with separate configuration files.

## mftctl CLI Configuration

### Config File Location

- **Linux/macOS**: `~/.mftctl/config.json`
- **Windows**: `%USERPROFILE%\.mftctl\config.json`

### Config File Format

The configuration file is in JSON format:

```json
{
  "server_url": "http://localhost:3001",
  "api_key": "",
  "jwt_token": ""
}
```

### Configuration Keys

| Key | Description | Default |
|-----|-------------|---------|
| `server_url` | MFTPlus dashboard server URL | `http://localhost:3001` |
| `api_key` | Admin API key for authentication | (empty) |
| `jwt_token` | JWT token for session-based auth | (empty) |

### Configuration via CLI

```bash
# Initialize config file
mftctl config init

# Set server URL
mftctl config set server-url https://dashboard.mftplus.co.za

# Set API key
mftctl config set api-key pc-api-xxxxxxxxxxxxxxxx

# View current configuration
mftctl config list

# Get a specific value
mftctl config get server-url

# Unset a value
mftctl config unset api-key

# Export configuration as JSON
mftctl config export
```

## MFTPlus Agent Configuration

The agent runtime uses a separate configuration file in TOML format.

### Config File Location

- **Linux/macOS**: `~/.config/mft-agent/config.toml`
- **Windows**: `%APPDATA%\mft-agent\config.toml`

### Config File Format

```toml
dashboard_url = "https://dashboard.mftplus.co.za"
api_key = "pc-api-xxxxxxxxxxxxxxxx"
agent_name = "production-server-01"
tags = ["production", "eu-west"]
enable_telemetry = true
```

### Configuration via Agent CLI

```bash
mft-agent-cli configure --dashboard-url https://dashboard.mftplus.co.za --api-key pc-api-xxxxxxxxxxxxxxxx
```

## Next Steps

- [CLI Commands](./cli) — CLI reference
- [Install mftctl](../guide/install-mftctl) — Install the CLI tool
- [Install Agent](../guide/install-agent) — Install the agent runtime
