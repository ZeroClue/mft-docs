# Security and Authentication

Secure your MFTPlus deployment with API-key authentication and TLS encryption.

## Overview

MFTPlus uses API-key authentication for all dashboard and CLI access. Communication between agents and the dashboard is encrypted via TLS.

- **API-key authentication** — all agents and CLI sessions authenticate with a unique API key
- **TLS encryption** — all control-plane and data-transfer traffic is encrypted in transit
- **AES-256-GCM encryption** — transferred files are encrypted end-to-end
- **SHA-256 checksums** — every transferred file is checksummed for integrity verification
- **Audit logging** — all transfer activity is logged locally in SQLite

## Authentication

### API Keys

Every agent and CLI session authenticates with an API key. Keys are managed from the [MFTPlus Cloud Dashboard](https://dashboard.mftplus.co.za).

1. Navigate to **Settings** → **API Keys**
2. Click **Generate New API Key**
3. Copy the key immediately — it is shown only once

### CLI Authentication

```bash
# Login with an API key
mftctl login pc-api-xxxxxxxxxxxxxxxx

# Login with a custom server URL
mftctl login --server https://dashboard.mftplus.co.za

# Clear stored credentials
mftctl logout
```

Credentials are stored in `~/.mftctl/config.json` after login.

### Environment Variables

```bash
# Override config file settings
export MFTPLUS_SERVER_URL=https://dashboard.mftplus.co.za
export MFTPLUS_API_KEY=pc-api-xxxxxxxxxxxxxxxx
```

## Data Protection

### Encryption in Transit

All API and WebSocket traffic between agents, hubs, and the dashboard uses TLS. The MFTPlus cloud enforces TLS 1.2 or higher.

### Encryption at Rest

Transferred files are encrypted with AES-256-GCM. Encryption is configured per transfer:

```bash
mftctl transfers create \
  --agent ag-2x8mK9nR \
  --source ./sensitive-file.pdf \
  --dest sftp://partner.example.com/incoming \
  --encryption aes256
```

Supported algorithms:
- `aes256` — AES-256-GCM (default)
- `chacha20` — ChaCha20-Poly1305

### Checksum Verification

Every transfer includes SHA-256 checksum verification. Checksums are computed for each chunk and verified on receipt.

## Audit Logging

All transfer activity is logged locally on the agent in SQLite format:

- **Linux/macOS**: `~/.config/mft-agent/transfers.db`
- **Windows**: `%APPDATA%\mft-agent\transfers.db`

Audit logs can be queried via the dashboard or the CLI:

```bash
# List audit log entries
mftctl audit log list

# Verify audit chain integrity
mftctl audit verify
```

## Best Practices

- Rotate API keys every 90 days
- Store API keys in environment variables or a secrets manager
- Never commit API keys to version control
- Use separate API keys for different environments (dev, staging, production)
- Monitor audit logs for suspicious activity
- Run `mftctl logout` before handing over a machine

## Next Steps

- [Architecture](./architecture) — Understanding MFTPlus security model
- [Configuration](../api/config) — Complete configuration reference
- [CLI Reference](../api/cli) — Security-related commands
