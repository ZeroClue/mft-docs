# Install mftctl

Install `mftctl` — the MFTPlus command-line tool for managing agents, transfers, jobs, and audit.

## Quick Install (Linux & macOS)

Install the latest version with a single command:

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

### Options

```bash
# Install a specific version
curl -fsSL https://releases.mftplus.co.za/install.sh | sh -s -- --version v0.7.0

# Install to a custom prefix
curl -fsSL https://releases.mftplus.co.za/install.sh | sh -s -- --prefix ~/.local

# Dry run (print what would be done)
curl -fsSL https://releases.mftplus.co.za/install.sh | sh -s -- --dry-run
```

The install script supports Linux (amd64, arm64) and macOS (Intel, Apple Silicon).

### Windows (PowerShell)

```powershell
irm https://releases.mftplus.co.za/install.ps1 | iex
```

## Manual Download

Download the latest binary for your platform:

| Platform | Architecture | Download URL |
|----------|-------------|--------------|
| Linux | amd64 | `https://releases.mftplus.co.za/latest/mftctl_linux_amd64` |
| Linux | arm64 | `https://releases.mftplus.co.za/latest/mftctl_linux_arm64` |
| macOS | Universal (Intel & Apple Silicon) | `https://releases.mftplus.co.za/latest/mftctl_darwin_universal` |
| Windows | amd64 | `https://releases.mftplus.co.za/latest/mftctl_windows_amd64.exe` |

### Manual Install Steps

**Linux (amd64):**
```bash
curl -fsSL https://releases.mftplus.co.za/latest/mftctl_linux_amd64 -o mftctl
chmod +x mftctl
sudo mv mftctl /usr/local/bin/
```

**macOS (Universal):**
```bash
curl -fsSL https://releases.mftplus.co.za/latest/mftctl_darwin_universal -o mftctl
chmod +x mftctl
sudo mv mftctl /usr/local/bin/
```

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri https://releases.mftplus.co.za/latest/mftctl_windows_amd64.exe -OutFile mftctl.exe
# Move to a directory in your PATH, e.g.:
Move-Item .\mftctl.exe C:\Windows\System32\
```

## Verify Installation

```bash
mftctl --version
```

## Checksum Verification

Each release includes a checksums file for binary integrity verification:

```bash
curl -fsSL https://releases.mftplus.co.za/latest/checksums.txt

# Verify downloaded binary (Linux/macOS)
sha256sum -c <(grep mftctl_linux_amd64 checksums.txt)
```

## Configuration

mftctl stores configuration at:

- **Linux/macOS**: `~/.mftctl/config.json`
- **Windows**: `%USERPROFILE%\.mftctl\config.json`

Initialize the configuration file:

```bash
mftctl config init
```

Set your dashboard server URL:

```bash
mftctl config set server-url https://dashboard.mftplus.co.za
```

Authenticate with your API key:

```bash
mftctl login pc-api-xxxxxxxxxxxxxxxx
```

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Linux kernel 3.10+, macOS 10.15+, Windows 10+ | Latest LTS versions |
| **Architecture** | amd64, arm64 | amd64 |
| **Disk** | 10 MB free space | 25 MB free space |
| **Network** | HTTPS access to dashboard | Stable internet connection |

## Upgrading

Re-run the install script or download the latest binary:

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

## Uninstalling

```bash
# Remove binary
sudo rm /usr/local/bin/mftctl

# Remove configuration (optional)
rm -rf ~/.mftctl
```

## Troubleshooting

### Binary Not Found

Ensure `/usr/local/bin` is in your PATH:

```bash
echo $PATH
which mftctl
```

### Permission Denied

Ensure the binary has execute permissions:

```bash
chmod +x /usr/local/bin/mftctl
```

## Next Steps

- [Quick Start](./quick-start) — Start using mftctl
- [CLI Commands](../api/cli) — Complete command reference
- [Install Agent](./install-agent) — Install the agent runtime on servers
