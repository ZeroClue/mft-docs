# RBAC API Reference

REST API endpoints for managing users, roles, and team membership. All RBAC endpoints require authentication with an ADMIN or OWNER API key.

## Authentication

All requests must include a valid API token in the `Authorization` header:

```bash
Authorization: Bearer <your-api-token>
```

## List Team Members

Returns all members of your team.

```http
GET /api/team/members
```

**Response:**

```json
{
  "members": [
    {
      "id": "user_abc123",
      "email": "alice@example.com",
      "name": "Alice",
      "role": "OWNER",
      "joinedAt": "2025-06-01T00:00:00Z",
      "status": "active"
    },
    {
      "id": "user_def456",
      "email": "bob@example.com",
      "name": "Bob",
      "role": "MEMBER",
      "joinedAt": "2025-06-15T00:00:00Z",
      "status": "active"
    }
  ]
}
```

## Get Team Member

Returns details for a specific team member.

```http
GET /api/team/members/{userId}
```

**Response:**

```json
{
  "id": "user_abc123",
  "email": "alice@example.com",
  "name": "Alice",
  "role": "OWNER",
  "joinedAt": "2025-06-01T00:00:00Z",
  "lastActiveAt": "2025-07-01T12:00:00Z",
  "status": "active"
}
```

## Update User Role

Changes a team member's role. Requires ADMIN or OWNER role.

```http
PATCH /api/team/members/{userId}
```

**Request body:**

```json
{
  "role": "ADMIN"
}
```

Valid roles: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`.

**Constraints:**
- Only OWNERs can assign the OWNER role to another user
- At least one OWNER must always remain on the team
- ADMINs can only assign ADMIN, MEMBER, or VIEWER roles

## Invite User

Sends an invitation email to a new team member.

```http
POST /api/team/invitations
```

**Request body:**

```json
{
  "email": "newuser@example.com",
  "role": "MEMBER"
}
```

**Response:**

```json
{
  "invitationId": "inv_xyz789",
  "email": "newuser@example.com",
  "role": "MEMBER",
  "expiresAt": "2025-07-04T00:00:00Z",
  "status": "pending"
}
```

## List Pending Invitations

Returns all invitations that have not yet been accepted.

```http
GET /api/team/invitations
```

**Response:**

```json
{
  "invitations": [
    {
      "id": "inv_xyz789",
      "email": "newuser@example.com",
      "role": "MEMBER",
      "expiresAt": "2025-07-04T00:00:00Z",
      "status": "pending"
    }
  ]
}
```

## Resend Invitation

Resends a pending invitation email.

```http
POST /api/team/invitations/{invitationId}/resend
```

**Response:** `204 No Content`

## Revoke Invitation

Cancels a pending invitation.

```http
DELETE /api/team/invitations/{invitationId}
```

**Response:** `204 No Content`

## Remove Team Member

Removes a user from the team. Requires ADMIN or OWNER role.

```http
DELETE /api/team/members/{userId}
```

**Response:** `204 No Content`

**Constraints:**
- You cannot remove yourself
- The last OWNER cannot be removed

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_ROLE` | The specified role is not valid |
| 400 | `LAST_OWNER` | Cannot remove or demote the last OWNER |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | Insufficient role permissions |
| 404 | `NOT_FOUND` | User or invitation not found |
| 409 | `ALREADY_INVITED` | User has a pending invitation |
| 429 | `RATE_LIMITED` | Too many requests |

## Next Steps

- [User Roles & Permissions](../guides/user-roles) — Role descriptions and permissions
- [Team Management](../guides/team-management) — Managing your team
