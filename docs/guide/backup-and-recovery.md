# Backup and Recovery

Implementing robust backup and disaster recovery procedures protects your MFTPlus deployment from data loss and ensures business continuity. This guide covers backup strategies, restoration procedures, and recovery planning.

## Overview

MFTPlus stores critical data including:
- **Transfer History**: Records of all file transfers
- **Job Configurations**: Scheduled transfer job definitions
- **Agent Registrations**: Trusted agent certificates and configurations
- **User Accounts**: Customer and administrator authentication data
- **Audit Logs**: Compliance and security event records

A comprehensive backup strategy protects these assets and enables quick recovery from hardware failures, data corruption, or accidental deletions.

## Backup Strategy

### Backup Components

| Component | Data | Backup Frequency | Retention |
|-----------|------|------------------|-----------|
| **PostgreSQL Database** | All application data, audit logs | Hourly | 30 days |
| **Agent Certificates** | mTLS certificates, keys | Daily | 90 days |
| **Configuration Files** | Environment variables, config files | On change | Indefinite |
| **Pipeline Definitions** | YAML pipeline configurations | On change | Indefinite |

### Backup Types

#### Full Backups

Complete copies of all data. Perform full backups daily during low-usage periods.

**Recommended schedule:** 2:00 AM daily (automated via cron)

#### Incremental Backups

Changes since the last full backup. Store hourly incremental backups for faster point-in-time recovery.

**Recommended schedule:** Hourly, retained for 24 hours

## Database Backups

### PostgreSQL Native Backups

Use `pg_dump` for logical backups of the MFTPlus database.

**Automated Backup Script:**

```bash
#!/bin/bash
# /usr/local/bin/mftplus-backup.sh

set -euo pipefail

BACKUP_DIR="/var/backups/mftplus"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/mftplus_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Get database credentials from environment
DB_HOST="${PGHOST:-localhost}"
DB_PORT="${PGPORT:-5432}"
DB_NAME="${PGDATABASE:-mftplus}"
DB_USER="${PGUSER:-mftplus}"

# Perform backup
pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" \
  --clean --if-exists --create --format=plain "${DB_NAME}" \
  | gzip > "${BACKUP_FILE}"

# Set appropriate permissions
chmod 640 "${BACKUP_FILE}"

# Remove old backups
find "${BACKUP_DIR}" -name "mftplus_*.sql.gz" \
  -mtime +${RETENTION_DAYS} -delete

echo "Backup completed: ${BACKUP_FILE}"
```

**Configure Cron:**

```bash
# Daily backup at 2:00 AM
0 2 * * * /usr/local/bin/mftplus-backup.sh >> /var/log/mftplus-backup.log 2>&1

# Hourly incremental (WAL archive)
0 * * * * /usr/local/bin/mftplus-wal-archive.sh >> /var/log/mftplus-wal.log 2>&1
```

### Docker Deployment Backups

For Docker-based deployments, run backups from within the database container:

```bash
#!/bin/bash
# Backup MFTPlus database in Docker

CONTAINER_NAME="mftplus-postgres-1"
BACKUP_DIR="/var/backups/mftplus"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

docker exec "${CONTAINER_NAME}" pg_dump -U mftplus \
  --clean --if-exists --create mftplus \
  | gzip > "${BACKUP_DIR}/mftplus_${TIMESTAMP}.sql.gz"

# Keep last 30 days
find "${BACKUP_DIR}" -name "mftplus_*.sql.gz" -mtime +30 -delete
```

### Point-in-Time Recovery (PITR)

Enable WAL archiving for recovery to any point in time:

**postgresql.conf:**
```ini
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal/%f'
max_wal_senders = 3
```

**Restore to specific time:**
```bash
# Create recovery.conf
echo "restore_command = 'cp /var/lib/postgresql/wal/%f %p'" \
  > /var/lib/postgresql/recovery.conf

echo "recovery_target_time = '2026-04-29 14:30:00'" \
  >> /var/lib/postgresql/recovery.conf

# Restart PostgreSQL to begin recovery
systemctl restart postgresql
```

## Agent Certificates Backup

Agent certificates are critical for mTLS authentication. Losing certificates requires re-registering all agents.

### Backup Procedure

```bash
#!/bin/bash
# Backup agent certificates

CERT_DIR="/var/lib/mftplus/certificates"
BACKUP_DIR="/var/backups/mftplus/certificates"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "${BACKUP_DIR}"

# Create encrypted backup
tar -czf - "${CERT_DIR}" | \
  gpg --cipher-algo AES256 --compress-algo 1 --symmetric \
  --output "${BACKUP_DIR}/certs_${TIMESTAMP}.tar.gz.gpg"

# Keep 90 days
find "${BACKUP_DIR}" -name "certs_*.tar.gz.gpg" -mtime +90 -delete
```

**Automate with Cron:**
```bash
# Daily certificate backup at 3:00 AM
0 3 * * * /usr/local/bin/mftplus-backup-certs.sh
```

### Restoring Certificates

```bash
# Decrypt and extract
gpg --output certs.tar.gz --decrypt certs_20260429_030000.tar.gz.gpg
tar -xzf certs.tar.gz -C /

# Restart mft-server to load certificates
systemctl restart mft-server
```

## Configuration Backup

Back up configuration files and environment variables whenever changes occur.

### Docker Compose Configuration

```bash
# Backup docker-compose.yml and .env
cp /opt/mftplus/docker-compose.yml /var/backups/mftplus/config/
cp /opt/mftplus/.env /var/backups/mftplus/config/.env.$(date +%Y%m%d)
```

### Environment Variables

```bash
# Export environment to file
printenv | grep MFTPLUS > /var/backups/mftplus/env_$(date +%Y%m%d).txt
```

### Pipeline Definitions

```bash
# Export pipeline YAML definitions
curl -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  https://api.mftplus.co.za/api/pipelines \
  | jq '.data[] | .identifier' \
  | while read id; do
      curl -H "Authorization: Bearer ${ADMIN_TOKEN}" \
        "https://api.mftplus.co.za/api/pipelines/${id}/yaml" \
        -o "/var/backups/mftplus/pipelines/${id}.yaml"
    done
```

## Disaster Recovery

### Recovery Objectives

| Metric | Target | Rationale |
|--------|--------|-----------|
| **RPO** (Recovery Point Objective) | 1 hour | Maximum acceptable data loss |
| **RTO** (Recovery Time Objective) | 4 hours | Maximum acceptable downtime |
| **Data Loss** | <1 hour | Hourly backup frequency |

### Recovery Procedures

#### Complete System Recovery

**1. Assess Damage**

```bash
# Check database status
docker exec mftplus-postgres-1 pg_isready -U mftplus

# Check application logs
journalctl -u mft-server -n 100

# Identify failed components
docker ps -a
```

**2. Restore Database**

```bash
# Stop application
docker compose down

# Restore from latest backup
gunzip -c /var/backups/mftplus/mftplus_latest.sql.gz | \
  docker exec -i mftplus-postgres-1 psql -U mftplus mftplus

# Restart services
docker compose up -d
```

**3. Restore Certificates**

```bash
# Decrypt and extract certificates
gpg --output certs.tar.gz --decrypt /var/backups/mftplus/certificates/latest.tar.gz.gpg
tar -xzf certs.tar.gz -C /

# Verify certificate permissions
chmod 600 /var/lib/mftplus/certificates/*
```

**4. Verify Recovery**

```bash
# Check database integrity
docker exec mftplus-postgres-1 psql -U mftplus -c "SELECT COUNT(*) FROM transfers;"

# Verify agent connectivity
curl -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  https://api.mftplus.co.za/api/agents

# Run test transfer
mftctl transfer start --agent test-agent sftp://test.com/file /tmp/file
```

#### Partial Recovery

**Single Database Table:**

```bash
# Restore specific table from backup
gunzip -c backup.sql.gz | \
  grep -A 1000 "COPY TABLE transfers" | \
  docker exec -i mftplus-postgres-1 psql -U mftplus mftplus
```

**Specific Transfer Record:**

```bash
# Extract and restore single record
gunzip -c backup.sql.gz | \
  grep -A 50 "INSERT INTO transfers VALUES ('trf_123" | \
  docker exec -i mftplus-postgres-1 psql -U mftplus mftplus
```

### Failover to Secondary Site

For high-availability deployments, configure a standby MFTPlus instance.

**Continuous Replication:**

```bash
# On standby server, configure PostgreSQL streaming replication
# primary_conninfo = 'host=primary.example.com port=5432 user=replicator'
```

**Promote Standby:**

```bash
# Trigger failover
docker exec mftplus-postgres-standby pg_ctl promote -D /var/lib/postgresql/data

# Update DNS to point to standby
# Update load balancer configuration
```

## Testing Backups

Regular testing ensures backups are viable and recovery procedures work.

### Automated Backup Testing

```bash
#!/bin/bash
# Test backup restoration

BACKUP_FILE="/var/backups/mftplus/mftplus_latest.sql.gz"
TEST_CONTAINER="mftplus-test-restore"

# Create test database
docker run -d --name "${TEST_CONTAINER}" \
  -e POSTGRES_PASSWORD=testpass \
  -e POSTGRES_DB=mftplus_test \
  postgres:15

# Wait for PostgreSQL to start
sleep 10

# Restore backup to test database
gunzip -c "${BACKUP_FILE}" | \
  docker exec -i "${TEST_CONTAINER}" psql -U postgres -d mftplus_test

# Verify data integrity
docker exec "${TEST_CONTAINER}" psql -U postgres -d mftplus_test \
  -c "SELECT COUNT(*) FROM transfers;"

# Clean up
docker stop "${TEST_CONTAINER}"
docker rm "${TEST_CONTAINER}"

echo "Backup test completed successfully"
```

### Weekly Backup Verification

```bash
# Schedule automated weekly tests
0 4 * * 0 /usr/local/bin/mftplus-test-backup.sh
```

### Quarterly Disaster Recovery Drill

1. **Announce DR drill** to stakeholders
2. **Stop primary MFTPlus instance**
3. **Restore from latest backup** to separate environment
4. **Verify all critical functions**:
   - Agent connections
   - Transfer operations
   - Job execution
   - User authentication
5. **Document recovery time** and any issues
6. **Update procedures** based on findings

## Scheduling Backups

### Recommended Schedule

| Backup Type | Frequency | Time | Retention |
|-------------|-----------|------|-----------|
| Full Database | Daily | 2:00 AM | 30 days |
| Incremental (WAL) | Hourly | :00 | 24 hours |
| Certificates | Daily | 3:00 AM | 90 days |
| Configuration | On change | - | Indefinite |
| Test Restoration | Weekly | Sunday 4:00 AM | - |

### Cron Configuration

```bash
# /etc/cron.d/mftplus-backups

# Full database backup
0 2 * * * root /usr/local/bin/mftplus-backup.sh

# WAL archive
0 * * * * root /usr/local/bin/mftplus-wal-archive.sh

# Certificate backup
0 3 * * * root /usr/local/bin/mftplus-backup-certs.sh

# Backup testing
0 4 * * 0 root /usr/local/bin/mftplus-test-backup.sh
```

### Monitoring Backups

**Monitor backup success:**

```bash
# Check recent backups
ls -lt /var/backups/mftplus/*.sql.gz | head -5

# Verify backup file integrity
gunzip -t /var/backups/mftplus/mftplus_latest.sql.gz

# Check backup logs
tail -50 /var/log/mftplus-backup.log
```

**Alert on failures:**

```bash
#!/bin/bash
# Check if backup exists and is recent

BACKUP_FILE="/var/backups/mftplus/mftplus_$(date +%Y%m%d)_020000.sql.gz"
MAX_AGE_SECONDS=86400  # 24 hours

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "ALERT: Backup file missing: ${BACKUP_FILE}"
  exit 1
fi

FILE_AGE=$(($(date +%s) - $(stat -c %Y "${BACKUP_FILE}")))

if [ ${FILE_AGE} -gt ${MAX_AGE_SECONDS} ]; then
  echo "ALERT: Backup is older than 24 hours"
  exit 1
fi

echo "Backup verification passed"
```

## Offsite Storage

Store backup copies in separate geographic locations for disaster recovery.

### Cloud Storage (AWS S3)

```bash
#!/bin/bash
# Upload backups to AWS S3

S3_BUCKET="s3://your-company-mftplus-backups"
LOCAL_BACKUP="/var/backups/mftplus/mftplus_latest.sql.gz"

# Upload with encryption
aws s3 cp "${LOCAL_BACKUP}" "${S3_BUCKET}/$(basename ${LOCAL_BACKUP})" \
  --storage-class STANDARD_IA \
  --server-side-encryption AES256

# Set lifecycle policy (90-day retention)
aws s3api put-bucket-lifecycle-configuration \
  --bucket your-company-mftplus-backups \
  --lifecycle-configuration file://s3-lifecycle.json
```

**s3-lifecycle.json:**
```json
{
  "Rules": [
    {
      "Id": "DeleteOldBackups",
      "Status": "Enabled",
      "Prefix": "",
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
```

### Remote Sync (rsync)

```bash
#!/bin/bash
# Sync backups to remote server

REMOTE_USER="backup"
REMOTE_HOST="backup.example.com"
REMOTE_DIR="/backups/mftplus"

rsync -avz --delete \
  /var/backups/mftplus/ \
  ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
```

## Best Practices

### Security

- **Encrypt backups** at rest and in transit
- **Restrict backup access** to authorized personnel only
- **Store encryption keys** separately from backups
- **Test backup restoration** in isolated environment
- **Document backup procedures** for incident response

### Reliability

- **Automate backups** to prevent human error
- **Monitor backup jobs** and alert on failures
- **Test restores monthly** to verify backup integrity
- **Maintain multiple backup copies** (3-2-1 rule)
- **Document recovery procedures** with runbooks

### Performance

- **Schedule during low-usage periods**
- **Use compression** to reduce storage requirements
- **Monitor disk space** and alert before exhaustion
- **Use incremental backups** for large datasets
- **Optimize PostgreSQL** for backup performance

### Compliance

- **Retain audit logs** per regulatory requirements
- **Document backup procedures** for auditors
- **Test recovery to meet RPO/RTO targets**
- **Secure sensitive data** in backups
- **Maintain backup chain of custody** documentation

## Monitoring and Alerting

### Key Metrics

| Metric | Alert Threshold |
|--------|-----------------|
| Backup job failure | Immediate |
| Backup age > 26 hours | Warning |
| Disk space < 20% | Critical |
| Restore test failure | Critical |
| Replication lag > 10 minutes | Warning |

### Monitoring Commands

```bash
# Check backup age
find /var/backups/mftplus -name "mftplus_*.sql.gz" -mtime +1

# Check disk space
df -h /var/backups

# Verify backup file integrity
for f in /var/backups/mftplus/*.sql.gz; do
  gunzip -t "$f" || echo "Corrupt: $f"
done
```

### Alert Integration

**Webhook Alert (example):**

```bash
#!/bin/bash
# Send backup failure alert

WEBHOOK_URL="https://hooks.example.com/mftplus-alerts"

curl -X POST "${WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"MFTPlus backup failed\",
    \"severity\": \"critical\",
    \"timestamp\": \"$(date -Iseconds)\"
  }"
```

## Troubleshooting

### Backup Job Fails

**Symptoms:** Cron job shows errors in logs

**Diagnosis:**
```bash
# Check backup logs
tail -100 /var/log/mftplus-backup.log

# Test database connectivity
pg_isready -h localhost -p 5432

# Verify disk space
df -h /var/backups
```

**Solutions:**
1. Ensure PostgreSQL is running and accessible
2. Verify sufficient disk space
3. Check database credentials
4. Confirm backup directory permissions

### Restore Fails

**Symptoms:** Import errors, data corruption

**Diagnosis:**
```bash
# Verify backup integrity
gunzip -t backup.sql.gz

# Check PostgreSQL version compatibility
pg_restore --version

# Test restore to temporary database
createdb test_restore
gunzip -c backup.sql.gz | psql test_restore
```

**Solutions:**
1. Verify backup file isn't corrupted
2. Ensure PostgreSQL versions match
3. Check sufficient disk space for restore
4. Verify database user permissions

### Replication Lag

**Symptoms:** Standby falls behind primary

**Diagnosis:**
```bash
# Check replication lag on primary
psql -c "SELECT client_addr, state, sync_state, "
       "pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes "
       "FROM pg_stat_replication;"

# Check standby receive status
psql -c "SELECT pg_is_in_recovery(), "
       "pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn());"
```

**Solutions:**
1. Check network bandwidth between sites
2. Verify standby resources aren't exhausted
3. Check for long-running queries blocking replay
4. Consider increasing `max_wal_senders`

## Reference

### Backup File Format

**SQL Dump Structure:**
```
-- PostgreSQL database dump
--
-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
...

-- Name: transfers; Type: TABLE; Schema: public
...

COPY transfers (id, source_url, destination_path, ...) FROM stdin;
...
```

### Essential Files to Backup

| File/Directory | Purpose |
|----------------|---------|
| `/var/backups/mftplus/*.sql.gz` | Database dumps |
| `/var/lib/mftplus/certificates/` | mTLS certificates |
| `/opt/mftplus/docker-compose.yml` | Deployment config |
| `/opt/mftplus/.env` | Environment variables |
| `/var/lib/mftplus/pipelines/` | Pipeline definitions |

### Recovery Time Estimates

| Scenario | Expected RTO |
|----------|--------------|
| Database corruption (full restore) | 2-4 hours |
| Single table restore | 15-30 minutes |
| Certificate replacement | 30-60 minutes |
| Complete system rebuild | 4-8 hours |
| Failover to standby | 15-30 minutes |

For additional information, see [Deployment](./deployment.md), [Monitoring](./monitoring.md), or [Troubleshooting](./troubleshooting.md).
