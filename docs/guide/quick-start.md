---
title: Quick Start - MFTPlus Documentation
description: Transfer your first file with MFTPlus in under 5 minutes. Step-by-step guide to install, configure, and run your first file transfer job.
keywords: MFTPlus quick start, file transfer tutorial, install mftctl, SFTP automation guide, first file transfer
---

# Quick Start

Transfer your first file with MFTPlus in under 5 minutes.

## Prerequisites

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **Access**: SFTP/FTP credentials or local directory path

---

## Option A: One-Line Install (macOS/Linux)

```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

This installs `mftctl` — the MFTPlus command-line interface.

---

## Option B: Desktop Installer

Download and run the installer for your platform:

| Platform | Download |
|----------|----------|
| Windows | [MFTPlus-x64_64.msi](https://releases.mftplus.co.za/latest/mftplus-x64_64.msi) |
| macOS (Intel) | [MFTPlus-x86_64.dmg](https://releases.mftplus.co.za/latest/mftplus-x86_64.dmg) |
| macOS (Apple Silicon) | [MFTPlus-aarch64.dmg](https://releases.mftplus.co.za/latest/mftplus-aarch64.dmg) |
| Linux (Debian/Ubuntu) | [mftplus_amd64.deb](https://releases.mftplus.co.za/latest/mftplus_amd64.deb) |
| Linux (RHEL/CentOS) | [mftplus-x86_64.rpm](https://releases.mftplus.co.za/latest/mftplus-x86_64.rpm) |

Launch MFTPlus from your applications menu.

---

## Step 1: Configure Server URL

**First launch?** Enter your dashboard server URL when prompted.

| Deployment | Server URL |
|------------|------------|
| Local development | `http://localhost:8080` |
| Cloud | Your cloud dashboard URL |
| Self-hosted | Your company's dashboard URL |

**Desktop app:** This is saved automatically.
**CLI:** Run `mftctl config init` and set with `mftctl config set server.url <url>`

---

## Step 2: Register Your Agent

1. Click **Register** in the MFTPlus interface
2. Enter your registration credentials
3. Verify your agent appears in the dashboard under **Agents**

::: info Registration Credentials
New users receive registration credentials via email after signing up at [mftplus.co.za](https://mftplus.co.za). Contact your account owner if you don't have credentials.
:::

::: tip
Your agent ID is shown in the app header and dashboard agents list.
:::

---

## Step 3: Create Your First Transfer Job

In the dashboard:

1. Navigate to **Jobs** → **Create Job**
2. Configure:
   - **Name**: `my-first-transfer`
   - **Schedule**: `0 2 * * *` (daily at 2 AM)
   - **Protocol**: SFTP
   - **Source**: `/path/to/files/*.log`
   - **Destination**: `sftp://your-server.com/backup`
   - **Credentials**: Add your SFTP credentials
3. Click **Save**

---

## Step 4: Run It Now

Want to test immediately? Click **Run Now** on your job.

Monitor the execution under **History** — you'll see status, timestamps, and file counts.

---

## Verify Success

Check the transfer log locally:

| Platform | Transfer Log |
|----------|--------------|
| Linux/macOS | `~/.config/mft-agent/transfers.db` |
| Windows | `%APPDATA%\mft-agent\transfers.db` |

Or view in the dashboard under **Jobs** → **History**.

---

## Supported Protocols

| Protocol | Best For |
|----------|----------|
| **SFTP** | Secure transfers (recommended) |
| **FTP** | Legacy systems |
| **FTPS** | FTP over TLS/SSL |
| **Local** | Same-machine file operations |

---

## Troubleshooting

**Agent not appearing in dashboard?**
- Check server URL in config
- Verify network connectivity to dashboard
- Check logs: `~/.config/mft-agent/logs/` (or `%APPDATA%\mft-agent\logs\` on Windows)

**Connection refused?**
- Verify hostname and port
- Check firewall rules allow outbound connections
- Test: `telnet sftp.example.com 22`

**Permission denied?**
- Verify source directory is readable
- Verify destination directory is writable
- Check SSH key permissions (if using key auth)

---

## Security

MFTPlus encrypts all transfers using **AES-256-GCM** — the same standard used for securing classified information. Credentials are stored locally with restrictive permissions (600) and never leave your machine unencrypted.

---

## Next Steps

- [Installation](./installation) — Detailed install options
- [CLI Reference](../api/cli) — Complete `mftctl` command reference
- [Configuration](../api/config) — Advanced configuration options

## Need Help?

- 📖 [docs.mftplus.co.za](https://docs.mftplus.co.za)
- 📧 [support@mftplus.co.za](mailto:support@mftplus.co.za)
