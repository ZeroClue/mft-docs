---
title: CLI Agent Installation
description: Install and configure the MFTPlus CLI agent (mft-agent-cli) for headless file transfer operations on Linux systems.
---

# CLI Agent Installation

Install the MFTPlus CLI agent (`mft-agent-cli`) for headless, scriptable file transfer operations on Linux systems.

## Prerequisites

Before installing the CLI agent:

- **Operating System**: Linux (glibc 2.17+)
- **Architecture**: x86_64 (amd64)
- **Network**: HTTPS access to `dashboard.mftplus.co.za`

## Step 1: Create an Account

Before installing the agent, you need an API key:

1. Navigate to [dashboard.mftplus.co.za](https://dashboard.mftplus.co.za)
2. Click **Sign Up** and create your account
3. Verify your email address
4. Log in to the dashboard

## Step 2: Generate an API Key

The CLI agent requires an API key for authentication:

1. In the dashboard, navigate to **Settings** → **API Keys**
2. Click **Generate New API Key**
3. Copy the generated key — it will only be shown once
4. Store it securely; you'll need it during agent configuration

::: warning Keep Your API Key Secret
API keys grant full access to your MFTPlus account. Never commit them to version control or share them publicly.
:::

## Step 3: Download the CLI Agent

Download version 0.2.0 from the public download server:

| Format | Download |
|--------|----------|
| **tar.gz** | [mft-agent-cli_0.2.0_linux_amd64.tar.gz](https://releases.mftplus.co.za/v0.2.0/mft-agent-cli_0.2.0_linux_amd64.tar.gz) |
| **DEB** | [MFT.Agent_0.2.0_amd64.deb](https://releases.mftplus.co.za/v0.2.0/MFT.Agent_0.2.0_amd64.deb) |
| **RPM** | [MFT.Agent_0.2.0_x86_64.rpm](https://releases.mftplus.co.za/v0.2.0/MFT.Agent_0.2.0_x86_64.rpm) |
| **AppImage** | [MFT.Agent_0.2.0_amd64.AppImage](https://releases.mftplus.co.za/v0.2.0/MFT.Agent_0.2.0_amd64.AppImage) |

```bash
# Download tar.gz archive
wget https://releases.mftplus.co.za/v0.2.0/mft-agent-cli_0.2.0_linux_amd64.tar.gz
```

## Step 4: Verify Checksum

Verify the downloaded file integrity using SHA256 checksums:

```bash
# Download checksums
wget https://releases.mftplus.co.za/v0.2.0/checksums.sha256

# Verify the tar.gz archive
sha256sum -c --ignore-missing checksums.sha256
# Expected output: mft-agent-cli_0.2.0_linux_amd64.tar.gz: OK
```

::: danger Security Warning
Do not install the agent if checksum verification fails. Download the file again and contact support if the issue persists.
:::

## Step 5: Install the Agent

Choose your preferred installation method:

### tar.gz (Portable)

Extract and install to `/usr/local/bin`:

```bash
# Extract the archive
tar -xzf mft-agent-cli_0.2.0_linux_amd64.tar.gz

# Install to system path
sudo install mft-agent-cli /usr/local/bin/

# Verify installation
mft-agent-cli --help
```

### DEB Package (Debian/Ubuntu)

```bash
# Download and install
wget https://releases.mftplus.co.za/v0.2.0/MFT.Agent_0.2.0_amd64.deb
sudo dpkg -i MFT.Agent_0.2.0_amd64.deb

# Fix any missing dependencies
sudo apt-get install -f

# Verify installation
mft-agent-cli --help
```

### RPM Package (RHEL/CentOS/Fedora)

```bash
# Download and install
wget https://releases.mftplus.co.za/v0.2.0/MFT.Agent_0.2.0_x86_64.rpm
sudo rpm -i MFT.Agent_0.2.0_x86_64.rpm

# Verify installation
mft-agent-cli --help
```

### AppImage (Universal)

```bash
# Download
wget https://releases.mftplus.co.za/v0.2.0/MFT.Agent_0.2.0_amd64.AppImage

# Make executable
chmod +x MFT.Agent_0.2.0_amd64.AppImage

# Run (add to PATH for convenience)
sudo mv MFT.Agent_0.2.0_amd64.AppImage /usr/local/bin/mft-agent-cli

# Verify installation
mft-agent-cli --help
```

## Step 6: Configure the Agent

Use the built-in `configure` command to set up your API key. This creates the configuration file automatically:

```bash
# Configure with your API key
./mft-agent-cli configure --api-key YOUR_API_KEY_HERE
```

The agent will create `~/.config/mft-agent/config.toml` with the following format:

```toml
dashboard_url = "https://dashboard.mftplus.co.za"
api_key = "nyxcoolminds-xxxxxxxx"
telemetry_enabled = true
app_version = "0.2.0"
```

::: tip Additional Configure Options
```bash
# Specify custom dashboard URL
./mft-agent-cli configure --dashboard-url https://custom.example.com --api-key YOUR_KEY

# Disable telemetry
./mft-agent-cli configure --api-key YOUR_KEY --enable-telemetry false

# Use custom config file path
./mft-agent-cli configure --api-key YOUR_KEY -c /path/to/config.toml
```
:::

## Step 7: Start the Agent

Start the agent in the foreground for testing:

```bash
# Start in foreground (Ctrl+C to stop)
mft-agent-cli start
```

For production deployments, run as a systemd service (see below).

## Configuration Directory

The CLI agent stores data in:

| Location | Purpose |
|----------|---------|
| `~/.config/mft-agent/config.toml` | Configuration file (created by `configure` command) |
| `~/.local/share/mft-agent/agent.db` | Transfer database |

## Running as a Systemd Service

For production deployments, run the CLI agent as a systemd service:

```bash
# Create service file
sudo cat > /etc/systemd/system/mft-agent.service << 'EOF'
[Unit]
Description=MFTPlus CLI Agent
After=network.target

[Service]
Type=simple
User=$USER
ExecStart=/usr/local/bin/mft-agent-cli start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable mft-agent.service
sudo systemctl start mft-agent.service

# Check service status
sudo systemctl status mft-agent.service
```

## CLI Reference

### Available Commands

```text
Usage: mft-agent-cli <COMMAND>

Commands:
  start           Start the agent engine (runs in foreground)
  stop            Stop a running agent
  status          Show current agent status
  list-transfers  List recent transfers
  configure       Configure initial settings
  jobs            Manage scheduled transfer jobs
  help            Print this message or the help of the command(s)
```

### Common Commands

```bash
# Show agent status
mft-agent-cli status

# List recent transfers
mft-agent-cli list-transfers

# Manage scheduled jobs
mft-agent-cli jobs

# Show help for a specific command
mft-agent-cli start --help
```

## Upgrading

Download and install the new version using the same method as initial installation. Configuration and data are preserved across upgrades.

```bash
# Download latest version
wget https://releases.mftplus.co.za/v0.2.0/mft-agent-cli_0.2.0_linux_amd64.tar.gz

# Verify checksums
wget https://releases.mftplus.co.za/v0.2.0/checksums.sha256
sha256sum -c --ignore-missing checksums.sha256

# Install
tar -xzf mft-agent-cli_0.2.0_linux_amd64.tar.gz
sudo install mft-agent-cli /usr/local/bin/

# Restart the service (if running as systemd)
sudo systemctl restart mft-agent.service
```

## Uninstalling

### tar.gz / AppImage

```bash
# Stop and disable service (if running)
sudo systemctl stop mft-agent.service
sudo systemctl disable mft-agent.service

# Remove binary
sudo rm /usr/local/bin/mft-agent-cli

# Optionally remove configuration and data
rm -rf ~/.config/mft-agent
rm -rf ~/.local/share/mft-agent
```

### DEB Package

```bash
sudo apt-get remove mft-agent
```

### RPM Package

```bash
sudo yum remove mft-agent
```

## Troubleshooting

### Permission Denied

If you get permission errors running the agent:

```bash
# Ensure the binary is executable
chmod +x /usr/local/bin/mft-agent-cli

# Check file permissions
ls -la /usr/local/bin/mft-agent-cli
```

### Configuration Issues

To reconfigure the agent:

```bash
# Run configure again with new settings
mft-agent-cli configure --api-key YOUR_NEW_KEY
```

### Connection Failed

If the agent cannot connect to the dashboard:

```bash
# Test network connectivity
curl -v https://dashboard.mftplus.co.za

# Check firewall rules
sudo ufw status

# Verify configuration
cat ~/.config/mft-agent/config.toml
```

### Service Not Starting

If the systemd service fails to start:

```bash
# View service logs
sudo journalctl -u mft-agent.service -n 50

# Check service status
sudo systemctl status mft-agent.service

# Test the agent manually first
mft-agent-cli start
```

## Next Steps

- [Quick Start](./quick-start) - Create your first transfer job
- [Architecture](./architecture) - Learn how MFTPlus works
- [Transfer Protocol](./protocol) - Understand transfer behavior

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
