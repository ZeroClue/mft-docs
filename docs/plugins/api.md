---
title: Plugin API Reference - MFTPlus Documentation
description: "API reference for MFTPlus plugins. Interfaces, hooks, and patterns for building custom transfer handlers and extending platform functionality."
---

# MFTPlus Plugin API

Complete API reference for plugin development.

## Plugin Interface

### Base Plugin

All plugins implement the base interface:

```go
type Plugin interface {
    // Initialize plugin with configuration
    Init(ctx context.Context, config map[string]string) error
    
    // Cleanup plugin resources
    Shutdown(ctx context.Context) error
    
    // Return plugin metadata
    Metadata() Metadata
}

type Metadata struct {
    Name        string
    Version     string
    Description string
    Type        PluginType
    Author      string
    License     string
}
```

### Plugin Types

```go
type PluginType string

const (
    PluginTypeAuth      PluginType = "auth"
    PluginTypeStorage   PluginType = "storage"
    PluginTypeProtocol  PluginType = "protocol"
    PluginTypeMonitor   PluginType = "monitor"
)
```

## Authentication Plugin API

### Interface

```go
type AuthPlugin interface {
    Plugin
    
    // Authenticate user credentials
    Authenticate(ctx context.Context, req AuthRequest) (*AuthResult, error)
    
    // Authorize access to resource
    Authorize(ctx context.Context, token string, resource string, action Action) (bool, error)
    
    // Refresh authentication token
    Refresh(ctx context.Context, token string) (*AuthResult, error)
    
    // Revoke authentication token
    Revoke(ctx context.Context, token string) error
}
```

### Types

```go
type AuthRequest struct {
    Type     AuthType
    Username string
    Password string
    Token    string
    OIDC     OIDCCredentials
}

type AuthResult struct {
    Token      string
    ExpiresAt  time.Time
    RefreshTok string
    User       User
}

type Action string

const (
    ActionRead   Action = "read"
    ActionWrite  Action = "write"
    ActionDelete Action = "delete"
    ActionAdmin  Action = "admin"
)
```

## Storage Plugin API

### Interface

```go
type StoragePlugin interface {
    Plugin
    
    // Store data and return ID
    Store(ctx context.Context, r io.Reader, metadata Metadata) (string, error)
    
    // Retrieve data by ID
    Retrieve(ctx context.Context, id string) (io.ReadCloser, *Metadata, error)
    
    // Delete data by ID
    Delete(ctx context.Context, id string) error
    
    // List stored items
    List(ctx context.Context, filter ListFilter) ([]Item, error)
    
    // Get storage statistics
    Stats(ctx context.Context) (*StorageStats, error)
}
```

### Types

```go
type Metadata struct {
    Name      string
    Size      int64
    MimeType  string
    CreatedAt time.Time
    Custom    map[string]string
}

type ListFilter struct {
    Prefix string
    Limit  int
}

type Item struct {
    ID       string
    Metadata Metadata
}

type StorageStats struct {
    TotalItems int64
    TotalSize  int64
}
```

## Protocol Plugin API

### Interface

```go
type ProtocolPlugin interface {
    Plugin
    
    // Send file to destination
    Send(ctx context.Context, req SendRequest) (*Transfer, error)
    
    // Receive incoming transfer
    Receive(ctx context.Context, req ReceiveRequest) (*Transfer, error)
    
    // Get transfer status
    Status(ctx context.Context, id string) (*TransferStatus, error)
    
    // Cancel transfer
    Cancel(ctx context.Context, id string) error
    
    // Resume transfer
    Resume(ctx context.Context, id string) error
}
```

### Types

```go
type SendRequest struct {
    File         string
    Destination  string
    Options      TransferOptions
}

type ReceiveRequest struct {
    TransferID   string
    OutputDir    string
    Options      TransferOptions
}

type Transfer struct {
    ID        string
    Status    TransferStatus
    Progress  float64
    StartedAt time.Time
}

type TransferStatus string

const (
    StatusPending   TransferStatus = "pending"
    StatusActive    TransferStatus = "active"
    StatusCompleted TransferStatus = "completed"
    StatusFailed    TransferStatus = "failed"
    StatusCancelled TransferStatus = "cancelled"
)
```

## Monitoring Plugin API

### Interface

```go
type MonitorPlugin interface {
    Plugin
    
    // Record transfer started
    TransferStarted(ctx context.Context, transfer Transfer)
    
    // Record transfer progress
    TransferProgress(ctx context.Context, transfer Transfer, progress float64)
    
    // Record transfer completed
    TransferCompleted(ctx context.Context, transfer Transfer)
    
    // Record transfer failed
    TransferFailed(ctx context.Context, transfer Transfer, err error)
    
    // Record custom metric
    RecordMetric(ctx context.Context, name string, value float64, tags map[string]string)
}
```

## Plugin Context

### Context Values

```go
// Transfer ID
ctx = context.WithValue(ctx, ContextKeyTransferID, "abc123")

// User ID
ctx = context.WithValue(ctx, ContextKeyUserID, "user-123")

// Request ID
ctx = context.WithValue(ctx, ContextKeyRequestID, "req-456")
```

## Plugin Lifecycle

```
Init() → Active operation → Shutdown()
   ↓
Error handling at each stage
```

## Error Handling

```go
type PluginError struct {
    Code    ErrorCode
    Message string
    Cause   error
}

func (e *PluginError) Error() string {
    return fmt.Sprintf("[%s] %s: %v", e.Code, e.Message, e.Cause)
}
```

## Next Steps

- [Creating Plugins](./creating) - Build your first plugin
- [CLI Commands](../api/cli) - Plugin management commands
