# Transfer Protocol

MFTPlus supports multiple transfer protocols for flexible file movement.

## Supported Protocols

| Protocol | Description |
|----------|-------------|
| **SFTP** | SSH File Transfer Protocol (recommended) |
| **FTP** | File Transfer Protocol |
| **FTPS** | FTP over TLS/SSL |
| **Local** | Local filesystem operations |

## Protocol Features

### Adaptive Flow Control

Automatically adjusts transfer rate based on network conditions:

```
Initial: 10 MB/s
Network detected: 100 Mbps
Adjusted: 50 MB/s
Network change: 10 Mbps
Readjusted: 5 MB/s
```

### Chunked Transfers

Files are split into chunks for:
- Parallel processing
- Efficient resumption
- Progress tracking

### Compression

Optional compression for:
- Reduced bandwidth usage
- Faster transfers for compressible data
- Transparent compression/decompression

### Checksum Verification

Every chunk is verified using:
- SHA-256 for integrity
- Automatic retransmission on failure
- End-to-end verification

## Protocol Selection

Specify the protocol when creating transfers:

```bash
mftctl transfers create \
  --agent <id> \
  --source /path/to/file \
  --dest sftp://backup.example.com/incoming \
  --protocol sftp
```

Or send files directly with a protocol-specific destination URL:

```bash
mftctl send ./file.txt \
  --agent <id> \
  --to ftp://host.example.com/incoming
```

## Supported URL Schemes

| Scheme | Protocol | Example |
|--------|----------|---------|
| `sftp://` | SFTP | `sftp://user@host:22/path` |
| `ftp://` | FTP | `ftp://user@host:21/path` |
| `ftps://` | FTPS | `ftps://user@host:990/path` |
| (local path) | Local | `/var/data/file.txt` |

## Encryption

File content can be encrypted during transfer:

```bash
mftctl send ./sensitive.pdf \
  --agent <id> \
  --to sftp://partner.example.com/incoming \
  --encryption aes256
```

Supported algorithms:
- `aes256` - AES-256-GCM (default)
- `chacha20` - ChaCha20-Poly1305

## Connection Profiles

Store and reuse connection settings:

```bash
mftctl connections create \
  --name backup-server \
  --type sftp \
  --host backup.example.com \
  --port 22 \
  --username deploy \
  --auth key

mftctl connections test backup-server
```

## Next Steps

- [CLI Commands](../api/cli) - Command reference
- [Plugins](../plugins/) - Extend transfer capabilities
