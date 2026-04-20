# Creating Plugins

Build custom plugins to extend MFTPlus functionality.

## Plugin Structure

A basic plugin has this structure:

```
my-plugin/
├── plugin.yaml
├── main.go
├── go.mod
└── README.md
```

## Plugin Manifest

`plugin.yaml` defines plugin metadata:

```yaml
name: my-plugin
version: 1.0.0
description: My custom MFTPlus plugin
type: storage
author: Your Name <you@example.com>
license: MIT
```

## Example Plugin

### Storage Plugin

```go
package main

import (
    "context"
    "io"

    "github.com/zeroclue/mftplus/plugin"
)

type MyStorage struct {
    config map[string]string
}

func (s *MyStorage) Init(ctx context.Context, config map[string]string) error {
    s.config = config
    return nil
}

func (s *MyStorage) Store(ctx context.Context, r io.Reader) (string, error) {
    // Implement storage logic
    return "stored-id", nil
}

func (s *MyStorage) Retrieve(ctx context.Context, id string) (io.ReadCloser, error) {
    // Implement retrieval logic
    return nil, nil
}

func (s *MyStorage) Delete(ctx context.Context, id string) error {
    // Implement delete logic
    return nil
}

func main() {
    plugin.Serve(&MyStorage{})
}
```

## Plugin Types

### Authentication Plugin

```go
type AuthPlugin interface {
    Authenticate(ctx context.Context, credentials Credentials) (Result, error)
    Authorize(ctx context.Context, token string, resource string) (bool, error)
}
```

### Storage Plugin

```go
type StoragePlugin interface {
    Store(ctx context.Context, r io.Reader) (string, error)
    Retrieve(ctx context.Context, id string) (io.ReadCloser, error)
    Delete(ctx context.Context, id string) error
}
```

### Protocol Plugin

```go
type ProtocolPlugin interface {
    Send(ctx context.Context, file string, destination string) error
    Receive(ctx context.Context) error
    Status(ctx context.Context, id string) (Status, error)
}
```

## Building Plugins

```bash
# Build plugin
go build -o my-plugin.so -buildmode=plugin

# Install plugin
mftctl plugin install ./my-plugin.so
```

## Testing Plugins

```bash
# Test plugin locally
mftctl plugin test ./my-plugin.so

# Enable plugin
mftctl plugin enable my-plugin
```

## Distribution

Publish your plugin:

1. Push to GitHub
2. Release with compiled binaries
3. Submit for inclusion in the plugin registry

## Next Steps

- [Plugin API](./api) - Complete API reference
