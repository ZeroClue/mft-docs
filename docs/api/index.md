---
title: API Reference - MFTPlus Documentation
description: "Complete API reference for MFTPlus. CLI commands (`mftctl`), configuration options, and programmatic interfaces for automating file transfers."
---

# MFTPlus API Reference

Complete reference for MFTPlus APIs and interfaces.

## Overview

MFTPlus provides multiple interfaces:

- **Desktop UI**: Graphical interface for file transfer operations
- **REST API**: HTTP interface for dashboard integration
- **mftctl CLI**: Command-line interface for automation

## Quick Reference

### mftctl CLI

The `mftctl` command-line tool provides programmatic access to MFTPlus functionality.

```bash
# Agent management
mftctl agents list
mftctl agents transfers <agent-id>

# Job management
mftctl jobs create --agent <id> --source /path --dest /path --schedule "0 2 * * *"
mftctl jobs list
mftctl jobs delete <job-id>

# Plugin management
mftctl plugin list
mftctl plugin install <name>
mftctl plugin remove <name>
```

### REST API

The MFTPlus Dashboard exposes a REST API for programmatic access.

```bash
# List agents (requires admin API key)
curl -H "X-Admin-API-Key: your-key" \
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
