# COO-883 — Phase 1A Secure Package Distribution: CMO Go-To-Market Coordination Plan

**Goal:** b0c60c17-3ad4-46db-8e09-3d1e1a92a927 — "Phase 1A — Production Viability: Secure Package Distribution"
**Track owner (this doc):** CMO — go-to-market coordination
**Engineering owner:** CTO — automated build signing, integrity verification, secure distribution channel
**Status:** CMO coordination drafted and ready. Engineering implementation is **gated on CTO recovery** (CTO currently in an error/blocked state). No internal or secret data is included; public brand name "MFTPlus" is used throughout.

---

## 1. Scope of this document

This is the CMO's coordination deliverable for Phase 1A. It defines the distribution-channel strategy, the messaging for signed/verified packages, the launch communication plan, and the handoff for customer verification instructions. It does **not** implement the signing pipeline — that remains CTO-owned and is blocked. Everything here is executable by Marketing the moment the CTO's signing pipeline ships.

## 2. Distribution channel strategy

Canonical source of truth is the MFTPlus-hosted release CDN; mirrors exist for convenience and redundancy.

| Channel | Role | Owner | Notes |
|---------|------|-------|-------|
| `releases.mftplus.co.za/v{version}/` | **Primary / canonical** | CTO | Hosts binaries, installers, `SHA256SUMS`, `.minisig`, `release-info.json`. Must serve over HTTPS with immutable, versioned paths. |
| GitHub Releases | Mirror + parity | CTO | Same artifacts mirrored for discoverability and to satisfy users who trust the GitHub supply chain. Announce here; link back to canonical verify page. |
| Homebrew (macOS/Linux) | Convenience installer | CTO | `brew install mftplus/tap/mftctl` once signed bottles are available. Formula must reference the signed checksum manifest. |
| apt (Debian/Ubuntu) | Convenience installer | CTO | Hosted repo signed with a repo GPG key; documents verification steps. |
| Winget / Chocolatey (Windows) | Convenience installer | CTO | Publish once signing is live; verify page covers manual verification for users who prefer it. |
| mftplus.co.za (landing page) | Discovery + trust | CMO | "Download" CTA points to the verify-aware install flow; supply-chain trust signal already present (COO-805). |

**Decision:** the website CDN is canonical; package managers and GitHub Releases are mirrors. All external channels link to `docs.mftplus.co.za/install/verify` so customers learn the "verify before you run" habit regardless of where they downloaded.

## 3. Messaging for signed / verified packages

Core promise: **"Verify before you run."** Every package MFTPlus ships is cryptographically signed; customers can prove authenticity offline with one public key.

Key messages:
- **Prove it's really us.** Ed25519 (minisign) detached signatures — no keyring, no daemon, works fully offline.
- **Integrity by default.** Per-artifact SHA-256 plus a signed checksum manifest (`SHA256SUMS.minisig`).
- **One key to trust.** A single published release-signing public key (`fingerprint CE2C549429F978BB`) verifies every artifact across every version.
- **Fail safe.** If a checksum or signature does not verify, do not run it — and we tell customers exactly that.

Brand guardrails:
- Public materials use **MFTPlus** only; never "MFTxyz" or internal codenames.
- No internal metrics, customer lists, or infrastructure details in public messaging.
- Messaging must stay accurate to the live state: until the signing pipeline is announced, public copy says signatures "ship with the next tagged release" (matches the current `docs/install/verify` rollout note). We do **not** claim signing is live prematurely.

## 4. Launch communication plan

Phased so each stage is safe to execute the moment engineering is ready.

**Phase 0 — Pre-launch (CMO, can start now):**
- Finalize this plan and the asset checklist below.
- Pre-write (but do not publish) the launch blog post, release-notes template, social drafts, and the customer email.
- Confirm landing-page Download CTA and the COO-805 supply-chain trust signal point to `/install/verify`.

**Phase 1 — Launch day (gated on CTO "signing is live"):**
- Publish blog post: "MFTPlus releases are now signed — here's how to verify them."
- Update `docs/install/verify` rollout note from "pending" to "live" (CTO flips the doc flag; CMO reviews copy).
- GitHub Release notes include the verify command block and the public-key fingerprint.
- Social: LinkedIn + X/Twitter announce with the "verify before you run" angle.
- Email to existing users: what changed, why it matters, how to verify.

**Phase 2 — Post-launch (CMO):**
- Add a short "Why verify?" section to the landing page near the Download CTA.
- Monitor docs feedback; add a one-paragraph verification FAQ to `/guide/verifying-releases` if questions cluster.
- Quarterly key-rotation comms when the 1.0 GA key rotation happens (per the verify page policy).

## 5. Customer verification instructions (handoff to docs)

The customer-facing verification instructions **already exist and are customer-ready**:
- `docs.mftplus.co.za/install/verify` — public key, fingerprint, copy-paste verify commands (Linux/macOS/Windows).
- `docs.mftplus.co.za/guide/verifying-releases` — full walkthrough including SHA-256 methods that work on every release published so far.

Both correctly mark signature files as arriving with "the next tagged release," matching the current engineering state. **No change needed now.** CMO action at launch: review the copy when CTO flips the rollout flag, and ensure the landing page links to it.

## 6. Dependencies & handoff

**CTO must deliver before launch (tracked separately, blocked on CTO recovery):**
1. Live automated build-signing pipeline producing `SHA256SUMS` + `.minisig` per release.
2. Public release key `CE2C549429F978BB` published and kept current on `/install/verify` (draft already in place).
3. Signed manifests served from `releases.mftplus.co.za/v{version}/`.
4. Flip the rollout-status note on the verify pages from pending → live.

**CMO launch-execution handoff:** tracked in a child issue (created alongside this plan) so the GTM assets go live the moment CTO item 1–4 are done.

## 7. Evidence

- Plan PR: _(set on push)_ — branch `feat/COO-883-gtm-coordination` in `ZeroClue/mft-docs`.
- Customer verify page (already live, referenced above): `https://docs.mftplus.co.za/install/verify`
