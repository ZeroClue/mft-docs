---
title: Plugins - Extend MFTPlus with WASM | MFTPlus Documentation
description: "Extend MFTPlus with WebAssembly plugins. Subscribe to transfer-event hooks and call sandboxed host functions to integrate with external systems."
---

# MFTPlus Plugin System

Extend MFTPlus with **WebAssembly plugins**. A plugin is a WASM module plus a TOML manifest; it
runs inside a sandboxed runtime and extends the product by reacting to transfer events and
calling host functions.

## Overview

Plugins let you:

- React to transfer lifecycle events (`on_transfer_start`, `on_transfer_progress`,
  `on_transfer_complete`, `on_transfer_failed`).
- Call sandboxed host functions (`mft.log`, `mft.http_request`, `mft.get_transfer_info`,
  `mft.get_timestamp`).
- Integrate with external systems (for example, post a notification when a transfer finishes)
  under a declarative permission sandbox.

There is no Go SDK and no shared-library plugin format. See
[Creating Plugins](./creating) for the authoring pipeline and [Plugin API](./api) for the
full surface.

## How plugins are loaded

The runtime discovers plugin directories that contain a manifest and instantiates the declared
WASM entrypoint. On load it calls `on_init`; as transfers flow through the system it invokes the
transfer-event hooks the plugin exports. Missing hooks are treated as no-ops.

## Installing a plugin

Installation copies a plugin's manifest and WASM entrypoint into the product's plugins
directory. The current install path reads `plugin.toml` from the source directory and recreates
the plugin under `<plugins-dir>/<plugin.name>/`.

```bash
mftctl plugin install <plugin-source-directory>
```

List and remove installed plugins:

```bash
mftctl plugin list
mftctl plugin remove <plugin-name>
```

> The runtime loader currently discovers `mft-plugin.toml` (a stricter schema than the
> authoring `plugin.toml`). Until the install and load manifests are reconciled, author the
> loader manifest for execution — see [Creating Plugins](./creating) for both schemas.

## Permissions

Every plugin declares the capabilities it needs in its manifest; the runtime enforces them
deny-by-default:

- **Network** — domain/glob allowlist.
- **File read / write** — path glob patterns.
- **Clipboard** — boolean opt-in.
- **Transfer events** — the set of events the plugin subscribes to.

## Next Steps

- [Creating Plugins](./creating) - Build your first plugin.
- [Plugin API](./api) - Host functions and SDK types.
