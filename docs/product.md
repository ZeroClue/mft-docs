# Product

**Enterprise-grade file transfer. None of the enterprise complexity.**

---

## Overview

MFTxyz is the first Managed File Transfer platform built for the cloud-native era. CLI-first, API-first, deployed in hours.

---

## Key Benefits

### CLI-First
Work from the terminal like you already do.

- Intuitive commands (mftctl transfer, mftctl status, mftctl logs)
- Shell completion for bash/zsh/fish
- Output in JSON, YAML, or human-readable formats
- Transfer templates for reusable workflows

### API-First
Automate everything, integrate with anything.

- REST API with comprehensive endpoints
- Webhook notifications for all transfer events
- SDKs coming soon (Go, Python, TypeScript)

### Cross-Platform
Native agents for every platform.

- Linux, macOS, Windows agents
- Container-ready deployment
- Runs on bare metal, VMs, or cloud

### Deployment Speed
From zero to production in hours.

- Single binary installation
- Terraform provider and Helm charts
- Configuration as code (YAML, TOML, JSON)
- Infrastructure as Code friendly

---

## Features

### Reliability
Transfers that complete. Every time.

- Automatic retry with exponential backoff
- Transfer resumption for interrupted connections
- End-to-end checksums for data integrity
- Real-time transfer status and logs

### Observability
See what's happening. Fix what's not.

- Structured JSON logs (stdout/stderr friendly)
- Prometheus metrics endpoint
- Transfer history API
- Webhook notifications for key events

### Security
Zero-trust by default. Audit-ready always.

- Encryption at rest and in transit
- SOC2-compatible architecture
- Role-based access control
- Full audit trail for every transfer

### Deployment
From zero to production in hours.

- Single binary installation (no dependency hell)
- Terraform provider and Helm charts
- On-premises, cloud, or hybrid deployment
- Configuration as code

---

## Architecture

Built for 2026. Not 2006.

**Components:**
- **mftctl CLI**: Command-line interface for all operations
- **mftd agent**: Lightweight agent that runs on your infrastructure
- **Cloud backend**: Coordination, observability, and management

**Data Flow:**
```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│  mftctl CLI │ ────▶ │  mftd agent │ ────▶ │ Cloud Backend │
│             │      │             │      │              │
│  Initiate   │      │  Execute    │      │  Coordinate  │
│  Monitor    │      │  Transfer   │      │  Observe     │
└─────────────┘      └─────────────┘      └──────────────┘
```

---

## Integrations

Plays well with your existing stack.

**Infrastructure:**
- Terraform
- Kubernetes
- Docker
- AWS, GCP, Azure

**CI/CD:**
- GitHub Actions
- GitLab CI
- Jenkins

**Monitoring:**
- Prometheus
- Datadog
- Grafana

---

## Next Steps

- [Apply for Design Partner Program](/design-partners)
- [Read the Documentation](/guide/introduction)
- [CLI Reference](/api/cli)
- [API Reference](/api/)
