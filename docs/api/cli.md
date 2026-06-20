# CLI Commands

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

Authenticate with the MFTPlus dashboard.

```bash
mftctl login [api-key]

Options:
  -s, --server <url>  Dashboard server URL

Examples:
  mftctl login
  mftctl login pc-api-xxxxxxxxxxxxxxxx
  mftctl login --server https://dashboard.mftplus.co.za
```

### logout

Clear stored credentials.

```bash
mftctl logout
```

## Agent Management

### agents list

List all registered agents.

```bash
mftctl agents list [options]

Options:
  -j, --json  Output as JSON
```

### agents show

Show detailed agent information.

```bash
mftctl agents show <agent-id> [options]

Options:
  -j, --json  Output as JSON

Examples:
  mftctl agents show ag-2x8mK9nR
```

### agents transfers

List transfers for a specific agent.

```bash
mftctl agents transfers <agent-id> [options]

Options:
  -j, --json  Output as JSON

Examples:
  mftctl agents transfers ag-2x8mK9nR
```

### agents jobs

List jobs for a specific agent.

```bash
mftctl agents jobs <agent-id> [options]

Options:
  -j, --json  Output as JSON

Examples:
  mftctl agents jobs ag-2x8mK9nR
```

### agents label

Manage agent labels.

```bash
mftctl agents label <command> [args...]

Commands:
  list    List all labels for an agent
  add     Add or update a label
  update  Update a label value
  remove  Remove a label

Examples:
  mftctl agents label list ag-2x8mK9nR
  mftctl agents label add ag-2x8mK9nR environment production
  mftctl agents label update ag-2x8mK9nR environment staging
  mftctl agents label remove ag-2x8mK9nR environment
```

## Transfer Management

### transfers list

List all transfers.

```bash
mftctl transfers list [options]

Options:
  --status <status>  Filter by status
  --agent <id>       Filter by agent
  --page <n>         Page number
  --limit <n>        Results per page
  -j, --json         Output as JSON
```

### transfers show / status

Show transfer details.

```bash
mftctl transfers show <transfer-id> [options]
mftctl transfers status <transfer-id> [options]

Options:
  -j, --json  Output as JSON

Examples:
  mftctl transfers show tr-abc123
  mftctl transfers status tr-abc123
```

### transfers create

Create a new transfer.

```bash
mftctl transfers create [options]

Options:
  --agent <id>             Agent ID
  --source <path>          Source file or directory
  --dest <path>            Destination path
  --protocol <protocol>    Transfer protocol (sftp, ftp, ftps, local)
  --retention <duration>   Retention period
  --compress               Enable compression
  --encryption <algo>      Encryption algorithm (aes256, chacha20)
  --pre-hook <cmd>         Pre-transfer hook command
  --post-hook <cmd>        Post-transfer hook command
  --on-failure-hook <cmd>  On-failure hook command

Examples:
  mftctl transfers create --agent ag-2x8mK9nR \
    --source /var/log/app/*.log \
    --dest sftp://backup.example.com/logs \
    --protocol sftp
```

### transfers update

Update transfer notification settings.

```bash
mftctl transfers update <transfer-id> [options]

Options:
  --on-success <email>  Success notification email
  --on-failure <email>  Failure notification email

Examples:
  mftctl transfers update tr-abc123 --on-failure ops@example.com
```

### transfers logs

Show transfer logs.

```bash
mftctl transfers logs <transfer-id> [options]

Examples:
  mftctl transfers logs tr-abc123
```

### send

Send a file directly to a remote destination.

```bash
mftctl send [file] [options]

Options:
  --agent <id>        Agent ID (required)
  --to <destination>  Remote destination (required)
  --stdin             Read file content from stdin
  --encryption <algo> Encryption algorithm (aes256, chacha20)

Examples:
  mftctl send ./report.pdf --agent ag-2x8mK9nR --to sftp://partner.example.com/incoming
  cat data.csv | mftctl send --agent ag-2x8mK9nR --to sftp://partner.example.com/incoming --stdin
```

## Job Management

### jobs list

List all scheduled jobs.

```bash
mftctl jobs list [options]

Options:
  -j, --json  Output as JSON
```

### jobs show

Show job details.

```bash
mftctl jobs show <job-id> [options]

Options:
  -j, --json  Output as JSON

Examples:
  mftctl jobs show job-abc123
```

### jobs create

Create a new scheduled job.

```bash
mftctl jobs create [options]

Options:
  --agent <id>        Agent ID (required)
  --name <name>       Job name (required)
  --source <path>     Source file or directory
  --dest <path>       Destination path
  --schedule <cron>   Cron schedule expression
  --protocol <proto>  Transfer protocol
  --direction <dir>   Transfer direction (upload, download)
  --enabled           Enable the job immediately
  --template <name>   Use a transfer template
  --var <kv>          Template variable (key=value)

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
mftctl jobs delete <job-id>

Examples:
  mftctl jobs delete job-abc123
```

## Audit Commands

### audit verify

Verify cryptographic chain integrity of audit logs.

```bash
mftctl audit verify [options]

Options:
  -k, --api-key <key>  Admin API key
  --server <url>       Dashboard server URL
  -j, --json           Output as JSON

Examples:
  mftctl audit verify
  mftctl audit verify --json
```

### audit chain status

Show audit chain metadata.

```bash
mftctl audit chain status [options]

Options:
  -k, --api-key <key>  Admin API key
  --server <url>       Dashboard server URL
  -j, --json           Output as JSON
```

### audit chain export

Export audit logs as CSV or PDF.

```bash
mftctl audit chain export [options]

Options:
  -k, --api-key <key>  Admin API key
  --server <url>       Dashboard server URL
  --format <format>    Export format (csv, pdf; default: csv)
```

### audit entry get

Get a specific audit log entry.

```bash
mftctl audit entry get <entry-id> [options]

Options:
  -k, --api-key <key>  Admin API key
  --server <url>       Dashboard server URL
  -j, --json           Output as JSON
```

### audit log list

Query audit log entries.

```bash
mftctl audit log list [options]

Options:
  -k, --api-key <key>    Admin API key
  --server <url>         Dashboard server URL
  --category <category>  Filter by category
  --severity <severity>  Filter by severity
  --customer <id>        Filter by customer
  --limit <n>            Results limit
  --offset <n>           Results offset
  -j, --json             Output as JSON

Categories: authentication, authorization, admin, agent, transfer, job, system
Severities: info, warning, error, critical
```

## Connection Management

### connections list

List all connection profiles.

```bash
mftctl connections list [options]

Options:
  -j, --json  Output as JSON
```

### connections show

Show connection profile details.

```bash
mftctl connections show <profile-id> [options]

Options:
  -j, --json  Output as JSON
```

### connections create

Create a new connection profile.

```bash
mftctl connections create [options]

Options:
  --name <name>     Profile name
  --type <type>     Connection type (sftp, ftp, ftps, s3, gcs)
  --host <host>     Server hostname
  --port <port>     Server port
  --username <user> Username
  --auth <method>   Authentication method (password, key, env)
```

### connections update

Update a connection profile.

```bash
mftctl connections update <profile-id> [options]
```

### connections delete

Delete a connection profile.

```bash
mftctl connections delete <profile-id>
```

### connections test

Test a connection profile.

```bash
mftctl connections test <profile-id>
```

## Bridge Management

### bridge list

List all bridge configurations.

```bash
mftctl bridge list [options]

Options:
  -j, --json  Output as JSON
```

### bridge show

Show bridge configuration details.

```bash
mftctl bridge show <bridge-id> [options]

Options:
  -j, --json  Output as JSON
```

### bridge create

Create a new bridge configuration.

```bash
mftctl bridge create [options]
```

### bridge delete

Delete a bridge configuration.

```bash
mftctl bridge delete <bridge-id>
```

## Template Management

### templates list

List all transfer templates.

```bash
mftctl templates list [options]

Options:
  -j, --json  Output as JSON
```

### templates show

Show template details.

```bash
mftctl templates show <template-id> [options]

Options:
  -j, --json  Output as JSON
```

### templates create

Create a new transfer template.

```bash
mftctl templates create [options]
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
mftctl plugin search <query>

Examples:
  mftctl plugin search s3
  mftctl plugin search auth
```

### plugin info

Get detailed information about a plugin.

```bash
mftctl plugin info <plugin-name>

Examples:
  mftctl plugin info s3-storage
```

### plugin install

Install a plugin from the registry.

```bash
mftctl plugin install <plugin-name>

Examples:
  mftctl plugin install s3-storage
  mftctl plugin install auth-oidc
```

### plugin list

List installed plugins.

```bash
mftctl plugin list [options]

Options:
  -j, --json  Output as JSON
```

### plugin remove

Remove an installed plugin.

```bash
mftctl plugin remove <plugin-name>

Examples:
  mftctl plugin remove s3-storage
```

### plugin verify

Verify an installed plugin's signature and checksum.

```bash
mftctl plugin verify <plugin-name>

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

Keys: server-url, api-key, jwt

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

Connect to MFTPlus hub or cloud relay via WebSocket.

```bash
mftctl connect [options]

Options:
  -s, --server <url>  Hub server URL
  -t, --token <token> Authentication token
  --hub               Connect in hub mode

Examples:
  mftctl connect --server wss://hub.mftplus.co.za --token my-token
  mftctl connect --hub
```

## Update Management

### update check

Check for available agent updates.

```bash
mftctl update check
```

### update apply

Apply the latest agent update.

```bash
mftctl update apply
```

### update rollback

Rollback to the previous agent version.

```bash
mftctl update rollback
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

- [Configuration](./config) — Configuration options
- [Plugin API](../plugins/api) — Plugin development
