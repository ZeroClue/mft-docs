# User Roles & Permissions

MFTPlus uses Role-Based Access Control (RBAC) to manage what users can see and do within the dashboard. Each role grants a specific set of permissions scoped to your team.

## Available Roles

| Role | Intended For |
|------|-------------|
| **OWNER** | Billing administrator, account owner |
| **ADMIN** | Team managers, power users |
| **MEMBER** | Regular team members performing transfers |
| **VIEWER** | Read-only access for auditors or stakeholders |

## Permission Matrix

| Feature | OWNER | ADMIN | MEMBER | VIEWER |
|---------|-------|-------|--------|--------|
| View dashboard | ✅ | ✅ | ✅ | ✅ |
| View transfers | ✅ | ✅ | ✅ | ✅ |
| Send files | ✅ | ✅ | ✅ | ❌ |
| Receive files | ✅ | ✅ | ✅ | ❌ |
| Create transfer jobs | ✅ | ✅ | ✅ | ❌ |
| Manage plugins | ✅ | ✅ | ✅ | ❌ |
| Invite users | ✅ | ✅ | ❌ | ❌ |
| Manage roles | ✅ | ✅ | ❌ | ❌ |
| Remove users | ✅ | ✅ | ❌ | ❌ |
| View billing | ✅ | ✅ | ❌ | ❌ |
| Manage billing | ✅ | ❌ | ❌ | ❌ |
| Delete team | ✅ | ❌ | ❌ | ❌ |

## Role Descriptions

### OWNER

The OWNER role has full access to all features, including billing management and team deletion. Every team starts with one OWNER — the user who created the team. There can be multiple OWNERs.

- Can manage billing plans, invoices, and payment methods
- Can delete the team (irreversible)
- Can transfer OWNER to another user
- Full ADMIN capabilities

### ADMIN

ADMINs manage day-to-day team operations. They can invite users, change roles (except granting OWNER), and manage team settings.

- Can invite new users and assign roles
- Can promote MEMBERs to ADMIN
- Can remove users from the team
- Can manage plugins and integrations

### MEMBER

MEMBERs can send and receive files, create transfer jobs, view team activity, and manage plugins. They cannot manage users or change settings.

- Can send and receive files
- Can create and manage their own transfer jobs
- Can view transfer history and logs

### VIEWER

VIEWERs have read-only access to the dashboard. They can monitor transfer activity but cannot initiate any operations.

- Can view the dashboard and transfer list
- Can export transfer logs
- Cannot send, receive, or modify anything

## How Roles Are Assigned

Roles are assigned at invitation time by an ADMIN or OWNER. Existing user roles can be changed at any time from the **Team Management** page.

See [Team Management](./team-management) for step-by-step instructions.

## Best Practices

- **Principle of least privilege**: Grant the minimum role needed for each user's responsibilities
- **Limit OWNERs**: Keep the number of OWNERs to 2-3 trusted individuals
- **Use VIEWER for auditors**: Give read-only access to compliance and audit personnel
- **Review regularly**: Periodically audit your team's roles to ensure they remain appropriate

## Next Steps

- [Team Management](./team-management) — Manage your team's roles
- [Inviting Users](./inviting-users) — Invite new users to your team
