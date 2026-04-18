# Quick Start

Get started with MFT in just a few minutes.

## Basic Transfer

The simplest way to transfer a file:

```bash
# Send a file
mft send ./myfile.txt recipient@example.com

# Receive a file
mft receive
```

## Transfer with Progress

Monitor your transfer progress:

```bash
mft send --progress ./large-file.tar.gz recipient@example.com
```

## Transfer to Multiple Recipients

Send to multiple recipients at once:

```bash
mft send ./document.pdf alice@example.com,bob@example.com
```

## Resume Interrupted Transfers

Automatically resume failed transfers:

```bash
mft send --resume ./large-file.tar.gz recipient@example.com
```

## Common Options

```bash
# Set transfer timeout
mft send --timeout 300s ./file.txt recipient@example.com

# Use specific transfer protocol
mft send --protocol sftp ./file.txt recipient@example.com

# Enable compression
mft send --compress ./file.txt recipient@example.com

# Set retry count
mft send --retry 5 ./file.txt recipient@example.com
```

## Next Steps

- [Architecture](./architecture) - Learn about MFT architecture
- [API Reference](../api/) - Explore the API
- [Plugins](../plugins/) - Extend MFT with plugins
