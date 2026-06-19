---
title: Architecture - How MFTPlus Works | MFTPlus Documentation
description: "Understand MFTPlus architecture: lightweight desktop agent, centralized dashboard, SQLite audit database, and cron-based scheduling. Built for cloud-native DevOps."
---

# MFTPlus Architecture

Understanding MFTPlus architecture will help you plan your deployment and make the most of its capabilities.

## System Components

### Agent (`mft-agent-cli`)

The core MFTPlus component. A Rust-based CLI agent that runs on your servers and handles:

- Scheduled and manual file transfers
- Protocol handling (SFTP, FTP, FTPS, local)
- Transfer queue management
- Retry logic with exponential backoff
- Audit logging (SQLite)
- Phone-home registration to dashboard or hub

```bash
mft-agent-cli --version
mft-agent-cli run
```

### Dashboard

The web-based management interface for:

- Agent registration and monitoring
- Job creation and scheduling
- Transfer history and audit logs
- Credential management
- Usage analytics

The dashboard is the central point of control for all agents in your deployment.

### Hub (v0.6.0+)

An optional relay component that enables:

- Hub-and-spoke topology for distributed deployments
- WebSocket relay for agent-to-hub connectivity (v0.6.1+)
- Centralized agent management across network boundaries
- Secure phone-home registration

The hub sits between agents and the dashboard, relaying traffic when agents cannot connect directly.

## Hub-and-Spoke Topology

In a hub-and-spoke deployment (v0.6.0+):

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Agent   │────▶│          │────▶│ Dashboard │
│ (Spoke)  │     │   Hub    │     │           │
└──────────┘     │          │     └──────────┘
                  │  Relay   │
┌──────────┐     │          │     ┌──────────┐
│  Agent   │────▶│          │────▶│  Agent   │
│ (Spoke)  │     └──────────┘     │ (Spoke)  │
└──────────┘                      └──────────┘
```

Agents connect to the hub, which relays instructions and transfer events to and from the dashboard. This allows agents behind NAT or firewalls to participate without direct inbound access.

## WebSocket Relay (v0.6.1+)

The WebSocket relay protocol allows agents to maintain persistent connections to the hub:

- **Deploy key authentication** in WebSocket headers (v0.6.1)
- **Auth cache sync** between hub and cloud dashboard (v0.6.1)
- **Rate limiting** per credential or customer (v0.6.1)
- **Security hardening** with deploy key rotation and bounded rate limits (v0.6.1)

## Transfer Flow

```
┌──────────┐     job config     ┌──────────┐
│ Dashboard │──────────────────▶│   Hub    │
│           │◀──────────────────│          │
└──────────┘   transfer status  │  Relay   │
                                │          │
┌──────────┐     WebSocket      │          │
│  Agent   │◀──────────────────▶│          │
│ (Spoke)  │                    └──────────┘
└──────────┘
```

1. **Configure**: Jobs are created in the dashboard
2. **Dispatch**: Job configuration is relayed to the agent via the hub
3. **Execute**: Agent performs the transfer using the configured protocol
4. **Report**: Transfer status and audit logs are sent back through the hub
5. **Monitor**: Dashboard displays real-time status and history

In direct-connect deployments (no hub), agents communicate directly with the dashboard.

## Security Model

### Agent Authentication

- **Deploy key** authentication for agent-to-hub registration
- **Phone-home registration** with unique agent IDs
- **TLS** for all control-plane communication

### Data Protection

- **AES-256-GCM** encryption for transferred files
- **Credentials** stored with restrictive permissions (600)
- **Certificates** managed per-agent in `~/.config/mft-agent/certificates/`
- **SHA-256 checksums** for all transferred files

### Audit Logging

All transfer activity is logged locally in SQLite format at:
- **Linux/macOS**: `~/.config/mft-agent/transfers.db`
- **Windows**: `%APPDATA%\mft-agent\transfers.db`

## Deployment Patterns

### Direct Connect (Simple)

```
Agent ──── Dashboard
```

Single agent connecting directly to the dashboard. Best for proof-of-concept and small deployments.

### Hub-and-Spoke (Distributed)

```
Agent ──── Hub ──── Dashboard
Agent ──── Hub ──── Dashboard
```

Multiple agents connecting through a hub. Best for multi-site deployments and agents behind NAT.

### Multi-Hub (Enterprise)

```
Agent ──── Hub A ─┐
                  ├─── Dashboard
Agent ──── Hub B ─┘
```

Multiple hubs connecting to a single dashboard. Best for large enterprise deployments with geographic distribution.

::: tip Security Configuration
For detailed security and authentication setup, see [Security & Authentication](./security).
:::

## Next Steps

- [Transfer Protocol](./protocol) - Deep dive into the protocol
- [Security & Authentication](./security) - Configure auth, encryption, and access control
- [API Reference](../api/) - Explore the API
- [Plugin System](../plugins/) - Extend MFTPlus with custom plugins
