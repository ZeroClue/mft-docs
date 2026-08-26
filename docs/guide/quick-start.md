---
title: Quick Start Guide - Transfer Files in 5 Minutes | MFTPlus
description: "Get started with MFTPlus in under 5 minutes. Install mftctl, log in with your API key, connect your machine as an agent, and send your first transfer."
---

# Quick Start: Your First Transfer in 5 Minutes

Transfer your first file with MFTPlus in under 5 minutes.

## Prerequisites

- **OS**: Linux (amd64/aarch64), macOS (Intel or Apple Silicon), or Windows 10+
- **MFTPlus account**: sign up at [dashboard.mftplus.co.za](https://dashboard.mftplus.co.za)
- **Destination**: SFTP credentials or a local directory path for your first transfer

---

## Step 1: Install mftctl

**Linux & macOS — one line:**

```bash
curl -fsSL https://releases.mftplus.co.za/install.sh | sh
```

**Windows (PowerShell):**

```powershell
irm https://releases.mftplus.co.za/install.ps1 | iex
```

Verify:

```bash
mftctl --version
```

For manual downloads and all supported platforms, see the [Installation guide](./installation).

---

## Step 2: Get Your API Key

1. Log in at [dashboard.mftplus.co.za](https://dashboard.mftplus.co.za)
2. Go to **API Keys** → **Create API Key**
3. Give it a name and copy the key — it starts with `sk_` and is **shown only once**

---

## Step 3: Log In

```bash
mftctl login sk_xxxxxxxxxxxxxxxx --server https://dashboard.mftplus.co.za
```

You should see:

```text
✓ Successfully logged in to https://dashboard.mftplus.co.za
```

Your credentials are stored locally in `~/.mftctl/config.json` (`%USERPROFILE%\.mftctl\config.json` on Windows) so you only do this once per machine.

::: tip Behind a proxy or custom deployment?
Override the saved values per command: `mftctl connect --server <url> --token <key>`, or update them with `mftctl config set server-url / api-key`.
:::

---

## Step 4: Connect This Machine as an Agent

In a terminal, run:

```bash
mftctl connect
```

This opens a persistent connection to MFTPlus and registers this machine as an agent in your dashboard. If the connection drops, it reconnects automatically (retrying every few seconds, up to 30 seconds between attempts).

Leave it running — press `Ctrl+C` when you want to disconnect.

---

## Step 5: Verify the Connection

From another terminal:

```bash
mftctl agents list
```

Your machine appears in the list with an agent ID. You can also open the dashboard and check **Agents** — it should show your hostname as **online**.

Need details about one agent?

```bash
mftctl agents show <agent-id>
```

---

## Step 6: Send Your First Transfer

With your agent connected, send a file through it:

```bash
mftctl send report.csv --to sftp://user@backup.example.com/uploads/ --agent <agent-id>
```

Then watch it move:

```bash
mftctl transfers list
```

Or view status, timestamps, and file counts under **Transfers** in the dashboard.

Once you're comfortable with one-off sends, schedule recurring work with transfer jobs and triggers — see [Transfer Triggers](./transfer-triggers) and the dashboard's **Jobs** page.

---

## Troubleshooting

**Login fails with an authentication error?**
- Make sure you copied the full `sk_...` key (it's shown only once at creation)
- Regenerate a key in the dashboard under **API Keys**, then log in again

**Agent not appearing online?**
- Check that `mftctl connect` is still running in your first terminal
- Verify your saved settings: `mftctl config list`
- Confirm outbound HTTPS to `dashboard.mftplus.co.za` is allowed

**Transfer failed?**
- Check the destination path and permissions
- Review recent attempts: `mftctl transfers list`

**Need more help?** See the [Troubleshooting Guide](./troubleshooting) for comprehensive solutions to common issues.

---

## Security

Credentials are stored locally with restrictive permissions (600) and never leave your machine unencrypted. Transfers are encrypted in transit using AES-256.

---

## Next Steps

- [Installation](./installation) — Detailed install options
- [Configuration](../api/config) — Configuration reference for `mftctl` and the agent
- [Architecture](./architecture) — Learn how MFTPlus works

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
