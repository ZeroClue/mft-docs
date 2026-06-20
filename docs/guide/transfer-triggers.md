# Transfer Triggers

Transfer Triggers enable automatic file transfers based on filesystem events. When files arrive in a monitored directory, MFTPlus automatically transfers them to configured destinations without manual intervention.

## What are Transfer Triggers?

Transfer Triggers provide event-driven file transfer capabilities:

- **Real-time monitoring**: Watch directories for new files matching glob patterns
- **Automatic transfers**: Trigger transfers immediately when files arrive
- **Flexible routing**: Use templates to build dynamic destination paths
- **Debouncing**: Wait for file completion before transferring (useful for large uploads)
- **Security**: Path validation and restricted directory access

## How Triggers Work

The trigger workflow follows these steps:

1. **Directory watcher**: Agent monitors `watchPath` for filesystem events
2. **Pattern matching**: New files are matched against `globPattern`
3. **Debounce period**: Agent waits `debounceSeconds` for file write completion
4. **OneShot job execution**: A transfer job executes with the matched file
5. **Destination routing**: File is transferred to the resolved destination path

```
/data/incoming/file.csv
         ↓
    [Agent Watcher]
         ↓
    *.csv matches
         ↓
    [Debounce 5s]
         ↓
    [OneShot Transfer]
         ↓
sftp://partner/inbox/file.csv
```

## Creating Triggers

### Via Dashboard

1. Navigate to **Triggers** → **Create Trigger**
2. Configure the trigger:
   - **Name**: `incoming-csv-triggers`
   - **Watch Path**: `/data/incoming`
   - **Glob Pattern**: `*.csv`
   - **Destination**: `sftp://partner.inbox.com/{&#8203;{filename}&#8203;}`
   - **Credentials**: Select or create SFTP credentials
3. Click **Save**

### Via CLI

```bash
mftctl trigger create \
  --watch /data/incoming \
  --glob "*.csv" \
  --dest "sftp://partner.inbox.com/{&#8203;{filename}&#8203;}" \
  --debounce 5 \
  --recursive
```

## Configuration Reference

### Basic Settings

| Setting | Type | Required | Description |
|---------|------|----------|-------------|
| `watchPath` | string | Yes | Directory to monitor for new files |
| `globPattern` | string | Yes | Glob pattern for matching files (e.g., `*.csv`, `data-*.json`) |
| `destination` | string | Yes | Destination URL with template support |
| `credentials` | string | Yes | Named credential set for the destination |

### Advanced Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `recursive` | boolean | `false | Monitor subdirectories recursively |
| `debounceSeconds` | integer | `5` | Wait period for file completion (seconds) |
| `excludePatterns` | array | `[]` | Glob patterns to exclude (e.g., `["*.tmp", "*.bak"]`) |
| `enabled` | boolean | `true` | Enable or disable the trigger |

## Template Language

Destination paths support dynamic variables for flexible routing:

### File Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{&#8203;{filename}&#8203;}` | Full filename with extension | `report-2024.csv` |
| `{&#8203;{basename}&#8203;}` | Filename without extension | `report-2024` |
| `{&#8203;{extension}&#8203;}` | File extension including dot | `.csv` |
| `{&#8203;{parentdir}&#8203;}` | Parent directory name | `incoming` |

### Date/Time Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{&#8203;{date()}&#8203;}` | Current date (YYYY-MM-DD) | `2024-05-17` |
| `{&#8203;{time()}&#8203;}` | Current time (HH-MM-SS) | `14-30-45` |
| `{&#8203;{datetime()}&#8203;}` | Current date and time | `2024-05-17_14-30-45` |

### Unique Identifiers

| Variable | Description | Example |
|----------|-------------|---------|
| `{&#8203;{uuid}&#8203;}` | Random UUID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `{&#8203;{seq}&#8203;}` | Sequential number (per trigger) | `1`, `2`, `3`... |

### Template Transforms

Apply transformations to variables:

| Transform | Description | Example |
|-----------|-------------|---------|
| `{&#8203;{var|upper}&#8203;}` | Uppercase | `{&#8203;{basename|upper}&#8203;}` → `REPORT-2024` |
| `{&#8203;{var|lower}&#8203;}` | Lowercase | `{&#8203;{basename|lower}&#8203;}` → `report-2024` |
| `{&#8203;{var|replace:old:new}&#8203;}` | Replace text | `{&#8203;{basename|replace:-:_}&#8203;}` → `report_2024` |

### Template Examples

```
# Keep original filename
sftp://partner.inbox.com/{&#8203;{filename}&#8203;}

# Organize by date
sftp://archive.example.com/{&#8203;{date()}&#8203;}/{&#8203;{filename}&#8203;}

# Add timestamp
sftp://backup.example.com/{&#8203;{basename}&#8203;}_{&#8203;{datetime()}&#8203;}{&#8203;{extension}&#8203;}

# Sequential numbering
sftp://orders.example.com/order-{&#8203;{seq}&#8203;}.csv

# Parent directory routing
sftp://partner.inbox.com/{&#8203;{parentdir}&#8203;}/{&#8203;{filename}&#8203;}
```

## Protocols and Destinations

Transfer Triggers support all MFTPlus protocols:

| Protocol | URL Format | Example |
|----------|------------|---------|
| **SFTP** | `sftp://host/path` | `sftp://sftp.example.com/incoming/{&#8203;{filename}&#8203;}` |
| **FTP** | `ftp://host/path` | `ftp://ftp.example.com/uploads/{&#8203;{filename}&#8203;}` |
| **FTPS** | `ftps://host/path` | `ftps://secure.example.com/{&#8203;{filename}&#8203;}` |
| **Local** | `file:///path` | `file:///var/archive/{&#8203;{filename}&#8203;}` |

## Monitoring Trigger History

### Via Dashboard

1. Navigate to **Triggers** → trigger name
2. View **Recent Executions** for:
   - Triggered files
   - Execution timestamps
   - Transfer status
   - Error messages (if any)

### Via CLI

```bash
# List triggers
mftctl trigger list
```

## Security

### Path Validation

- **Restricted directories**: Triggers can only watch paths within allowed directories
- **Path traversal prevention**: Templates cannot escape allowed directories
- **Credential isolation**: Each trigger uses isolated credential sets

### Allowed Directories

Configure allowed watch directories in agent config:

```yaml
agent:
  triggers:
    allowedPaths:
      - /data/incoming
      - /var/uploads
      - /tmp/transfer
```

::: warning Security Note
Triggers cannot watch paths outside the configured `allowedPaths`. This prevents unauthorized file access.
:::

### Credential Management

- Credentials are stored securely and never logged
- Each trigger references credentials by name
- Credential changes apply immediately to all triggers

## Troubleshooting

### Trigger Not Firing

1. **Verify path is within allowed directories**
   Check the `allowedPaths` setting in the agent configuration file at `~/.config/mft-agent/config.yaml`.

2. **Check file pattern matches**
   - Verify `globPattern` matches your filenames
   - Test with: `ls /data/incoming/*.csv`

3. **Confirm trigger is enabled**
   ```bash
   mftctl trigger list
   ```

### Files Transferring Too Early

If large files are transferred before completion:

1. **Increase debounce time**
   ```yaml
   debounceSeconds: 30  # Wait 30 seconds for file completion
   ```

2. **Use filename patterns for completion**
   ```yaml
   excludePatterns:
     - "*.tmp"      # Exclude temporary files
     - "*.upload"   # Exclude in-progress uploads
   ```

### Transfer Failures

1. **Verify destination connectivity**
   ```bash
   # Test SFTP connection
   sftp partner.inbox.com
   ```

2. **Check credentials are valid**
   ```bash
   mftctl connections list
   ```

3. **Review trigger execution logs**
   ```bash
   mftctl trigger history incoming-csv-triggers --last 10
   ```

### Permission Denied

1. **Verify agent can read watch directory**
   ```bash
   ls -la /data/incoming
   ```

2. **Verify destination is writable**
   - Check destination user permissions
   - Confirm destination directory exists

### High CPU Usage

If monitoring large directory trees:

1. **Disable recursive monitoring**
   ```yaml
   recursive: false
   ```

2. **Use more specific glob patterns**
   ```yaml
   globPattern: "2024/*.csv"  # Instead of "*.csv"
   ```

3. **Add exclude patterns for noise**
   ```yaml
   excludePatterns:
     - "*.log"
     - "*.tmp"
     - ".*"
   ```

## Best Practices

### Debounce Configuration

| File Type | Recommended Debounce |
|-----------|---------------------|
| Small files (< 1MB) | 2-5 seconds |
| Medium files (1-100MB) | 10-30 seconds |
| Large files (> 100MB) | 60-300 seconds |

### Pattern Design

- **Use specific patterns**: `*.csv` instead of `*`
- **Combine with date**: `{&#8203;{date()}&#8203;}/{&#8203;{filename}&#8203;}` for organization
- **Exclude temporary files**: Add `*.tmp`, `*.bak` to `excludePatterns`

### Monitoring

- **Review trigger history weekly**: Check for failures or patterns
- **Set up alerts**: Configure notifications for failed transfers
- **Test regularly**: Verify triggers fire with test files

## Examples

### CSV Ingest Pipeline

```bash
mftctl trigger create \
  --name csv-ingest \
  --watch /data/incoming \
  --glob "*.csv" \
  --dest "sftp://data-warehouse.example.com/ingest/{&#8203;{date()}&#8203;}/{&#8203;{filename}&#8203;}" \
  --credentials warehouse-creds \
  --debounce 10
```

### Backup Trigger

```bash
mftctl trigger create \
  --name config-backup \
  --watch /etc/app/config \
  --glob "*.yaml" \
  --dest "file:///var/backups/config/{&#8203;{datetime()}&#8203;}/{&#8203;{filename}&#8203;}" \
  --debounce 2
```

### Multi-Destination Routing

Use multiple triggers for different file types:

```bash
# CSV files to SFTP
mftctl trigger create csv-sftp --watch /data/incoming --glob "*.csv" \
  --dest "sftp://sftp.example.com/csv/{&#8203;{filename}&#8203;}"

# JSON files to local archive
mftctl trigger create json-archive --watch /data/incoming --glob "*.json" \
  --dest "file:///var/archive/json/{&#8203;{basename}&#8203;}_{&#8203;{datetime()}&#8203;}{&#8203;{extension}&#8203;}"
```

## Next Steps

- [Installation](./installation) - Install MFTPlus agents
- [Quick Start](./quick-start) - Create your first transfer job
- [CLI Commands](../api/cli) - Complete `mftctl` reference

## Need Help?

- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
