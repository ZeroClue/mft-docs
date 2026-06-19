---
title: Network Discovery Tool - MFTPlus Documentation
description: "Discover shadow IT file transfers across your network with the MFTPlus Network Discovery Tool. Scan Linux and Windows machines for scheduled transfers, cron jobs, scripts, and saved FTP configurations."
---

# Network Discovery Tool

The MFTPlus Network Discovery Tool (`mft-discover`) scans your enterprise network for file transfers that are running outside of MFTPlus. It finds scheduled transfers, ad-hoc scripts, and saved FTP client configurations across Linux and Windows machines.

The output report serves as both a **security audit** and a **migration planning tool** — showing exactly which transfers can be consolidated into MFTPlus.

## Key Features

- **Passive scanning only** — reads local files and configurations, no network probing or port scanning
- **Cross-platform** — scans both Linux (via SSH) and Windows (via WinRM) targets
- **Auto-detection** — automatically detects each target's OS and selects the right scanners
- **Dual output** — JSON for automation, styled HTML for executive review
- **Dashboard upload** — optionally upload results to your MFTPlus dashboard

## Installation

Download the latest release for your platform:

```bash
# Linux (x86_64)
curl -sL https://releases.mftplus.co.za/latest/mft-discover-linux-x86_64.tar.gz | tar xz
chmod +x mft-discover
sudo mv mft-discover /usr/local/bin/

# Windows — download the .zip from releases.mftplus.co.za
```

## Quick Start

### Scan the local machine

The fastest way to see what transfers exist on a single machine:

```bash
mft-discover --local
```

This scans crontabs, shell scripts, and transfer tool configurations on the current host. Output is written to the current directory as `mft-discover-report-YYYY-MM-DD.json` and `.html`.

### Scan remote hosts

```bash
# Scan specific hosts via SSH
mft-discover --targets 10.0.1.5,10.0.1.20 --ssh-key ~/.ssh/id_rsa

# Scan a CIDR range
mft-discover --targets 10.0.1.0/24 --username admin --password

# Scan from a hosts file
mft-discover --targets-file hosts.txt --ssh-key ~/.ssh/id_rsa
```

### Mixed Linux/Windows environments

The tool connects via SSH first and falls back to WinRM if SSH fails. This handles mixed environments without manual classification:

```bash
# SSH key for Linux, WinRM for Windows
mft-discover --targets 10.0.1.0/24 \
  --ssh-key ~/.ssh/id_rsa \
  --winrm-domain corp.local

# Username/password for both SSH and WinRM
mft-discover --targets-file hosts.txt \
  --username admin --password
```

## What It Finds

### Linux Scanners

| Scanner | What it looks for |
|---------|-------------------|
| **Crontab** | System crontabs (`/etc/crontab`, `/etc/cron.d/`, `/etc/cron.daily/`, etc.) and per-user crontabs containing transfer commands |
| **Scripts** | Shell scripts (`.sh`) in `/usr/local/bin/`, `/opt/`, `/home/`, `/root/` containing `rsync`, `scp`, `sftp`, `ftp`, `curl`, `wget`, `rclone`, `lftp` |
| **Config Scanner** | FileZilla (`sitemanager.xml`, `recentservers.xml`), WinSCP (`WinSCP.ini`), PuTTY sessions |

### Windows Scanners

| Scanner | What it looks for |
|---------|-------------------|
| **Scheduled Tasks** | Windows Task Scheduler entries containing `robocopy`, `xcopy`, `ftp`, `pscp`, `winscp`, `curl`, `scp` |
| **Scripts** | Batch (`.bat`), command (`.cmd`), and PowerShell (`.ps1`) files in common locations |
| **Config Scanner** | WinSCP configs, FileZilla configs, PuTTY sessions (Windows Registry) |

### Detected Protocols

SFTP, FTP, FTPS, SCP, Rsync, HTTP, HTTPS, SMB, plus tools like rclone, WinSCP, and PSCP.

## Risk Flags

Each finding is analyzed for security risks:

| Flag | Meaning |
|------|---------|
| **Unencrypted** | Transfer uses FTP, HTTP, or rsync without SSH encryption |
| **Hardcoded Credentials** | Password visible in command or config file |
| **No Retry Logic** | Transfer command has no retry mechanism for transient failures |
| **No Logging** | Output is redirected to `/dev/null` or `NUL` — no audit trail |

## Output Reports

### HTML Report

The HTML report is self-contained (inline CSS, no external dependencies) and designed for:

- Printing or attaching to emails
- Executive review with summary cards at the top
- Per-host breakdown with risk flags highlighted

### JSON Report

Machine-readable format suitable for automation, scripting, or importing into other tools.

### Upload to Dashboard

Upload scan results directly to your MFTPlus dashboard:

```bash
mft-discover --targets 10.0.1.0/24 \
  --ssh-key ~/.ssh/id_rsa \
  --upload https://dashboard.mftplus.co.za \
  --token <your-api-token>
```

View results at **Dashboard > Discovery Reports** where you can filter findings, dismiss false positives, and import transfers as MFTPlus jobs.

## CLI Reference

```
mft-discover [OPTIONS]

Options:
  -t, --targets <HOSTS>        Comma-separated IPs, hostnames, or CIDR ranges
      --targets-file <PATH>     File with one host per line
      --local                   Scan local machine only
      --ssh-key <PATH>          SSH private key for authentication
  -u, --username <USER>         Username for SSH/WinRM
  -p, --password                Prompt for password (used for both SSH and WinRM)
      --winrm-domain <DOMAIN>   Windows AD domain for WinRM auth
      --upload <URL>            Upload report to MFTPlus dashboard
      --token <TOKEN>           Auth token for dashboard upload
  -o, --output <DIR>            Output directory (default: current directory)
  -h, --help                    Show help
  -V, --version                 Show version
```

## Security Considerations

- The tool runs with the privileges of the authenticated user — it can only read files accessible to that user
- No passwords are stored or transmitted to MFTPlus (only risk flag indicators)
- SSH connections use the standard ssh2 library with host key verification
- WinRM connections support Negotiate authentication with domain credentials
- Reports can be generated offline without any network connectivity to MFTPlus

## Requirements

- **Linux targets**: SSH server with key or password authentication
- **Windows targets**: WinRM enabled (HTTP port 5985 or HTTPS port 5986) with PowerShell Remoting
- **Local scan**: No special requirements — runs on the current machine
