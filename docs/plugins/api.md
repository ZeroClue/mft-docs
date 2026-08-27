---
title: Plugin API Reference - MFTPlus WASM Plugin SDK
description: "MFTPlus plugin API: the mft_plugin Rust SDK, host functions (module 'mft'), transfer-event hooks, and the permission model. Field-for-field against source."
---

# MFTPlus Plugin API

This reference documents the **actual** plugin surface shipped in the product: the Rust
`mft_plugin` SDK crate, the host functions the runtime links into every plugin (WebAssembly
module `"mft"`), and the transfer-event hooks the loader invokes. Nothing here is invented —
every symbol maps to a definition in the plugin runtime source.

## Architecture at a glance

- A plugin is a WASM module. The runtime (wasmtime) instantiates it and links the `mft` host
  functions.
- Only imports from module `"mft"` and `"wasi_snapshot_preview1"` are permitted; all other
  imports are rejected.
- The plugin exports hook functions by name; the loader calls each hook when the corresponding
  transfer event occurs. Missing hooks are treated as no-ops.
- Privileged operations (network, file, clipboard) are gated by the plugin's declared
  `permissions` and enforced deny-by-default.

## Host functions

These are the functions a plugin may `import` from module `"mft"`. Signatures are taken
verbatim from `crates/mft-plugin-runtime/src/host.rs` (and the app linker in
`src/plugins/wasm.rs`).

| Host function | Import | Signature | Status |
|---------------|--------|-----------|--------|
| Log | `mft.log` | `(param i32 ptr, i32 len) -> i32` | Callable; writes the UTF-8 message at `ptr..ptr+len` to the agent log. |
| HTTP request | `mft.http_request` | `(param i32 url_ptr, i32 url_len, i32 body_ptr, i32 body_len) -> i32` | Stub in current source (returns `1`); network calls are not yet wired. |
| Transfer info | `mft.get_transfer_info` | `(param i32 transfer_id_ptr, i32 transfer_id_len) -> i32` | Stub in current source (returns `0`). |
| Timestamp | `mft.get_timestamp` | `(param) -> i32` | Stub in current source (returns `1`). |

Return value convention: `0` indicates success; non-zero indicates a host-side failure or
"not implemented" for the stubbed functions.

> Strings are passed by pointer + length into the plugin's exported linear `memory`. The host
> reads `memory.data` at the given offset; the plugin must keep the bytes live for the duration
> of the call.

### Example: calling `mft.log` from WAT

```wat
(module
  (import "mft" "log" (func $log (param i32 i32) (result i32)))
  (memory (export "memory") 1)
  (data (i32.const 0) "plugin booted\00")
  (func (export "on_init") (result i32)
    i32.const 0
    i32.const 13
    call $log
    i32.const 0
  )
)
```

## Transfer-event hooks

The loader calls the following exported functions by name. The high-level SDK presents them as
the `Plugin` trait methods listed below; the runtime invokes the raw WASM exports.

| Hook (WASM export) | SDK trait method | Called when |
|--------------------|------------------|-------------|
| `on_init` | `Plugin::on_init` | Plugin is first loaded. |
| `on_transfer_start` | `Plugin::on_transfer_start` | A transfer starts. |
| `on_transfer_progress` | `Plugin::on_transfer_progress` | Transfer progress updates (receives an `f64` progress). |
| `on_transfer_complete` | `Plugin::on_transfer_complete` | A transfer completes successfully. |
| `on_transfer_failed` | `Plugin::on_transfer_failed` | A transfer fails (receives an error `&str`). |
| `on_shutdown` | `Plugin::on_shutdown` | Plugin is unloaded. |

> Current loader behavior: `on_init`, `on_transfer_start`, `on_transfer_complete`, and
> `on_shutdown` are called with no arguments; `on_transfer_progress` receives an `f64`;
> `on_transfer_failed`'s string argument is currently skipped (a documented TODO in the
> runtime). Hooks may be omitted — the loader treats a missing export as a successful no-op.

## The `mft_plugin` SDK crate

Plugins written in Rust depend on the `mft_plugin` crate. Its public surface
(`crates/mft-plugin/src/lib.rs`):

```rust
pub use manifest::{PluginManifest, PluginMetadata, Permissions, RuntimeConfig};
pub use permissions::{PermissionSet, PermissionViolation, ResourceLimits};
pub use types::{TransferInfo, TransferStatus, HookContext, HookType};
```

### `Plugin` trait

Implemented by every plugin. All methods have empty default bodies; override only what you need.

```rust
pub trait Plugin {
    fn on_init(&mut self, ctx: &HookContext) -> Result<()>;
    fn on_transfer_start(&mut self, ctx: &HookContext, transfer: &TransferInfo) -> Result<()>;
    fn on_transfer_progress(&mut self, ctx: &HookContext, transfer: &TransferInfo, progress: f64) -> Result<()>;
    fn on_transfer_complete(&mut self, ctx: &HookContext, transfer: &TransferInfo) -> Result<()>;
    fn on_transfer_failed(&mut self, ctx: &HookContext, transfer: &TransferInfo, error: &str) -> Result<()>;
    fn on_shutdown(&mut self, ctx: &HookContext) -> Result<()>;
}
```

The SDK bridges your `Plugin` implementation to the WASM hook exports (`on_init`, …) at build
time; you do not export the symbols manually when using the trait.

### `HookContext`

Passed to every hook.

| Field | Type | Notes |
|-------|------|-------|
| `plugin_id` | `String` | This plugin's id (`<name>@<version>`). |
| `transfer_id` | `Option<String>` | Set for transfer hooks. |
| `hook_type` | `HookType` | Which hook is firing. |
| `invoked_at` | `u64` | Unix timestamp (seconds) when the hook was invoked. |
| `transfer` | `Option<TransferInfo>` | Snapshot of the transfer for transfer hooks. |

### `HookType`

`Init`, `TransferStart`, `TransferProgress`, `TransferComplete`, `TransferFailed`, `Shutdown`
(serde `snake_case`: `init`, `transfer_start`, …).

### `TransferInfo`

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` | Unique transfer id. |
| `status` | `TransferStatus` | Current status. |
| `source` | `String` | Source path/URL. |
| `destination` | `String` | Destination path. |
| `total_bytes` | `u64` | Total size. |
| `transferred_bytes` | `u64` | Bytes transferred so far. |
| `started_at` | `Option<u64>` | Unix timestamp. |
| `completed_at` | `Option<u64>` | Unix timestamp. |
| `error` | `Option<String>` | Present when `status == Failed`. |
| `metadata` | `HashMap<String, serde_json::Value>` | Additional metadata (flattened). |

`TransferInfo` also provides `progress() -> f64`, `bytes_per_second() -> Option<u64>`, and
`eta_seconds() -> Option<u64>`.

### `TransferStatus`

`queued`, `running`, `completed`, `failed`, `cancelled`, `paused` (serde lowercase).
`*_is_terminal()` is true for `completed`/`failed`/`cancelled`; `is_active()` is true for
`running`/`paused`.

### `Permissions` (manifest)

Used in `mft-plugin.toml` under `[permissions]`:

| Field | Type | Notes |
|-------|------|-------|
| `network` | `Vec<String>` | Domain glob allowlist. |
| `file_read` | `Vec<String>` | Path glob patterns. |
| `file_write` | `Vec<String>` | Path glob patterns. |
| `transfer_events` | `Vec<String>` | Subscribed event names. |
| `clipboard` | `bool` | Clipboard access opt-in. |

### `ResourceLimits` (manifest)

Under `[limits]`; defaults shown:

| Field | Type | Default |
|-------|------|---------|
| `max_memory_mb` | `usize` | `128` |
| `max_cpu_percent` | `usize` | `10` |
| `max_network_requests_per_minute` | `u32` | `60` |
| `max_execution_time_seconds` | `u64` | `30` |

### `PermissionSet` and `PermissionViolation`

At runtime the manifest `Permissions` are compiled into a `PermissionSet` with
`allows_network(url)`, `allows_file_read(path)`, `allows_file_write(path)`,
`allows_transfer_event(event)`, and `allows_clipboard()`. A violation is reported as a
`PermissionViolation`:

- `network_denied { url }`
- `file_read_denied { path }`
- `file_write_denied { path }`
- `clipboard_denied`
- `resource_limit_exceeded { resource, limit }`

## Signing & verification — current status

> [!IMPORTANT]
> **The current product does NOT perform signature verification on plugins.** There is no
> key-generation or verification step in the loader, the install path, or the manifest parser.
> The only reference to plugin signing in the source tree is `ARCHITECTURE.md`, which lists
> "Plugin Signing: Signature verification for trust" as a **future enhancement** (not yet
> implemented). Transfer encryption uses ed25519/x25519 key agreement, but that is unrelated to
> plugin trust.
>
> Therefore: do not ship documentation or tooling that tells users to generate ed25519 keys or
> sign plugins — there is nowhere for a signature to be checked today. When signing lands, the
> manifest will gain a signature field and the loader will verify it before `on_init`.

## Security model summary

- WASM sandbox: memory isolation, no direct OS access.
- Import validation: only `mft` and `wasi_snapshot_preview1` imports are allowed.
- Fuel metering: CPU consumption is bounded via wasmtime fuel.
- Memory caps: per-plugin heap size is constrained.
- Permission enforcement: deny-by-default network/file/clipboard, with glob allowlists.
- Rate limiting: network requests are throttled per `max_network_requests_per_minute`.

## Next steps

- [Creating Plugins](./creating) — author and install your first plugin.
- [Plugin System Overview](../plugins/) — how plugins fit into MFTPlus.
