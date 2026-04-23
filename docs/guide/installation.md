# Installation

Install `mftctl`, the MFTPlus command-line interface, on your system.

## Quick Install (Recommended)

The fastest way to install mftctl on Linux or macOS:

```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

This installs the latest version to `/usr/local/bin` (requires sudo) or `~/.local/bin` (fallback).

::: verify Verifying Installation
```bash
mftctl --version
```
:::

## Installation Options

### Custom Directory

Install to a specific directory:

```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh -s - -d ~/bin
```

### Specific Version

Install a specific version:

```bash
MFTCTL_VERSION=1.0.0 curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

### Manual Download

Download the binary directly from [releases.mftplus.co.za](https://releases.mftplus.co.za/latest/):

| Platform | Binary |
|----------|--------|
| Linux (amd64) | `mftctl-linux-amd64` |
| Linux (arm64) | `mftctl-linux-arm64` |
| macOS (Intel) | `mftctl-macos-amd64` |
| macOS (Apple Silicon) | `mftctl-macos-arm64` |
| Windows (amd64) | `mftctl-windows-amd64.exe` |

```bash
# Download
wget https://releases.mftplus.co.za/latest/mftctl-linux-amd64

# Make executable
chmod +x mftctl-linux-amd64

# Move to PATH
sudo mv mftctl-linux-amd64 /usr/local/bin/mftctl
```

## Platform-Specific Instructions

### Linux

**Debian/Ubuntu:**
```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

**RHEL/CentOS/Fedora:**
```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

**NixOS:**
```bash
nix-env -iA nixpkgs.mftctl
```

### macOS

**Homebrew:**
```bash
brew install mftplus/tap/mftctl
```

**Manual Install:**
```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

### Windows

**PowerShell (One-line):**
```powershell
iwr https://docs.mftplus.co.za/install.ps1 | iex
```

**Manual Download:**
1. Download [`mftplus-x64_64.msi`](https://releases.mftplus.co.za/latest/mftplus-x64_64.msi)
2. Run the installer
3. Restart your terminal

**Verify installation:**
```powershell
mftctl --version
```

### Docker

Run mftctl in a Docker container:

```bash
docker run --rm -it \
  -v ~/.config/mftplus:/root/.config/mftplus \
  mftplus/mftctl:latest \
  --version
```

::: tip Persistent Configuration
Mounting `~/.config/mftplus` ensures your authentication and configuration persist between container runs.
:::

## Configuration

After installation, create your configuration file:

```bash
mftctl config init
```

This creates `~/.config/mftplus/config.yaml`:

```yaml
server:
  url: https://dashboard.mftplus.co.za
  timeout: 30s

transfer:
  default-retry-count: 3
  default-timeout: 5m
  compression: true

logging:
  level: info
  format: text
```

## Authentication

Authenticate with your MFTPlus account:

```bash
mftctl login <your-api-key>
```

Your API key is available in the [MFTPlus Dashboard](https://dashboard.mftplus.co.za) under **Settings → API Keys**.

## Upgrading

Upgrade to the latest version:

```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

The installer will automatically replace the existing version.

## Uninstalling

Remove mftctl from your system:

```bash
# Remove binary
sudo rm /usr/local/bin/mftctl

# Or if installed to ~/.local/bin
rm ~/.local/bin/mftctl

# Remove configuration (optional)
rm -rf ~/.config/mftplus
```

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Linux kernel 3.10+, macOS 10.15+, Windows 10+ | Latest LTS versions |
| **Architecture** | amd64, arm64 | amd64 |
| **Memory** | 50 MB RAM | 100 MB RAM |
| **Disk** | 50 MB free space | 100 MB free space |
| **Network** | HTTPS access to dashboard.mftplus.co.za | Stable internet connection |

## Troubleshooting

### Command Not Found

If `mftctl` is not found after installation:

```bash
# Check if ~/.local/bin is in your PATH
echo $PATH | grep ~/.local/bin

# Add to PATH if missing (for bash)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Or for zsh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Permission Denied

If you can't write to `/usr/local/bin`:

```bash
# Install to user directory instead
curl -fsSL https://docs.mftplus.co.za/install.sh | sh -s - -d ~/.local/bin
```

### Checksum Verification Failed

If checksum verification fails, you can skip it (not recommended):

```bash
MFTCTL_SKIP_VERIFY=1 curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

### Firewall Issues

If you're behind a firewall, ensure outbound access to:
- `docs.mftplus.co.za` (installer)
- `releases.mftplus.co.za` (downloads)
- `dashboard.mftplus.co.za` (API)

## Next Steps

- [Quick Start](./quick-start) - Create your first transfer
- [CLI Reference](../api/cli) - Complete command documentation
- [Configuration](../api/config) - Configuration options

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
- **Issues**: [github.com/ZeroClue/mft-docs/issues](https://github.com/ZeroClue/mft-docs/issues)
