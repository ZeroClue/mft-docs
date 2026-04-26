---
title: Transfer Protocol - SFTP, FTP, FTPS Support | MFTPlus
description: "Learn about MFTPlus protocol support: SFTP for secure transfers, FTP for legacy systems, FTPS for TLS/SSL, and local filesystem operations."
---

# Transfer Protocol Support

The MFT Transfer Protocol (MFTP) is optimized for modern network conditions.

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

## Protocol Versions

### MFTP v1 (Current)

- Basic transfer support
- Chunked transfers
- Checksum verification
- Basic retry logic

### MFTP v2 (Coming Soon)

- UDP support for high-latency networks
- QUIC protocol integration
- Advanced compression
- Transfer prioritization

## Connection Modes

### Direct Mode

Point-to-point connection between sender and receiver:

```bash
mftctl send --mode direct ./file.txt recipient@example.com
```

### Relay Mode

Use a relay server for NAT traversal:

```bash
mftctl send --mode relay ./file.txt recipient@example.com
```

### Queue Mode

Store-and-forward via server queue:

```bash
mftctl send --mode queue ./file.txt recipient@example.com
```

## Next Steps

- [API Reference](../api/) - Explore the API
- [Plugins](../plugins/) - Extend the protocol with custom plugins
- [Quick Start](../guide/quick-start) - Set up your first transfer
