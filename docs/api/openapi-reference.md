# REST API Reference

::: warning API Preview
The MFTPlus API is currently in preview and coming soon. The endpoints and features described here are subject to change before general availability.
:::

Welcome to the MFTPlus REST API documentation.

## Overview

The MFTPlus API provides programmatic access to all MFTPlus features including:

- **Agent Management**: Register and manage transfer agents
- **Transfers**: Monitor and control file transfer operations
- **Jobs**: Create and manage scheduled transfer jobs
- **Pipelines**: Define and execute complex transfer workflows

## OpenAPI Specification

The complete OpenAPI 3.1.0 specification is available for download: [mftplus-api.yaml](/mftplus-api.yaml)

You can use this file with Postman, Insomnia, VS Code REST Client, or Redoc.

## Authentication

### API Key Authentication

Used by agents for server communication. Include the API key in the `X-API-Key` header:

```http
X-API-Key: mft_ak_xxxxxxxxxxxxxxxxxxxx
```

### JWT Bearer Authentication

Used by admins and customers. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Base URLs

| Environment | URL |
|-------------|-----|
| Production | https://api.mftplus.co.za (Coming Soon) |

## Response Format

All API responses follow a consistent format.

**Success Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Endpoints

### Health

**GET /api/health**

Check the API server health status.

- **Authentication:** None required

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-04-25T13:00:00Z",
  "uptime": 3600
}
```

### Agents

**POST /api/agents/register**

Register a new agent with the MFTPlus server.

- **Authentication:** Customer JWT token OR `customerIdentifier` in request body

**Request Body:**

```json
{
  "name": "production-server-1",
  "hostname": "server1.example.com",
  "os": "linux",
  "version": "0.1.0"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "agent": {
      "id": "uuid",
      "name": "production-server-1",
      "hostname": "server1.example.com",
      "os": "linux",
      "status": "online",
      "createdAt": "2026-04-25T13:00:00Z"
    },
    "apiKey": "mft_ak_xxxxxxxxxxxxxxxxxxxx",
    "mtls": {
      "enabled": true,
      "csrTemplate": "CSR template..."
    }
  }
}
```

**POST /api/agents/heartbeat**

Send a heartbeat from an agent to maintain online status.

- **Authentication:** API Key (X-API-Key header)

**Request Body:**

```json
{
  "status": "online",
  "load": 0.45,
  "memory": 512
}
```

**GET /api/agents**

List all agents.

- **Authentication:** Admin or Customer JWT

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page

**GET /api/agents/{id}**

Get detailed information about a specific agent.

- **Authentication:** Admin or Customer JWT

**GET /api/agents/{id}/transfers**

Get transfers associated with a specific agent.

- **Authentication:** Admin or Customer JWT

**Query Parameters:**
- `page` (integer) - Page number
- `limit` (integer) - Items per page
- `status` (string) - Filter by transfer status

### Transfers

**POST /api/transfers**

Create a new file transfer operation.

- **Authentication:** API Key (X-API-Key header)

**Request Body:**

```json
{
  "sourceUrl": "sftp://ftp.example.com/files/data.csv",
  "destinationPath": "/local/data/files/data.csv",
  "direction": "pull",
  "protocol": "sftp",
  "size": 1048576
}
```

**PATCH /api/transfers/{id}**

Update transfer progress and status.

- **Authentication:** API Key (X-API-Key header)

**Request Body:**

```json
{
  "status": "running",
  "progress": 45,
  "bytesTransferred": 471859,
  "speed": 1048576
}
```

**GET /api/transfers**

List all transfers.

- **Authentication:** Admin or Customer JWT

**Query Parameters:**
- `page` (integer) - Page number
- `limit` (integer) - Items per page
- `status` (string) - Filter by status
- `agentId` (string) - Filter by agent

**GET /api/transfers/{id}**

Get detailed information about a specific transfer.

- **Authentication:** Admin or Customer JWT

### Jobs

**POST /api/jobs**

Create a new scheduled transfer job.

- **Authentication:** Admin JWT

**Request Body:**

```json
{
  "agentId": "uuid",
  "name": "Daily backup",
  "sourcePath": "/remote/backup/",
  "destinationPath": "/local/backups/",
  "schedule": "0 2 * * *",
  "protocol": "sftp",
  "direction": "pull",
  "enabled": true
}
```

**GET /api/jobs**

List all jobs.

- **Authentication:** Admin or Customer JWT

**Query Parameters:**
- `agentId` (string) - Filter by agent
- `enabled` (boolean) - Filter by enabled status

**GET /api/jobs/{id}**

Get detailed information about a specific job.

- **Authentication:** Admin or Customer JWT

**PATCH /api/jobs/{id}**

Update job properties.

- **Authentication:** Admin JWT

**DELETE /api/jobs/{id}**

Delete a job.

- **Authentication:** Admin JWT

**GET /api/jobs/{id}/runs**

Get execution history for a job.

- **Authentication:** Admin JWT

**POST /api/jobs/{id}/runs**

Start a new job run (called by agents).

- **Authentication:** API Key (X-API-Key header)

### Pipelines

**POST /api/pipelines**

Create a new pipeline from YAML definition.

- **Authentication:** Admin or Customer JWT

**Request Body:**

```json
{
  "identifier": "daily-etl-pipeline",
  "name": "Daily ETL Pipeline",
  "description": "Extract, transform, and load daily data",
  "yaml": "source: ...\ndestination: ...",
  "enabled": true
}
```

**GET /api/pipelines**

List all pipelines.

- **Authentication:** Admin or Customer JWT

**Query Parameters:**
- `page` (integer) - Page number
- `limit` (integer) - Items per page
- `enabled` (boolean) - Filter by enabled status
- `search` (string) - Search in identifier, name, description

**GET /api/pipelines/schema**

Get the JSON schema for pipeline validation.

- **Authentication:** Admin or Customer JWT

**POST /api/pipelines/dry-run**

Validate a pipeline YAML without saving it.

- **Authentication:** Admin or Customer JWT

**GET /api/pipelines/{id}**

Get detailed information about a specific pipeline.

- **Authentication:** Admin or Customer JWT

**GET /api/pipelines/{id}/yaml**

Export a pipeline as YAML file.

- **Authentication:** Admin or Customer JWT

**PUT /api/pipelines/{id}/yaml**

Update a pipeline from new YAML definition (creates a new version).

- **Authentication:** Admin or Customer JWT

**PATCH /api/pipelines/{id}**

Update pipeline metadata (not YAML).

- **Authentication:** Admin or Customer JWT

**DELETE /api/pipelines/{id}**

Delete a pipeline.

- **Authentication:** Admin or Customer JWT

**GET /api/pipelines/{id}/runs**

Get pipeline execution history.

- **Authentication:** Admin JWT

**POST /api/pipelines/{id}/runs**

Start a pipeline execution run.

- **Authentication:** Admin JWT

**GET /api/pipelines/{id}/versions**

Get pipeline version history.

- **Authentication:** Admin JWT

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Public endpoints** (agent registration): 10 requests per minute
- **Authenticated endpoints**: 60 requests per minute
- **Agent endpoints** (heartbeat, transfers): 300 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1714029600
```

## cURL Examples

Register an agent:

```bash
curl -X POST https://api.mftplus.co.za/api/agents/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer-token>" \
  -d '{
    "name": "prod-server-1",
    "hostname": "server1.example.com",
    "os": "linux"
  }'
```

Send heartbeat:

```bash
curl -X POST https://api.mftplus.co.za/api/agents/heartbeat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: mft_ak_xxxxxxxxxxxxxxxxxxxx" \
  -d '{"status": "online"}'
```

List agents:

```bash
curl https://api.mftplus.co.za/api/agents \
  -H "Authorization: Bearer <admin-token>"
```
