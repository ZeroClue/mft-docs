# Hub Admin Guide

> **Admin Only:** This guide covers cloud dashboard administration and hub management for system operators. If you are an end user setting up transfers, see the [User Guide](/guide/).

> **The hub is an optional add-on for licensed tiers (Enterprise).** Most users manage agents directly through the [MFTPlus Cloud Dashboard](https://dashboard.mftplus.co.za) without deploying a hub. See [pricing](https://mftplus.co.za/pricing) for tier details.

This guide covers the MFTPlus cloud dashboard and hub management — user roles, hub setup, deploy key management, and the hub dashboard interface. Intended for system administrators and team leads managing MFTPlus deployments.

## User Roles

MFTPlus uses a four-role model that controls access to dashboard, hub, and team features. These are the same roles described in [User Roles & Permissions](../guides/user-roles).

| Role | Intended For | Permissions |
|------|-------------|-------------|
| **OWNER** | Account owner / billing admin | Full access — manage users, hubs, and deploy keys; change billing and settings; delete hubs |
| **ADMIN** | Team managers, hub operators | Manage users, hubs, and deploy keys; view all agents and transfers; change settings (no billing or hub deletion) |
| **MEMBER** | Regular operators | View hubs, manage agents within assigned hubs, create and view transfers, view health metrics |
| **VIEWER** | Auditors / stakeholders | Read-only — view hubs, agents, transfers, and health metrics; no create, edit, or delete actions |

### Role Assignment

OWNERs and ADMINs invite users and assign roles from the dashboard **Settings → Team** page. When a new user accepts an invitation, they inherit the role assigned by the inviter. Roles can be changed at any time.

### Permission Breakdown

| Feature | OWNER | ADMIN | MEMBER | VIEWER |
|---------|-------|-------|--------|--------|
| View hubs / agents / transfers | ✅ | ✅ | ✅ | ✅ |
| View hub health | ✅ | ✅ | ✅ | ✅ |
| Create transfer jobs | ✅ | ✅ | ✅ | ❌ |
| Manage agents | ✅ | ✅ | ✅ | ❌ |
| Manage deploy keys | ✅ | ✅ | ❌ | ❌ |
| Invite users | ✅ | ✅ | ❌ | ❌ |
| Change billing | ✅ | ❌ | ❌ | ❌ |
| Delete hub | ✅ | ❌ | ❌ | ❌ |

::: tip Least-Privilege Access
Assign the **VIEWER** role for auditors and compliance reviews. Use the **MEMBER** role for operators who need to create and manage transfers. Reserve **ADMIN** for hub operators, and keep **OWNER** to 2–3 trusted individuals.
:::

## Cloud Dashboard: Hubs Section

A **Hub** is a logical grouping of MFTPlus agents that share a common configuration, deploy keys, and access controls. Each hub operates independently — agents, jobs, and settings in one hub are isolated from others.

### Navigating to Hubs

1. Log in to the [MFTPlus Cloud Dashboard](https://dashboard.mftplus.co.za)
2. In the left sidebar, click **Hubs**
3. The Hubs overview page displays all hubs in your account

### Hubs Overview Page

The hubs list shows:

- **Hub Name** — The friendly name assigned to the hub
- **Agents** — Number of registered agents (online / total)
- **Status** — Overall health indicator (Healthy, Degraded, Offline)
- **Transfers (24h)** — Transfer count in the last 24 hours
- **Created** — Hub creation date

Click on a hub name to open its **Hub Dashboard** (see below).

### Creating a Hub

1. On the Hubs overview page, click **Create Hub**
2. Enter a **Hub Name** (alphanumeric, hyphens and underscores allowed)
3. Optionally add a **Description**
4. Click **Create**

The new hub appears in the hubs list immediately. You can now register agents to it.

### Deleting a Hub

1. Navigate to the hub's **Settings** tab
2. Scroll to the **Danger Zone** section
3. Click **Delete Hub**
4. Type the hub name to confirm
5. Click **Delete**

::: warning Hub Deletion Is Permanent
Deleting a hub removes all associated agents, transfer history, logs, and deploy keys. This action cannot be undone. Transfer ownership or archive data before deletion.
:::

## Deploy Key Management

Deploy keys authenticate agents when they connect to a hub. Each hub has its own set of deploy keys. Agents use these keys to register and maintain a secure connection.

### Generate a Deploy Key

1. Open the hub's **Settings** tab
2. In the **Deploy Keys** section, click **Generate Key**
3. Optionally enter a **Label** to identify the key's purpose (e.g., `production-agents`, `staging-agents`)
4. Click **Generate**

The key is displayed once. Copy it immediately and store it securely.

```bash
# A deploy key looks like this:
mft_dep_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

::: tip Store Deploy Keys Securely
The full key is shown only at generation time. Store it in a secrets manager (e.g., 1Password, Bitwarden, Vault) or distribute it to agent administrators directly.
:::

### Register an Agent with a Deploy Key

On the agent machine, use the deploy key to connect:

```bash
mftctl connect --server https://hub-xxxx.mftplus.co.za --token mft_dep_xxxxxxxxxxxx
```

The agent authenticates with the key and appears in the hub's agent list once connected.

### Revoke a Deploy Key

1. Open the hub's **Settings** tab
2. In the **Deploy Keys** section, find the key you want to revoke
3. Click the **Revoke** button
4. Confirm the revocation

Revoked keys cannot be un-revoked. Agents using a revoked key will be disconnected on their next heartbeat and must be re-registered with a new key.

### Rotate a Deploy Key

Rotating keys is a security best practice. The rotation process introduces a new key before revoking the old one, minimising agent downtime.

1. **Generate** a new deploy key (see above) — agents can still use the old key
2. **Re-register** each agent with the new key:
   ```bash
   mftctl connect --server https://hub-xxxx.mftplus.co.za --token mft_dep_yyyyyyyyyyyy
   ```
3. **Verify** all agents are online with the new key
4. **Revoke** the old deploy key once no agents depend on it

::: tip Rotation Schedule
Rotate deploy keys regularly — every 90 days is a good baseline for production hubs.
:::

## Hub Dashboard Tour

The hub dashboard provides a focused view of a single hub's agents, transfers, health, and configuration.

### Accessing the Hub Dashboard

From the [MFTPlus Cloud Dashboard](https://dashboard.mftplus.co.za), click **Hubs** in the sidebar, then click on a hub name.

### Agents Tab

The Agents tab lists every agent registered to the hub.

| Column | Description |
|--------|-------------|
| **Hostname** | The agent machine's hostname |
| **Agent ID** | Unique identifier assigned during registration |
| **Status** | Online (green), Offline (red), or Degraded (yellow) |
| **Version** | MFTPlus agent version installed |
| **Last Heartbeat** | Timestamp of the last check-in |
| **Platform** | Operating system (Linux, macOS, Windows) |

From this view you can:

- **Filter** agents by status, version, or platform
- **Search** by hostname or agent ID
- **Click** an agent row to view its detail page (shows config, recent transfers, and logs)
- **De-register** an agent by clicking the action menu (⋮) and selecting **Remove**

### Transfers Tab

The Transfers tab shows all file transfer activity for this hub.

| Column | Description |
|--------|-------------|
| **Job Name** | The transfer job name |
| **Agent** | The agent that executed the transfer |
| **Status** | Success (green), Failed (red), In Progress (blue), Queued (grey) |
| **Files** | Number of files transferred |
| **Size** | Total data transferred |
| **Started** | Transfer start timestamp |
| **Duration** | Time taken to complete |

From this view you can:

- **Filter** by date range, status, or agent
- **Search** by job name
- **Export** transfer logs as CSV for compliance audits
- **Click** a transfer row to view details (file list, checksums, error messages)

### Health Tab

The Health tab displays operational metrics for the hub.

**Metrics shown:**
- **Agent Uptime** — Percentage of agents online over the selected time window (1h, 24h, 7d, 30d)
- **Transfer Success Rate** — Ratio of successful transfers to total attempts
- **Average Transfer Duration** — Mean time to complete a transfer
- **Queue Depth** — Number of transfers currently queued or in progress
- **Error Rate** — Transfers that failed as a percentage of total transfers

**Health Status Indicators:**

| Status | Meaning |
|--------|---------|
| **Healthy** | All agents online, success rate > 99%, no errors in the last hour |
| **Degraded** | One or more agents offline, or success rate between 95% and 99% |
| **Unhealthy** | Success rate below 95% or critical errors detected |

Use the time window selector (1h, 24h, 7d, 30d) to view trends.

### Settings Tab

The Settings tab contains hub-level configuration and management actions.

**Sections:**

| Section | Description |
|---------|-------------|
| **General** | Hub name, description, and timezone |
| **Deploy Keys** | Generate, revoke, and rotate deploy keys (see above) |
| **Agent Defaults** | Default job retry count, log retention period, heartbeat interval |
| **Notifications** | Configure webhook URLs or email addresses for alerts (agent offline, transfer failure, key expiry) |
| **Security** | Allowed IP ranges for agent connections, enforce mTLS |
| **Audit Log** | Read-only log of all configuration changes made to the hub |
| **Danger Zone** | Delete the hub (admin only) |

## Best Practices

### Hub Organisation

- Use separate hubs for **production**, **staging**, and **development** environments
- Create per-client hubs in MSP deployments for strong isolation
- Limit Admin role access to 2–3 people per hub

### Deploy Key Hygiene

- Label every deploy key so you know its purpose at a glance
- Rotate keys regularly — every 90 days is a good baseline for production
- Rotate keys immediately if a key is accidentally exposed
- Audit active keys monthly and revoke unused ones

### Monitoring

- Configure notifications for agent offline and transfer failure events
- Review the Health tab weekly for trends in success rate and queue depth
- Export transfer logs before deleting a hub

## Next Steps

- [Installation](./installation) — Deploy the MFTPlus agent
- [Quick Start](./quick-start) — Register an agent and create your first transfer
- [Architecture](./architecture) — Understand how agents and hubs communicate

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)