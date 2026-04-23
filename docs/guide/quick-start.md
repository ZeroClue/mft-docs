# Quick Start

Get up and running with MFTPlus in under 5 minutes. This guide will walk you through installing the CLI, authenticating with your account, and creating your first scheduled transfer.

## Prerequisites

Before you begin, ensure you have:
- **API Key**: Sign up at [mftplus.co.za](https://mftplus.co.za) to get your API key
- **curl or wget**: For downloading the installer
- **Access to source/destination**: Credentials for your SFTP, S3, or other storage systems

## Step 1: Install mftctl

Install the MFTPlus CLI in one command:

```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

This downloads and installs the latest `mftctl` binary to `/usr/local/bin` (or `~/.local/bin` if you don't have write access to `/usr/local/bin`).

**Verify installation:**
```bash
mftctl --version
```

::: tip Custom Installation Directory
To install to a specific directory:
```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh -s - -d ~/bin
```
:::

::: tip Windows Users
Download the MSI installer from [releases.mftplus.co.za](https://releases.mftplus.co.za/latest/mftplus-x64_64.msi) and run it.
:::

## Step 2: Authenticate

Connect your CLI to your MFTPlus account:

```bash
mftctl login <your-api-key> --server https://dashboard.mftplus.co.za
```

::: tip Finding Your API Key
Log in to your MFTPlus dashboard at [dashboard.mftplus.co.za](https://dashboard.mftplus.co.za) and navigate to **Settings → API Keys**.
:::

## Step 3: Configure a Source or Destination

Add a storage location that MFTPlus can access. For example, to add an SFTP server:

```bash
mftctl connections create \
  --name partner-sftp \
  --type sftp \
  --host sftp.example.com \
  --port 22 \
  --username transfer-user \
  --password your-password
```

::: tip Supported Storage Types
MFTPlus supports:
- **SFTP/FTP/FTPS**: Legacy file transfer protocols
- **Amazon S3**: S3-compatible storage
- **Azure Blob Storage**: Microsoft's cloud storage
- **Google Cloud Storage**: GCS buckets
:::

## Step 4: Create Your First Transfer

Create a scheduled transfer between your storage locations. For example, to sync files from S3 to SFTP daily at 2 AM:

```bash
mftctl transfer create \
  --source s3://production-data/exports \
  --dest sftp://partner.example.com/incoming \
  --schedule "0 2 * * *" \
  --name daily-partner-sync \
  --on-failure alerts@yourcompany.com
```

**What this does:**
- Transfers files from `s3://production-data/exports` to `sftp://partner.example.com/incoming`
- Runs daily at 2:00 AM (cron syntax)
- Sends an email on failure
- Logs all transfer activity for compliance

::: tip Cron Schedule Syntax
The `--schedule` field uses standard cron syntax: `minute hour day month weekday`
- `0 2 * * *` — Daily at 2:00 AM
- `*/30 * * * *` — Every 30 minutes
- `0 0 * * 1` — Weekly on Monday at midnight
- `0 0 1 * *` — Monthly on the 1st at midnight
:::

## Step 5: Monitor Your Transfer

Check the status of your transfers:

```bash
# List all transfers
mftctl transfer list

# Check specific transfer status
mftctl transfer status daily-partner-sync

# Watch transfer activity in real-time
mftctl transfer logs --follow daily-partner-sync
```

## Common Next Steps

### Run a Transfer Immediately

Skip the schedule and run now:

```bash
mftctl transfer run --name daily-partner-sync
```

### Enable Automatic Retry

Make transfers resilient to transient failures:

```bash
mftctl transfer update daily-partner-sync \
  --retry-count 3 \
  --retry-backoff 30s
```

### Set Up Notifications

Get alerted on success or failure:

```bash
mftctl transfer update daily-partner-sync \
  --on-success ops@yourcompany.com \
  --on-failure alerts@yourcompany.com
```

### Enable Encryption

Encrypt files in transit:

```bash
mftctl transfer update daily-partner-sync \
  --encryption aes256
```

## Example Workflows

### Daily Customer Exports

```bash
# Create the transfer
mftctl transfer create \
  --source s3://customer-data/daily-exports \
  --dest sftp://customer-partner.com/dropzone \
  --schedule "0 3 * * *" \
  --name customer-daily-export \
  --on-success ops@yourcompany.com

# Verify it's scheduled
mftctl transfer list --filter name=customer-daily-export
```

### Hourly Log Sync

```bash
# Create the transfer
mftctl transfer create \
  --source /var/log/app \
  --dest s3://company-backups/app-logs \
  --schedule "10 * * * *" \
  --name hourly-log-sync \
  --compression true

# Run immediately to test
mftctl transfer run --name hourly-log-sync
```

### Compliance Archive

```bash
# Create the transfer
mftctl transfer create \
  --source s3://transactions \
  --dest glacier://compliance-archive \
  --schedule "0 0 1 * *" \
  --name monthly-compliance-archive \
  --retention 7y
```

## Troubleshooting

### Connection Test

Test a connection before creating a transfer:

```bash
mftctl connections test partner-sftp
```

### Debug Mode

Enable verbose logging:

```bash
mftctl --debug transfer logs --name daily-partner-sync
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `mftctl: command not found` | Ensure `~/.local/bin` is in your PATH: `export PATH="$HOME/.local/bin:$PATH"` |
| `Authentication failed` | Verify your API key in the dashboard. Generate a new one if needed. |
| `Connection timeout` | Check firewall rules and ensure the destination host is reachable from your network. |
| `Permission denied` | Verify the credentials have read access to the source and write access to the destination. |

## Next Steps

- [Installation](./installation) - Detailed installation options
- [CLI Reference](../api/cli) - Complete command documentation
- [Architecture](./architecture) - Learn how MFTPlus works
- [Transfer Protocol](./protocol) - Understand transfer behavior

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
- **Community**: [github.com/ZeroClue/mft-docs/issues](https://github.com/ZeroClue/mft-docs/issues)
