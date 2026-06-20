# Architecture

Understanding MFTPlus architecture will help you make the most of its capabilities.

## System Components

### mftctl CLI

The `mftctl` command-line tool is the primary interface for interacting with the MFTPlus platform:

```bash
mftctl agents list
mftctl transfers create --agent <id> --source /path --dest /path
mftctl audit verify
```

### MFTPlus Dashboard

The web dashboard provides:
- Agent registration and management
- Transfer and job configuration
- Audit log viewing and export
- REST API for programmatic access

### MFTPlus Agent

A lightweight agent process runs on managed machines:
- Executes file transfers
- Runs scheduled jobs
- Reports status to the dashboard
- Supports protocol bridges and custom plugins

### Plugin System

Extensible architecture supporting:
- Authentication providers (OIDC, LDAP)
- Storage backends (S3, GCS, Azure)
- Transfer protocols (SFTP, FTP, FTPS)
- Monitoring integrations (Prometheus, Datadog)

## Transfer Flow

```
┌──────────┐    CLI/API     ┌──────────┐   WebSocket   ┌──────────┐
│  mftctl  │ ──────────────▶│ Dashboard│──────────────▶│  Agent   │
│   CLI    │ ◀──────────────│ (REST)   │◀──────────────│ (Worker) │
└──────────┘                └──────────┘               └──────────┘
                                │                           │
                                ▼                           ▼
                          ┌──────────┐               ┌──────────┐
                          │ Database │               │  Target  │
                          │(Postgres)│               │  Server  │
                          └──────────┘               └──────────┘
```

## Data Flow

1. **Initiation**: CLI or dashboard creates a transfer request
2. **Dispatch**: Dashboard assigns the transfer to a registered agent
3. **Execution**: Agent connects to the source/destination and performs the transfer
4. **Reporting**: Agent sends status updates and completion reports
5. **Audit**: All events are cryptographically chained in the audit log

## Security Model

### Authentication

- API key authentication for CLI access
- Agent tokens for machine-to-machine communication
- JWT-based session management

### Encryption

- TLS for all API and WebSocket communications
- AES-256-GCM or ChaCha20 for file content encryption
- End-to-end encryption options for sensitive transfers

### Audit

All operations are logged to an immutable audit trail:
- Cryptographically chained entries
- Integrity verification via `mftctl audit verify`
- Exportable for compliance reporting (CSV, PDF)

## Next Steps

- [CLI Commands](../api/cli) - Command reference
- [Transfer Protocol](./protocol) - Deep dive into the protocol
