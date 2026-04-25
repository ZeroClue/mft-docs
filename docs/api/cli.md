---
title: CLI Commands Reference - MFTPlus Documentation
description: Complete reference for mftctl command-line interface. All commands, options, and examples for managing file transfers.
keywords: mftctl commands, MFTPlus CLI, file transfer CLI, command line reference, automation commands
---

# CLI Commands

Complete reference for `mftctl` command-line interface.

## Global Options

```bash
mftctl [global-options] <command> [command-options]

Global Options:
  --config <path>      Config file path (default: ~/.config/mftplus/config.yaml)
  --debug              Enable debug logging
  --quiet              Suppress output except errors
  --help               Show help
  --version            Show version
```

## Transfer Commands

### send

Send a file to recipient(s).

```bash
mftctl send [options] <file> <recipient>

Options:
  --progress              Show progress bar
  --timeout <duration>    Transfer timeout (default: 5m)
  --protocol <name>       Transfer protocol (default: auto)
  --compress              Enable compression
  --retry <count>         Retry count (default: 3)
  --resume                Resume interrupted transfer
  --mode <mode>           Connection mode: direct|relay|queue

Examples:
  mftctl send ./file.txt alice@example.com
  mftctl send --progress ./large.tar.gz bob@example.com
  mftctl send --compress --resume ./data.json alice@example.com,bob@example.com
```

### receive

Receive incoming transfer(s).

```bash
mftctl receive [options]

Options:
  --dir <path>           Output directory (default: current directory)
  --overwrite            Overwrite existing files
  --parallel <count>     Parallel receive count (default: 2)

Examples:
  mftctl receive
  mftctl receive --dir ~/Downloads
  mftctl receive --parallel 4
```

### status

Check transfer status.

```bash
mftctl status [options] [transfer-id]

Options:
  --watch                Watch status changes
  --json                 Output as JSON

Examples:
  mftctl status abc123
  mftctl status --watch
```

## Configuration Commands

### config init

Initialize configuration.

```bash
mftctl config init

Creates: ~/.config/mftplus/config.yaml
```

### config set

Set configuration value.

```bash
mftctl config set <key> <value>

Examples:
  mftctl config set server.url https://dashboard.mftplus.co.za
  mftctl config set transfer.timeout 10m
```

### config get

Get configuration value.

```bash
mftctl config get <key>

Examples:
  mftctl config get server.url
  mftctl config get transfer.timeout
```

## Certificate Commands

### certificates issue

Issue new certificate.

```bash
mftctl certificates issue [options]

Options:
  --ca-url <url>         CA server URL
  --validity <duration>  Certificate validity (default: 8760h)
  --renew-auto           Enable auto-renewal

Examples:
  mftctl certificates issue
  mftctl certificates issue --ca-url https://ca.example.com
```

### certificates renew

Renew certificate.

```bash
mftctl certificates renew [options]

Options:
  --force                Force renewal

Examples:
  mftctl certificates renew
  mftctl certificates renew --force
```

### certificates list

List certificates.

```bash
mftctl certificates list [options]

Options:
  --json                 Output as JSON

Examples:
  mftctl certificates list
  mftctl certificates list --json
```

## Plugin Commands

### plugin install

Install plugin.

```bash
mftctl plugin install <plugin-name>

Examples:
  mftctl plugin install s3-storage
  mftctl plugin install auth-oidc
```

### plugin list

List installed plugins.

```bash
mftctl plugin list

Examples:
  mftctl plugin list
```

### plugin remove

Remove plugin.

```bash
mftctl plugin remove <plugin-name>

Examples:
  mftctl plugin remove s3-storage
```

## Next Steps

- [Configuration](./config) - Configuration options
- [Plugin API](../plugins/api) - Plugin development
