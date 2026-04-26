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
# Linux/macOS
mftctl status

# Windows
mftctl.exe status
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
# Replace with your dashboard URL
curl -v https://dashboard.yourcompany.com/health
```

### 4. Verify Configuration

```bash
# View current configuration
mftctl config show

# Validate configuration
mftctl config validate
```

---

## Connection Issues

### Agent Can't Reach Dashboard

**Symptoms:**
- Agent appears offline in dashboard
- "Connection refused" or "timeout" errors
- Registration fails

**Solutions:**

1. **Verify Server URL**
   ```bash
   mftctl config get server.url
   ```
   Ensure the URL is correct and includes the protocol (`http://` or `https://`).

2. **Test Network Connectivity**
   ```bash
   # Test basic connectivity
   ping dashboard.yourcompany.com

   # Test HTTPS (replace with your port if non-standard)
   curl -v https://dashboard.yourcompany.com
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
   
   # Or configure in mftctl
   mftctl config set server.proxy http://proxy.example.com:8080
   ```

5. **DNS Resolution**
   
   ```bash
   # Verify DNS resolves correctly
   nslookup dashboard.yourcompany.com
   
   # Try using IP address directly if DNS fails
   mftctl config set server.url https://192.168.1.100
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
   openssl s_client -connect dashboard.yourcompany.com:443 -showcerts
   ```

2. **Self-Signed Certificates**
   
   For self-signed certificates in development, add the CA cert:
   
   ```bash
   mftctl config set server.ca-cert /path/to/ca-cert.pem
   ```

3. **Certificate Mismatch**
   
   Ensure the certificate's Common Name (CN) or Subject Alternative Name (SAN) matches the server URL in your configuration.

### Connection Drops During Transfer

**Symptoms:**
- Transfers start but stop midway
- "connection reset" errors
- Inconsistent file delivery

**Solutions:**

1. **Increase Timeout**
   ```yaml
   # config.yaml
   server:
     timeout: 300s  # Increase from default 30s
   ```

2. **Enable Retry Logic**
   ```yaml
   # config.yaml
   transfer:
     retryAttempts: 3
     retryDelay: 5s
   ```

3. **Check Network Stability**
   
   Monitor for packet loss or high latency:
   ```bash
   # Ping test with 100 packets
   ping -c 100 dashboard.yourcompany.com
   ```

---

## Authentication Problems

### Token Expired / Invalid

**Symptoms:**
- "401 Unauthorized" errors
- "token expired" messages
- Sudden authentication failures

**Solutions:**

1. **Re-register the Agent**
   ```bash
   mftctl register --force
   ```
   
   You'll need your registration credentials. Contact your account owner if you don't have them.

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
   # Remove stored tokens
   mftctl config clear auth.token
   
   # Re-authenticate
   mftctl auth login
   ```

### API Key Issues

**Symptoms:**
- API requests rejected with 403 Forbidden
- "invalid API key" errors

**Solutions:**

1. **Verify API Key in Configuration**
   ```bash
   mftctl config get server.apiKey
   ```

2. **Regenerate API Key**
   
   Log into the dashboard and generate a new API key, then update:
   ```bash
   mftctl config set server.apiKey your-new-api-key
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
   
   Archive or prune old transfer records:
   ```bash
   mftctl transfers prune --older-than 90d
   ```

3. **Configure Log Rotation**
   ```yaml
   # config.yaml
   logging:
     maxSize: 100MB
     maxBackups: 5
     maxAge: 30d
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
   
   Ensure glob patterns are correct:
   ```yaml
   # Correct
   source: /var/log/*.log
   
   # Incorrect (missing extension)
   source: /var/log/*.
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

1. **Enable Resume Support**
   ```yaml
   # config.yaml
   transfer:
     resumeEnabled: true
     chunkSize: 10MB
   ```

2. **Increase Timeout**
   ```yaml
   server:
     timeout: 600s  # 10 minutes for large files
   ```

3. **Verify Destination Space**
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
   # x86_64    → Download amd64/x64 build
   # aarch64   → Download arm64 build
   # armv7l    → Download arm build
   ```

2. **Missing Dependencies on Linux**
   ```bash
   # Check for missing libraries
   ldd /usr/bin/mftplus
   
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
   # Linux/macOS
   sudo dpkg -i mftplus_amd64.deb
   sudo rpm -i mftplus-x86_64.rpm
   
   # Windows: Run Command Prompt as Administrator
   ```

2. **Manual Installation Directory**
   
   Install to a user-writable location:
   ```bash
   # Extract to home directory
   tar -xzf mftplus-linux-amd64.tar.gz -C $HOME/
   
   # Add to PATH
   export PATH=$HOME/mftplus/bin:$PATH
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

3. **Reinstall Service**
   ```powershell
   # Remove existing service
   mftplus-service.exe uninstall
   
   # Reinstall as administrator
   mftplus-service.exe install
   ```

---

## Configuration Mistakes

### Invalid YAML Syntax

**Symptoms:**
- "YAML parse error" on startup
- Configuration not loading
- Agent fails to start

**Solutions:**

1. **Validate Configuration**
   ```bash
   mftctl config validate
   ```

2. **Common YAML Mistakes**
   
   ```yaml
   # WRONG: Tabs instead of spaces
   server:
  	url: http://localhost:8080
   
   # RIGHT: Use spaces for indentation
   server:
     url: http://localhost:8080
   
   # WRONG: Missing colon after key
   server url http://localhost:8080
   
   # RIGHT: Colon after key
   server: http://localhost:8080
   ```

3. **Use Online YAML Validator**
   
   Copy your config to [yamllint.com](https://yamllint.com) to validate syntax.

### Wrong Server URL

**Symptoms:**
- Agent can't connect
- 404 Not Found errors
- "host not found"

**Solutions:**

1. **Verify URL Format**
   ```yaml
   # Include protocol
   server:
     url: https://dashboard.example.com  # RIGHT
   
   # Missing protocol
   server:
     url: dashboard.example.com  # WRONG
   ```

2. **Test URL in Browser**
   
   Open the server URL in a web browser. It should load the dashboard.

3. **Check for Trailing Slashes**
   ```yaml
   server:
     url: https://dashboard.example.com/api  # RIGHT
     url: https://dashboard.example.com/api/  # MAY CAUSE ISSUES
   ```

### Incorrect File Paths

**Symptoms:**
- "file not found" errors
- Transfers fail to find source files
- Patterns match nothing

**Solutions:**

1. **Use Absolute Paths**
   ```yaml
   # More reliable
   source: /var/log/app/*.log
   
   # May fail depending on working directory
   source: ./logs/*.log
   ```

2. **Windows Path Separators**
   ```yaml
   # Use forward slashes (works on all platforms)
   source: C:/Logs/*.log
   
   # Or escape backslashes
   source: C:\\Logs\\*.log
   ```

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

MFTPlus offers a free tier for small-scale use. For enterprise features and higher transfer limits, see [mftplus.co.za/pricing](https://mftplus.co.za/pricing).

**3. Can I run multiple agents on the same machine?**

Yes, but you must configure each agent with a unique configuration directory:
```bash
mftctl --config-dir ~/.config/mft-agent-2 config init
```

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
# Temporarily enable verbose logging
mftctl config set logging.level debug

# View logs
tail -f ~/.config/mft-agent/logs/agent.log
```

**11. The agent shows as offline in the dashboard. What do I do?**

1. Check that the agent process is running: `mftctl status`
2. Verify server URL: `mftctl config get server.url`
3. Test connectivity: `curl -v https://dashboard.yourcompany.com/health`
4. Check firewall rules allow outbound HTTPS

**12. Why are my scheduled jobs not running?**

1. Verify the schedule syntax is valid (cron format)
2. Check the agent's timezone matches your expectation
3. View job history in the dashboard for error messages
4. Ensure the agent was running at the scheduled time

**13. How do I reset my configuration?**

```bash
# Backup current config first
cp ~/.config/mft-agent/config.yaml ~/.config/mft-agent/config.yaml.backup

# Reinitialize
mftctl config init
```

**14. Can I recover from a failed transfer?**

If resume is enabled, MFTPlus will automatically resume incomplete transfers on the next retry. Check your configuration:
```bash
mftctl config get transfer.resumeEnabled
```

**15. Where can I get help?**

- Documentation: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- Email Support: [support@mftplus.co.za](mailto:support@mftplus.co.za)
- Community: Coming soon

---

## Still Need Help?

If you've tried the solutions above and still can't resolve your issue:

1. **Collect Diagnostic Information**
   ```bash
   # Export diagnostic bundle
   mftctl diagnostics export --output debug-bundle.zip
   ```

2. **Contact Support**
   
   Email [support@mftplus.co.za](mailto:support@mftplus.co.za) with:
   - MFTPlus version (`mftctl version`)
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
