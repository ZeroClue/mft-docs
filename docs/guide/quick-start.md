---
title: Quick Start Guide - Transfer Files in 5 Minutes | MFTPlus
description: "Get started with MFTPlus in under 5 minutes. Install the agent, register with your dashboard, and create your first scheduled SFTP/FTP transfer job."
---

# Quick Start: Your First Transfer in 5 Minutes

Transfer your first file with MFTPlus in under 5 minutes.

## Prerequisites

- **OS**: Windows 10+ or Linux
- **Access**: SFTP/FTP credentials or local directory path

---

## Step 1: Install mftctl

Download the archive for your platform from [releases.mftplus.co.za](https://releases.mftplus.co.za/v0.7.0/):

| Platform | Download |
|----------|----------|
| Linux (x86_64) | [mftctl_0.7.0_linux_amd64.tar.gz](https://releases.mftplus.co.za/v0.7.0/mftctl_0.7.0_linux_amd64.tar.gz) |
| Linux (aarch64) | [mftctl_0.7.0_linux_aarch64.tar.gz](https://releases.mftplus.co.za/v0.7.0/mftctl_0.7.0_linux_aarch64.tar.gz) |
| Windows (x86_64) | [mftctl_0.7.0_windows_amd64.zip](https://releases.mftplus.co.za/v0.7.0/mftctl_0.7.0_windows_amd64.zip) |

**Manual install (Linux):**
```bash
# Download and extract
tar xzf mftctl_0.7.0_linux_amd64.tar.gz

# Move to PATH
sudo mv mftctl /usr/local/bin/

# Verify
mftctl --version
```

**Manual install (Windows PowerShell):**
```powershell
# Download
Invoke-WebRequest -Uri https://releases.mftplus.co.za/v0.7.0/mftctl_0.7.0_windows_amd64.zip -OutFile mftctl_0.7.0_windows_amd64.zip

# Extract
Expand-Archive .\mftctl_0.7.0_windows_amd64.zip -DestinationPath .

# Move to PATH
Move-Item .\mftctl.exe C:\Windows\System32\

# Verify
mftctl --version
```

For detailed installation options, see the [Installation guide](./installation).

---

```bash
mftctl version
```

Set your dashboard server URL:

```bash
mftctl config set server.url http://localhost:8080
```

For cloud deployments:
```bash
mftctl config set server.url https://dashboard.yourcompany.com
```

Configuration is stored at:
- **Linux**: `~/.config/mftplus/config.yaml`
- **Windows**: `%APPDATA%\mftplus\config.yaml`

---

```bash
mftctl login pc-api-xxxxxxxxxxxxxxxx
```

```bash
mftctl register --deploy-key your-deploy-key
```

Your agent will appear in the dashboard with a unique agent ID.

::: tip Finding Your Agent ID
Run `mftctl status` to see your agent ID and connection status.
:::

---

## Step 4: Verify Registration

Check your agent status:

```bash
mftctl status
```

Open your dashboard and verify that your agent appears in the **Agents** list. You should see:
- Agent hostname
- Online status
- Last heartbeat timestamp

---

## Step 5: Create Your First Transfer Job

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

## Step 6: Run It Now

Want to test immediately? Click **Run Now** on your job.

Monitor the execution under **History** — you'll see status, timestamps, and file counts.

---

## Verify Success

Check the transfer log locally:

| Platform | Transfer Log |
|----------|--------------|
| Linux | `~/.config/mftplus/transfers.db` |
| Windows | `%APPDATA%\mftplus\transfers.db` |

Or view in the dashboard under **Jobs** → **History**.

---

## Cleanup

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
- Check logs: `~/.config/mftplus/logs/` (or `%APPDATA%\mftplus\logs\` on Windows)
- Run `mftctl status` to check connection

**Connection refused?**
- Verify hostname and port
- Check firewall rules allow outbound connections
- Test: `telnet sftp.example.com 22`

**Permission denied?**
- Verify source directory is readable
- Verify destination directory is writable
- Check SSH key permissions (if using key auth)

**Need more help?** See the [Troubleshooting Guide](./troubleshooting) for comprehensive solutions to common issues.

---

## Security

MFTPlus encrypts all transfers using **AES-256-GCM** — the same standard used for securing classified information. Credentials are stored locally with restrictive permissions (600) and never leave your machine unencrypted.

---

## Next Steps

- [Installation](./installation) — Detailed install options
- [Configuration](../api/config) — Advanced configuration options
- [Architecture](./architecture) — Learn how MFTPlus works

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
