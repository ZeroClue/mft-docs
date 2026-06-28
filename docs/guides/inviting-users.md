# Inviting Users

Invite users to your MFTPlus team so they can send and receive files. Only ADMINs and OWNERs can send invitations.

## Prerequisites

- You must have **ADMIN** or **OWNER** role
- The invitee must have a valid email address
- Your team must have available seats (if on a plan with user limits)

## Sending an Invitation

1. Log in to the [MFTPlus Dashboard](https://dashboard.mftplus.co.za)
2. Navigate to **Settings > Team**
3. Click **Invite User**
4. Enter the user's email address
5. Select a role (see [User Roles](./user-roles) for guidance)
6. Click **Send Invitation**

The user will receive an email with an invitation link.

## Accepting an Invitation

1. Open the invitation email from `noreply@mftplus.co.za`
2. Click **Accept Invitation**
3. If you do not have an MFTPlus account, you will be prompted to create one
4. If you already have an account, you will be added to the team automatically

Invitation links expire after 72 hours.

## Resending an Invitation

If a user did not receive their invitation:

1. Go to **Settings > Team**
2. Find the pending invitation in the **Pending Invitations** section
3. Click **Resend**

## Cancelling an Invitation

1. Go to **Settings > Team**
2. Find the pending invitation
3. Click **Revoke**

## Inviting Users via API

```bash
curl -X POST https://dashboard.mftplus.co.za/api/team/invitations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "colleague@example.com",
    "role": "MEMBER"
  }'
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Invitation email not received | Check spam folder. Ask the sender to resend. Ensure `noreply@mftplus.co.za` is allowlisted. |
| "No available seats" error | Contact an OWNER to upgrade your plan or remove inactive users. |
| Invitation link expired | Ask the sender to resend the invitation. |
| User already belongs to another team | Users can belong to multiple MFTPlus teams. They should accept using their existing account. |
| "User already invited" message | Check Pending Invitations. Revoke the old invitation and send a new one if needed. |

## Next Steps

- [User Roles & Permissions](./user-roles) — Choose the right role for each user
- [Team Management](./team-management) — Manage your team after inviting users
