# Billing Access Control

Billing and subscription management in MFTPlus is restricted to users with the **OWNER** role. This restriction ensures that billing changes, which carry financial implications, are controlled by authorized individuals.

## Why Billing Requires OWNER Role

- **Financial security**: Prevents unauthorized plan changes or payment method updates
- **Accountability**: Ensures billing actions are traceable to specific account owners
- **Compliance**: Meets audit requirements for financial access control

## Billing Operations Requiring OWNER

| Operation | Required Role |
|-----------|--------------|
| View billing page | OWNER or ADMIN |
| View invoices | OWNER or ADMIN |
| Update payment method | **OWNER only** |
| Change subscription plan | **OWNER only** |
| Download invoices | OWNER or ADMIN |
| View usage metrics | OWNER or ADMIN |

## Managing Billing

1. Log in to the [MFTPlus Dashboard](https://dashboard.mftplus.co.za)
2. Navigate to **Settings > Billing**
3. View your current plan, usage, and invoices

If you do not see the Billing section, you do not have the required role.

## What to Do If You Need Billing Access

If you need to manage billing but do not have the OWNER role:

1. **Contact an existing OWNER** on your team and ask them to:
   - Make the change themselves, or
   - Promote you to OWNER so you can manage billing
2. **If no OWNER is available**, contact MFTPlus support at support@mftplus.co.za with proof of account ownership

## Security Best Practices

- **Limit billing access** to as few people as possible (typically 1-2 trusted individuals)
- **Audit billing activity**: OWNERs can review billing change history in the audit log
- **Use separate billing email**: Consider using a dedicated email alias (e.g., billing@yourcompany.com) for the OWNER account
- **Monitor OWNER accounts**: Ensure OWNER accounts have strong passwords and MFA enabled

## Next Steps

- [User Roles & Permissions](./user-roles) — Full list of role capabilities
- [Team Management](./team-management) — Manage roles within your team
