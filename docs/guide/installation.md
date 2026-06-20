# Installation

MFTPlus provides two separate tools. Choose the one that fits your use case:

| Tool | Purpose | Install Method |
|------|---------|---------------|
| **mftctl** | CLI tool for managing agents, transfers, jobs, and audit from the terminal | One-line script or manual binary download |
| **MFTPlus Agent** | Background service that runs on servers and executes file transfers | Package manager (.deb/.rpm) or desktop installer |

## Quick Links

- [Install mftctl](./install-mftctl) — CLI management tool
- [Install MFTPlus Agent](./install-agent) — Agent runtime for servers

## Which One Do I Need?

**Use mftctl if you:**
- Want to manage transfers, agents, and jobs from the command line
- Need to automate MFT operations in CI/CD pipelines
- Are an admin managing the MFTPlus platform

**Use the MFTPlus Agent if you:**
- Need to run file transfers on a remote server
- Want a background service with scheduling
- Prefer a desktop application with a graphical interface

You can install both on the same machine. Use `mftctl` to manage agents running anywhere.

## Quick Install

### mftctl (CLI)

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

### MFTPlus Agent

**Debian/Ubuntu:**
```bash
wget https://releases.mftplus.co.za/latest/mftplus_amd64.deb
sudo dpkg -i mftplus_amd64.deb
sudo systemctl start mft-agent
```

**RHEL/CentOS/Fedora:**
```bash
wget https://releases.mftplus.co.za/latest/mftplus-x86_64.rpm
sudo rpm -i mftplus-x86_64.rpm
sudo systemctl start mft-agent
```

## Next Steps

- [Quick Start](./quick-start) — Get started in under 5 minutes
- [Architecture](./architecture) — Learn how MFTPlus works
