# Backup and Recovery

This guide covers backup strategies and recovery procedures for MFTPlus deployments.

## Overview

MFTPlus stores data in three primary locations that need backup consideration:

1. **PostgreSQL Database** - Transfer metadata, configurations, and version history
2. **File Storage** - Transferred files and associated data
3. **Configuration** - Environment variables and deployment settings

## Database Backup

### PostgreSQL Dump (Recommended)

The most reliable backup method for PostgreSQL is using `pg_dump`:

```bash
# Full database dump
pg_dump -h localhost -U mftplus -d mftplus > mftplus_backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -h localhost -U mftplus -d mftplus | gzip > mftplus_backup_$(date +%Y%m%d).sql.gz
```

### Automated Backups

Set up automated daily backups using cron:

```bash
# Daily backup at 2 AM, retained for 30 days
0 2 * * * /usr/bin/pg_dump -h localhost -U mftplus -d mftplus | gzip > /backups/mftplus_$(date +\%Y\%m\%d).sql.gz
find /backups/ -name "mftplus_*.sql.gz" -mtime +30 -delete
```

### Database Restoration

```bash
# Restore from SQL dump
psql -h localhost -U mftplus -d mftplus < mftplus_backup_20250115.sql

# Restore from compressed dump
gunzip -c mftplus_backup_20250115.sql.gz | psql -h localhost -U mftplus -d mftplus
```

## File Storage Backup

File storage requirements vary by backend. Follow your storage provider's recommended backup approach.

### Local Filesystem

If using local filesystem storage:

```bash
# Backup storage directory
tar -czf mftplus_files_$(date +%Y%m%d).tar.gz /var/lib/mftplus/storage
```

### S3-Compatible Storage

Most S3-compatible providers offer built-in versioning and backup:

- Enable bucket versioning for automatic file version tracking
- Configure cross-region replication for disaster recovery
- Use lifecycle policies to manage retention

### NFS/Network Storage

Network-mounted storage should be backed up at the filesystem level using your standard backup procedures.

## Configuration Backup

### Environment Variables

Backup your `.env` file:

```bash
cp /opt/mftplus/.env /backups/env_backup_$(date +%Y%m%d)
```

**Important:** Store configuration backups securely. The `.env` file contains sensitive credentials.

### Docker Compose Configuration

```bash
cp /opt/mftplus/docker-compose.yml /backups/docker-compose_backup_$(date +%Y%m%d).yml
```

## Point-in-Time Recovery

MFTPlus includes built-in versioning capabilities that enable point-in-time recovery for file transfers:

- **Transfer Versioning**: Every transfer creates an immutable version record
- **Audit Trail**: Complete history of transfer states and modifications
- **Rollback Capability**: Restore previous versions through the CLI or API

### Using Versioning for Recovery

```bash
# List versions for a specific transfer
mftctl transfer versions --transfer-id <transfer-id>

# Restore to a specific version
mftctl transfer restore --transfer-id <transfer-id> --version-id <version-id>
```

This versioning feature provides granular recovery options for individual transfers without requiring full database restoration.

## Disaster Recovery Procedure

### Recovery Steps

1. **Assess the scope** - Determine what needs recovery (database, files, configuration)
2. **Stop services** - Prevent new data during recovery
3. **Restore database** - Apply the most recent PostgreSQL backup
4. **Restore file storage** - Recover files from your backup location
5. **Restore configuration** - Replace `.env` and `docker-compose.yml`
6. **Verify integrity** - Check that all services start correctly
7. **Resume operations** - Start accepting transfers

### Recovery Time Objective (RTO)

- Database restore: 15-60 minutes depending on size
- File restore: Varies by storage backend (minutes to hours)
- Configuration restore: 5 minutes

### Recovery Point Objective (RPO)

- Daily backups: Maximum 24 hours of data loss
- Hourly backups: Maximum 1 hour of data loss
- Continuous replication: Near-zero data loss

## Backup Scheduling Recommendations

| Environment | Backup Frequency | Retention |
|-------------|------------------|-----------|
| Production | Hourly | 30 daily + 12 monthly |
| Staging | Daily | 7 daily + 3 monthly |
| Development | Weekly | 4 weekly |

## Best Practices

1. **Test your backups** - Regularly restore backups to a test environment
2. **Off-site storage** - Store backup copies in a separate location
3. **Encrypt backups** - Protect sensitive data in backup files
4. **Monitor backup jobs** - Ensure backups complete successfully
5. **Document procedures** - Maintain up-to-date recovery documentation
6. **Automate alerts** - Get notified of backup failures immediately

## See Also

- [Installation Guide](/guide/installation) - Deployment setup
- [Configuration Reference](/api/config) - Configuration options
