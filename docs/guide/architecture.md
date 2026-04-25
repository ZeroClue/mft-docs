---
title: Architecture - MFTPlus Documentation
description: Understanding MFTPlus architecture. Learn about the CLI, daemon, dashboard, and how components work together.
keywords: MFTPlus architecture, system design, mftctl CLI, daemon, dashboard, component overview
---

# Architecture

Understanding MFT's architecture will help you make the most of its capabilities.

## System Components

### CLI (`mftctl`)

The command-line interface provides direct access to MFT functionality:

```bash
mftctl send ./file.txt recipient@example.com
mftctl receive
mftctl status
```

### Server (`mftd`)

The background daemon handles:
- Transfer queue management
- Connection pooling
- Retry logic
- State persistence

### Agent (`mft-agent`)

Rust-based agent for:
- High-performance transfers
- Protocol handling
- Plugin execution

### Plugin System

Extensible architecture supporting:
- Authentication providers
- Storage backends
- Transfer protocols
- Monitoring integrations

## Transfer Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Client │ ──▶ │  Server │ ──▶ │  Agent  │ ──▶ │ Recipient│
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                    │                                │
                    ▼                                ▼
              ┌─────────┐                     ┌─────────┐
              │  Queue  │                     │  Agent  │
              └─────────┘                     └─────────┘
```

## Data Flow

1. **Initiation**: Client sends transfer request
2. **Queuing**: Server queues the transfer
3. **Processing**: Agent handles the actual transfer
4. **Monitoring**: Progress updates sent to client
5. **Completion**: Final status persisted

## Security Model

### Zero-Trust Architecture

- mTLS authentication for all components
- End-to-end encryption for transfers
- Principle of least privilege
- Comprehensive audit logging

### Step CA Integration

MFT integrates with Step CA for certificate management:

```bash
mftctl certificates issue --ca-url https://ca.example.com
mftctl certificates renew --auto
```

## Next Steps

- [Transfer Protocol](./protocol) - Deep dive into the protocol
- [API Reference](../api/) - Explore the API
