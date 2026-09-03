---
title: Creating Plugins - MFTPlus WASM Plugin Guide
description: "Build MFTPlus plugins as Rust-compiled WebAssembly modules. Author plugin.toml, compile to WASM, install, and subscribe to transfer-event hooks."
---

# Creating MFTPlus Plugins

MFTPlus plugins are **WebAssembly (WASM) modules** compiled from Rust and loaded by the
sandboxed plugin runtime (wasmtime). There is no Go SDK and no shared-library (`-buildmode=plugin`)
loading path — a plugin is a single `.wasm` file plus a manifest.

A plugin extends MFTPlus by:

- Subscribing to **transfer-event hooks** (`on_transfer_start`, `on_transfer_progress`,
  `on_transfer_complete`, `on_transfer_failed`, `on_init`, `on_shutdown`).
- Calling **host functions** exported by the runtime (logging, HTTP, transfer info, time)
  inside a permission sandbox.

## Plugin layout

```
my-plugin/
├── plugin.toml      # manifest (metadata, permissions, limits, runtime)
└── plugin.wasm      # compiled WASM module (entrypoint named in [runtime])
```

The WASM entrypoint filename is declared in `plugin.toml` under `[runtime] entrypoint`.
The default expected name is `plugin.wasm`.

## Authoring manifest — `plugin.toml`

This is the manifest read by the plugin install path
(`PluginManager::install_plugin`, which requires `plugin.toml` to exist in the source
directory). Every field below is taken verbatim from the manifest parser source
(`src/plugins/manifest.rs`):

```toml
[plugin]
name = "slack-notifier"
version = "1.0.0"
author = "Acme Inc <plugins@acme.com>"
description = "Send Slack notifications on transfer events"

[permissions]
network = ["https://hooks.slack.com/*"]
file_access = "read_metadata"
transfer_events = ["completed", "failed"]

[limits]
max_memory_mb = 128
max_cpu_percent = 10
max_network_requests_per_minute = 60

[runtime]
type = "wasm"
entrypoint = "plugin.wasm"
```

Field reference (authoring manifest):

| Section | Field | Type | Notes |
|---------|-------|------|-------|
| `plugin` | `name` | string | Required. Non-empty; used as the install directory name. |
| `plugin` | `version` | string | Required. Non-empty. |
| `plugin` | `author` | string | Required. Non-empty. Free-form (may include `<email>`). |
| `plugin` | `description` | string | Required. Non-empty. |
| `permissions` | `network` | string[] | URL/glob domain allowlist. Default empty. |
| `permissions` | `file_access` | string | `"none"` (default) or `"read_metadata"`. |
| `permissions` | `transfer_events` | string[] | Event names to subscribe to (e.g. `completed`, `failed`, `start`). Default empty. |
| `limits` | `max_memory_mb` | u32 | Default `128`. |
| `limits` | `max_cpu_percent` | u32 | Default `10`. |
| `limits` | `max_network_requests_per_minute` | u32 | Default `60`. |
| `runtime` | `type` | string | Must be `"wasm"`. |
| `runtime` | `entrypoint` | string | WASM filename, e.g. `plugin.wasm`. |

The install parser validates that `plugin.name`, `plugin.version`, and `plugin.author` are
non-empty; otherwise install fails with a `MissingField` error.

## Runtime manifest — `mft-plugin.toml` (loader schema)

The WASM runtime loader (`mft_plugin::PluginManifest::from_file`) discovers plugin directories
that contain **`mft-plugin.toml`** (note the different filename and a stricter schema). This is
the manifest the loader actually validates before executing a plugin. Fields, verbatim from
`crates/mft-plugin/src/manifest.rs`:

```toml
[plugin]
name = "slack-notifier"
version = "1.0.0"
author = "Acme Inc <plugins@acme.com>"
description = "Send Slack notifications on transfer events"
license = "MIT"
homepage = "https://example.com"
repository = "https://example.com/slack-notifier"

[permissions]
network = ["https://hooks.slack.com/*"]
file_read = ["/var/log/mft/*"]
file_write = ["/var/out/mft/*"]
transfer_events = ["completed", "failed"]
clipboard = false

[limits]
max_memory_mb = 64
max_cpu_percent = 10
max_network_requests_per_minute = 60
max_execution_time_seconds = 30

[runtime]
type = "wasm"
entrypoint = "plugin.wasm"
abi = 1
```

Runtime loader validation (`PluginManifest::validate`):

- `plugin.name` must match `^[a-zA-Z0-9_-]+$`.
- `plugin.version` must parse as a valid SemVer version.
- At least one permission must be requested (`network`, `file_read`, `file_write`,
  `transfer_events`, or `clipboard`); otherwise install is rejected (`NoPermissions`).
- `limits.max_memory_mb` must be between `1` and `1024`.
- `limits.max_cpu_percent` must be between `1` and `100`.
- `runtime.type` and `runtime.abi` default to `"wasm"` and `1` when omitted.

> [!WARNING]
> **Known product gap (documentation-accurate, not yet fixed):** the install path copies
> `plugin.toml` into the plugins directory, but the runtime loader only discovers
> `mft-plugin.toml` and expects the stricter schema above. Until this is reconciled, a plugin
> installed via the current tooling will not be loaded by the runtime. Author `mft-plugin.toml`
> for the loader and `plugin.toml` for the install step, or track the fix in the product repo.

## Building the WASM module

Author the plugin in Rust and compile it to the WASM toolchain target, then produce the
`.wasm` entrypoint declared in your manifest. The runtime invokes the hook symbols
`on_init`, `on_transfer_start`, `on_transfer_progress`, `on_transfer_complete`,
`on_transfer_failed`, and `on_shutdown` directly by name, and links the `mft` host functions
described in the [Plugin API](./api).

A minimal module only needs to export the hooks it cares about; any unimplemented hook is
treated as a no-op by the loader.

## Hello-world walkthrough (WAT, verified against the loader)

The smallest provable plugin is a hand-written WASM text module. It imports the `mft.log`
host function, exports `memory`, and exports `on_init`. This matches exactly what the runtime
linker provides (`module "mft"`, function `log`) and what the loader invokes
(`call_hook("on_init", …)`).

Save as `plugin.wat` (a ready-to-build copy is committed at
`examples/hello-world/plugin.wat`):

```wat
(module
  ;; Host function provided by the MFTPlus runtime (module "mft")
  (import "mft" "log" (func $log (param i32 i32) (result i32)))

  ;; Plugins must export linear memory so the host can read/write strings
  (memory (export "memory") 1)

  ;; Message written to the agent log on init
  (data (i32.const 0) "hello from mftplus plugin\00")

  ;; Hook invoked by the loader when the plugin is initialized.
  ;; Returns the host function result (0 = success).
  (func (export "on_init") (result i32)
    i32.const 0           ;; pointer to message
    i32.const 25          ;; length of message
    call $log
  )
)
```

Compile to the WASM entrypoint:

```bash
wat2wasm plugin.wat -o plugin.wasm
```

Place `plugin.toml` (or `mft-plugin.toml`) and `plugin.wasm` together in a directory and
install it. On load the runtime calls `on_init`, which writes
`hello from mftplus plugin` to the agent log via the `mft.log` host function.

> The runtime's own test suite loads an equivalent WAT module exporting `on_init` and asserts
> the call succeeds, confirming this shape is valid against the actual linker.

## Installing a plugin

Installation copies the manifest and the WASM entrypoint into the product's plugins directory.
The current install path reads `plugin.toml` from the source directory and recreates the plugin
under `<plugins-dir>/<plugin.name>/`. Ensure the `entrypoint` file exists next to the manifest,
or only the manifest is copied.

```bash
# From the plugin source directory (contains plugin.toml and plugin.wasm)
mftctl plugin install .
```

## Permissions model

The sandbox is **deny-by-default**:

- `network` is a domain/glob allowlist. A request to any domain not listed is denied.
- File access (`file_read` / `file_write` in the loader schema, or `file_access` in the
  authoring schema) is constrained to declared path patterns.
- `clipboard` and `transfer_events` are explicit opt-in booleans / sets.

## Next steps

- [Plugin API](./api) — host functions and SDK types, field-for-field.
- [Plugin System Overview](../plugins/) — how plugins fit into MFTPlus.
