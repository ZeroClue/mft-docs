# Installation

Install the MFTPlus agent CLI on your system.

## Download Binary

Download the tar.gz archive for your platform from [releases.mftplus.co.za](https://releases.mftplus.co.za/latest/):

| Platform | Architecture | Download |
|----------|-------------|----------|
| Linux | x86_64 | [mft-agent-cli-linux-x86_64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-linux-x86_64.tar.gz) |
| Linux | aarch64 | [mft-agent-cli-linux-aarch64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-linux-aarch64.tar.gz) |
| Windows | x86_64 | [mft-agent-cli-windows-x86_64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-windows-x86_64.tar.gz) |
| macOS (Intel) | x86_64 | [mft-agent-cli-macos-x86_64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-macos-x86_64.tar.gz) |
| macOS (Apple Silicon) | aarch64 | [mft-agent-cli-macos-aarch64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-macos-aarch64.tar.gz) |

macOS CLI binary support added in v0.6.2. Windows CLI binary support added in v0.6.2.

## One-Line Install

If you have `curl` or `wget` available:

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

**Windows (PowerShell):**

```powershell
iex ((New-Object System.Net.WebClient).DownloadString('https://releases.mftplus.co.za/install.ps1'))
```

These scripts download the correct binary for your platform and place it in a system PATH directory.

## Manual Installation

### Linux

```bash
# Download
wget https://releases.mftplus.co.za/latest/mft-agent-cli-linux-x86_64.tar.gz

# Extract
tar xzf mft-agent-cli-linux-x86_64.tar.gz

# Copy to PATH
sudo mv mft-agent-cli /usr/local/bin/

# Verify
mft-agent-cli --version
```

### macOS

```bash
# Download
curl -OL https://releases.mftplus.co.za/latest/mft-agent-cli-macos-x86_64.tar.gz

# Extract
tar xzf mft-agent-cli-macos-x86_64.tar.gz

# Copy to PATH
sudo mv mft-agent-cli /usr/local/bin/

# Verify
mft-agent-cli --version
```

::: tip Apple Silicon
If you are on Apple Silicon (M1/M2/M3), use the `aarch64` variant instead of `x86_64`.

Check your architecture:
```bash
uname -m
# x86_64 = Intel
# arm64 = Apple Silicon
```
:::

### Windows

```powershell
# Download
Invoke-WebRequest -Uri https://releases.mftplus.co.za/latest/mft-agent-cli-windows-x86_64.tar.gz -OutFile mft-agent-cli-windows-x86_64.tar.gz

# Extract
tar xzf mft-agent-cli-windows-x86_64.tar.gz

# Move to PATH directory
Move-Item .\mft-agent-cli.exe C:\Windows\System32\

# Verify
mft-agent-cli --version
```

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Linux kernel 3.10+, Windows 10+, macOS 10.15+ | Latest LTS versions |
| **Architecture** | x86_64 (amd64), ARM64 (aarch64) | x86_64 |
| **Memory** | 50 MB RAM | 100 MB RAM |
| **Disk** | 20 MB free space | 50 MB free space |
| **Network** | HTTPS access to dashboard | Stable internet connection |

Linux CLI available now. Windows CLI and macOS CLI supported in v0.6.2+.

## Configuration Directory

MFTPlus stores configuration and data in:

- **Linux**: `~/.config/mft-agent/`
- **macOS**: `~/Library/Application Support/mft-agent/`
- **Windows**: `%APPDATA%\mft-agent\`

**Directory contents:**
- `config.yaml` - Server URL and agent settings
- `certificates/` - Encryption keys (permissions: 600)
- `transfers.db` - SQLite transfer log
- `logs/` - Application logs

## Server URL Configuration

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
# ~/.config/mft-agent/config.yaml
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
sudo rm /usr/local/bin/mft-agent-cli

# Remove configuration (optional)
rm -rf ~/.config/mft-agent
```

**Windows:**
```powershell
# Remove binary
Remove-Item C:\Windows\System32\mft-agent-cli.exe

# Remove configuration (optional)
Remove-Item $env:APPDATA\mft-agent -Recurse
```

## Troubleshooting

### Binary Won't Run

**Linux:**
```bash
# Check for missing libraries
ldd /usr/local/bin/mft-agent-cli

# View detailed logs
mft-agent-cli --verbose
```

**macOS:**
```bash
# Verify Gatekeeper allows the binary
xattr -d com.apple.quarantine /usr/local/bin/mft-agent-cli
```

**Windows:**
- Check Windows Defender or antivirus logs
- Run PowerShell as administrator if permission errors occur

### Permission Errors

Ensure the agent process has read/write access to:
- Configuration directory (`~/.config/mft-agent/` or equivalent)
- Certificate directory (`~/.config/mft-agent/certificates/`)
- Transfer log database (`~/.config/mft-agent/transfers.db`)

### Network Connectivity

Verify the agent can reach the dashboard:

```bash
# Test dashboard connectivity
curl -v http://localhost:8080/health

# Check firewall rules
sudo ufw status  # Linux
netsh advfirewall show allprofiles  # Windows
```

## Data Directories

| Directory | Purpose |
|-----------|---------|
| `config.yaml` | Agent configuration |
| `certificates/` | Encryption keys (600 permissions) |
| `transfers.db` | SQLite transfer log |
| `logs/` | Application logs |
| `jobs/` | Scheduled job definitions |

## Next Steps

- [Quick Start](./quick-start) - Create your first transfer
- [Architecture](./architecture) - Learn how MFTPlus works
- [Configuration](../api/config) - Configuration options

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
