# Hub Administration

> **Admin Only:** This guide covers hub management tasks for MFTPlus dashboard operators. If you are an end user setting up transfers, see the [User Guide](/guide/).

## Managing Your Hub

The MFTPlus dashboard is the central control point for your file transfer infrastructure. This section covers administrative tasks.

### Dashboard Overview

The hub dashboard provides:
- **Agent overview** — Online status, version, and last heartbeat for all registered agents
- **Job management** — Create, edit, and monitor scheduled transfer jobs
- **Transfer history** — Complete audit trail with search and export
- **User management** — Invite and manage dashboard users
- **System settings** — Configure hub-wide defaults

### Deploy Keys

Deploy keys authenticate agents connecting to your hub. Each agent requires a unique key:

1. Navigate to **Settings** → **Deploy Keys**
2. Click **Generate Key**
3. Copy the key and install it on the agent during setup
4. The key grants the agent access to pull jobs and report status

Keys can be revoked individually from the same panel. Revoked keys immediately disable the associated agent.

### User Roles

MFTPlus supports three dashboard roles:

| Role | Permissions |
|------|-------------|
| **Admin** | Full access — manage users, keys, agents, jobs, and system settings |
| **Operator** | Manage agents, jobs, and view transfers — cannot manage users or system settings |
| **Viewer** | Read-only access to agents, jobs, and transfer history |

To manage roles:

1. Go to **Settings** → **Users**
2. Select a user
3. Choose their role from the dropdown
4. Changes take effect immediately

## Agent Management

### Registering Agents

Agents register with the hub on first launch using a deploy key:

1. Generate a deploy key in the dashboard
2. Configure the agent with the hub URL and key (see [Installation](/guide/installation))
3. The agent appears in the **Agents** list with online status

### Monitoring Agent Health

The dashboard **Agents** page shows:
- **Status** — Online, Offline, or Error
- **Last heartbeat** — Timestamp of last check-in
- **Version** — Agent software version
- **Jobs** — Number of active scheduled jobs

Agents that have not reported in for more than 5 minutes are marked offline.

## System Configuration

### Hub URL

The hub URL is configured per-agent in `config.yaml`:

```yaml
server:
  url: https://dashboard.yourcompany.com
  timeout: 30s
```

See [Configuration Reference](/api/config) for all options.

### Audit Logs

All hub activity is logged:

- **Agent events** — Registration, de-registration, status changes
- **Job events** — Creation, modification, execution results
- **User events** — Login, role changes, setting changes

Logs are accessible from the dashboard **Activity Log** and can be exported for compliance.

## Troubleshooting Hub Operations

### Agent Not Appearing

1. Verify the deploy key is valid and not revoked
2. Check the agent can reach the hub URL (no firewall blocks)
3. Review agent logs: `~/.config/mft-agent/logs/`
4. Confirm the hub URL in agent config matches the dashboard address

### Job Not Executing

1. Verify the agent is online in the dashboard
2. Check the job schedule syntax
3. Review job history for error messages
4. Test credentials with a manual transfer

## Next Steps

- [User Guide](/guide/) — End-user documentation
- [API Reference](/api/) — REST API and CLI commands
- [Configuration](/api/config) — All configuration options
