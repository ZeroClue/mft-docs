# Team Management

Manage your team's members and their roles from the MFTPlus Dashboard. Only ADMINs and OWNERs can access the team management features.

## Viewing Team Members

1. Log in to the [MFTPlus Dashboard](https://dashboard.mftplus.co.za)
2. Navigate to **Settings > Team** in the sidebar
3. You will see a list of all team members with their name, email, role, and join date

## Changing a User's Role

1. Go to **Settings > Team**
2. Find the user you want to modify
3. Click the role dropdown next to their name
4. Select the new role
5. Confirm the change

**Note**: Only OWNERs can assign the OWNER role. ADMINs can assign ADMIN, MEMBER, and VIEWER roles.

## Removing a User

1. Go to **Settings > Team**
2. Find the user you want to remove
3. Click the **Remove** button (trash icon)
4. Confirm removal

Removing a user revokes their access to the dashboard and transfers immediately. This action cannot be undone.

## Transferring Ownership

To transfer the OWNER role to another user:

1. Go to **Settings > Team**
2. Click **Transfer Ownership** next to the target user
3. Confirm the transfer

The previous OWNER will be demoted to ADMIN.

## Team Management via API

You can also manage team members programmatically. See the [RBAC API Reference](../api/rbac) for endpoint details.

```bash
# List team members
curl -H "Authorization: Bearer <token>" \
  https://dashboard.mftplus.co.za/api/team/members

# Update user role
curl -X PATCH https://dashboard.mftplus.co.za/api/team/members/<user-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot change a user's role | You must have ADMIN or OWNER role. OWNER can only be granted by another OWNER. |
| Cannot remove a user | Only ADMINs and OWNERs can remove users. You cannot remove yourself. |
| Role dropdown is disabled | Your role (MEMBER or VIEWER) does not have permission to manage users. |
| "Last OWNER" error | You cannot remove or demote the last OWNER. Promote another user to OWNER first. |

## Next Steps

- [User Roles & Permissions](./user-roles) — Understand what each role can do
- [Inviting Users](./inviting-users) — Invite new users to your team
