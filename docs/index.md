---
layout: home

hero:
  name: "MFTPlus"
  text: "Stop Managing File Transfers. Start Automating Them."
  tagline: "The modern managed file transfer platform that DevOps teams actually want to use."
  actions:
    - theme: brand
      text: Start Free Forever
      link: /pricing
    - theme: alt
      text: See How It Works
      link: /guide/introduction
  image:
    src: /hero-terminal.png
    alt: MFTPlus dashboard and CLI workflow

features:
  - title: "Your Files. Scheduled. Delivered."
    details: "Set up recurring transfers in minutes, not days. Cron-like scheduling that just works—with automatic retry, failure alerts, and delivery confirmation."
  - title: "Every Transfer, Accounted For"
    details: "Complete audit trails for SOC2, HIPAA, and GDPR. Know exactly who moved what, when, and where—down to the individual file."
  - title: "Security Without Compromise"
    details: "AES-256 encryption everywhere. mTLS for agent communication. Role-based access control. SSO integration. Built for security teams, approved by compliance."
  - title: "Connect Anything"
    details: "SFTP, FTP, FTPS, S3, Azure Blob, Google Cloud Storage. One unified interface for all your file transfer needs—no more protocol spaghetti."
  - title: "From One to Millions"
    details: "Start small, scale without friction. Handle 10 transfers or 10 million with the same platform. Horizontal scaling built in from day one."
  - title: "Deploy Anywhere"
    details: "Run agents in your cloud, on-premises, or at the edge. All managed centrally through a single web dashboard. CLI-first, API-complete."
---

## The Problem with File Transfers Today

Your team handles file transfers every day. Customer data exports. Partner SFTP dropzones. Compliance archives. Cloud migrations.

And you're doing it with **fragile cron jobs**, **hand-rolled scripts**, or **legacy MFT platforms** built before cloud-native was a thing.

The result:
- **Transfers fail silently**—until someone notices
- **No visibility**—who moved what file, when, to where?
- **Security nightmares**—credentials in scripts, no audit trails
- **Scaling pain**—what worked for 100 files breaks at 100,000
- **Compliance anxiety**—can you prove every file movement for auditors?

## There's a Better Way

**MFTPlus** gives you enterprise-grade managed file transfers with the developer experience of a modern CLI tool.

### What Makes MFTPlus Different

**Born in the cloud, not retrofitted**
- Cloud-native architecture from day one
- Deploy via Docker in under 5 minutes
- Terraform provider included—infrastructure as code
- Observability built in (structured logs, metrics, tracing)

**DevOps-friendly, not DevOps-hostile**
- CLI-first workflow (`mftctl`) that you'll actually enjoy using
- Full API coverage—automate everything
- Web dashboard for when you need visual oversight
- No GUI lock-in—script everything

**Compliance-ready, not compliance-later**
- Complete audit trails by default
- SOC2-compatible logging and reporting
- Encryption at rest and in transit
- Role-based access control and SSO

## Quick Start

```bash
# Install in 30 seconds
curl -fsSL https://docs.mftplus.co.za/install.sh | sh

# Create your first scheduled transfer
mftctl transfer create \
  --source s3://production-data/exports \
  --dest sftp://partner.example.com/incoming \
  --schedule "0 2 * * *" \
  --on-failure alert@yourcompany.com
```

That's it. Your transfer is scheduled, monitored, and logged.

## Real Problems, Solved

### "We need to send daily exports to 50 customers via SFTP"

**Before:** 50 different cron jobs, 50 sets of SSH keys, no central monitoring, failures go unnoticed until customers complain.

**With MFTPlus:** One dashboard, all transfers visible. Automatic retry on failure. Alert on completion. Add new customers in seconds, not hours.

### "Auditors want to see every file movement for the past 3 years"

**Before:** Frantically grep through logs across 20 servers. Hope nothing was deleted. Cross your fingers.

**With MFTPlus:** Run one export command. Get a complete, audit-ready report. Every file, every transfer, every timestamp.

### "Our legacy MFT platform is a pain to use and costs a fortune"

**Before:** Wait weeks for vendor support. GUI-heavy workflows you can't automate. Five-figure annual contracts.

**With MFTPlus:** Start free today. Scale as you grow. Get up and running in an afternoon. Plans from $0 to custom enterprise.

## Pricing That Makes Sense

| Tier | Price | Best For |
|------|-------|----------|
| **Community** | Free forever | Individual developers, small projects |
| **Starter** | $150/month | Teams automating recurring transfers |
| **Pro** | $499/month | Companies with compliance requirements |
| **Enterprise** | Custom | Large-scale deployments with SLA needs |

[See Full Comparison →](/pricing)

## What Our Users Say

> "We replaced 47 cron scripts with MFTPlus in one weekend. Our on-call rotations have been blissfully quiet ever since."
> — DevOps Lead, FinTech Startup

> "SOC2 auditors actually complimented our file transfer audit trails. That's never happened before."
> — CTO, Healthcare SaaS

> "The CLI is exactly what I wanted from [legacy MFT vendor] but never got. It's like they designed it for people who use terminals."
> — Senior Engineer, E-commerce Platform

## Ready to Stop Worrying About File Transfers?

**Start free in under 5 minutes.** No credit card required. Scale when you need to.

[:star: Start Free Forever](/pricing) | [:book: Read the Docs](/guide/introduction) | [:email: Talk to Sales](mailto:sales@mftplus.co.za)
