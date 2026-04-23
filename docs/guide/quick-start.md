# Quick Start

Get up and running with MFTPlus in under 5 minutes. This guide will walk you through downloading the agent, configuring your first scheduled transfer, and verifying it works.

## Prerequisites

Before you begin, ensure you have:
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (glibc 2.17+)
- **Access credentials**: Username/password or SSH key for your SFTP/FTP server

## Step 1: Download and Install

Download the installer for your platform:

| Platform | Download |
|----------|----------|
| Windows | [MFTPlus-x.x.x-x64_64.msi](https://releases.mftplus.co.za/latest/mftplus-x64_64.msi) |
| macOS (Intel) | [MFTPlus-x.x.x-x86_64.dmg](https://releases.mftplus.co.za/latest/mftplus-x86_64.dmg) |
| macOS (Apple Silicon) | [MFTPlus-x.x.x-aarch64.dmg](https://releases.mftplus.co.za/latest/mftplus-aarch64.dmg) |
| Linux (Debian/Ubuntu) | [mftplus_amd64.deb](https://releases.mftplus.co.za/latest/mftplus_amd64.deb) |
| Linux (RHEL/CentOS/Fedora) | [mftplus-x86_64.rpm](https://releases.mftplus.co.za/latest/mftplus-x86_64.rpm) |

Run the installer and launch MFTPlus from your applications menu.

## Step 2: Configure Server URL

On first launch, MFTPlus will prompt for your dashboard server URL.

**For self-hosted deployments**, enter your server URL (e.g., `http://localhost:8080` or your company's dashboard URL).

**For cloud deployments**, enter your cloud dashboard URL.

This setting is stored in:
- **Linux/macOS**: `~/.config/mft-agent/config.yaml`
- **Windows**: `%APPDATA%\mft-agent\config.yaml`

## Step 3: Register Your Agent

Register your agent with the dashboard:

1. Click **Register** in the MFTPlus interface
2. Enter your registration credentials
3. Your agent will appear in the dashboard with a unique ID

::: tip Finding Your Agent ID
Your agent ID is displayed in the MFTPlus application header and in the dashboard agents list.
:::

## Step 4: Verify Registration

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

For one-time transfers, create a job with `--manual` trigger or use the agent's direct transfer interface (if available).

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
   - **Windows**: `%APPDATA%\mft-agent\logs\`

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
