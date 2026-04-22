# Quick Start

Get started with MFT in just a few minutes.

## Basic Transfer

The simplest way to transfer a file:

```bash
# Send a file
mftctl send ./myfile.txt recipient@example.com

# Receive a file
mftctl receive
```

## Transfer with Progress

Monitor your transfer progress:

```bash
mftctl send --progress ./large-file.tar.gz recipient@example.com
```

## Transfer to Multiple Recipients

Send to multiple recipients at once:

```bash
mftctl send ./document.pdf alice@example.com,bob@example.com
```

## Resume Interrupted Transfers

Automatically resume failed transfers:

```bash
mftctl send --resume ./large-file.tar.gz recipient@example.com
```

## Common Options

```bash
# Set transfer timeout
mftctl send --timeout 300s ./file.txt recipient@example.com

# Use specific transfer protocol
mftctl send --protocol sftp ./file.txt recipient@example.com

# Enable compression
mftctl send --compress ./file.txt recipient@example.com

# Set retry count
mftctl send --retry 5 ./file.txt recipient@example.com
```

## Next Steps

- [Architecture](./architecture) - Learn about MFT architecture
- [API Reference](../api/) - Explore the API
- [Plugins](../plugins/) - Extend MFT with plugins
