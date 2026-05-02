# Admin Panel

The MFTPlus admin panel provides centralized management for customers, subscriptions, agents, and system health.

## Accessing the Admin Panel

Navigate to `/admin` on your MFTPlus dashboard domain:

```
https://dashboard.yourcompany.com/admin
```

:::: tip Production Access
Admin panel access requires authentication. See [Admin Login](#admin-login) below.
::::

## Admin Login

The admin panel uses separate authentication from the main dashboard:

### Authentication Methods

1. **Admin API Key**: Use your organization's admin API key
2. **SSO Integration**: Single sign-on through your identity provider (if configured)

### Session Management

- Sessions expire after 8 hours of inactivity
- Manual logout available via the user menu
- Concurrent sessions limited to 3 per admin account

### First-Time Setup

On initial deployment, the system prompts you to:
1. Create the primary admin account
2. Configure authentication method (API key or SSO)
3. Set up additional admin users

:::: warning Secure Your Admin Keys
Admin API keys provide full access to customer data and system settings. Store them securely and rotate regularly.
::::

## Customer Management

Manage customer accounts, configurations, and access from the Customers section.

### Viewing Customers

The customers list displays:
- Customer name and ID
- Associated agents
- Active subscription tier
- Account status (active, suspended, pending)
- Last activity timestamp

### Customer Actions

| Action | Description |
|--------|-------------|
| **View Details** | Open customer profile with full configuration |
| **Suspend** | Temporarily disable customer access |
| **Delete** | Remove customer and associated data (requires confirmation) |
| **Impersonate** | View dashboard as the customer (audit logged) |

### Adding Customers

1. Navigate to **Customers** → **Add Customer**
2. Enter customer details:
   - Company name
   - Contact email
   - Initial subscription tier
3. Customer receives onboarding email with setup instructions

### Customer Configuration

Per-customer settings include:
- Agent registration limits
- Storage quotas
- Transfer throughput limits
- Allowed protocols
- IP whitelist (optional)

## Subscription Oversight

Monitor and manage customer subscriptions from the Subscriptions section.

### Subscription Tiers

| Tier | Features | Agents | Storage |
|------|----------|--------|---------|
| **Free** | Basic transfers, community support | 1 | 10 GB |
| **Pro** | Priority transfers, email support | 10 | 500 GB |
| **Business** | SSO, API access, phone support | 50 | 5 TB |
| **Enterprise** | Custom limits, dedicated support | Unlimited | Unlimited |

### Subscription Actions

- **Upgrade**: Increase tier limits immediately
- **Downgrade**: Takes effect at next billing cycle
- **Cancel**: Disable access at period end
- **Renew**: Extend active subscription

### Billing Events

Track subscription events including:
- New subscriptions
- Plan changes
- Payment failures
- Auto-renewals
- Cancellations

## Agent Monitoring

Real-time visibility into all registered agents across your deployment.

### Agent Overview

The agents dashboard shows:

| Metric | Description |
|--------|-------------|
| **Total Agents** | All registered agents |
| **Online** | Agents with active connections |
| **Offline** | Agents not connected (with last seen time) |
| **Transfers** | Active transfer count per agent |

### Agent Details

Click any agent to view:
- Hostname and system information
- OS version and architecture
- Agent version
- Connected since timestamp
- Active and historical transfers
- Certificate status

### Agent Actions

| Action | Description |
|--------|-------------|
| **View Transfers** | Filter transfers by this agent |
| **Update Config** | Push configuration changes |
| **Revoke Certificate** | Remove agent access (requires re-registration) |
| **Force Disconnect** | Terminate agent connection |

:::: warning Certificate Revocation
Revoking an agent's certificate immediately terminates all active transfers and prevents reconnection until the agent re-registers.
::::

### Agent Health Monitoring

Configure alerts for:
- Agent offline duration
- Transfer failure rates
- Certificate expiration
- Version drift (outdated agents)

## System Health Dashboard

Monitor overall system performance and resource utilization.

### Health Metrics

The system dashboard displays:

- **Transfer Queue**: Pending, active, and completed transfers
- **Error Rates**: Transfer and system errors by type
- **Resource Usage**: CPU, memory, and storage across components
- **Response Times**: API endpoint latencies (p50, p95, p99)
- **Throughput**: Data transfer rates by protocol

### Component Status

| Component | Status Indicators |
|-----------|-------------------|
| **API Server** | Uptime, request rate, error rate |
| **Database** | Connections, query performance |
| **Message Queue** | Queue depth, processing rate |
| **Storage** | Capacity, I/O performance |

### Alerting

Configure alerts for:
- Component downtime
- Performance degradation
- Resource exhaustion
- Anomalous error rates

Alerts delivered via:
- Email (default)
- Webhook (custom integrations)
- Slack/Teams (configured integration)

## Audit Log Access

Comprehensive audit logging for compliance and security review.

### Log Categories

| Category | Events Logged |
|----------|---------------|
| **Authentication** | Logins, logouts, failed attempts, password changes |
| **Customer** | Account creation, modifications, deletions |
| **Subscription** | Tier changes, billing events, cancellations |
| **Agent** | Registration, configuration changes, revocations |
| **Transfer** | Job creation, transfers, failures |
| **Admin** | All admin panel actions with user attribution |

### Querying Audit Logs

Filter logs by:
- Date/time range
- Category
- User/admin
- Resource ID (customer, agent, transfer)
- Action type

Export logs in:
- CSV (spreadsheet compatible)
- JSON (programmatic analysis)
- Syslog format (SIEM integration)

### Log Retention

- **Standard**: 90 days
- **Enterprise**: Configurable retention up to 7 years

### Compliance

Audit logs support compliance requirements for:
- SOC 2
- ISO 27001
- HIPAA
- PCI DSS

All log entries are immutable and tamper-evident.

## Admin API

The admin panel exposes a REST API for automation.

### Authentication

Include your admin API key in requests:

```bash
curl -H "X-Admin-API-Key: your-key" \
  https://dashboard.mftplus.co.za/api/admin/agents
```

### Common Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/admin/agents` | List all agents |
| `GET /api/admin/customers` | List customers |
| `POST /api/admin/customers` | Create customer |
| `GET /api/admin/subscriptions` | List subscriptions |
| `GET /api/admin/audit` | Query audit logs |

See [API Reference](../api/) for complete endpoint documentation.

## Best Practices

### Security

- Use separate admin accounts for each administrator
- Enable SSO for centralized access control
- Rotate admin API keys monthly
- Review audit logs weekly for suspicious activity
- Limit admin impersonation to troubleshooting only

### Customer Management

- Document customer configurations before changes
- Test configuration changes on non-production customers first
- Notify customers before planned maintenance
- Keep customer contact information updated

### Monitoring

- Set up alerts for critical thresholds
- Review system health dashboard daily
- Track agent certificate expiration dates
- Monitor transfer failure rates by protocol

## Troubleshooting

### Admin Panel Not Loading

1. Verify you're using the correct URL (`/admin` path)
2. Check browser console for JavaScript errors
3. Clear browser cache and cookies
4. Try incognito/private browsing mode
5. Verify admin API key validity

### Unable to Impersonate Customer

1. Verify customer account is active
2. Check your admin permissions
3. Ensure audit logging service is running
4. Contact system administrator if issue persists

### Missing Audit Logs

1. Verify date range filter includes expected events
2. Check log retention policy (90-day default)
3. Ensure audit logging service is healthy
4. Check system health dashboard for errors

### Agent Status Stale

1. Agent may be offline (check last seen timestamp)
2. Network connectivity issue between agent and dashboard
3. Agent process may have crashed (check agent logs)
4. Certificate may have expired (revoke and re-register)
