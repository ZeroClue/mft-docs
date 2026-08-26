# Troubleshooting

Solve common MFTPlus issues and find answers to frequently asked questions.

::: tip Quick Diagnosis
Most issues can be identified by checking the agent logs and verifying basic connectivity. Start with the [Diagnostic Steps](#diagnostic-steps) below if you're unsure where to begin.
:::

---

## Diagnostic Steps

Before diving into specific issues, run these quick checks:

### 1. Check Agent Status

```bash
# Is this machine connected? List your agents and their online state
mftctl agents list

# Running the headless agent daemon on a server? Check it directly
mft-agent-cli status
```

### 2. View Recent Logs

| Platform | Log Location |
|----------|--------------|
| Linux | `~/.config/mft-agent/logs/agent.log` |
| macOS | `~/Library/Application Support/mft-agent/logs/agent.log` |
| Windows | `%APPDATA%\mft-agent\logs\agent.log` |

```bash
# View last 50 lines (Linux/macOS)
tail -n 50 ~/.config/mft-agent/logs/agent.log

# View last 50 lines (Windows PowerShell)
Get-Content "$env:APPDATA\mft-agent\logs\agent.log" -Tail 50
```

### 3. Test Dashboard Connectivity

```bash
curl -v https://dashboard.mftplus.co.za/api/health
```

### 4. Verify Configuration

```bash
# View current configuration
mftctl config list
```

---

## Connection Issues

### Agent Can't Reach Dashboard

**Symptoms:**
- Agent appears offline in dashboard
- "Connection refused" or "timeout" errors
- Registration fails

**Solutions:**

1. **Check Your Saved Server URL**
   ```bash
   mftctl config get server-url
   ```
   Ensure the URL is correct and includes the protocol (`http://` or `https://`). For the MFTPlus cloud it should be `https://dashboard.mftplus.co.za`.

2. **Test Network Connectivity**
   ```bash
   # Test basic connectivity
   ping dashboard.mftplus.co.za

   # Test HTTPS
   curl -v https://dashboard.mftplus.co.za/api/health
   ```

3. **Check Firewall Rules**
   
   Ensure outbound connections are allowed:
   
   | Platform | Command |
   |----------|---------|
   | Linux (UFW) | `sudo ufw status` |
   | Linux (firewalld) | `sudo firewall-cmd --list-all` |
   | Windows | `netsh advfirewall show allprofiles` |
   | macOS | `sudo pfctl -s rules` |

4. **Proxy Configuration**
   
   If you're behind a proxy, configure it:
   
   ```bash
    # Set proxy environment variables
    export HTTP_PROXY=http://proxy.example.com:8080
    export HTTPS_PROXY=http://proxy.example.com:8080
    ```

5. **DNS Resolution**
   
   ```bash
   # Verify DNS resolves correctly
   nslookup dashboard.mftplus.co.za
   ```

### mTLS / Certificate Errors

**Symptoms:**
- "certificate verify failed" errors
- "unknown certificate authority" warnings
- TLS handshake failures

**Solutions:**

1. **Verify Certificate Validity**
   ```bash
   # Check certificate expiry
   openssl s_client -connect dashboard.mftplus.co.za:443 -showcerts
   ```

2. **Self-Signed Certificates**
   
   For self-signed certificates in development, add the CA cert:
   
   For self-signed certificates in development, add the CA cert path to the environment:
   ```bash
   export NODE_EXTRA_CA_CERTS=/path/to/ca-cert.pem
   ```

3. **Certificate Mismatch**
   
   Ensure the certificate's Common Name (CN) or Subject Alternative Name (SAN) matches the server URL in your configuration.

### Connection Drops During Transfer

**Symptoms:**
- Transfers start but stop midway
- "connection reset" errors
- Inconsistent file delivery

**Solutions:**

1. **Rely on Automatic Reconnect**

   `mftctl connect` reconnects automatically after a drop, retrying with exponential backoff (1s → 2s → 4s … capped at 30s). Keep the process running; no manual restart is needed for brief network interruptions.

2. **Retry Failed Transfers**

   Scheduled jobs support configurable retry attempts and backoff — set them when creating the job in the dashboard, or with `mft-agent-cli jobs create --max-retries --initial-backoff`. One-off failures can be re-sent from the dashboard or with `mftctl send`.

   There is no global retry tuning in `~/.config/mft-agent/config.toml` — the agent retries failed transfers automatically with exponential backoff, and transfers that fail after all retries move to the dead-letter queue:

   ```bash
   # List transfers that failed after max retries
   mft-agent-cli dead-letters

   # Retry a specific transfer
   mft-agent-cli retry --transfer-id <transfer-id>
   ```

3. **Check Network Stability**
   
   Monitor for packet loss or high latency:
   ```bash
   # Ping test with 100 packets
   ping -c 100 dashboard.mftplus.co.za
   ```

---

## Authentication Problems

### Token Expired / Invalid

**Symptoms:**
- "401 Unauthorized" errors
- "token expired" messages
- Sudden authentication failures

**Solutions:**

1. **Log In Again**

   Re-authenticate with your API key (create a fresh one in the dashboard if needed):
   ```bash
   mftctl login sk_xxxxxxxxxxxxxxxx --server https://dashboard.mftplus.co.za
   ```

2. **Check System Clock**
   
   Token validation depends on accurate time:
   ```bash
   # Linux/macOS
   date
   timedatectl status  # Linux only
   
   # Windows
   w32tm /query /status
   ```
   
   If time is incorrect, sync with an NTP server.

3. **Clear Cached Credentials**
   ```bash
   # Remove stored credentials
   mftctl logout

   # Re-authenticate
   mftctl login sk_xxxxxxxxxxxxxxxx --server https://dashboard.mftplus.co.za
   ```

### API Key Issues

**Symptoms:**
- API requests rejected with 403 Forbidden
- "invalid API key" errors

**Solutions:**

1. **Re-authenticate**
   ```bash
   mftctl login sk_xxxxxxxxxxxxxxxx --server https://dashboard.mftplus.co.za
   ```

2. **Regenerate API Key**
   
   Log into the dashboard and generate a new API key (**API Keys** → **Create API Key**), then login again:
   ```bash
   mftctl login sk_xxxxxxxxxxxxxxxx --server https://dashboard.mftplus.co.za
   ```

3. **Check API Key Permissions**
   
   Ensure the API key has the necessary permissions for the operations you're performing.

---

## Transfer Failures

### Permission Denied

**Symptoms:**
- "permission denied" errors
- "access is denied" on Windows
- Transfers fail with EACCES

**Solutions:**

1. **Source Directory Permissions**
   ```bash
   # Check read permissions
   ls -la /path/to/source
   
   # Fix if needed
   chmod +r /path/to/source/file
   ```

2. **Destination Directory Permissions**
   
   For SFTP/FTP destinations, ensure the user has write permissions:
   ```bash
   # Test SFTP write permissions
   sftp user@server.com
   sftp> put /tmp/test.txt /remote/path/
   ```

3. **SSH Key Permissions** (SFTP)
   
   SSH keys must have restrictive permissions:
   ```bash
   chmod 600 ~/.ssh/id_rsa
   chmod 644 ~/.ssh/id_rsa.pub
   ```

4. **Windows Service Account**
   
   If running as a Windows Service, verify the service account has access to network paths:
   ```powershell
   # Check service account
   Get-WmiObject Win32_Service | Where-Object {$_.Name -like "*mft*"}
   ```

### Storage Backend Errors

**Symptoms:**
- "disk full" errors
- "no space left on device"
- Transfer log writes fail

**Solutions:**

1. **Check Disk Space**
   ```bash
   # Linux/macOS
   df -h
   
   # Windows
   Get-PSDrive
   ```

2. **Clean Transfer Logs**

   Archive or delete old transfer log files from the agent's log directory.

3. **Keep Log Size Under Control**

   Archive or delete old log files on a schedule, for example with a cron job:
   ```bash
   # Delete agent logs older than 30 days (Linux/macOS)
   find ~/.config/mft-agent/logs -name "*.log" -mtime +30 -delete
   ```

4. **Adjust Log Verbosity**

   Log rotation is handled automatically and is not configurable, but you
   can set the verbosity via `log_level` in `~/.config/mft-agent/config.toml`:

   ```toml
   # config.toml
   log_level = "warn"  # Reduce log volume (e.g., "error", "warn", "info", "debug")
   ```

### File Not Found

**Symptoms:**
- "no such file or directory"
- Transfers skip files
- Pattern matching fails

**Solutions:**

1. **Verify File Paths**
   ```bash
   # Check if files exist at source
   ls -la /path/to/source/*.log
   
   # Use absolute paths in job configuration
   ```

2. **Check Pattern Syntax**
    
   Ensure glob patterns used in jobs and triggers are correct:
   ```text
   # Correct
   /var/log/*.log

   # Incorrect (missing extension)
   /var/log/*.
   ```

3. **Case Sensitivity**
   
   Remember that Linux is case-sensitive:
   ```bash
   # These are different on Linux
   /var/log/app.log
   /var/log/APP.LOG
   ```

### Large File Transfer Failures

**Symptoms:**
- Large files fail to transfer
- Connection drops during big transfers
- Partial file at destination

**Solutions:**

1. **Retry the Transfer**

   Interrupted transfers can be retried from the dashboard (**Transfers** → retry), or simply re-sent:
   ```bash
   mftctl send largefile.bin --to sftp://user@host/path --agent <agent-id>
   ```

   The agent resumes incomplete transfers on the next retry; transfers that
   exhaust retries land in the dead-letter queue:

   ```bash
   # List dead letters
   mft-agent-cli dead-letters

   # Retry a specific transfer
   mft-agent-cli retry --transfer-id <transfer-id>
   ```

2. **Verify Destination Space**
   ```bash
   # For SFTP
   sftp user@server.com
   sftp> df -h
   
   # For local transfers
   df -h /destination/path
   ```

---

## Installation Problems

### Binary Won't Run

**Symptoms:**
- "cannot execute binary file"
- "exec format error"
- "command not found"

**Solutions:**

1. **Verify Architecture Match**
   ```bash
   # Check your system architecture
   uname -m
   
   # Expected outputs:
   # x86_64    → Download amd64 build (macOS: universal build covers it)
   # aarch64   → Download aarch64/arm64 build (macOS: universal build covers it)
   ```

2. **Missing Dependencies on Linux**
   ```bash
   # Check for missing libraries
   ldd /usr/local/bin/mftctl
   
   # Install common dependencies
   sudo apt-get install libc6 libssl1.1  # Debian/Ubuntu
   sudo yum install glibc openssl         # RHEL/CentOS
   ```

3. **Windows: Blocked by SmartScreen**
   
   Click "More info" → "Run anyway" for the installer. To avoid this in production, code-sign the binary.

4. **macOS: App Can't Be Opened**
   ```bash
   # Remove quarantine attribute
   xattr -d com.apple.quarantine /Applications/MFTPlus.app
   
   # Or allow in System Preferences → Security & Privacy
   ```

### Permission Errors During Install

**Symptoms:**
- "access denied" during installation
- "permission denied" when writing to config directory

**Solutions:**

1. **Install with Elevated Privileges**
   ```bash
   # Install the desktop agent (Linux) from the release channel
   sudo dpkg -i MFT.Agent_<version>_amd64.deb        # Debian/Ubuntu
   sudo rpm -i MFT.Agent-<version>-1.x86_64.rpm      # RHEL/CentOS
   
   # Windows: Run the installer as Administrator
   ```

2. **Manual Installation Directory**
   
   Install to a user-writable location:
   ```bash
   # Extract to home directory
   tar -xzf mftctl_<version>_linux_amd64.tar.gz -C $HOME/
   
   # Add to PATH
   export PATH=$HOME/bin:$PATH
   ```

### Service Won't Start (Windows)

**Symptoms:**
- Service fails to start
- "Error 1053: The service did not respond"
- Event Log errors

**Solutions:**

1. **Check Event Viewer**
   
   Look for MFTPlus entries in Windows Event Viewer → Windows Logs → Application.

2. **Verify Service Account**
   
   Ensure the service account has necessary permissions:
   ```powershell
   # View service configuration
   Get-WmiObject Win32_Service | Where-Object {$_.Name -eq "MFTPlus"}
   ```

3. **Reinstall the Agent**

   Uninstall the desktop agent via Windows "Apps & features" (or the original installer's repair option), then re-run the latest installer from the [release channel](https://releases.mftplus.co.za/latest/) as Administrator.

---

## Configuration Mistakes

### Invalid Configuration File

The headless agent reads its configuration from `~/.config/mft-agent/config.toml`
(TOML format) and `mftctl` uses a JSON config file (`~/.mftctl/config.json`).
A malformed file prevents the agent from starting or breaks CLI commands.

**Symptoms:**
- "parse error" on startup
- Configuration not loading
- CLI commands fail with unexpected errors

**Solutions:**

`mftctl` uses a JSON config file (`~/.mftctl/config.json`) and the headless agent uses TOML (`~/.config/mft-agent/config.toml`). If you edited either by hand:

1. **Validate Syntax**
   ```bash
   # JSON (mftctl): parse errors are reported with line numbers
   python3 -m json.tool ~/.mftctl/config.json > /dev/null && echo OK
   ```

   For the agent's TOML config, use a TOML validator (most editors have built-in TOML linting).

2. **Common Mistakes**
    ```json
    // WRONG: trailing comma
    { "serverURL": "...", }

    // RIGHT: no trailing commas, double quotes only
    { "serverURL": "https://dashboard.mftplus.co.za" }
    ```

   ```toml
   # WRONG: Missing quotes around a string value
   dashboard_url = https://dashboard.example.com
   
   # RIGHT: Quote string values
   dashboard_url = "https://dashboard.example.com"
   
   # WRONG: Duplicate keys in the same table
   log_level = "info"
   log_level = "debug"
   
   # RIGHT: One value per key
   log_level = "info"
   ```

3. **Let the CLI Fix It**

   The safest option is to manage values through `mftctl config set / get / unset`, or start fresh:
   ```bash
   mftctl logout        # clears stored credentials
   mftctl login sk_xxxxxxxxxxxxxxxx --server https://dashboard.mftplus.co.za
   ```

### Wrong Server URL

**Symptoms:**
- Agent can't connect
- 404 Not Found errors
- "host not found"

**Solutions:**

1. **Verify URL Format**
   ```bash
   # Check what's currently saved
   mftctl config get server-url

   # RIGHT: includes protocol
   mftctl config set server-url https://dashboard.mftplus.co.za

   # WRONG: missing protocol
   mftctl config set server-url dashboard.mftplus.co.za
   ```

2. **Test URL in Browser**
    
   Open the server URL in a web browser. It should load the dashboard.

3. **Check for Trailing Slashes**
   ```bash
   # Use the plain base URL — no path, no trailing slash
   mftctl config set server-url https://dashboard.mftplus.co.za
   ```

### Incorrect File Paths

**Symptoms:**
- "file not found" errors
- Transfers fail to find source files
- Patterns match nothing

**Solutions:**

1. **Use Absolute Paths**
    ```text
    # More reliable (job source setting)
    /var/log/app/*.log

    # May fail depending on working directory
    ./logs/*.log
    ```

2. **Windows Path Separators**
    ```text
    # Use forward slashes (works on all platforms)
    C:/Logs/*.log

    # Or escape backslashes
    C:\\Logs\\*.log
    ```
   When creating the job via the CLI, quote paths containing spaces.

3. **Verify Path Exists**
   ```bash
   # Test path before using in job
   ls -la /path/to/source/
   ```

---

## FAQ

### General Questions

**1. What protocols does MFTPlus support?**

MFTPlus supports SFTP, FTP, FTPS, and local file transfers. SFTP is recommended for security.

**2. Is MFTPlus free?**

MFTPlus offers a Community tier for small-scale use. For enterprise features and higher transfer limits, see [mftplus.co.za/pricing](https://mftplus.co.za/pricing).

**3. Can I run multiple agents on the same machine?**

Yes. Each machine that runs `mftctl connect` registers as its own agent with a unique agent ID, so you can connect as many machines as you need to the same account.

**4. How do I upgrade MFTPlus?**

Download and run the latest installer. Your configuration and transfer history are preserved automatically.

**5. Does MFTPlus work offline?**

The agent requires connectivity to the dashboard for job management, but transfers can continue if connectivity is temporarily lost (configurable).

### Security Questions

**6. How are credentials stored?**

Credentials are stored locally in encrypted format with restrictive file permissions (600). They are never transmitted unencrypted.

**7. Can I use SSH keys instead of passwords?**

Yes, for SFTP connections you can configure SSH key authentication in the job settings.

**8. Is MFTPlus compliant with security standards?**

MFTPlus uses AES-256-GCM encryption for data in transit. Contact sales@mftplus.co.za for compliance documentation (SOC 2, HIPAA, etc.).

### Troubleshooting Questions

**9. Why did my transfer fail with "permission denied"?**

This usually means:
- Source file isn't readable by the agent process
- Destination directory isn't writable
- SFTP user lacks necessary permissions

Check file permissions and verify the agent's user account has access.

**10. How do I enable debug logging?**

```bash
# Run any command with debug output
mftctl --debug agents list

# View logs
tail -f ~/.config/mft-agent/logs/agent.log
```

**11. The agent shows as offline in the dashboard. What do I do?**

1. Check that `mftctl connect` is running on the machine: it should show an active connection
2. List your agents and their online state: `mftctl agents list`
3. Verify server URL: `mftctl config get server-url`
4. Test connectivity: `curl -v https://dashboard.mftplus.co.za/api/health`
5. Check firewall rules allow outbound HTTPS

**12. Why are my scheduled jobs not running?**

1. Verify the schedule syntax is valid (cron format)
2. Check the agent's timezone matches your expectation
3. View job history in the dashboard for error messages
4. Ensure the agent was running at the scheduled time

**13. How do I reset my configuration?**

```bash
# Backup current config first
cp ~/.mftctl/config.json ~/.mftctl/config.json.backup
cp ~/.config/mft-agent/config.toml ~/.config/mft-agent/config.toml.backup

# Clear stored credentials, then log in again
mftctl logout
mftctl login sk_xxxxxxxxxxxxxxxx --server https://dashboard.mftplus.co.za
```

**14. Can I recover from a failed transfer?**

If resume is enabled in the transfer configuration, MFTPlus will automatically resume incomplete transfers on the next retry.

**15. Where can I get help?**

- Documentation: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- Email Support: [support@mftplus.co.za](mailto:support@mftplus.co.za)
- Community: Coming soon

---

## Still Need Help?

If you've tried the solutions above and still can't resolve your issue:

1. **Collect Diagnostic Information**
   ```bash
   # Export configuration
   mftctl config export

   # Show your registered agents and their state
   mftctl agents list
   ```

2. **Contact Support**
   
   Email [support@mftplus.co.za](mailto:support@mftplus.co.za) with:
   - MFTPlus version (`mftctl --version`)
   - Operating system and version
   - Description of the issue
   - Relevant log excerpts or diagnostic bundle
   - Steps to reproduce the problem

3. **Community Resources**
   
   - Check the [discussion forum](https://docs.mftplus.co.za) for similar issues
   - Review [GitHub Issues](https://github.com/ZeroClue/mft-docs/issues) for known problems

---

## Related Topics

- [Quick Start](./quick-start) — Get started in 5 minutes
- [Installation](./installation) — Detailed installation instructions
- [Configuration](../api/config) — Configuration reference
- [CLI Reference](../api/cli) — Complete command reference
