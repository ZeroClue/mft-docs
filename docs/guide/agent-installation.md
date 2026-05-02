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

Download the latest release from the public download server:

| Format | Download |
|--------|----------|
| **tar.gz** | [mft-agent-cli-linux-amd64.tar.gz](https://releases.mftplus.co.za/latest/mft-agent-cli-linux-amd64.tar.gz) |
| **DEB** | [MFT.Agent_amd64.deb](https://releases.mftplus.co.za/latest/MFT.Agent_amd64.deb) |
| **RPM** | [MFT.Agent-x86_64.rpm](https://releases.mftplus.co.za/latest/MFT.Agent-x86_64.rpm) |
| **AppImage** | [MFT.Agent_amd64.AppImage](https://releases.mftplus.co.za/latest/MFT.Agent_amd64.AppImage) |

```bash
# Download tar.gz archive
wget https://releases.mftplus.co.za/latest/mft-agent-cli-linux-amd64.tar.gz
```

## Step 4: Verify Checksum

Verify the downloaded file integrity using SHA256 checksums:

```bash
# Download checksums
wget https://releases.mftplus.co.za/latest/checksums.sha256

# Verify the tar.gz archive
sha256sum -c --ignore-missing checksums.sha256
# Expected output: mft-agent-cli-linux-amd64.tar.gz: OK
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
tar -xzf mft-agent-cli-linux-amd64.tar.gz

# Install to system path
sudo install mft-agent-cli /usr/local/bin/

# Verify installation
mft-agent-cli --version
```

### DEB Package (Debian/Ubuntu)

```bash
# Download and install
wget https://releases.mftplus.co.za/latest/MFT.Agent_amd64.deb
sudo dpkg -i MFT.Agent_amd64.deb

# Fix any missing dependencies
sudo apt-get install -f

# Verify installation
mft-agent-cli --version
```

### RPM Package (RHEL/CentOS/Fedora)

```bash
# Download and install
wget https://releases.mftplus.co.za/latest/MFT.Agent-x86_64.rpm
sudo rpm -i MFT.Agent-x86_64.rpm

# Verify installation
mft-agent-cli --version
```

### AppImage (Universal)

```bash
# Download
wget https://releases.mftplus.co.za/latest/MFT.Agent_amd64.AppImage

# Make executable
chmod +x MFT.Agent_amd64.AppImage

# Run (add to PATH for convenience)
sudo mv MFT.Agent_amd64.AppImage /usr/local/bin/mft-agent-cli

# Verify installation
mft-agent-cli --version
```

## Step 6: Configure the Agent

Create the configuration directory and initialize the agent:

```bash
# Create config directory
mkdir -p ~/.config/mft-agent

# Create configuration file
cat > ~/.config/mft-agent/config.yaml << EOF
# MFTPlus CLI Agent Configuration

# Dashboard connection
server:
  url: https://dashboard.mftplus.co.za
  timeout: 30s

# API authentication
api_key: YOUR_API_KEY_HERE

# Agent settings
agent:
  name: $(hostname)
  heartbeat_interval: 60s

# Transfer settings
transfers:
  retry_attempts: 3
  retry_delay: 5s
  chunk_size: 8192
EOF

# Replace YOUR_API_KEY_HERE with your actual API key
sed -i "s/YOUR_API_KEY_HERE/$MFTPLUS_API_KEY/" ~/.config/mft-agent/config.yaml
```

::: tip Secure Configuration
Set restrictive permissions on your configuration:
```bash
chmod 600 ~/.config/mft-agent/config.yaml
```
:::

## Step 7: Verify Connection

Test that the agent can connect to the dashboard:

```bash
# Check agent status
mft-agent-cli status

# Expected output:
# Agent: hostname
# Status: connected
# Dashboard: https://dashboard.mftplus.co.za
```

## Configuration Directory

The CLI agent stores data in:

| Location | Purpose |
|----------|---------|
| `~/.config/mft-agent/config.yaml` | Configuration file |
| `~/.config/mft-agent/certificates/` | Encryption keys (600 permissions) |
| `~/.config/mft-agent/transfers.db` | SQLite transfer log |
| `~/.config/mft-agent/logs/` | Application logs |

## Running as a Systemd Service

For production deployments, run the CLI agent as a systemd service:

```bash
# Create service file
sudo cat > /etc/systemd/system/mft-agent.service << EOF
[Unit]
Description=MFTPlus CLI Agent
After=network.target

[Service]
Type=simple
User=$USER
ExecStart=/usr/local/bin/mft-agent-cli daemon
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

## Upgrading

Download and install the new version using the same method as initial installation. Configuration and data are preserved across upgrades.

```bash
# Download latest version
wget https://releases.mftplus.co.za/latest/mft-agent-cli-linux-amd64.tar.gz

# Verify checksums
wget https://releases.mftplus.co.za/latest/checksums.sha256
sha256sum -c --ignore-missing checksums.sha256

# Install
tar -xzf mft-agent-cli-linux-amd64.tar.gz
sudo install mft-agent-cli /usr/local/bin/

# Restart the service (if running as systemd)
sudo systemctl restart mft-agent.service
```

## Uninstalling

### tar.gz / AppImage

```bash
# Remove binary
sudo rm /usr/local/bin/mft-agent-cli

# Optionally remove configuration
rm -rf ~/.config/mft-agent
```

### DEB Package

```bash
sudo apt-get remove mft-agent
```

### RPM Package

```bash
sudo yum remove mft-agent
```

### Systemd Service

```bash
# Stop and disable service
sudo systemctl stop mft-agent.service
sudo systemctl disable mft-agent.service

# Remove service file
sudo rm /etc/systemd/system/mft-agent.service
sudo systemctl daemon-reload
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

### Connection Failed

If the agent cannot connect to the dashboard:

```bash
# Test network connectivity
curl -v https://dashboard.mftplus.co.za

# Check firewall rules
sudo ufw status

# Verify API key in config
cat ~/.config/mft-agent/config.yaml | grep api_key
```

### Service Not Starting

If the systemd service fails to start:

```bash
# View service logs
sudo journalctl -u mft-agent.service -n 50

# Check service status
sudo systemctl status mft-agent.service
```

## CLI Reference

### Common Commands

```bash
# Show version
mft-agent-cli --version

# Show agent status
mft-agent-cli status

# Run transfer job
mft-agent-cli run <job-id>

# List configured jobs
mft-agent-cli jobs

# View transfer logs
mft-agent-cli logs

# Start daemon mode
mft-agent-cli daemon
```

### Help

```bash
# Show general help
mft-agent-cli --help

# Show command-specific help
mft-agent-cli run --help
```

## Next Steps

- [Quick Start](./quick-start) - Create your first transfer job
- [Architecture](./architecture) - Learn how MFTPlus works
- [Transfer Protocol](./protocol) - Understand transfer behavior

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
