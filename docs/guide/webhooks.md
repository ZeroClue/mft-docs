# Webhooks

MFTPlus webhooks notify your application about important events in real-time. Configure webhook endpoints to receive notifications about transfer lifecycle events, billing changes, and system state updates.

## Overview

Webhooks are HTTP POST callbacks sent to your server when specific events occur in MFTPlus. Use webhooks to:

- Trigger downstream workflows when transfers complete
- Update internal systems with transfer status changes
- Sync billing data with your accounting platform
- Monitor and respond to failed transfers
- Build custom integrations with your existing tools

### Common Use Cases

| Use Case | Events |
|----------|--------|
| **Data Pipeline Triggers** | `transfer.completed` |
| **Failure Alerting** | `transfer.failed`, `transfer.retried` |
| **Billing Integration** | `billing.subscription_updated`, `billing.invoice_paid` |
| **Compliance Logging** | `transfer.started`, `transfer.completed` |
| **Custom Analytics** | All transfer events |

## Configuring Webhook Endpoints

### Via Dashboard

1. Navigate to **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Configure your endpoint:
   - **URL**: Your webhook receiver endpoint (HTTPS recommended)
   - **Events**: Select which events to subscribe to
   - **Secret**: A signing key for signature verification
4. Click **Save**

### Via CLI

```bash
mftctl webhooks create \
  --url https://your-app.com/mftplus-webhook \
  --events transfer.completed,transfer.failed \
  --secret your-signing-secret-here
```

### Via API

```bash
curl -X POST https://api.mftplus.co.za/v1/webhooks \
  -H "Authorization: Bearer $MFTPLUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/mftplus-webhook",
    "events": ["transfer.completed", "transfer.failed"],
    "secret": "your-signing-secret-here"
  }'
```

### Endpoint Requirements

Your webhook endpoint must:

- **Accept POST requests** with JSON payloads
- **Return 2xx status** within 30 seconds (timeout applies)
- **Handle idempotency** using the `X-Webhook-ID` header
- **Verify signatures** using the `X-Webhook-Signature` header

::: tip HTTPS Required
For production environments, your webhook endpoint must use HTTPS to protect payload data in transit.
:::

## Transfer Lifecycle Events

### transfer.started

Sent when a transfer job begins execution.

```json
{
  "id": "evt_1abc123xyz456",
  "event": "transfer.started",
  "timestamp": "2026-04-29T12:34:56.789Z",
  "data": {
    "transferId": "trf_abc123xyz456",
    "jobId": "job_def456uvw789",
    "agentId": "agent_ghi789rst012",
    "source": "/data/inbound/*.csv",
    "destination": "sftp://backup.example.com/archive/",
    "protocol": "sftp",
    "fileCount": 15
  }
}
```

### transfer.completed

Sent when a transfer completes successfully.

```json
{
  "id": "evt_1abc123xyz456",
  "event": "transfer.completed",
  "timestamp": "2026-04-29T12:35:23.456Z",
  "data": {
    "transferId": "trf_abc123xyz456",
    "jobId": "job_def456uvw789",
    "agentId": "agent_ghi789rst012",
    "source": "/data/inbound/*.csv",
    "destination": "sftp://backup.example.com/archive/",
    "protocol": "sftp",
    "fileCount": 15,
    "bytesTransferred": 52428800,
    "durationSeconds": 42,
    "files": [
      {
        "filename": "data-001.csv",
        "sizeBytes": 1048576,
        "checksum": "sha256:a1b2c3d4..."
      }
    ]
  }
}
```

### transfer.failed

Sent when a transfer fails due to errors.

```json
{
  "id": "evt_1abc123xyz456",
  "event": "transfer.failed",
  "timestamp": "2026-04-29T12:35:30.789Z",
  "data": {
    "transferId": "trf_abc123xyz456",
    "jobId": "job_def456uvw789",
    "agentId": "agent_ghi789rst012",
    "source": "/data/inbound/*.csv",
    "destination": "sftp://backup.example.com/archive/",
    "protocol": "sftp",
    "error": {
      "code": "AUTH_FAILED",
      "message": "Authentication failed: Invalid credentials",
      "retryable": true
    },
    "failedFiles": [
      {
        "filename": "data-001.csv",
        "error": "Permission denied"
      }
    ]
  }
}
```

### transfer.retried

Sent when a failed transfer is being retried.

```json
{
  "id": "evt_1abc123xyz456",
  "event": "transfer.retried",
  "timestamp": "2026-04-29T12:37:00.123Z",
  "data": {
    "transferId": "trf_abc123xyz456",
    "jobId": "job_def456uvw789",
    "agentId": "agent_ghi789rst012",
    "attemptNumber": 2,
    "maxAttempts": 5
  }
}
```

## Billing Events

MFTPlus integrates with Polar.sh for subscription management and billing.

### billing.subscription_updated

Sent when a subscription is created, updated, or cancelled.

```json
{
  "id": "evt_2def456uvw789",
  "event": "billing.subscription_updated",
  "timestamp": "2026-04-29T10:00:00.000Z",
  "data": {
    "subscriptionId": "sub_123abc456def",
    "status": "active",
    "planId": "plan_pro",
    "customerId": "cus_xyz789ghi012",
    "currentPeriodStart": "2026-04-01T00:00:00.000Z",
    "currentPeriodEnd": "2026-05-01T00:00:00.000Z",
    "cancelAtPeriodEnd": false
  }
}
```

### billing.invoice_paid

Sent when an invoice is successfully paid.

```json
{
  "id": "evt_3ghi789rst012",
  "event": "billing.invoice_paid",
  "timestamp": "2026-04-29T10:05:00.000Z",
  "data": {
    "invoiceId": "in_456jkl012mno345",
    "subscriptionId": "sub_123abc456def",
    "amount": 4900,
    "currency": "USD",
    "status": "paid",
    "paidAt": "2026-04-29T10:05:00.000Z"
  }
}
```

### billing.payment_failed

Sent when a payment attempt fails.

```json
{
  "id": "evt_4jkl012mno345",
  "event": "billing.payment_failed",
  "timestamp": "2026-04-29T10:10:00.000Z",
  "data": {
    "invoiceId": "in_789pqr345stu678",
    "subscriptionId": "sub_123abc456def",
    "amount": 4900,
    "currency": "USD",
    "status": "open",
    "reason": "payment_method_expired",
    "nextRetryAt": "2026-04-30T10:10:00.000Z"
  }
}
```

## Webhook Payload Format

All webhook payloads follow this structure:

```json
{
  "id": "evt_unique_event_id",
  "event": "event.type.name",
  "timestamp": "2026-04-29T12:34:56.789Z",
  "data": {
    // Event-specific data
  }
}
```

### Headers

Each webhook request includes these headers:

| Header | Description |
|--------|-------------|
| `X-Webhook-ID` | Unique identifier for this delivery (use for idempotency) |
| `X-Webhook-Signature` | HMAC SHA-256 signature for verification |
| `X-Webhook-Timestamp` | Unix timestamp of when the webhook was sent |
| `User-Agent` | `MFTPlus-Webhook/1.0` |
| `Content-Type` | `application/json` |

## Webhook Security

### Signature Verification

Verify webhook signatures to ensure requests originate from MFTPlus.

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  const expectedSignature = `sha256=${digest}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Usage
const express = require('express');
const app = express();

app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const secret = 'your-webhook-secret';

  if (!verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString());
  // Process event...
  res.status(200).send('OK');
});
```

### Python Example

```python
import hmac
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f'sha256={expected}', signature)

@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Webhook-Signature')
    secret = 'your-webhook-secret'

    if not verify_signature(request.data, signature, secret):
        return 'Invalid signature', 401

    event = request.json
    # Process event...
    return 'OK', 200
```

::: warning Keep Secrets Safe
Never commit webhook secrets to version control. Store them in environment variables or a secure secrets manager.
:::

### Idempotency

Process each webhook only once using the `X-Webhook-ID` header:

```typescript
const processedWebhooks = new Set();

app.post('/webhook', (req, res) => {
  const webhookId = req.headers['x-webhook-id'];

  if (processedWebhooks.has(webhookId)) {
    return res.status(200).send('Already processed');
  }

  // Process event...
  processedWebhooks.add(webhookId);
  res.status(200).send('OK');
});
```

## Retry Behavior

### Delivery Attempts

MFTPlus automatically retries failed webhook deliveries:

| Attempt | Timing |
|---------|--------|
| 1 | Immediate |
| 2 | 1 minute later |
| 3 | 5 minutes later |
| 4 | 30 minutes later |
| 5 | 2 hours later |

After 5 failed attempts, the webhook is disabled and you'll receive an email notification.

### Retry Conditions

Webhooks are retried when:

- Your endpoint returns a non-2xx status code
- Your endpoint times out (30 second limit)
- Your endpoint is unreachable (network error)
- TLS/SSL handshake fails

### Disabling Failed Webhooks

After 5 consecutive failures, the webhook is automatically disabled. Re-enable it via:

- **Dashboard**: Settings → Webhooks → Click webhook → Enable
- **CLI**: `mftctl webhooks enable <webhook-id>`
- **API**: `PATCH /v1/webhooks/{id}` with `{"enabled": true}`

## Error Handling

### Graceful Failure

Design your webhook handler to fail gracefully:

```typescript
app.post('/webhook', async (req, res) => {
  try {
    // Acknowledge receipt immediately
    res.status(200).send('OK');

    // Process asynchronously
    await processEventAsync(req.body);
  } catch (error) {
    // Log error but don't retry
    console.error('Webhook processing failed:', error);
    // Don't throw - we already sent 200 OK
  }
});
```

### Monitoring

Monitor webhook deliveries:

- **Dashboard**: Settings → Webhooks → View delivery logs
- **CLI**: `mftctl webhooks logs <webhook-id> --last 24h`
- **API**: `GET /v1/webhooks/{id}/deliveries`

## Testing Webhooks

### Local Testing

Use a local tunnel service to test webhooks during development:

```bash
# Using ngrok
ngrok http 3000

# Configure webhook with ngrok URL
mftctl webhooks create \
  --url https://abc123.ngrok.io/webhook \
  --events transfer.completed
```

### Test Events

Send test events from the dashboard:

1. Navigate to Settings → Webhooks
2. Select your webhook
3. Click **Send Test Event**
4. Choose an event type
5. Verify delivery in your application logs

## Event Reference

| Event | Category | Description |
|-------|----------|-------------|
| `transfer.started` | Transfer | Transfer execution started |
| `transfer.completed` | Transfer | Transfer completed successfully |
| `transfer.failed` | Transfer | Transfer failed with error |
| `transfer.retried` | Transfer | Transfer is being retried |
| `billing.subscription_updated` | Billing | Subscription changed |
| `billing.invoice_paid` | Billing | Invoice payment succeeded |
| `billing.payment_failed` | Billing | Payment attempt failed |

## Best Practices

1. **Use HTTPS** for production webhook endpoints
2. **Verify signatures** on every request
3. **Handle idempotency** using webhook IDs
4. **Respond quickly** — process events asynchronously
5. **Log all events** for debugging and audit trails
6. **Implement retries** for downstream API calls
7. **Monitor delivery logs** for failures
8. **Test locally** before deploying to production

## Troubleshooting

### Webhook Not Received

1. Check endpoint is publicly accessible
2. Verify URL is correct in webhook configuration
3. Review delivery logs in dashboard
4. Test signature verification logic
5. Check server logs for errors

### Signature Verification Fails

1. Confirm secret matches configuration
2. Verify you're using raw request body (not parsed)
3. Check signature format: `sha256=...`
4. Ensure UTF-8 encoding

### Timeouts

1. Return 200 OK immediately
2. Process events asynchronously
3. Optimize database queries
4. Use background job queues

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
- **API Reference**: [Webhooks API](/api/webhooks)
