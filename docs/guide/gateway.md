---
title: HTTP Gateway - Direct File Upload API | MFTPlus
description: "Upload files directly to MFTPlus via HTTP API without running an agent. Use cURL, PowerShell, or Python for programmatic uploads."
---

# HTTP Gateway

The MFTPlus HTTP Gateway enables direct file uploads via HTTP API — no agent installation required. Send files programmatically using cURL, PowerShell, Python, or any HTTP client.

## What is the HTTP Gateway?

The Gateway provides an HTTP endpoint (`POST /api/gateway/upload`) that accepts file uploads via multipart/form-data. Uploaded files are stored securely in cloud storage and tracked with status, checksums, and audit history.

### Key Capabilities

- **Direct uploads**: Upload files via HTTP — no agent, no SFTP setup
- **Programmatic access**: Works with any HTTP client (cURL, PowerShell, Python, etc.)
- **Secure authentication**: API key-based auth with SHA-256 hashed keys
- **Automatic cloud storage**: Files stored in MFTPlus-managed S3 (Community) or your own cloud (Pro)
- **Progress tracking**: Each upload is tracked with status and SHA-256 checksum
- **Rate limiting**: Per-key rate limiting (100 requests/minute)

## When to Use the Gateway vs the Agent

| Use Case | Gateway | Agent |
|----------|---------|-------|
| One-off or ad-hoc uploads | ✅ Best choice | ❌ Overkill |
| Scheduled recurring transfers | ❌ | ✅ Best choice |
| CI/CD pipeline uploads | ✅ Natural fit | ❌ |
| Large file transfers (>500MB) | ❌ Not supported | ✅ Best choice |
| SFTP/FTP/FTPS destinations | ❌ HTTP only | ✅ Supports all protocols |
| Script-based automation | ✅ Simple HTTP calls | ✅ CLI commands |
| Event-driven triggers | ❌ | ✅ Directory watching |

**In short:** Use the Gateway when you need to push files into MFTPlus from scripts, CI/CD, or automated workflows without running an agent. Use the Agent when you need scheduled transfers, SFTP/FTP destinations, or directory monitoring.

## Tier Comparison

| Feature | Community | Pro |
|---------|-----------|-----|
| Upload endpoint | ✅ | ✅ |
| Max file size | 500 MB | 500 MB (configurable) |
| Rate limit | 100 req/min per key | 100 req/min per key |
| Storage | MFTPlus-managed S3 | MFTPlus-managed S3 |
| BYO cloud (S3/Azure) | ❌ | ✅ |
| API keys | Unlimited | Unlimited |
| SHA-256 checksums | ✅ | ✅ |
| Compression | NONE | Configurable |

## How It Works

```
Your Application                     MFTPlus Gateway                    Cloud Storage
      │                                     │                                │
      │  POST /api/gateway/upload           │                                │
      │  X-Gateway-Key: <key>               │                                │
      │  [multipart file]                   │                                │
      │────────────────────────────────────>│                                │
      │                                     │  Upload to S3/Azure           │
      │                                     │──────────────────────────────>│
      │  { uploadId, status: "COMPLETED",   │                                │
      │    checksumSha256 }                 │                                │
      │<────────────────────────────────────│                                │
```

1. Your application sends a `POST` request with the file to the Gateway endpoint
2. The Gateway authenticates your API key and validates the file
3. The file is uploaded to cloud storage (MFTPlus-managed or your own)
4. The Gateway returns an upload ID, status, and SHA-256 checksum

## Getting a Gateway API Key

1. Log in to your MFTPlus dashboard at [dashboard.mftplus.co.za](https://dashboard.mftplus.co.za)
2. Navigate to **Gateway** → **API Keys**
3. Click **Create API Key**
4. Give the key a label (e.g., `ci-uploads`, `partner-integration`)
5. Copy the generated key — it is shown only once

::: warning
Store your API key securely. The key is hashed with SHA-256 and cannot be retrieved after creation. If lost, revoke the key and create a new one.
:::

### Key Format

```
mftgw_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d
```

Gateway API keys use the prefix `mftgw_` followed by a unique token, distinguishing them from agent API keys.

### Revoking a Key

1. Navigate to **Gateway** → **API Keys** in the dashboard
2. Click **Revoke** next to the key you want to disable
3. The key is immediately invalidated — any in-flight uploads using this key will fail

## Uploading Files

### Basic Upload (cURL)

```bash
curl -X POST https://api.mftplus.co.za/api/gateway/upload \
  -H "X-Gateway-Key: mftgw_your-api-key-here" \
  -F "file=@/path/to/document.pdf"
```

**Response:**

```json
{
  "success": true,
  "uploadId": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "document.pdf",
  "sizeBytes": 1048576,
  "status": "COMPLETED",
  "checksumSha256": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
}
```

### Upload with PowerShell

```powershell
$headers = @{
    "X-Gateway-Key" = "mftgw_your-api-key-here"
}

$form = @{
    file = Get-Item -Path "C:\reports\daily-report.csv"
}

Invoke-RestMethod -Uri "https://api.mftplus.co.za/api/gateway/upload" `
    -Method Post `
    -Headers $headers `
    -Form $form
```

### Upload with Python

```python
import requests

url = "https://api.mftplus.co.za/api/gateway/upload"
headers = {"X-Gateway-Key": "mftgw_your-api-key-here"}

with open("backup.sql", "rb") as f:
    response = requests.post(url, headers=headers, files={"file": f})

data = response.json()
print(f"Upload ID: {data['uploadId']}")
print(f"Status: {data['status']}")
print(f"SHA-256: {data['checksumSha256']}")
```

### Upload from CI/CD (GitHub Actions)

```yaml
- name: Upload artifact to MFTPlus
  run: |
    curl -X POST https://api.mftplus.co.za/api/gateway/upload \
      -H "X-Gateway-Key: \$MFTPLUS_GATEWAY_KEY" \
      -F "file=@build/output.zip"
```

## API Reference

### POST /api/gateway/upload

Upload a file to MFTPlus cloud storage.

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `X-Gateway-Key` | Yes | Your Gateway API key |
| `Content-Type` | Auto | Set automatically to `multipart/form-data` |

**Body (multipart/form-data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | The file to upload |

**Responses:**

| Status | Description |
|--------|-------------|
| `200` | Upload completed successfully. Returns upload details and SHA-256 checksum. |
| `400` | No file provided or invalid request. |
| `401` | Missing or invalid API key. |
| `403` | Gateway is disabled or feature not available on your tier. |
| `413` | File exceeds maximum allowed size (500 MB). |
| `429` | Rate limit exceeded (100 requests/minute per key). Retry after the specified window. |
| `500` | Upload failed due to a server or storage error. |

**Response Body:**

```json
{
  "success": true,
  "uploadId": "uuid",
  "filename": "original-filename.ext",
  "sizeBytes": 1048576,
  "status": "COMPLETED",
  "checksumSha256": "hex-encoded-sha256"
}
```

## Configuring Routes (Admin)

Gateway configuration is managed through the MFTPlus admin panel.

### Creating a Gateway

1. Navigate to **Gateway** → **Manage Gateways** in the admin panel
2. Click **Create Gateway**
3. Configure the following:
   - **Name**: A unique name for this gateway
   - **Tier**: Community or Pro
   - **Max File Size**: Maximum allowed file size in MB (default: 500)
   - **Compression**: Compression algorithm (default: NONE)
   - **Allowed Source IPs**: (Optional) Restrict uploads to specific IPs or CIDR ranges
4. Click **Save**

### Managing API Keys

1. Navigate to **Gateway** → **API Keys** in the admin panel
2. Create, label, and revoke keys as needed
3. View last-used timestamps for each key

### Viewing Upload History

1. Navigate to **Gateway** → **Uploads** in the admin panel
2. Filter by status (UPLOADING, COMPLETED, FAILED), date range, or gateway
3. Review upload details including filename, size, checksum, and timestamps

## BYO Cloud Setup (Pro)

Pro tier customers can upload files to their own S3 or Azure Blob Storage instead of MFTPlus-managed storage.

### Configuring BYO Cloud

1. Ensure your gateway is set to Pro tier
2. Navigate to **Gateway** → **BYO Cloud** in the admin panel
3. Choose your provider and enter credentials

**S3 Configuration:**

| Field | Description |
|-------|-------------|
| Bucket | Your S3 bucket name |
| Region | AWS region (e.g., `us-east-1`) |
| Access Key ID | AWS IAM access key |
| Secret Access Key | AWS IAM secret key |
| Prefix | Storage path prefix (e.g., `uploads/my-app/`) |

**Azure Blob Configuration:**

| Field | Description |
|-------|-------------|
| Container | Azure Blob container name |
| Connection String | Azure storage account connection string |
| Prefix | Storage path prefix (e.g., `uploads/my-app/`) |

::: warning
Credentials are encrypted at rest using AES-256-GCM before being stored in the database. Access keys and secrets are masked in the admin panel (e.g., `AKIA****WXYZ`).
:::

### Viewing BYO Config

After configuring, you can view your BYO cloud settings in the admin panel. Secrets are masked for security — you will see the configuration structure but not the full credential values.

## Troubleshooting

### "Invalid API key" (401)

- Verify the key is not revoked — check in the dashboard under **Gateway** → **API Keys**
- Verify the key prefix is `mftgw_`
- If the key was recently created, ensure it was copied correctly (keys are shown only once)

### "Gateway is disabled" (403)

- Check that your gateway is enabled in the dashboard
- Contact your admin if you cannot enable it

### "File exceeds maximum allowed size" (413)

- The default maximum is 500 MB
- Contact your admin to increase the limit if needed (PRO tier)

### Rate limiting (429)

- The Gateway allows 100 requests per minute per API key
- If you hit this limit, implement retry logic with exponential backoff in your client
- Rate limit headers are returned with each response: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Upload failures (500)

- Check the original file is not corrupted
- If using BYO cloud, verify your cloud storage credentials are valid
- Large files may take longer to process — the Gateway stores files to temp storage before uploading to cloud storage

## Security

- **API key storage**: Keys are hashed with SHA-256 before storage — plaintext keys are never persisted
- **Cloud credentials**: BYO cloud credentials are encrypted at rest using AES-256-GCM
- **Source IP restriction**: Gateways can be configured to only accept uploads from specific IPs or CIDR ranges
- **Rate limiting**: Prevents abuse with per-key rate limiting (100 requests/minute)
- **Checksum verification**: Each completed upload includes a SHA-256 checksum for integrity verification
