# Security and Authentication

Secure your MFTPlus deployment with comprehensive authentication, encryption, and access control.

## Overview

MFTPlus implements a zero-trust security model with multiple layers of protection:

- **Mutual TLS (mTLS)** for all component communication
- **JWT-based authentication** with token rotation
- **AES-256 encryption** for data in transit
- **Role-based access control (RBAC)** for admin and user roles
- **API key management** with automated rotation
- **Comprehensive audit logging** for compliance

::: tip Security First
All MFTPlus components require authentication by default. Unauthenticated connections are rejected.
:::

## JWT Authentication

MFTPlus uses JSON Web Tokens (JWT) for authentication between clients and servers.

### Token Structure

```yaml
# ~/.config/mftplus/config.yaml
auth:
  jwt:
    secret: ${JWT_SECRET}              # Load from environment variable
    issuer: mftplus-server
    audience: mftplus-api
    expiration: 3600                   # 1 hour in seconds
    refresh_expiration: 604800         # 7 days in seconds
    algorithm: RS256                   # RS256 for production, HS256 for dev
```

### Environment Variables

```bash
# Generate a secure secret (production)
openssl rand -base64 64

# Set environment variable
export JWT_SECRET="your-secure-secret-here"

# Or for systemd services
sudo systemctl edit mftplus-server
# Add:
# [Service]
# Environment="JWT_SECRET=your-secure-secret-here"
```

### Token Configuration Examples

**Development (HS256 - symmetric):**
```yaml
auth:
  jwt:
    algorithm: HS256
    secret: dev-secret-change-in-production
    expiration: 86400  # 24 hours for development
```

**Production (RS256 - asymmetric):**
```yaml
auth:
  jwt:
    algorithm: RS256
    private_key: /etc/mftplus/keys/jwt_private.pem
    public_key: /etc/mftplus/keys/jwt_public.pem
    expiration: 3600  # 1 hour
```

### Token Management

```bash
# Generate a new token (admin only)
mftctl auth token create --user admin@example.com --role admin

# List active tokens
mftctl auth token list --user admin@example.com

# Revoke a specific token
mftctl auth token revoke --token-id abc123

# Revoke all tokens for a user
mftctl auth token revoke --user admin@example.com --all
```

### Token Rotation

MFTPlus supports automatic token rotation:

```yaml
auth:
  jwt:
    expiration: 3600              # Access token: 1 hour
    refresh_expiration: 604800    # Refresh token: 7 days
    rotation_enabled: true
    rotation_threshold: 300       # Rotate 5 minutes before expiry
```

::: warning Token Storage
Never store JWT tokens in plaintext logs or debugging output. Use secure storage mechanisms like system keychains.
:::

## mTLS Configuration

Mutual TLS (mTLS) is required for all agent-server communication in MFTPlus.

### Certificate Authority Setup

MFTPlus integrates with [Step CA](https://smallstep.com/docs/certificates/) for certificate management:

```bash
# Initialize Step CA (first-time setup)
step ca init --deployment-type standalone --name "MFTPlus CA" --dns localhost

# Start the CA
step-ca $(step path)/config/ca.json &
```

### Agent Certificate Generation

```bash
# Generate a certificate for an agent
mftctl certificates issue --agent-id agent-1 \
  --ca-url https://ca.example.com:9000 \
  --root $(step path)/certs/root_ca.crt

# Certificates are stored in:
# ~/.config/mftplus/certificates/
```

### Server Certificate Configuration

```yaml
# /etc/mftplus/server.yaml
tls:
  enabled: true
  min_version: TLSv1.3
  max_version: TLSv1.3

  certificate:
    cert: /etc/mftplus/certs/server.crt
    key: /etc/mftplus/certs/server.key
    ca: /etc/mftplus/certs/ca.crt

  client_auth:
    mode: requireAndVerifyClientCert
    ca_files:
      - /etc/mftplus/certs/ca.crt

  cipher_suites:
    - TLS_AES_128_GCM_SHA256
    - TLS_AES_256_GCM_SHA384
    - TLS_CHACHA20_POLY1305_SHA256

  curve_preferences:
    - X25519
    - secp256r1
    - secp384r1
```

### Auto-Renewal Configuration

```yaml
# ~/.config/mftplus/config.yaml
certificates:
  ca_url: https://ca.example.com:9000
  auto_renew: true
  renew_before: 720h    # Renew 30 days before expiry
  validity: 8760h       # 1 year validity
  watch_interval: 24h   # Check every 24 hours
```

### mTLS Verification

```bash
# Verify certificate chain
openssl verify -CAfile /etc/mftplus/certs/ca.crt \
  /etc/mftplus/certs/server.crt

# Test mTLS connection
curl -v --cert client.crt --key client.key \
  --cacert ca.crt https://mftplus.example.com:8443/health
```

::: tip Certificate Permissions
Ensure certificate files have restrictive permissions:
```bash
chmod 600 ~/.config/mftplus/certificates/*.key
chmod 644 ~/.config/mftplus/certificates/*.crt
```
:::

## API Key Management

API keys provide alternative authentication for service accounts and integrations.

### API Key Configuration

```yaml
# ~/.config/mftplus/config.yaml
api_keys:
  enabled: true
  hash_algorithm: sha256
  min_length: 32
  rotation_required_days: 90
  prefix: "mftpk_"  # Keys start with this prefix
```

### Creating API Keys

```bash
# Create a new API key
mftctl apikeys create \
  --name "Service Account - Backup" \
  --role readonly \
  --expires 90d

# Output: mftpk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### API Key Management Commands

```bash
# List all API keys
mftctl apikeys list

# Get details of a specific key
mftctl apikeys get mftpk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Delete an API key
mftctl apikeys delete mftpk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Rotate (renew) an API key
mftctl apikeys rotate mftpk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Using API Keys

```bash
# Set API key as environment variable
export MFTPLUS_API_KEY="mftpk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

# Use in API requests
curl -H "X-API-Key: mftpk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  https://api.mftplus.example.com/v1/transfers

# Or use with mftctl
mftctl --api-key mftpk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6 status
```

### API Key Rotation Policy

```yaml
api_keys:
  rotation_required_days: 90
  warning_days: 7            # Warn 7 days before expiry
  auto_rotate: false         # Manual rotation required
  max_inactive_days: 30      # Revoke if unused for 30 days
```

::: warning API Key Security
- Never commit API keys to version control
- Rotate keys immediately if compromised
- Use different keys for different services
- Monitor key usage in audit logs
:::

## AES-256 Encryption Configuration

MFTPlus uses AES-256-GCM for encrypting data in transit.

### Encryption Settings

```yaml
# /etc/mftplus/server.yaml
encryption:
  algorithm: AES-256-GCM
  key_derivation: PBKDF2
  pbkdf2:
    iterations: 600000
    salt_length: 32
    key_length: 32

  # Transfer encryption
  transfers:
    enabled: true
    algorithm: AES-256-GCM
    nonce_size: 12           # 96-bit nonce for GCM
    tag_size: 16             # 128-bit authentication tag
```

### Environment Configuration

```bash
# Set encryption key (use a key management system in production)
export MFTPLUS_ENCRYPTION_KEY=$(openssl rand -base64 32)

# Configure key derivation
export MFTPLUS_PBKDF2_ITERATIONS=600000
export MFTPLUS_PBKDF2_SALT_LENGTH=32
```

### Transfer-Specific Encryption

```yaml
# Per-transfer encryption settings
transfer:
  encryption:
    enabled: true
    algorithm: AES-256-GCM
    compress: true           # Compress before encrypting
    chunk_size: 10MB         # Encrypt in 10MB chunks

  # Streaming encryption for large files
  streaming:
    enabled: true
    buffer_size: 1MB
  ```

### Verification

```bash
# Verify encryption is enabled
mftctl config get encryption.enabled

# Test encrypted transfer
mftctl send --encrypt ./sensitive-file.txt recipient@example.com

# Verify file checksum (confirms integrity)
mftctl transfers verify <transfer-id>
```

::: tip Key Management
For production deployments, use a key management service (KMS) like:
- AWS KMS
- Azure Key Vault
- HashiCorp Vault
- Google Cloud KMS
:::

## Role-Based Access Control (RBAC)

MFTPlus implements RBAC with predefined roles for admin and user access.

### Built-in Roles

| Role | Permissions | Use Case |
|------|-------------|----------|
| **admin** | Full access to all resources | System administrators |
| **operator** | Manage transfers, view logs | Operations team |
| **user** | Create and manage own transfers | Regular users |
| **readonly** | View-only access | Auditors and monitors |

### User Management

```bash
# Create a new user
mftctl users create \
  --email user@example.com \
  --name "John Doe" \
  --role user

# Promote to admin
mftctl users update user@example.com --role admin

# List all users
mftctl users list

# Delete a user
mftctl users delete user@example.com
```

### RBAC Configuration

```yaml
# /etc/mftplus/server.yaml
rbac:
  enabled: true
  default_role: user
  admin_users:
    - admin@example.com
    - security@example.com

  # Role permissions matrix
  roles:
    admin:
      permissions:
        - "*"
    operator:
      permissions:
        - "transfers:*"
        - "transfers:read"
        - "transfers:create"
        - "logs:read"
    user:
      permissions:
        - "transfers:create"
        - "transfers:read:own"
        - "transfers:cancel:own"
    readonly:
      permissions:
        - "transfers:read"
        - "logs:read"
```

### Permission Scope

```yaml
permissions:
  # Own resources only
  transfers:manage:own

  # All transfers
  transfers:manage:all

  # Specific operations
  transfers:create
  transfers:read
  transfers:cancel
  transfers:retry

  # Administrative
  users:manage
  config:edit
  logs:read
```

### Service Account Roles

```bash
# Create service account with specific role
mftctl users create \
  --email backup-service@example.com \
  --role readonly \
  --type service
```

## Security Best Practices Checklist

### Deployment Security

- [ ] **Use TLS 1.3 only** (disable TLS 1.2 and below)
- [ ] **Enable mTLS** for all component communication
- [ ] **Rotate JWT secrets** every 90 days
- [ ] **Use RSA keys** for JWT in production (HS256 only for dev)
- [ ] **Store secrets in environment variables**, never in config files
- [ ] **Restrict file permissions** on certificates (600) and configs (644)
- [ ] **Enable audit logging** for all security events
- [ ] **Use a KMS** for encryption keys in production
- [ ] **Disable unused services** and ports
- [ ] **Run as non-root user** where possible

### Network Security

- [ ] **Configure firewall rules** to allow only necessary ports
- [ ] **Use VPN or private networks** for admin access
- [ ] **Enable rate limiting** on API endpoints
- [ ] **Configure DDoS protection** (e.g., Cloudflare, AWS Shield)
- [ ] **Separate management interfaces** from data transfer interfaces

### Operational Security

- [ ] **Rotate API keys** every 90 days
- [ ] **Monitor audit logs** for suspicious activity
- [ ] **Implement intrusion detection** (IDS/IPS)
- [ ] **Regular security updates** of all components
- [ ] **Backup configurations** and test restoration
- [ ] **Document incident response** procedures
- [ ] **Conduct regular security audits**

### Compliance

- [ ] **Enable detailed logging** for audit trails
- [ ] **Implement log retention** policy (minimum 90 days)
- [ ] **Use immutable logging** for critical security events
- [ ] **Document security policies** and procedures
- [ ] **Regular penetration testing** (annually or after major changes)

## Troubleshooting

### Certificate Issues

**Problem: Certificate verification fails**

```bash
# Check certificate validity
openssl x509 -in ~/.config/mftplus/certificates/client.crt -text -noout

# Verify against CA
openssl verify -CAfile /etc/mftplus/certs/ca.crt client.crt

# Check expiration
openssl x509 -in client.crt -noout -dates
```

**Solution: Renew expired certificates**
```bash
mftctl certificates renew --force
```

### JWT Token Issues

**Problem: Token rejected as invalid**

```bash
# Check token expiration
echo "eyJ..." | jq -R 'split(".") | .[1] | @base64d | fromjson | .exp'

# Verify JWT secret matches
mftctl config get auth.jwt.secret
```

**Solution: Re-generate tokens after secret rotation**
```bash
mftctl auth token create --user user@example.com
```

### Permission Errors

**Problem: Access denied error**

```bash
# Check user roles
mftctl users get user@example.com

# Verify RBAC is enabled
mftctl config get rbac.enabled
```

**Solution: Ensure user has correct role**
```bash
mftctl users update user@example.com --role operator
```

## Next Steps

- [Architecture](./architecture) — Understanding MFTPlus security model
- [Configuration](../api/config) — Complete configuration reference
- [CLI Reference](../api/cli) — Security-related commands

## Need Help?

- **Security Issues**: security@mftplus.co.za
- **Documentation**: [docs.mftplus.co.za](https://docs.mftplus.co.za)
- **Support**: [support@mftplus.co.za](mailto:support@mftplus.co.za)
