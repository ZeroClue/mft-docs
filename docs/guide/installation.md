---
title: Installation Guide - MFTPlus Documentation
description: "Install MFTPlus CLI agent on Linux or Windows using tar.gz binaries."
---

# Installation

Install the MFTPlus agent CLI on your system.

## Download Binary

Download the archive for your platform from [releases.mftplus.co.za](https://releases.mftplus.co.za/v0.6.1/):

| Platform | Architecture | Download |
|----------|-------------|----------|
| Linux | x86_64 | [mftctl_0.6.1_linux_amd64.tar.gz](https://releases.mftplus.co.za/v0.6.1/mftctl_0.6.1_linux_amd64.tar.gz) |
| Linux | aarch64 | [mftctl_0.6.1_linux_aarch64.tar.gz](https://releases.mftplus.co.za/v0.6.1/mftctl_0.6.1_linux_aarch64.tar.gz) |
| Windows | x86_64 | [mftctl_0.6.1_windows_amd64.zip](https://releases.mftplus.co.za/v0.6.1/mftctl_0.6.1_windows_amd64.zip) |

Windows CLI binary support added in v0.6.2. macOS CLI support coming in a future release.

## Manual Installation

### Linux

```bash
# Download
wget https://releases.mftplus.co.za/v0.6.1/mftctl_0.6.1_linux_amd64.tar.gz

# Extract
tar xzf mftctl_0.6.1_linux_amd64.tar.gz

# Copy to PATH
sudo mv mftctl /usr/local/bin/

# Verify
mftctl --version
```

### Windows

```powershell
# Download
Invoke-WebRequest -Uri https://releases.mftplus.co.za/v0.6.1/mftctl_0.6.1_windows_amd64.zip -OutFile mftctl_0.6.1_windows_amd64.zip

# Extract
Expand-Archive .\mftctl_0.6.1_windows_amd64.zip -DestinationPath .

# Move to PATH directory
Move-Item .\mftctl.exe C:\Windows\System32\

# Verify
mftctl --version
```

An automated installer (`install.ps1`) is also available — download and run it from an elevated PowerShell prompt:
```powershell
powershell -c "iwr https://releases.mftplus.co.za/v0.6.1/install.ps1 -OutFile install.ps1; .\install.ps1"
```

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Linux kernel 3.10+, Windows 10+ | Latest LTS versions |
| **Architecture** | x86_64 (amd64), ARM64 (aarch64) | x86_64 |
| **Memory** | 50 MB RAM | 100 MB RAM |
| **Disk** | 20 MB free space | 50 MB free space |
| **Network** | HTTPS access to dashboard | Stable internet connection |

Linux CLI available now. Windows CLI supported in v0.6.2+. macOS CLI coming in a future release.

## Configuration Directory

mftctl stores configuration at:

- **Linux**: `~/.config/mftplus/`
- **Windows**: `%APPDATA%\mftplus\`

**Directory contents:**
- `config.json` - Server URL, API key, and CLI settings

## Configuration

On first launch, the agent prompts for your dashboard server URL.

**For local development:**
```
http://localhost:8080
```

**For production deployments:**
```
https://dashboard.yourcompany.com
```

Edit manually:
```yaml
# ~/.config/mftplus/config.yaml
server:
  url: http://localhost:8080
  timeout: 30s
```

## Upgrading

Download the latest tar.gz binary and replace the existing binary in your PATH. Configuration and transfer history are preserved.

## Uninstalling

Remove the binary and optionally the configuration directory:

```bash
# Remove binary
sudo rm /usr/local/bin/mftctl

# Remove configuration (optional)
rm -rf ~/.config/mftplus
```

**Windows:**
```powershell
# Remove binary
Remove-Item C:\Windows\System32\mftctl.exe

# Remove configuration (optional)
Remove-Item $env:APPDATA\mftplus -Recurse
```

## Troubleshooting

### Binary Won't Run

```bash
# Check for missing libraries
ldd /usr/local/bin/mftctl

# View detailed logs
mftctl --verbose
```

**Windows:**
- Check Windows Defender or antivirus logs
- Run PowerShell as administrator if permission errors occur

### Permission Errors

Ensure the agent process has read/write access to:
- Configuration directory (`~/.config/mftplus/` or equivalent)
- Certificate directory (`~/.config/mftplus/certificates/`)
- Transfer log database (`~/.config/mftplus/transfers.db`)

### Network Connectivity

Verify you can reach the release server:

```bash
curl -I https://releases.mftplus.co.za
```

## Next Steps

- [Quick Start](./quick-start) - Start using mftctl
- [Architecture](./architecture) - Learn how MFTPlus works
- [CLI Commands](../api/cli) - Complete command reference

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
