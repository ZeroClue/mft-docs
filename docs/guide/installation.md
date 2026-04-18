# Installation

Install MFT using your preferred method.

## Prerequisites

- **Operating System**: Linux, macOS, or Windows
- **Go**: 1.21 or later (for building from source)
- **Rust**: 1.70 or later (for agent components)

## Install via Package Manager

### macOS (Homebrew)

```bash
brew tap mft-project/mft
brew install mft
```

### Linux (DEB/RPM)

```bash
# Debian/Ubuntu
curl -fsSL https://get.mft.io/deb | sudo sh

# RHEL/CentOS/Fedora
curl -fsSL https://get.mft.io/rpm | sudo sh
```

## Install from Binary

Download the latest release from [GitHub Releases](https://github.com/your-org/mft/releases).

```bash
# Download
curl -LO https://github.com/your-org/mft/releases/latest/download/mft-linux-amd64.tar.gz

# Extract
tar xzf mft-linux-amd64.tar.gz

# Install
sudo mv mft /usr/local/bin/
```

## Build from Source

```bash
# Clone repository
git clone https://github.com/your-org/mft.git
cd mft

# Build
go build -o mft ./cmd/mft

# Install
sudo mv mft /usr/local/bin/
```

## Verify Installation

```bash
mft version
```

You should see output like:

```
MFT version 1.0.0
Build: abc123def
Date: 2024-04-18T12:00:00Z
```

## Next Steps

- [Quick Start](./quick-start) - Start using MFT
