---
title: Verify MFTPlus Downloads — Release Signing Public Key
description: Official MFTPlus release-signing minisign public key, its fingerprint, and copy-paste commands to verify release downloads on Linux, macOS, and Windows.
---

# Verify MFTPlus downloads

MFTPlus signs release artifacts with [minisign](https://github.com/jedisct1/minisign) detached Ed25519 signatures. This page hosts the official release-signing public key and copy-paste commands to check any download before you run it. For the full walkthrough — including SHA-256 methods that work on every release published so far — see the [Verifying Releases](/guide/verifying-releases) guide.

The one-line habit: **verify before you run**.

::: tip Rollout status — live
Signing is live. Every release published from now on ships `SHA256SUMS` and `.minisig` signature files alongside the artifacts. Releases published before signing went live are checksum-only — they ship no `.minisig` files. Verify those with SHA-256 only, as described in the [Verifying Releases](/guide/verifying-releases) guide. Never treat the absence of a signature file as proof of authenticity.
:::

## Install minisign

Verification needs only the public key below — it works fully offline, with no keyring or daemon.

```bash
# Debian / Ubuntu
sudo apt install minisign

# Fedora
sudo dnf install minisign

# macOS
brew install minisign
```

Windows users can verify signatures from [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) after installing minisign there; checksums can be verified natively with PowerShell as shown below.

## The MFTPlus release public key

Save the following key **verbatim** as `mftplus-release.pub` in the directory where you downloaded your artifacts:

```bash
cat > mftplus-release.pub <<'EOF'
untrusted comment: minisign public key CE2C549429F978BB
RWS7ePkplFQszm10X9/qO/u+IQF0/P9iTC/tDxDt+NSSYcuQ3NrHI2Dd
EOF
```

The key text itself reads:

```
untrusted comment: minisign public key CE2C549429F978BB
RWS7ePkplFQszm10X9/qO/u+IQF0/P9iTC/tDxDt+NSSYcuQ3NrHI2Dd
```

::: danger Check the fingerprint first
The fingerprint of the MFTPlus release key is **`CE2C549429F978BB`**.

Before trusting anything signed with this key, cross-check the **first line** of your saved key file against this value:

```bash
head -n 1 mftplus-release.pub
# untrusted comment: minisign public key CE2C549429F978BB
```

If the fingerprint does not match exactly, do **not** use the key — re-download it from this page.
:::

## Verify a release

All files sit side by side under the same versioned path, e.g. `https://releases.mftplus.co.za/v{version}/`. Set the version once and reuse it:

```bash
VERSION=v0.7.0   # replace with the version you downloaded
BASE="https://releases.mftplus.co.za/${VERSION}"
```

Verify the artifacts you downloaded exist in this release path before continuing.

### Step 1 — Verify the signed checksum manifest

Prefer the manifest over per-file checks: it covers every artifact in the release and is itself signed.

```bash
curl -fsSLO "${BASE}/SHA256SUMS"
curl -fsSLO "${BASE}/SHA256SUMS.minisig"

minisign -V -p mftplus-release.pub -x SHA256SUMS.minisig SHA256SUMS
```

Then confirm your downloaded artifacts match the manifest:

```bash
sha256sum -c --ignore-missing SHA256SUMS
```

On Windows, compute digests natively with PowerShell:

```powershell
Get-FileHash .\mftctl_0.7.0_windows_amd64.zip -Algorithm SHA256
```

Compare the output hash (case-insensitive) against the matching line in `SHA256SUMS`.

### Step 2 — Verify an individual artifact (optional)

Each artifact also carries its own detached signature:

```bash
ASSET=mftctl_0.7.0_linux_amd64.tar.gz   # replace with the file you downloaded

curl -fsSLO "${BASE}/${ASSET}.minisig"

minisign -V -p mftplus-release.pub -x "${ASSET}.minisig" "${ASSET}"
```

minisign prints `Signature and comment OK` (with a comment mentioning the MFTPlus release key) when the check passes. Any other result means the artifact fails the check.

## If verification fails

- Re-download the artifact in case the transfer was interrupted.
- Confirm you are downloading from `releases.mftplus.co.za` and using the matching version path.
- Re-check the fingerprint of `mftplus-release.pub` against `CE2C549429F978BB`.
- Do **not** run an artifact whose checksum or signature fails; report the mismatch before retrying from another source.

## Key rotation policy

The current key (`CE2C549429F978BB`) signs MFTPlus releases until the 1.0 GA rotation or an earlier forced rotation in case of compromise. When a key is rotated:

- The superseded key stays listed on this page with a revocation notice for **two release cycles** before removal.
- Artifacts signed by the superseded key remain valid to verify against that key during the notice window.
- After the notice window closes, the superseded key is removed and its revocation notice moves to the release archive notes.

## Next Steps

- [Verifying Releases](/guide/verifying-releases) — full guide, including checksum-only releases
- [Install mftctl](/guide/install-mftctl) — Install the CLI
- [Install Agent](/guide/install-agent) — Install the agent runtime on servers
