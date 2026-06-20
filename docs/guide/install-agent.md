# Install MFTPlus Agent

Install the MFTPlus agent runtime on your servers. The agent runs as a background service and executes file transfers, scheduled jobs, and communicates with the MFTPlus dashboard.

## Linux

### Debian/Ubuntu

```bash
# Download and install
wget https://releases.mftplus.co.za/latest/mftplus_amd64.deb
sudo dpkg -i mftplus_amd64.deb

# Start the agent
sudo systemctl start mft-agent

# Enable on boot
sudo systemctl enable mft-agent
```

### RHEL/CentOS/Fedora

```bash
# Download and install
wget https://releases.mftplus.co.za/latest/mftplus-x86_64.rpm
sudo rpm -i mftplus-x86_64.rpm

# Start the agent
sudo systemctl start mft-agent

# Enable on boot
sudo systemctl enable mft-agent
```

### Manual Linux Install (tar.gz)

```bash
# Download
wget https://releases.mftplus.co.za/latest/mftplus_linux_amd64.tar.gz

# Extract
tar xzf mftplus_linux_amd64.tar.gz

# Copy binary
sudo mv mft-agent-cli /usr/local/bin/

# Install systemd service (optional)
sudo mft-agent-cli service install

# Start the agent
sudo systemctl start mft-agent
```

## macOS

Download the DMG for your architecture:

- **Intel**: [MFTPlus-x86_64.dmg](https://releases.mftplus.co.za/latest/mftplus-x86_64.dmg)
- **Apple Silicon**: [MFTPlus-aarch64.dmg](https://releases.mftplus.co.za/latest/mftplus-aarch64.dmg)

Open the DMG and drag MFTPlus to Applications. Launch from Applications.

## Windows

Download the installer:

- [MFTPlus-x64_64.msi](https://releases.mftplus.co.za/latest/mftplus-x64_64.msi)

Double-click the installer and follow the wizard. Launch MFTPlus from the Start Menu.

## Agent CLI Commands

The agent binary (`mft-agent-cli`) provides commands for managing the agent service:

```bash
# Start the agent (foreground)
mft-agent-cli start

# Start as a daemon
mft-agent-cli start --daemon

# Start with a custom config
mft-agent-cli start --config /etc/mft-agent/config.toml

# Stop the agent
mft-agent-cli stop

# Check agent status
mft-agent-cli status

# Configure initial settings
mft-agent-cli configure --dashboard-url https://dashboard.mftplus.co.za --api-key pc-api-xxxxxxxxxxxxxxxx

# List recent transfers
mft-agent-cli list-transfers --limit 20
```

## Configuration

The agent stores configuration at:

- **Linux/macOS**: `~/.config/mft-agent/config.toml`
- **Windows**: `%APPDATA%\mft-agent\config.toml`

The configuration uses TOML format:

```toml
# Dashboard connection
dashboard_url = "https://dashboard.mftplus.co.za"
api_key = "pc-api-xxxxxxxxxxxxxxxx"

# Agent identity
agent_name = "production-server-01"
tags = ["production", "eu-west"]

# Telemetry
enable_telemetry = true
```

## Systemd Service

When installed via .deb or .rpm, the agent registers as a systemd service:

```bash
# Service management
sudo systemctl status mft-agent
sudo systemctl restart mft-agent
sudo systemctl stop mft-agent

# View logs
journalctl -u mft-agent -f
```

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Windows 10+, macOS 10.15+, Linux kernel 3.10+ | Latest LTS versions |
| **Architecture** | x86_64 (amd64), ARM64 (aarch64) | x86_64 |
| **Memory** | 100 MB RAM | 200 MB RAM |
| **Disk** | 50 MB free space | 100 MB free space |
| **Network** | HTTPS access to dashboard | Stable internet connection |

## Upgrading

On Linux, use the package manager:

```bash
# Debian/Ubuntu
sudo apt-get update && sudo apt-get upgrade mftplus

# RHEL/CentOS/Fedora
sudo yum update mftplus
```

Or download and install the latest package.

## Uninstalling

### Linux

```bash
# Debian/Ubuntu
sudo apt-get remove mftplus

# RHEL/CentOS/Fedora
sudo yum remove mftplus

# Optionally remove configuration
rm -rf ~/.config/mft-agent
```

### macOS

```bash
rm -rf /Applications/MFTPlus.app
rm -rf ~/Library/Application\ Support/mft-agent
```

### Windows

1. Open **Settings** → **Apps**
2. Find **MFTPlus**
3. Click **Uninstall**
4. Optionally remove `%APPDATA%\mft-agent`

## Troubleshooting

### Agent Won't Start

Check the service status and logs:

```bash
sudo systemctl status mft-agent
journalctl -u mft-agent -n 50
```

### Missing Dependencies

```bash
# Debian/Ubuntu
sudo apt-get install -f

# RHEL/CentOS/Fedora
sudo yum install missing-package-name
```

## Next Steps

- [Quick Start](./quick-start) — Create your first transfer
- [Install mftctl](./install-mftctl) — Install the CLI management tool
- [Architecture](./architecture) — Learn how MFTPlus works
