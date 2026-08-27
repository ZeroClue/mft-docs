---
title: CLI Commands (mftctl) - Complete Reference | MFTPlus
description: "Complete reference for `mftctl` - the MFTPlus command-line interface. All commands for job management, configuration, and monitoring file transfers."
---

# mftctl CLI Commands

Complete reference for `mftctl` command-line interface.

## Global Options

```bash
mftctl [global-options] <command> [command-options]

Global Options:
  -d, --debug    Enable verbose debug logging
  -h, --help     Show help
  -v, --version  Show version information
```

## Authentication

### login

Login to the MFT dashboard using your admin API key.
This will store your credentials locally for future commands.

```bash
mftctl login [api-key] [flags]

Flags:
  -s, --server string   Dashboard server URL

Examples:
  mftctl login
  mftctl login pc-api-xxxxxxxxxxxxxxxx
  mftctl login --server https://dashboard.mftplus.co.za
```

### logout

Clear stored credentials.

```bash
mftctl logout [flags]
```

## Agent Management

### agents list

List all registered agents.

```bash
mftctl agents list [flags]

Flags:
  -h, --help  help for list
```

### agents show

Show detailed agent information.

```bash
mftctl agents show [agent-id] [flags]

Flags:
  -h, --help  help for show

Examples:
  mftctl agents show ag-2x8mK9nR
```

### agents transfers

List transfers for a specific agent.

```bash
mftctl agents transfers [agent-id] [flags]

Flags:
  -h, --help  help for transfers

Examples:
  mftctl agents transfers ag-2x8mK9nR
```

### agents jobs

List jobs for a specific agent.

```bash
mftctl agents jobs [agent-id] [flags]

Flags:
  -h, --help  help for jobs

Examples:
  mftctl agents jobs ag-2x8mK9nR
```

## Audit Logs

Inspect the cryptographic audit log chain. Each entry's hash includes the
previous entry's hash (SHA-256), forming a tamper-evident chain.

All `audit` commands support these global flags:

```bash
Global Flags:
  -k, --api-key string   API key (overrides logged-in config)
  -j, --json             Output in JSON format
      --server string    Server URL (overrides logged-in config)
```

### audit verify

Verify the SHA-256 hash chain integrity of the audit log.
Walks all entries and recomputes hashes to detect tampering.
Exits with code 0 if the chain is valid, 1 if broken.

```bash
mftctl audit verify [flags]

Examples:
  mftctl audit verify
  mftctl audit verify --json
```

### audit chain status

Show the current status of the audit log hash chain:
total entries, last sequence number, and last hash.

```bash
mftctl audit chain status [flags]

Example:
  mftctl audit chain status
```

### audit chain export

Export audit logs in CSV or PDF format.

```bash
mftctl audit chain export [flags]

Flags:
  -f, --format string   Export format: csv or pdf (default "csv")

Examples:
  mftctl audit chain export
  mftctl audit chain export --format pdf
```

### audit entry get

Get a single audit log entry by ID with full details,
including cryptographic hashes for manual verification.

```bash
mftctl audit entry get [entry-id] [flags]

Example:
  mftctl audit entry get aud-abc123
```

### audit log list

List audit log entries with optional filters.

```bash
mftctl audit log list [flags]

Flags:
  -c, --category string   Filter by category (authentication, authorization,
                          admin, agent, transfer, job, system)
      --customer string   Filter by customer ID (admin only)
  -l, --limit int         Max results (max 1000) (default 100)
  -o, --offset int        Pagination offset
  -s, --severity string   Filter by severity (info, warning, error, critical)

Examples:
  mftctl audit log list --category transfer --severity error
  mftctl audit log list --limit 50 --offset 100
```

## Transfer Management

### transfers list

List all transfers.

```bash
mftctl transfers list [flags]

Flags:
  -a, --agent string    Filter by agent ID
  -h, --help            help for list
  -l, --limit int       Results per page (default 20)
  -p, --page int        Page number (default 1)
  -S, --status string   Filter by status
```

### transfers show / status

Show transfer details.

```bash
mftctl transfers show [transfer-id] [flags]
mftctl transfers status [transfer-id] [flags]

Flags:
  -h, --help  help for show

Examples:
  mftctl transfers show tr-abc123
  mftctl transfers status tr-abc123
```

### transfers create

Create a new transfer.

Note: This is primarily used by agents. When creating a transfer manually,
you need to specify an agent that will execute the transfer.

```bash
mftctl transfers create [flags]

Flags:
  --agent string             Agent ID (required)
  --compress string          Compression algorithm (gzip|zstd|none)
  --compress-level int       Compression level (algorithm-specific)
  --dest string              Destination path (required)
  --encryption string        Encryption algorithm (aes256|chacha20)
  --on-failure-hook string   On-failure webhook URL
  --post-hook string         Post-transfer webhook URL
  --pre-hook string          Pre-transfer webhook URL
  --protocol string          Protocol (default: local)
  --retention string         Retention period (e.g., 30d, 7y). Empty = keep forever
  --source string            Source path/URL (required)

Examples:
  mftctl transfers create --agent ag-2x8mK9nR \
    --source /var/log/app/*.log \
    --dest sftp://backup.example.com/logs \
    --protocol sftp
```

### transfers update

Update notification settings for a transfer.

Configure email notifications for transfer completion or failure.

```bash
mftctl transfers update [transfer-id] [flags]

Flags:
  --on-failure string   Email address for failure notifications
  --on-success string   Email address for success notifications

Examples:
  mftctl transfers update tr-abc123 --on-failure ops@example.com
```

### transfers logs

Show logs for a specific transfer.

Note: Transfer logs are currently stored on the agent. This feature will
be available when the agent implements log streaming.

```bash
mftctl transfers logs [transfer-id] [flags]

Examples:
  mftctl transfers logs tr-abc123
```

### send

Send a file to a remote destination via an MFT agent.

Reads file content from a local path or from stdin (with --stdin) and
creates a transfer to the specified destination.

```bash
mftctl send [file] [flags]

Flags:
  --agent string        Agent ID (required)
  --encryption string   Encryption algorithm (aes256|chacha20)
  --stdin               Read file content from stdin
  --to string           Destination path/URL (required)

Examples:
  mftctl send ./report.pdf --agent ag-2x8mK9nR --to sftp://partner.example.com/incoming
  cat data.csv | mftctl send --agent ag-2x8mK9nR --to sftp://partner.example.com/incoming --stdin
```

## Trigger Management

Manage file watch triggers for event-driven automated transfers.

### trigger list

List all configured triggers.

```bash
mftctl trigger list [flags]

Flags:
  --json   Output in JSON format

Global Flags:
  -k, --api-key string   API key (overrides logged-in config)
  -h, --help             help for trigger
      --server string    Server URL (overrides logged-in config)
```

### trigger show

Show detailed trigger information and firing history.

```bash
mftctl trigger show [trigger-id] [flags]

Global Flags:
  -k, --api-key string   API key (overrides logged-in config)
  -h, --help             help for trigger
      --server string    Server URL (overrides logged-in config)

Examples:
  mftctl trigger show tr-abc123
```

### trigger create

Create a new file watch trigger.

```bash
mftctl trigger create [flags]

Flags:
  --agent string      Agent ID (required)
  --dest string       Destination path template (required)
  --glob string       Glob pattern for files to match (default "*")
  --name string       Trigger name
  --protocol string   Protocol (local/sftp) (default "local")
  --recursive         Watch subdirectories recursively
  --watch string      Path to watch (required)

Global Flags:
  -k, --api-key string   API key (overrides logged-in config)
  -h, --help             help for trigger
      --server string    Server URL (overrides logged-in config)

Examples:
  mftctl trigger create \
    --watch /data/incoming \
    --glob "*.csv" \
    --dest "sftp://partner.inbox.com/{{filename}}" \
    --agent ag-2x8mK9nR \
    --name csv-ingest
```

### trigger delete

Delete a trigger.

```bash
mftctl trigger delete [trigger-id] [flags]

Global Flags:
  -k, --api-key string   API key (overrides logged-in config)
  -h, --help             help for trigger
      --server string    Server URL (overrides logged-in config)

Examples:
  mftctl trigger delete tr-abc123
```

## Job Management

### jobs list

List all scheduled jobs.

```bash
mftctl jobs list [flags]

Flags:
  -h, --help  help for list
```

### jobs show

Show job details.

```bash
mftctl jobs show [job-id] [flags]

Flags:
  -h, --help  help for show

Examples:
  mftctl jobs show job-abc123
```

### jobs create

Create a new scheduled job.

```bash
mftctl jobs create [flags]

Flags:
  --agent string       Agent ID (required)
  --dest string        Destination path (required unless --template)
  --direction string   Direction (push/pull, default: push)
  --enabled            Enable job (default: true)
  --name string        Job name (required)
  --protocol string    Protocol (default: local)
  --schedule string    Cron schedule (required)
  --source string      Source path (required unless --template)
  --template string    Create from template ID
  --var stringArray    Template variables (key=value, can be used multiple times)

Examples:
  mftctl jobs create \
    --agent ag-2x8mK9nR \
    --name daily-sftp-sync \
    --source /var/log/app/*.log \
    --dest sftp://backup.example.com/logs \
    --schedule "0 2 * * *" \
    --protocol sftp
```

### jobs delete

Delete a scheduled job.

```bash
mftctl jobs delete [job-id] [flags]

Examples:
  mftctl jobs delete job-abc123
```

## Connection Management

### connections list

List all connection profiles.

```bash
mftctl connections list [flags]

Flags:
  -h, --help          help for list
      --format string Output format (table, json) (default "table")
```

### connections show

Show connection profile details.

```bash
mftctl connections show [name] [flags]

Flags:
  -h, --help  help for show
```

### connections create

Create a new connection profile.

```bash
mftctl connections create [flags]

Flags:
  --access-key string     Access key (for S3/Azure/GCS/Glacier)
  --bucket string         Bucket/container/vault name (for S3/Azure/GCS/Glacier)
  --description string    Description
  --host string           Server hostname or IP
  --name string           Profile name (required)
  --password string       Password
  --path string           Default path
  --port int              Server port (default: 22 for SFTP, 21 for FTP)
  --region string         Region (for S3/Azure/GCS/Glacier)
  --secret-key string     Secret key (for S3/Azure/GCS/Glacier)
  --ssh-key string        SSH private key content
  --ssh-key-path string   Path to SSH private key file
  --type string           Connection type (required: sftp, ftp, ftps, local, s3, azure, gcs, glacier)
  --username string       Username
```

### connections update

Update a connection profile.

```bash
mftctl connections update [name] [flags]

Flags:
  --access-key string     Access key
  --bucket string         Bucket/container name
  --description string    Description
  --host string           Server hostname or IP
  --password string       Password
  --path string           Default path
  --port int              Server port
  --region string         Region
  --secret-key string     Secret key
  --ssh-key string        SSH private key content
  --ssh-key-path string   Path to SSH private key file
  --type string           Connection type
  --username string       Username
```

### connections delete

Delete a connection profile.

```bash
mftctl connections delete [name] [flags]
```

### connections test

Test connectivity to a connection profile.

This will attempt to connect to the remote system using the saved credentials
and report whether the connection is successful.

```bash
mftctl connections test [name] [flags]
```

## Bridge Management

### bridge list

List all bridge configurations.

```bash
mftctl bridge list [flags]

Flags:
  -h, --help          help for list
      --format string Output format (table, json) (default "table")
```

### bridge show

Show bridge configuration details.

```bash
mftctl bridge show [name] [flags]

Flags:
  -h, --help  help for show
```

### bridge create

Create a new bridge configuration.

```bash
mftctl bridge create [flags]

Flags:
  --description string        Description
  --dest string               Destination connection name (required)
  --name string               Bridge name (required)
  --options string            Additional options as JSON
  --protocol-mapping string   Protocol mapping (e.g., sftp->s3, auto)
  --source string             Source connection name (required)
```

### bridge delete

Delete a bridge configuration.

```bash
mftctl bridge delete [name] [flags]
```

## Template Management

### templates list

List all transfer templates.

```bash
mftctl templates list [flags]
```

### templates show

Show template details.

```bash
mftctl templates show [template-id] [flags]
```

### templates create

Create a new transfer template.

```bash
mftctl templates create [flags]

Flags:
  --dest string        Destination path with variable placeholders (required)
  --direction string   Direction (push/pull, default: push)
  --name string        Template name (required)
  --protocol string    Protocol (default: local)
  --source string      Source path with variable placeholders (required)
  --variables string   Variables as JSON array
```

### templates delete

Delete a template.

```bash
mftctl templates delete <template-id>
```

## Plugin Management

### plugin search

Search for available plugins in the registry.

```bash
mftctl plugin search [query] [flags]

Flags:
  -o, --output string   Output format (pretty, json) (default "pretty")
  -v, --verbose         Verbose output

Examples:
  mftctl plugin search s3
  mftctl plugin search auth
```

### plugin info

Get detailed information about a plugin.

```bash
mftctl plugin info <name> [flags]

Examples:
  mftctl plugin info s3-storage
```

### plugin install

Install a plugin from the registry.

```bash
mftctl plugin install <name> [flags]

Flags:
  -f, --force           Overwrite if plugin already exists
      --no-verify       Skip signature verification
  -t, --target string   Target directory for installation

Examples:
  mftctl plugin install s3-storage
  mftctl plugin install auth-oidc
```

### plugin list

List installed plugins with their versions and status.

```bash
mftctl plugin list [flags]

Flags:
  -v, --verbose   Show detailed information
```

### plugin remove

Remove an installed plugin from the system.

```bash
mftctl plugin remove <name> [flags]

Flags:
  -f, --force   Remove without confirmation

Examples:
  mftctl plugin remove s3-storage
```

### plugin verify

Verify the cryptographic signature and checksum of an installed plugin.

This command checks:
- The plugin's digital signature is valid
- The plugin's checksum matches the expected value
- The plugin has not been modified since installation

```bash
mftctl plugin verify <name> [flags]

Examples:
  mftctl plugin verify s3-storage
```

## Configuration Management

### config init

Initialize mftctl configuration file.

```bash
mftctl config init

Creates: ~/.mftctl/config.json
```

### config get

Get a configuration value.

```bash
mftctl config get <key>

Valid keys: server-url, api-key, jwt

Examples:
  mftctl config get server-url
```

### config set

Set a configuration value.

```bash
mftctl config set <key> <value>

Examples:
  mftctl config set server-url https://dashboard.mftplus.co.za
```

### config list

List all configuration values.

```bash
mftctl config list
```

### config unset

Unset a configuration value.

```bash
mftctl config unset <key>

Examples:
  mftctl config unset api-key
```

### config export

Export configuration as JSON.

```bash
mftctl config export
```

## Hub Connection

### connect

Establish a persistent WebSocket connection to the MFTPlus hub or cloud relay.

The connect command acts as an MFTPlus agent, maintaining a real-time
WebSocket connection to either:
- The local hub relay (/hub/ws), which forwards to the cloud
- The cloud agent endpoint (/api/ws/agent), connecting directly

On disconnect it automatically reconnects with exponential backoff
(1s → 2s → 4s → … → 30s max).

Use Ctrl+C or SIGTERM to gracefully disconnect.

```bash
mftctl connect [flags]

Flags:
  -h, --help            help for connect
      --hub             Connect via hub relay (/hub/ws) instead of directly to cloud
  -s, --server string   Hub or cloud server URL (default: from config)
  -t, --token string    Auth token / API key (default: from config)

Examples:
  mftctl connect --server wss://hub.mftplus.co.za --token my-token
  mftctl connect --hub
```

## Update Management

### update check

Check for available agent updates by querying the version check API.

```bash
mftctl update check [flags]

Flags:
  --current string   Current version (default: auto-detected)
```

### update apply

Download, verify, and apply the latest agent update.

```bash
mftctl update apply [flags]

Flags:
  -v, --verbose          Show detailed progress
      --version string   Target version to apply (default: latest)
  -y, --yes              Skip confirmation prompt
```

### update rollback

Rollback the agent binary to the previous version.

```bash
mftctl update rollback [flags]

Flags:
  -y, --yes   Skip confirmation prompt
```

## Shell Completion

### completion

Generate shell completion script.

```bash
mftctl completion <shell>

Supported shells: bash, zsh, fish, powershell

Examples:
  mftctl completion bash > /etc/bash_completion.d/mftctl
  mftctl completion zsh > /usr/local/share/zsh/site-functions/_mftctl
```

## Next Steps

- [Configuration](./config) - Configuration options
- [Plugin API](../plugins/api) - Plugin development
- [Quick Start](../guide/quick-start) - See practical usage examples
