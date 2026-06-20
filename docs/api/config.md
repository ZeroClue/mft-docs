# Configuration

MFTPlus configuration options for `mftctl` CLI.

## Config File Location

Default configuration file location:

- **Linux/macOS**: `~/.mftctl/config.json`
- **Windows**: `%USERPROFILE%\.mftctl\config.json`

## Configuration Structure

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

## Environment Variables

Environment variables override config file settings:

```bash
# Server
MFTPLUS_SERVER_URL=https://dashboard.mftplus.co.za
MFTPLUS_API_KEY=pc-api-xxxxxxxxxxxxxxxx
```

## Configuration Priority

Settings are applied in this order (higher priority overrides lower):

1. Command-line flags
2. Environment variables
3. Config file
4. Default values

## Next Steps

- [CLI Commands](./cli) - CLI reference
- [Plugin API](../plugins/api) - Plugin development
