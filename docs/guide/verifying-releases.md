# Verifying MFTPlus Releases

Every MFTPlus release is published at `https://releases.mftplus.co.za/v{version}/`, together with the integrity metadata needed to verify downloads before use:

- **SHA-256 checksums** — detect corrupted or truncated downloads.
- **minisign signatures (Ed25519)** — prove artifacts were produced by MFTPlus and were not tampered with in transit or at rest. Live — see Rollout status below.

This guide shows how to check both. The one-line habit: **verify before you run**.

::: tip Rollout status — live
Per-file SHA-256 digests are available today in every release's `release-info.json` manifest. The `SHA256SUMS` manifest and `.minisig` signatures are now live — every release published from today ships signed checksum manifests and detached Ed25519 signatures. Older releases without `.minisig` files can still be verified with SHA-256 only.
:::

## What is published with a release

| File | Purpose |
|------|---------|
| Binaries and installers | The release artifacts themselves (e.g. `mftctl_0.7.0_linux_amd64.tar.gz`) |
| `SHA256SUMS` | One manifest listing the SHA-256 digest of every artifact |
| `SHA256SUMS.minisig` | Detached minisign signature over the manifest |
| `<artifact>.minisig` | Detached minisign signature over an individual artifact |
| `release-info.json` | Machine-readable manifest: per-file download URL, size, and SHA-256 |

All files sit side by side under the same versioned path, e.g. `https://releases.mftplus.co.za/v0.7.0/`.

## Checksum verification

### Compare against `release-info.json`

Works for every release published so far. Compute the digest of your download and compare it to the value recorded in the manifest:

```bash
VERSION=v0.7.0
ASSET=mftctl_0.7.0_linux_amd64.tar.gz

curl -fsSLO "https://releases.mftplus.co.za/${VERSION}/${ASSET}"
sha256sum "${ASSET}"

# Print the expected digest
curl -fsSL "https://releases.mftplus.co.za/${VERSION}/release-info.json" \
  | jq -r --arg f "${ASSET}" '.[0].downloads[] | select(.url | endswith($f)) | .sha256'
```

The two values must match exactly. To check every file you downloaded at once, convert the manifest to `sha256sum -c` format:

```bash
curl -fsSL "https://releases.mftplus.co.za/${VERSION}/release-info.json" \
  | jq -r '.[0].downloads[] | "\(.sha256)  \(.url | split("/")[-1])"' > SHA256SUMS.local
sha256sum -c --ignore-missing SHA256SUMS.local
```

### Verify against the signed manifest

Once a release publishes `SHA256SUMS`, prefer it over hand-built lists — it covers all artifacts and is itself signed (see below):

```bash
curl -fsSL "https://releases.mftplus.co.za/${VERSION}/SHA256SUMS" -o SHA256SUMS
sha256sum -c --ignore-missing SHA256SUMS
```

On Windows, compute digests with PowerShell:

```powershell
Get-FileHash .\MFT.Agent_0.7.0_x64-setup.exe -Algorithm SHA256
```

Compare the output hash (case-insensitive) against the value in `release-info.json`.

## Signature verification (minisign)

MFTPlus signs releases with [minisign](https://github.com/jedisct1/minisign) detached Ed25519 signatures as part of the Phase 1A signing pipeline. Verification needs only the public key — it works fully offline, with no keyring or daemon.

### 1. Install minisign

```bash
# Debian / Ubuntu
sudo apt install minisign

# Fedora
sudo dnf install minisign

# macOS
brew install minisign
```

Windows users can verify signatures from [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) after installing minisign there; checksums can be verified natively as shown above.

### 2. Get the MFTPlus release public key

The MFTPlus release-signing public key and its fingerprint are published at [`docs.mftplus.co.za/install/verify`](https://docs.mftplus.co.za/install/verify). Save it as `mftplus-release.pub`.

### 3. Verify the signed checksum manifest

```bash
curl -fsSLO "https://releases.mftplus.co.za/${VERSION}/SHA256SUMS.minisig"
minisign -Vm SHA256SUMS -p mftplus-release.pub
```

minisign reports a verified signature only when the manifest matches the release key published on the verify page. Any other result means the manifest fails the check.

### 4. Verify an individual artifact

Each artifact also carries its own detached signature:

```bash
curl -fsSLO "https://releases.mftplus.co.za/${VERSION}/${ASSET}.minisig"
minisign -Vm "${ASSET}" -p mftplus-release.pub
```

## If verification fails

- Re-download the artifact in case the transfer was interrupted.
- Confirm you are downloading from `releases.mftplus.co.za` and using the matching version path.
- Do **not** run an artifact whose checksum or signature fails; report the mismatch before retrying from another source.

## Verify your installed version

After installing, confirm what you are running:

```bash
mftctl --version
```

## Next Steps

- [Install mftctl](./install-mftctl) — Install the CLI
- [Install Agent](./install-agent) — Install the agent runtime on servers
- [Quick Start](./quick-start) — Start using mftctl
