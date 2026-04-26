# Installation

Install MFTPlus on your system.

## Quick Install (One-Line)

**macOS / Linux:**

```bash
curl -fsSL https://docs.mftplus.co.za/install.sh | sh
```

This installs `mftctl` — the MFTPlus command-line interface — to `/usr/local/bin/`.

::: tip
After installing, initialize your configuration:
```bash
mftctl config init
```
:::

---

## Desktop Agent Installers

Download the latest installer for your platform from [releases.mftplus.co.za](https://releases.mftplus.co.za/latest/):

| Platform | Download |
|----------|----------|
| Windows | [MFTPlus-x.x.x-x64_64.msi](https://releases.mftplus.co.za/latest/mftplus-x64_64.msi) |
| macOS (Intel) | [MFTPlus-x.x.x-x86_64.dmg](https://releases.mftplus.co.za/latest/mftplus-x86_64.dmg) |
| macOS (Apple Silicon) | [MFTPlus-x.x.x-aarch64.dmg](https://releases.mftplus.co.za/latest/mftplus-aarch64.dmg) |
| Linux (Debian/Ubuntu) | [mftplus_amd64.deb](https://releases.mftplus.co.za/latest/mftplus_amd64.deb) |
| Linux (RHEL/CentOS/Fedora) | [mftplus-x86_64.rpm](https://releases.mftplus.co.za/latest/mftplus-x86_64.rpm) |

## Platform-Specific Instructions

### Windows

1. Download `MFTPlus-x.x.x-x64_64.msi`
2. Double-click the installer
3. Follow the installation wizard
4. Launch MFTPlus from the Start Menu

**Verify installation:**
```powershell
# Check application directory
dir "C:\Program Files\MFTPlus"

# View version
fileversioninfo "C:\Program Files\MFTPlus\MFTPlus.exe"
```

### macOS

1. Download the appropriate DMG for your architecture:
   - **Intel**: `MFTPlus-x.x.x-x86_64.dmg`
   - **Apple Silicon**: `MFTPlus-x.x.x-aarch64.dmg`

2. Open the DMG file
3. Drag MFTPlus to Applications
4. Launch MFTPlus from Applications

**Verify installation:**
```bash
# Check application
ls /Applications/MFTPlus.app

# View version info
defaults read /Applications/MFTPlus.app/Contents/Info.plist CFBundleShortVersionString
```

::: tip Apple Silicon
To check your Mac architecture:
```bash
uname -m
# x86_64 = Intel
# arm64 = Apple Silicon
```
:::

### Linux

#### Debian/Ubuntu

```bash
# Download and install
wget https://releases.mftplus.co.za/latest/mftplus_amd64.deb
sudo dpkg -i mftplus_amd64.deb

# Launch
mftplus
```

#### RHEL/CentOS/Fedora

```bash
# Download and install
wget https://releases.mftplus.co.za/latest/mftplus-x86_64.rpm
sudo rpm -i mftplus-x86_64.rpm

# Launch
mftplus
```

::: tip Missing Dependencies
If you see dependency errors, install missing packages:
```bash
# Debian/Ubuntu
sudo apt-get install -f

# RHEL/CentOS/Fedora
sudo yum install missing-package-name
```
:::

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Windows 10+, macOS 10.15+, Linux kernel 3.10+ | Latest LTS versions |
| **Architecture** | x86_64 (amd64), ARM64 (aarch64) | x86_64 |
| **Memory** | 100 MB RAM | 200 MB RAM |
| **Disk** | 50 MB free space | 100 MB free space |
| **Network** | HTTPS access to dashboard | Stable internet connection |

## Configuration Directory

MFTPlus stores configuration and data in:

- **Linux**: `~/.config/mftplus/`
- **macOS**: `~/Library/Application Support/mftplus/`
- **Windows**: `%APPDATA%\mftplus\`

**Directory contents:**
- `config.yaml` - Server URL and agent settings
- `certificates/` - Encryption keys (permissions: 600)
- `transfers.db` - SQLite transfer log
- `logs/` - Application logs

## Server URL Configuration

On first launch, MFTPlus prompts for your dashboard server URL.

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

Download and run the latest installer. The new version will replace the existing one while preserving your configuration and transfer history.

::: warning Configuration Compatibility
Major version updates may require configuration changes. Review the release notes before upgrading.
:::

## Uninstalling

### Windows

1. Open **Settings** → **Apps**
2. Find **MFTPlus**
3. Click **Uninstall**
4. Optionally remove `%APPDATA%\mftplus` to delete configuration

### macOS

```bash
# Remove application
rm -rf /Applications/MFTPlus.app

# Optionally remove configuration
rm -rf ~/Library/Application Support/mftplus
```

### Linux

```bash
# Debian/Ubuntu
sudo apt-get remove mftplus

# RHEL/CentOS/Fedora
sudo yum remove mftplus

# Optionally remove configuration
rm -rf ~/.config/mftplus
```

## Troubleshooting

### Application Won't Launch

**Linux:**
```bash
# Check for missing libraries
ldd /usr/bin/mftplus

# View detailed logs
mftplus --verbose
```

**Windows:**
- Check Event Viewer for application errors
- Run as administrator if permission errors occur

**macOS:**
- Verify Gatekeeper allows the app: `xattr -d com.apple.quarantine /Applications/MFTPlus.app`
- Check Console.app for crash logs

### Permission Errors

Ensure the agent process has read/write access to:
- Configuration directory (`~/.config/mftplus/` or equivalent)
- Certificate directory (`~/.config/mftplus/certificates/`)
- Transfer log database (`~/.config/mftplus/transfers.db`)

### Network Connectivity

Verify the agent can reach the dashboard:

```bash
# Test dashboard connectivity
curl -v http://localhost:8080/health

# Check firewall rules
sudo ufw status  # Linux
netsh advfirewall show allprofiles  # Windows
```

**Need more help?** See the [Troubleshooting Guide](./troubleshooting) for comprehensive solutions to installation and configuration issues.

## Data Directories

| Directory | Purpose |
|-----------|---------|
| `config.yaml` | Agent configuration |
| `certificates/` | Encryption keys (600 permissions) |
| `transfers.db` | SQLite transfer log |
| `logs/` | Application logs |
| `jobs/` | Scheduled job definitions |

## Next Steps

- [Quick Start](./quick-start) — Transfer your first file in 5 minutes
- [Production Deployment](./deployment) — Deploy MFTPlus with Docker in production
- [CLI Reference](../api/cli) — Complete `mftctl` command reference
- [Architecture](./architecture) — Learn how MFTPlus works
- [Configuration](../api/config) — Configuration options
- [Security & Authentication](./security) — Secure your deployment

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
