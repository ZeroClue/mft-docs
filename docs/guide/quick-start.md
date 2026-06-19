# Quick Start

Get up and running with MFTPlus in under 5 minutes. This guide will walk you through installing the agent, registering with your dashboard, and creating your first scheduled transfer.

## Prerequisites

Before you begin, ensure you have:
- **Operating System**: Linux, Windows 10+, or macOS 10.15+
- **Access credentials**: Username/password or SSH key for your SFTP/FTP server

## Step 1: Download and Install

Download the tar.gz binary for your platform from [releases.mftplus.co.za](https://releases.mftplus.co.za/latest/):

| Platform | Download |
|----------|----------|
| Linux (x86_64) | [mft-agent-cli-linux-x86_64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-linux-x86_64.tar.gz) |
| Linux (aarch64) | [mft-agent-cli-linux-aarch64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-linux-aarch64.tar.gz) |
| Windows (x86_64) | [mft-agent-cli-windows-x86_64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-windows-x86_64.tar.gz) |
| macOS (Intel) | [mft-agent-cli-macos-x86_64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-macos-x86_64.tar.gz) |
| macOS (Apple Silicon) | [mft-agent-cli-macos-aarch64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-macos-aarch64.tar.gz) |

**One-line install (Linux/macOS):**
```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

**One-line install (Windows PowerShell):**
```powershell
iex ((New-Object System.Net.WebClient).DownloadString('https://releases.mftplus.co.za/install.ps1'))
```

**Manual install (all platforms):**
```bash
# Download and extract
tar xzf mft-agent-cli-*.tar.gz

# Move to PATH
sudo mv mft-agent-cli /usr/local/bin/   # Linux/macOS
Move-Item mft-agent-cli.exe C:\Windows\System32\  # Windows

# Verify
mft-agent-cli --version
```

For detailed installation options, see the [Installation guide](./installation).

## Step 2: Configure Server URL

Set your dashboard server URL:

```bash
mft-agent-cli config set server.url http://localhost:8080
```

Or for cloud deployments:
```bash
mft-agent-cli config set server.url https://dashboard.yourcompany.com
```

The configuration is stored at:
- **Linux/macOS**: `~/.config/mft-agent/config.yaml`
- **Windows**: `%APPDATA%\mft-agent\config.yaml`

## Step 3: Register Your Agent

Register your agent with the dashboard:

```bash
mft-agent-cli register --deploy-key your-deploy-key
```

Your agent will appear in the dashboard with a unique agent ID.

::: tip Finding Your Agent ID
Run `mft-agent-cli status` to see your agent ID and connection status.
:::

## Step 4: Verify Registration

Check your agent status:

```bash
mft-agent-cli status
```

Open your dashboard and verify that your agent appears in the **Agents** list. You should see:
- Agent hostname
- Online status
- Last heartbeat timestamp

## Step 5: Create Your First Transfer Job

Create a scheduled transfer job in the dashboard:

1. Navigate to **Jobs** → **Create Job**
2. Configure the transfer:
   - **Name**: `daily-sftp-sync`
   - **Schedule**: `0 2 * * *` (daily at 2:00 AM)
   - **Protocol**: SFTP
   - **Source**: `/var/log/app/*.log`
   - **Destination**: `sftp://backup.example.com/logs`
   - **Credentials**: Select or create SFTP credentials
3. Click **Save**

The job will execute on your agent according to the schedule.

## Step 6: Monitor Transfer Activity

View transfer activity in the dashboard:

1. Navigate to **Jobs** → **daily-sftp-sync**
2. View recent executions under **History**
3. Check status, timestamps, and file counts

All transfers are logged locally on your agent in SQLite format at:
- **Linux/macOS**: `~/.config/mft-agent/transfers.db`
- **Windows**: `%APPDATA%\mft-agent\transfers.db`

## Common Workflows

### Manual Transfer

Run a job immediately without waiting for the schedule:

1. Navigate to **Jobs** in the dashboard
2. Click **Run Now** on your job
3. Monitor execution in **History**

### Ad-Hoc Transfer

For one-time transfers, create a one-off job in the dashboard with a manual trigger.

### Transfer History

View all transfer history:

1. Navigate to **Transfers** in the dashboard
2. Filter by agent, job, or date range
3. Export for compliance audits

## Supported Protocols

MFTPlus supports the following transfer protocols:

| Protocol | Description |
|----------|-------------|
| **SFTP** | SSH File Transfer Protocol (recommended) |
| **FTP** | File Transfer Protocol |
| **FTPS** | FTP over TLS/SSL |
| **Local** | Local filesystem operations |

## Troubleshooting

### Agent Not Appearing in Dashboard

1. Verify server URL in agent configuration
2. Check network connectivity to dashboard
3. Review agent logs for errors:
   - **Linux/macOS**: `~/.config/mft-agent/logs/`
   - **Windows**: `%APPDATA%\mft-agent\log`
4. Run `mft-agent-cli status` to check connection

### Transfer Job Not Running

1. Verify schedule syntax (cron format)
2. Check agent is online in dashboard
3. Review job history for error messages
4. Test credentials with a manual transfer

### Connection Refused

1. Verify target server hostname and port
2. Check firewall rules allow outbound connections
3. Confirm credentials are correct
4. Test connectivity: `telnet sftp.example.com 22`

### Permission Denied

1. Verify source directory is readable by agent user
2. Verify destination directory is writable
3. Check SSH key permissions (if using key-based auth)
4. Confirm user has necessary permissions on target server

## Security

MFTPlus encrypts all sensitive data:

- **Encryption**: AES-256-GCM for all file transfers
- **Credentials**: Stored in protected files with restrictive permissions (600)
- **Certificates**: Located at `~/.config/mft-agent/certificates/` (never leave your machine)
- **Logging**: SHA-256 checksums for all transferred files

## Next Steps

- [Installation](./installation) - Detailed installation options
- [Architecture](./architecture) - Learn how MFTPlus works
- [Transfer Protocol](./protocol) - Understand transfer behavior

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
