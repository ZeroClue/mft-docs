# Introduction

Welcome to **MFTPlus** — Managed File Transfer, reimagined for modern DevOps workflows. Lightweight, secure, and audit-ready without the enterprise baggage.

## What is MFTPlus?

MFTPlus is the first file transfer tool built specifically for DevOps workflows. Unlike legacy MFT solutions that require expensive central servers, MFTPlus runs as a standalone desktop agent that gives you enterprise-grade features in a ~5MB package.

- **Lightweight**: No central server required. Runs on Windows, macOS, and Linux.
- **Secure**: AES-256-GCM encryption with restrictive file permissions.
- **Scheduled**: Cron-based job scheduling for automated transfers.
- **Audit-Ready**: Built-in SQLite logging for compliance requirements.
- **Multi-Protocol**: SFTP, FTP, FTPS, and local file transfers.

## Key Features

### Desktop Agent, Not Server

Unlike traditional MFT solutions that require a complex central server deployment, MFTPlus runs as a lightweight desktop agent. Deploy in minutes, not months.

### Multi-Protocol Support

Transfer files using SFTP, FTP, FTPS, or local filesystem operations — all from a unified interface.

### Scheduled Transfers

Set up automated file transfer jobs using familiar cron syntax. Full execution history and retry logic included.

### Enterprise Security

Your encryption keys are stored in protected files at `~/.config/mft-agent/certificates/` with restrictive permissions (600). Keys never leave your machine.

### Built-in Audit Trail

Every transfer is logged to a local SQLite database with SHA-256 checksums. Perfect for compliance audits and troubleshooting.

### Cross-Platform

Built with Tauri and Rust for native performance on all major platforms. No JVM, no Electron bloat.

## Who Uses MFTPlus?

- **DevOps/SRE Teams**: Manage CI/CD artifacts, backups, and data pipeline transfers
- **MSPs**: Lightweight file transfer solution for client environments
- **Regulated Industries**: Built-in audit trails for SOC 2, HIPAA, PCI compliance

## Next Steps

- [Installation](./installation) - Get MFTPlus installed on your system
- [Quick Start](./quick-start) - Start transferring files in minutes
- [Architecture](./architecture) - Understand how MFTPlus works
