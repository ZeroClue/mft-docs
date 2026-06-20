# Introduction

Welcome to **MFTPlus** — Managed File Transfer, reimagined for modern DevOps workflows. Lightweight, secure, and audit-ready without the enterprise baggage.

## What is MFTPlus?

MFTPlus is a managed file transfer platform built for DevOps workflows. Unlike legacy MFT solutions that require expensive central servers, MFTPlus provides a modern CLI-first experience with enterprise-grade features.

- **CLI-First**: `mftctl` provides complete control from the command line
- **Secure**: TLS encryption, AES-256-GCM file encryption, and cryptographic audit chains
- **Scheduled**: Cron-based job scheduling for automated transfers
- **Audit-Ready**: Immutable, cryptographically chained audit logs
- **Multi-Protocol**: SFTP, FTP, FTPS, and local file transfers
- **Agent-Based**: Lightweight agents for distributed execution

## Key Features

### CLI-First Design

`mftctl` is the primary interface for managing transfers, agents, jobs, and audit. Everything available in the dashboard is accessible from the terminal.

### Agent-Based Architecture

Agents run on managed machines and execute transfers. They communicate with the dashboard via WebSocket for real-time status updates.

### Flexible Transfer Options

Send files directly with `mftctl send`, create transfers via the dashboard API, or schedule recurring jobs with cron syntax.

### Enterprise Security

- API key authentication for CLI access
- TLS for all communications
- File encryption (AES-256-GCM, ChaCha20)
- Immutable audit trail with cryptographic chain verification

### Cross-Platform

The `mftctl` CLI runs on Linux, macOS, and Windows. Agents support all major platforms.

## Who Uses MFTPlus?

- **DevOps/SRE Teams**: Manage CI/CD artifacts, backups, and data pipeline transfers
- **MSPs**: Lightweight file transfer solution for client environments
- **Regulated Industries**: Built-in audit trails for SOC 2, HIPAA, PCI compliance

## Next Steps

- [Installation](./installation) - Install mftctl
- [Quick Start](./quick-start) - Start transferring files in minutes
- [Architecture](./architecture) - Understand how MFTPlus works
