# Plugin System

Extend MFT functionality with plugins.

## Overview

The MFT plugin system allows you to:

- Add custom authentication providers
- Integrate with storage backends
- Implement custom transfer protocols
- Add monitoring and observability

## Plugin Types

### Authentication Plugins

Handle user authentication and authorization:

```bash
mftctl plugin install auth-oidc
mftctl plugin install auth-ldap
```

### Storage Plugins

Integrate with storage backends:

```bash
mftctl plugin install s3-storage
mftctl plugin install azure-storage
mftctl plugin install gcs-storage
```

### Protocol Plugins

Implement custom transfer protocols:

```bash
mftctl plugin install protocol-sftp
mftctl plugin install protocol-as2
```

### Monitoring Plugins

Add monitoring and observability:

```bash
mftctl plugin install monitor-prometheus
mftctl plugin install monitor-datadog
```

## Plugin Discovery

List available plugins:

```bash
mftctl plugin list
```

Plugin repository: [mft-plugins](https://github.com/your-org/mft-plugins)

## Next Steps

- [Creating Plugins](./creating) - Build your own plugin
- [Plugin API](./api) - Plugin API reference
