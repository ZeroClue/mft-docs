---
title: Installation Guide - MFTPlus Documentation
description: "Install the MFTPlus CLI (mftctl) on Linux, macOS, or Windows using the one-line installer or a manual download from the official release channel."
---

# Installation

Install `mftctl` — the MFTPlus command-line tool for connecting your machines and managing transfers.

## One-Line Install (Linux & macOS)

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

The script auto-detects your platform, downloads the latest stable release, verifies its SHA-256 checksum, and installs it to `/usr/local/bin` (use `--prefix` to change the location).

Useful options:

```bash
# Install to a custom prefix
curl -fsSL https://releases.mftplus.co.za/install.sh | sh -s -- --prefix ~/.local

# Install a specific version
curl -fsSL https://releases.mftplus.co.za/install.sh | sh -s -- --version v0.7.0

# Print what would be done without installing
curl -fsSL https://releases.mftplus.co.za/install.sh | sh -s -- --dry-run
```

### Windows (PowerShell)

```powershell
irm https://releases.mftplus.co.za/install.ps1 | iex
```

## Manual Download

All release artifacts are published at [releases.mftplus.co.za](https://releases.mftplus.co.za). The **latest stable** files are always available under [`/latest/`](https://releases.mftplus.co.za/latest/), and every version keeps a permanent copy at `https://releases.mftplus.co.za/v{version}/`.

`mftctl` archives (pick the file matching the version shown on the channel):

| Platform | Architecture | Archive |
|----------|-------------|---------|
| Linux | amd64 (x86_64) | `mftctl_{version}_linux_amd64.tar.gz` |
| Linux | aarch64 (arm64) | `mftctl_{version}_linux_aarch64.tar.gz` |
| macOS | Universal (Intel & Apple Silicon) | `mftctl_{version}_macos-universal.tar.gz` |
| Windows | amd64 (x86_64) | `mftctl_{version}_windows_amd64.zip` |

**Linux:**

```bash
tar xzf mftctl_{version}_linux_amd64.tar.gz
sudo mv mftctl /usr/local/bin/

# Verify
mftctl --version
```

**macOS:**

```bash
tar xzf mftctl_{version}_macos-universal.tar.gz
sudo mv mftctl /usr/local/bin/

# Verify
mftctl --version
```

**Windows (PowerShell):**

```powershell
Expand-Archive .\mftctl_{version}_windows_amd64.zip -DestinationPath .
Move-Item .\mftctl.exe C:\Windows\System32\

# Verify
mftctl --version
```

The same channel also hosts the headless agent CLI (`mft-agent-cli_{version}_*`) for Linux servers — see [Install Agent](./install-agent).

## Verify Your Download

Every release directory includes a `checksums.sha256` file covering all artifacts:

```bash
# From the directory containing your downloaded archive
curl -fsSL -O https://releases.mftplus.co.za/latest/checksums.sha256
grep "mftctl" checksums.sha256 | sha256sum -c -
```

The one-line installer performs this check automatically.

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Linux kernel 3.10+, macOS 10.15+, Windows 10+ | Latest LTS versions |
| **Architecture** | amd64 (x86_64), aarch64 (arm64) | amd64 |
| **Memory** | 50 MB RAM | 100 MB RAM |
| **Disk** | 20 MB free space | 50 MB free space |
| **Network** | HTTPS access to `dashboard.mftplus.co.za` | Stable internet connection |

## Configuration Directory

`mftctl` stores its configuration in a single JSON file:

- **Linux/macOS**: `~/.mftctl/config.json`
- **Windows**: `%USERPROFILE%\.mftctl\config.json`

You normally don't edit this file by hand — manage it with the built-in commands:

```bash
mftctl config set server-url https://dashboard.mftplus.co.za
mftctl config get server-url
mftctl config list
```

Valid keys are `server-url`, `api-key`, and `jwt`. There are no environment-variable overrides; use these commands or pass flags directly (for example `mftctl login <api-key> --server <url>`).

Configuration is created automatically when you run `mftctl login` — see [Quick Start](./quick-start) for the full walkthrough.

## Upgrading

Re-run the installer to move to the latest stable release:

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

Or replace the binary manually with the newest archive from the [release channel](https://releases.mftplus.co.za/latest/). Your configuration is preserved.

## Uninstalling

Remove the binary and optionally the configuration directory:

```bash
# Remove binary
sudo rm /usr/local/bin/mftctl

# Remove configuration (optional)
rm -rf ~/.mftctl
```

**Windows:**
```powershell
# Remove binary
Remove-Item C:\Windows\System32\mftctl.exe

# Remove configuration (optional)
Remove-Item $env:USERPROFILE\.mftctl -Recurse
```

## Troubleshooting

### Binary Won't Run

```bash
# Confirm the architecture matches your machine (amd64 / aarch64)
uname -m

# Check for missing libraries
ldd /usr/local/bin/mftctl

# Run with debug logging for more detail
mftctl --debug agents list
```

### Network Connectivity

Verify you can reach the release server:

```bash
curl -I https://releases.mftplus.co.za
```

For dashboard connection problems, see the [Troubleshooting Guide](./troubleshooting).

## Next Steps

- [Quick Start](./quick-start) - Connect to MFTPlus and send your first transfer
- [CLI Commands](../api/cli) - Complete command reference
- [Architecture](./architecture) - Learn how MFTPlus works

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
