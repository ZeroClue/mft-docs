# API Reference

Complete reference for MFT APIs and interfaces.

## Overview

MFT provides multiple interfaces:

- **CLI API**: Command-line interface for direct usage
- **Go SDK**: Native Go library for integration
- **REST API**: HTTP interface for web applications
- **Plugin API**: Extend MFT functionality

## Quick Reference

### CLI Commands

```bash
# Transfer operations
mftctl send <file> <recipient>
mftctl receive [options]
mftctl status <transfer-id>

# Configuration
mftctl config init
mftctl config set <key> <value>
mftctl config get <key>

# Certificates
mftctl certificates issue
mftctl certificates renew
mftctl certificates list
```

### Go SDK

```go
package main

import "github.com/your-org/mft/sdk"

func main() {
    client := mft.NewClient("https://mft.example.com")
    
    transfer, err := client.Send(mft.SendRequest{
        File:      "./myfile.txt",
        Recipient: "recipient@example.com",
    })
    
    if err != nil {
        panic(err)
    }
    
    fmt.Println("Transfer ID:", transfer.ID)
}
```

## Next Steps

- [CLI Commands](./cli) - Complete CLI reference
- [Configuration](./config) - Configuration options
- [Plugin API](../plugins/api) - Plugin development guide
