---
title: API Reference - MFTPlus Documentation
description: "Complete API reference for MFTPlus. CLI commands (`mftctl`), configuration options, and programmatic interfaces for automating file transfers."
---

# MFTPlus API Reference

Complete reference for MFTPlus APIs and interfaces.

## Overview

MFTPlus provides multiple interfaces:

- **mftctl CLI**: Command-line interface for management and automation
- **REST API**: HTTP interface for dashboard integration
- **Desktop UI**: Graphical interface for file transfer operations

## Quick Reference

### mftctl CLI

The `mftctl` command-line tool provides programmatic access to MFTPlus functionality.

```bash
# Authentication
mftctl login
mftctl logout

# Agent management
mftctl agents list
mftctl agents show <agent-id>
mftctl agents transfers <agent-id>

# Transfer management
mftctl transfers list
mftctl transfers create --agent <id> --source /path --dest /path
mftctl send ./file --agent <id> --to sftp://host/path

# Job management
mftctl jobs create --agent <id> --name myjob --schedule "0 2 * * *"
mftctl jobs list
mftctl jobs delete <job-id>

# Audit
mftctl audit verify
mftctl audit log list

# Plugin management
mftctl plugin search <query>
mftctl plugin install <name>
mftctl plugin list
mftctl plugin remove <name>
mftctl plugin verify <name>

# Configuration
mftctl config init
mftctl config set server-url https://dashboard.mftplus.co.za
mftctl config list
```

### REST API

The MFTPlus Dashboard exposes a REST API for programmatic access.

```bash
# List agents (requires an admin key or admin Bearer JWT)
curl -H "X-Admin-Key: your-key" \
  https://dashboard.mftplus.co.za/api/agents

# Create transfer (agent auth required)
curl -X POST https://dashboard.mftplus.co.za/api/transfers \
  -H "Authorization: Bearer <agent-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "/local/file.txt",
    "destination": "sftp://server/remote/file.txt",
    "protocol": "sftp"
  }'
```

## Next Steps

- [CLI Commands](./cli) - Complete CLI reference
- [Configuration](./config) - Configuration options
- [Plugin API](../plugins/api) - Plugin development guide
