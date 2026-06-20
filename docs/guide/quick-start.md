# Quick Start

Get up and running with `mftctl` in under 5 minutes.

## Prerequisites

- **Operating System**: Linux, macOS, or Windows
- **MFTPlus dashboard**: Running instance with an API key

## Step 1: Install mftctl

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

Verify the installation:

```bash
mftctl --version
```

## Step 2: Authenticate

Log in to your MFTPlus dashboard:

```bash
mftctl login pc-api-xxxxxxxxxxxxxxxx
```

To use a custom server URL:

```bash
mftctl login --server https://dashboard.mftplus.co.za pc-api-xxxxxxxxxxxxxxxx
```

## Step 3: Configure Server URL

Set your dashboard server URL:

```bash
mftctl config set server-url https://dashboard.mftplus.co.za
```

## Step 4: View Your Agents

```bash
mftctl agents list
```

View details for a specific agent:

```bash
mftctl agents show ag-2x8mK9nR
```

## Step 5: Create Your First Transfer

Send a file directly:

```bash
mftctl send ./report.pdf \
  --agent ag-2x8mK9nR \
  --to sftp://backup.example.com/incoming
```

Create a scheduled transfer job:

```bash
mftctl transfers create \
  --agent ag-2x8mK9nR \
  --source /var/log/app/*.log \
  --dest sftp://backup.example.com/logs \
  --protocol sftp
```

## Step 6: Monitor Transfers

```bash
# List all transfers
mftctl transfers list

# Check transfer details
mftctl transfers status tr-abc123

# View transfer logs
mftctl transfers logs tr-abc123
```

## Step 7: Schedule a Job

Create a recurring transfer job:

```bash
mftctl jobs create \
  --agent ag-2x8mK9nR \
  --name daily-sync \
  --source /var/log/app/*.log \
  --dest sftp://backup.example.com/logs \
  --schedule "0 2 * * *" \
  --protocol sftp
```

## Step 8: Audit

Verify audit chain integrity:

```bash
mftctl audit verify
```

List recent audit entries:

```bash
mftctl audit log list --limit 10
```

## Common Workflows

### Send from stdin

```bash
cat data.csv | mftctl send --agent ag-2x8mK9nR --to sftp://recipient.example.com/incoming --stdin
```

### Agent Labels

```bash
mftctl agents label list ag-2x8mK9nR
mftctl agents label add ag-2x8mK9nR environment production
```

### Export Audit Reports

```bash
mftctl audit chain export --format csv
```

## Cleanup

```bash
# Delete a job
mftctl jobs delete job-abc123

# Logout
mftctl logout
```

## Next Steps

- [CLI Commands](../api/cli) — Complete command reference
- [Architecture](./architecture) — Learn how MFTPlus works
- [Installation](./installation) — Detailed installation options
