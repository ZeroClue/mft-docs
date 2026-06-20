---
title: Plugins - Extend MFTPlus | MFTPlus Documentation
description: "Extend MFTPlus with plugins. Learn about the plugin system, create custom transfer handlers, and integrate with your existing tools and workflows."
---

# MFTPlus Plugin System

Extend MFTPlus functionality with plugins.

## Overview

The MFTPlus plugin system allows you to:

- Add custom authentication providers
- Integrate with storage backends
- Implement custom transfer protocols
- Add monitoring and observability

## Plugin Types

### Authentication Plugins

Handle user authentication and authorization:

```bash
mftctl plugin search auth
mftctl plugin install auth-oidc
mftctl plugin install auth-ldap
```

### Storage Plugins

Integrate with storage backends:

```bash
mftctl plugin search s3
mftctl plugin install s3-storage
mftctl plugin install azure-storage
mftctl plugin install gcs-storage
```

### Protocol Plugins

Implement custom transfer protocols:

```bash
mftctl plugin search protocol
mftctl plugin install protocol-sftp
mftctl plugin install protocol-as2
```

### Monitoring Plugins

Add monitoring and observability:

```bash
mftctl plugin search monitor
mftctl plugin install monitor-prometheus
mftctl plugin install monitor-datadog
```

## Plugin Management

### Search for plugins

```bash
mftctl plugin search <query>
```

### View plugin details

```bash
mftctl plugin info <plugin-name>
```

### Install a plugin

```bash
mftctl plugin install <plugin-name>
```

### List installed plugins

```bash
mftctl plugin list
```

### Verify plugin integrity

```bash
mftctl plugin verify <plugin-name>
```

### Remove a plugin

```bash
mftctl plugin remove <plugin-name>
```

## Next Steps

- [Creating Plugins](./creating) - Build your own plugin
- [Plugin API](./api) - Plugin API reference
