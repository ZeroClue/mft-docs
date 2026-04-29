# Webhooks

Webhooks enable MFTPlus to push real-time notifications to your application when important events occur. Instead of polling the API for status updates, configure webhooks to receive HTTP callbacks as events happen.

## Overview

When an event occurs in your MFTPlus deployment (such as a transfer completing or an agent going offline), MFTPlus sends an HTTP POST request to a URL you configure. Your application can then process these events to trigger workflows, update databases, or send notifications.

### Use Cases

- **Transfer Notifications**: Alert teams when file transfers complete or fail
- **Agent Monitoring**: Trigger alerts when agents go offline or certificates expire
- **Audit Integration**: Stream events to SIEM systems for compliance
- **Automation**: Chain additional workflows based on transfer status
- **Custom Notifications**: Send alerts to Slack, Microsoft Teams, or other services

## Configuration

Configure webhooks through the MFTPlus admin panel or API.

### Admin Panel Configuration

1. Navigate to **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Configure webhook properties:
   - **Name**: Descriptive label for this webhook
   - **URL**: Endpoint that will receive POST requests
   - **Events**: Select which events trigger this webhook
   - **Secret**: (Optional) HMAC signature key for security
   - **Active**: Enable/disable the webhook

### API Configuration

Create a webhook via the REST API:

```bash
curl -X POST https://api.mftplus.co.za/api/webhooks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "Transfer Alerts",
    "url": "https://your-app.com/webhooks/mftplus",
    "events": ["transfer.completed", "transfer.failed"],
    "secret": "your-signing-secret",
    "active": true
  }'
```

## Event Types

MFTPlus sends webhook notifications for the following events:

### Transfer Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `transfer.created` | A new transfer was initiated | Transfer job starts |
| `transfer.progress` | Transfer progress update | Every 10% progress |
| `transfer.completed` | Transfer completed successfully | File transfer finishes |
| `transfer.failed` | Transfer failed | Error during transfer |
| `transfer.cancelled` | Transfer was cancelled | Manual or automatic cancellation |

### Agent Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `agent.registered` | New agent registered | Agent joins deployment |
| `agent.connected` | Agent came online | Agent connects after offline |
| `agent.disconnected` | Agent went offline | Agent loses connection |
| `agent.certificate.expiring` | Certificate expiring soon | 30 days before expiration |
| `agent.certificate.expired` | Certificate expired | Certificate no longer valid |

### Job Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `job.started` | Scheduled job started | Job execution begins |
| `job.completed` | Job completed successfully | All transfers in job finish |
| `job.failed` | Job failed | One or more transfers fail |
| `job.skipped` | Job skipped | Schedule conditions not met |

### System Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `system.health.degraded` | System performance degraded | Resource thresholds exceeded |
| `system.storage.warning` | Storage capacity warning | Disk usage above 80% |
| `system.error` | System error occurred | Unexpected system failure |

## Payload Format

All webhook payloads follow this structure:

```json
{
  "id": "whevt_1a2b3c4d5e6f7g8h",
  "event": "transfer.completed",
  "timestamp": "2026-04-29T15:30:00Z",
  "data": {
    // Event-specific data
  }
}
```

### Transfer Event Payloads

**transfer.completed:**
```json
{
  "id": "whevt_1a2b3c4d5e6f7g8h",
  "event": "transfer.completed",
  "timestamp": "2026-04-29T15:30:00Z",
  "data": {
    "transferId": "trf_1a2b3c4d5e6f",
    "agentId": "agent_1a2b3c4d",
    "agentName": "production-server-1",
    "sourceUrl": "sftp://ftp.example.com/files/data.csv",
    "destinationPath": "/local/data.csv",
    "direction": "pull",
    "protocol": "sftp",
    "size": 1048576,
    "bytesTransferred": 1048576,
    "duration": 45,
    "speed": 23303,
    "status": "completed"
  }
}
```

**transfer.failed:**
```json
{
  "id": "whevt_2b3c4d5e6f7g8h9i",
  "event": "transfer.failed",
  "timestamp": "2026-04-29T15:31:00Z",
  "data": {
    "transferId": "trf_2b3c4d5e6f",
    "agentId": "agent_1a2b3c4d",
    "agentName": "production-server-1",
    "sourceUrl": "sftp://ftp.example.com/files/data.csv",
    "error": "Authentication failed: Invalid credentials",
    "errorCode": "AUTH_FAILED",
    "retryCount": 3,
    "status": "failed"
  }
}
```

### Agent Event Payloads

**agent.disconnected:**
```json
{
  "id": "whevt_3c4d5e6f7g8h9i0j",
  "event": "agent.disconnected",
  "timestamp": "2026-04-29T15:32:00Z",
  "data": {
    "agentId": "agent_1a2b3c4d",
    "agentName": "production-server-1",
    "hostname": "server1.example.com",
    "lastSeen": "2026-04-29T15:30:00Z",
    "status": "offline"
  }
}
```

**agent.certificate.expiring:**
```json
{
  "id": "whevt_4d5e6f7g8h9i0j1k",
  "event": "agent.certificate.expiring",
  "timestamp": "2026-04-29T15:33:00Z",
  "data": {
    "agentId": "agent_1a2b3c4d",
    "agentName": "production-server-1",
    "certificateId": "cert_1a2b3c4d",
    "expiresAt": "2026-05-29T00:00:00Z",
    "daysRemaining": 30
  }
}
```

### Job Event Payloads

**job.completed:**
```json
{
  "id": "whevt_5e6f7g8h9i0j1k2l",
  "event": "job.completed",
  "timestamp": "2026-04-29T15:34:00Z",
  "data": {
    "jobId": "job_1a2b3c4d",
    "jobName": "Daily Backup",
    "agentId": "agent_1a2b3c4d",
    "schedule": "0 2 * * *",
    "transfersTotal": 5,
    "transfersCompleted": 5,
    "transfersFailed": 0,
    "duration": 320,
    "status": "completed"
  }
}
```

## Security

### Signature Verification

Each webhook request includes an `X-Webhook-Signature` header when a secret is configured. Verify this signature to ensure the request originated from MFTPlus.

The signature is an HMAC hex digest computed using the SHA-256 algorithm:

```
X-Webhook-Signature: sha256=<signature>
```

**Verification Example (Node.js):**
```javascript
import crypto from 'crypto';

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  const expectedSignature = `sha256=${digest}`;
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Usage
const payload = request.rawBody;
const signature = request.headers['x-webhook-signature'];
const isValid = verifySignature(payload, signature, 'your-secret');
```

**Verification Example (Python):**
```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected_signature = 'sha256=' + hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

# Usage
payload = request.body
signature = request.headers.get('X-Webhook-Signature')
is_valid = verify_signature(payload, signature, 'your-secret')
```

### HTTPS Requirements

- Always use HTTPS URLs for webhook endpoints
- MFTPlus refuses to send webhooks to HTTP endpoints (except for localhost testing)
- Ensure your SSL certificate is valid and not expired

### IP Whitelisting

For additional security, configure your firewall to only accept webhook connections from MFTPlus IP addresses. Contact support for the current IP ranges.

## Retry Policy

When your webhook endpoint returns a non-2xx status code or times out, MFTPlus retries delivery:

| Attempt | Timing |
|---------|--------|
| 1st retry | 1 minute after failure |
| 2nd retry | 5 minutes after 1st retry |
| 3rd retry | 30 minutes after 2nd retry |
| 4th retry | 2 hours after 3rd retry |

After 4 failed attempts, the webhook is marked as **failed** and an alert is sent to the admin. Manual reactivation is required.

**Timeout:** Webhook endpoints must respond within 10 seconds. Requests timing out are retried.

## Testing

### Testing Webhooks Locally

Use localtunnel or ngrok to test webhooks during development:

```bash
# Using localtunnel
npx localtunnel --port 3000

# Using ngrok
ngrok http 3000
```

Then configure your webhook with the provided HTTPS URL.

### Test Event Payloads

Send a test event from the admin panel:

1. Navigate to **Settings** → **Webhooks**
2. Select your webhook
3. Click **Send Test Event**
4. Choose an event type to simulate

## Best Practices

### Endpoint Design

- **Return quickly**: Process webhooks asynchronously and respond immediately
- **Return 200 OK**: Always return 200-299 status, even for internal errors
- **Idempotency**: Handle duplicate events (use the `id` field for deduplication)
- **Logging**: Log all received webhooks for troubleshooting

**Example Handler (Node.js/Express):**
```javascript
app.post('/webhooks/mftplus', async (req, res) => {
  const signature = req.headers['x-webhook-signature'];

  // Verify signature
  if (!verifySignature(req.rawBody, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  const { id, event, data } = req.body;

  // Check for duplicate
  if (await Event.exists({ id })) {
    return res.status(200).send('Duplicate');
  }

  // Process asynchronously
  processEvent(event, data).catch(console.error);

  // Save event ID for deduplication
  await Event.create({ id, event, data });

  // Respond immediately
  res.status(200).send('OK');
});
```

### Security Checklist

- [ ] Always use HTTPS endpoints
- [ ] Configure and verify signature secrets
- [ ] Implement request deduplication
- [ ] Validate payload structure
- [ ] Log all webhook events
- [ ] Monitor failed webhook deliveries
- [ ] Rotate secrets periodically

### Monitoring

Monitor webhook health through the admin panel:

- **Delivery Status**: Success/failure rates
- **Response Times**: Average endpoint response time
- **Recent Failures**: Last 10 failed deliveries with error details

Set up alerts for:
- Failed webhooks (after all retries exhausted)
- High failure rates (>5% in last hour)
- Slow endpoint responses (>5 seconds)

## Troubleshooting

### Webhooks Not Arriving

1. **Check webhook status**: Verify webhook is **Active** in admin panel
2. **Verify URL**: Ensure endpoint URL is correct and accessible
3. **Check firewall rules**: Confirm MFTPlus IPs can reach your endpoint
4. **Review signature verification**: Temporarily disable to test
5. **Check delivery logs**: View recent delivery attempts in admin panel

### Signature Verification Failing

1. **Confirm secret matches**: Verify secret in webhook configuration
2. **Check raw payload**: Ensure you're using the raw request body, not parsed
3. **Verify algorithm**: Confirm SHA-256 HMAC calculation
4. **Test without verification**: Temporarily disable to isolate the issue

### High Failure Rates

1. **Check endpoint health**: Verify your application is running
2. **Review response times**: Ensure responses are under 10 seconds
3. **Monitor errors**: Check application logs for exceptions during processing
4. **Scale infrastructure**: Add capacity if endpoint is overloaded

### Duplicate Events

Duplicate deliveries are normal and expected. Use the `id` field in each payload to deduplicate:

```javascript
const processedEvents = new Set();

function handleWebhook(payload) {
  if (processedEvents.has(payload.id)) {
    return; // Skip duplicate
  }
  processedEvents.add(payload.id);
  // Process event...
}
```

## Managing Webhooks

### List Webhooks

```bash
curl https://api.mftplus.co.za/api/webhooks \
  -H "Authorization: Bearer <admin-token>"
```

### Get Webhook Details

```bash
curl https://api.mftplus.co.za/api/webhooks/{id} \
  -H "Authorization: Bearer <admin-token>"
```

### Update Webhook

```bash
curl -X PATCH https://api.mftplus.co.za/api/webhooks/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "url": "https://new-url.com/webhook",
    "active": false
  }'
```

### Delete Webhook

```bash
curl -X DELETE https://api.mftplus.co.za/api/webhooks/{id} \
  -H "Authorization: Bearer <admin-token>"
```

### View Delivery History

```bash
curl https://api.mftplus.co.za/api/webhooks/{id}/deliveries \
  -H "Authorization: Bearer <admin-token>"
```

## Example Integrations

### Slack Notifications

```javascript
app.post('/webhooks/mftplus', (req, res) => {
  const { event, data } = req.body;

  if (event === 'transfer.failed') {
    axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `Transfer failed: ${data.sourceUrl}`,
      attachments: [{
        color: 'danger',
        fields: [
          { title: 'Agent', value: data.agentName },
          { title: 'Error', value: data.error }
        ]
      }]
    });
  }

  res.status(200).send('OK');
});
```

### Database Update

```python
@app.route('/webhooks/mftplus', methods=['POST'])
def webhook_handler():
    payload = request.get_json()

    if payload['event'] == 'transfer.completed':
        # Update transfer record in database
        db.transfers.update_one(
            {'transfer_id': payload['data']['transferId']},
            {'$set': {
                'status': 'completed',
                'completed_at': payload['timestamp']
            }}
        )

    return '', 200
```

### PagerDuty Alert

```javascript
app.post('/webhooks/mftplus', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'agent.disconnected') {
    await axios.post(
      `https://api.pagerduty.com/incidents`,
      {
        incident: {
          type: 'incident',
          title: `MFTPlus Agent Offline: ${data.agentName}`,
          service: { id: process.env.PAGERDUTY_SERVICE_ID },
          urgency: 'high'
        }
      },
      {
        headers: {
          'Authorization': `Token token=${process.env.PAGERDUTY_TOKEN}`,
          'Accept': 'application/vnd.pagerduty+json;version=2'
        }
      }
    );
  }

  res.status(200).send('OK');
});
```

## Reference

### Request Headers

| Header | Description |
|--------|-------------|
| `Content-Type` | Always `application/json` |
| `X-Webhook-Signature` | HMAC SHA-256 signature (if secret configured) |
| `X-Webhook-ID` | Unique webhook delivery ID |
| `X-Webhook-Timestamp` | Unix timestamp of delivery attempt |
| `User-Agent` | `MFTPlus-Webhook/1.0` |

### Response Requirements

- **Status Code**: Return 2xx for successful processing
- **Body**: Optional (ignored by MFTPlus)
- **Timeout**: Respond within 10 seconds to avoid retry

### Common Errors

| HTTP Status | Description | Retry Behavior |
|-------------|-------------|----------------|
| 401 | Invalid signature | No retry (security issue) |
| 404 | Endpoint not found | Retry (may be temporary) |
| 408 | Request timeout | Retry |
| 429 | Rate limited | Retry with exponential backoff |
| 500+ | Server error | Retry |

For more information, see [API Reference](../api/) or [Troubleshooting](./troubleshooting).
