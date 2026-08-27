# RBAC API Reference

REST API endpoints for managing users, roles, and team membership in MFTPlus. These endpoints live under `/api/users/*` and are authenticated with the **user's Bearer JWT** — the same token used to authenticate dashboard requests. They do **not** accept API-key headers.

## Authentication

Every request must include the authenticated user's session token in the `Authorization` header:

```bash
Authorization: Bearer <your-user-jwt>
```

> The RBAC endpoints are protected by the user-authentication middleware, not the admin-key or API-key middleware. Use the JWT you receive when logging in to the dashboard (or via `mftctl`).

## List Team Members

Returns all members of your team.

```http
GET /api/users/team
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
GET /api/users/team/{userId}
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
PATCH /api/users/team/{userId}/role
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

Sends an invitation email to a new team member. Invitations are valid for **14 days**.

```http
POST /api/users/invite
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
  "expiresAt": "2025-07-15T00:00:00Z",
  "status": "pending"
}
```

## List Pending Invitations

Returns all invitations that have not yet been accepted.

```http
GET /api/users/invitations
```

**Response:**

```json
{
  "invitations": [
    {
      "id": "inv_xyz789",
      "email": "newuser@example.com",
      "role": "MEMBER",
      "expiresAt": "2025-07-15T00:00:00Z",
      "status": "pending"
    }
  ]
}
```

## Resend Invitation

Resends a pending invitation email.

```http
POST /api/users/invitations/{invitationId}/resend
```

**Response:** `204 No Content`

## Revoke Invitation

Cancels a pending invitation.

```http
DELETE /api/users/invitations/{invitationId}
```

**Response:** `204 No Content`

## Remove Team Member

Removes a user from the team. Requires ADMIN or OWNER role.

```http
DELETE /api/users/team/{userId}
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
