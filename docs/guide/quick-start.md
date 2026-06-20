# Quick Start

Get up and running with `mftctl` in under 5 minutes. This guide walks you through installing the CLI, connecting to the dashboard, and creating your first transfer.

## Prerequisites

- **Operating System**: Linux, macOS, or Windows
- **Access credentials**: API key or dashboard login for MFTPlus

## Step 1: Install mftctl

Install the CLI with a single command:

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

Verify the installation:

```bash
mftctl version
```

## Step 2: Authenticate

Log in to your MFTPlus dashboard:

```bash
mftctl login
```

You'll be prompted for your API key. You can also provide it directly:

```bash
mftctl login pc-api-xxxxxxxxxxxxxxxx
```

## Step 3: Configure Server URL

Set your dashboard server URL:

```bash
mftctl config set server-url https://dashboard.mftplus.co.za
```

## Step 4: View Your Agents

List registered agents:

```bash
mftctl agents list
```

View details for a specific agent:

```bash
mftctl agents show <agent-id>
```

## Step 5: Create Your First Transfer

Create a transfer job:

```bash
mftctl transfers create \
  --agent <agent-id> \
  --source /var/log/app/*.log \
  --dest sftp://backup.example.com/logs \
  --protocol sftp
```

Or send a file directly:

```bash
mftctl send ./report.pdf \
  --agent <agent-id> \
  --to sftp://partner.example.com/incoming
```

## Step 6: Monitor Transfers

List all transfers:

```bash
mftctl transfers list
```

Check transfer details:

```bash
mftctl transfers status <transfer-id>
mftctl transfers logs <transfer-id>
```

## Step 7: Schedule a Job

Create a scheduled job:

```bash
mftctl jobs create \
  --agent <agent-id> \
  --name daily-sync \
  --source /var/log/app/*.log \
  --dest sftp://backup.example.com/logs \
  --schedule "0 2 * * *" \
  --protocol sftp
```

## Step 8: Review Audit Logs

Verify audit chain integrity:

```bash
mftctl audit verify
```

List recent audit entries:

```bash
mftctl audit log list --limit 10
```

## Common Workflows

### Ad-Hoc File Send

```bash
mftctl send ./urgent-report.pdf --agent <agent-id> --to sftp://recipient.example.com/incoming
```

### Transfer from stdin

```bash
cat data.csv | mftctl send --agent <agent-id> --to sftp://recipient.example.com/incoming --stdin
```

### Check Agent Labels

```bash
mftctl agents label list <agent-id>
```

### Export Audit Reports

```bash
mftctl audit chain export --format csv
```

## Cleanup

```bash
# Delete a job
mftctl jobs delete <job-id>

# Logout
mftctl logout
```

## Next Steps

- [CLI Commands](../api/cli) - Complete command reference
- [Architecture](./architecture) - Learn how MFTPlus works
- [Installation](./installation) - Detailed installation options

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
