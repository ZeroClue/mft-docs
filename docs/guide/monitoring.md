# Monitoring and Observability

Track the health of your agents, transfers, and scheduled jobs from the MFTPlus dashboard — no infrastructure for you to manage.

## What You Can Monitor

### Transfer Metrics

Available from the dashboard **Transfers** view and hub **Health** tab:

- **Transfer success rate** — ratio of successful transfers to total attempts
- **Active transfers** — current concurrent transfers
- **Average transfer duration** — time to complete transfers
- **Queue depth** — transfers currently queued or in progress
- **Error rate** — failed transfers as a percentage of total

Use the time window selector (1h, 24h, 7d, 30d) to view trends.

### Agent Metrics

Available from the dashboard **Agents** view:

- **Active agents** — number of connected agents (online / offline)
- **Last heartbeat** — timestamp of each agent's most recent check-in
- **Agent version** — installed MFTPlus agent version

See [Hub Administration](./hub-admin) for the full Health tab tour.

### Job Metrics

For scheduled jobs:

- **Pending jobs** — number of enabled scheduled jobs
- **Job execution rate** — percentage of jobs running on schedule

## Alerts and Notifications

Configure notifications so you hear about problems as they happen:

1. Open your hub's **Settings** tab in the [dashboard](https://dashboard.mftplus.co.za)
2. Under **Notifications**, add webhook URLs or email addresses
3. Choose the events to be alerted on: agent offline, transfer failure, deploy key expiry

Webhook payloads can drive incident tooling or chat alerts — see [Webhooks](./webhooks).

## Recommended Checks

| Cadence | Check | Where |
|---------|-------|-------|
| Real-time | Agent offline alert fires | Notifications |
| Daily | Transfer success rate > 95% | Health tab |
| Weekly | Queue depth trends and error rate | Health tab |
| Monthly | Audit log review for anomalies | Dashboard audit log |

## Troubleshooting

### Agents Show Offline

1. Check the agent machine is powered on and online
2. Verify outbound HTTPS connectivity from the agent: see [Troubleshooting](./troubleshooting)
3. Review recent transfer failures for connection errors

### Transfer Success Rate Drops

1. Filter failed transfers by date range and agent
2. Check error messages on individual transfer records
3. Confirm destination credentials have not expired

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
