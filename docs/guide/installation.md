# Installation

Install MFTPlus using your preferred method.

## Prerequisites

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (glibc 2.17+)
- **Desktop Environment**: Required (GUI-based application)

## Download Installers

Download the latest installer for your platform from [GitHub Releases](https://github.com/ZeroClue/MFTxyz/releases).

### Windows

1. Download `MFTPlus-setup-x.x.x.exe` or `MFTPlus-x.x.x-x64_64.msi`
2. Run the installer
3. Follow the installation wizard

### macOS

1. Download `MFTPlus-x.x.x-x86_64.dmg` (Intel) or `MFTPlus-x.x.x-aarch64.dmg` (Apple Silicon)
2. Open the DMG file
3. Drag MFTPlus to Applications

### Linux

#### Debian/Ubuntu

```bash
# Download .deb package
wget https://github.com/ZeroClue/MFTxyz/releases/latest/download/mftplus_amd64.deb

# Install
sudo dpkg -i mftplus_amd64.deb
```

#### RHEL/CentOS/Fedora

```bash
# Download .rpm package
wget https://github.com/ZeroClue/MFTxyz/releases/latest/download/mftplus-x86_64.rpm

# Install
sudo rpm -i mftplus-x86_64.rpm
```

#### AppImage (Universal)

```bash
# Download AppImage
wget https://github.com/ZeroClue/MFTxyz/releases/latest/download/MFTPlus-x86_64.AppImage

# Make executable
chmod +x MFTPlus-x86_64.AppImage

# Run
./MFTPlus-x86_64.AppImage
```

## Build from Source

### Prerequisites

- **Node.js** 20+ and **pnpm** 8+
- **Rust** stable toolchain

### Build Steps

```bash
# Clone repository
git clone https://github.com/ZeroClue/MFTxyz.git
cd MFTxyz/agent

# Install dependencies
pnpm install

# Build for development
pnpm dev

# Build for production
pnpm build
```

Production builds are output to `src-tauri/target/release/`.

## Verify Installation

Launch MFTPlus from your applications menu or run:

```bash
# Linux
mftplus

# Windows
MFTPlus.exe

# macOS
open /Applications/MFTPlus.app
```

You should see the MFTPlus dashboard window appear.

## Next Steps

- [Quick Start](./quick-start) - Start using MFTPlus
