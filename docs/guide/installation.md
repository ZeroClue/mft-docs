# Installation

Install `mftctl` — the MFTPlus command-line tool.

## Quick Install (Linux & macOS)

Install the latest version with a single command:

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

### Windows (PowerShell)

```powershell
irm https://releases.mftplus.co.za/install.ps1 | iex
```

## Download Binary Manually

Download the latest release for your platform:

| Platform | Download URL |
|----------|-------------|
| Linux (amd64) | `https://releases.mftplus.co.za/latest/mftctl_linux_amd64` |
| Linux (arm64) | `https://releases.mftplus.co.za/latest/mftctl_linux_arm64` |
| macOS (Universal) | `https://releases.mftplus.co.za/latest/mftctl_darwin_universal` |
| Windows (amd64) | `https://releases.mftplus.co.za/latest/mftctl_windows_amd64.exe` |

### Manual installation steps

```bash
# Linux (amd64)
curl -fsSL https://releases.mftplus.co.za/latest/mftctl_linux_amd64 -o mftctl
chmod +x mftctl
sudo mv mftctl /usr/local/bin/

# macOS (Universal - Intel & Apple Silicon)
curl -fsSL https://releases.mftplus.co.za/latest/mftctl_darwin_universal -o mftctl
chmod +x mftctl
sudo mv mftctl /usr/local/bin/

# Verify installation
mftctl version
```

## Checksum Verification

Each release includes a checksums file to verify binary integrity:

```bash
curl -fsSL https://releases.mftplus.co.za/latest/checksums.txt

# Verify downloaded binary (Linux/macOS)
sha256sum -c <(grep mftctl_linux_amd64 checksums.txt)
```

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Linux kernel 3.10+, macOS 10.15+, Windows 10+ | Latest LTS versions |
| **Architecture** | amd64, arm64 | amd64 |
| **Disk** | 10 MB free space | 25 MB free space |
| **Network** | HTTPS access to dashboard | Stable internet connection |

## Configuration Directory

mftctl stores configuration at:

- **Linux/macOS**: `~/.mftctl/config.json`
- **Windows**: `%USERPROFILE%\.mftctl\config.json`

**Directory contents:**
- `config.json` - Server URL, API key, and CLI settings

## Configuration

Initialize the configuration file:

```bash
mftctl config init
mftctl config set server-url https://dashboard.mftplus.co.za
```

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
