---
layout: home

hero:
  name: "MFTPlus"
  text: "Managed File Transfer for DevOps Teams"
  tagline: "Scheduled transfers, audit trails, and enterprise security. The modern MFT platform built for cloud-native infrastructure."
  actions:
    - theme: brand
      text: Try Free
      link: /pricing
    - theme: alt
      text: View Docs
      link: /guide/introduction
    - theme: alt
      text: See Pricing
      link: /pricing
  image:
    src: /hero-terminal.png
    alt: MFTPlus dashboard and CLI workflow

features:
  - title: Scheduled Transfers
    details: Automate recurring file transfers with cron-like scheduling. Reliable delivery with automatic retry and exponential backoff.
  - title: Audit Trails
    details: Complete visibility into every transfer. Track who moved what, when, and where. SOC2-compatible logging and compliance reports.
  - title: Enterprise Security
    details: AES-256 encryption at rest and in transit. mTLS for secure agent communication. Role-based access control and SSO integration.
  - title: Multi-Protocol Support
    details: Connect to SFTP, FTP, S3, Azure Blob, and GCS from a unified interface. Single pane of glass for all your file transfer needs.
  - title: Central Dashboard
    details: Monitor all transfers, agents, and schedules from one web interface. Real-time status, error alerts, and performance metrics.
  - title: Multi-Agent Architecture
    details: Deploy agents anywhere—in your cloud, on-premises, or at edge locations. All managed centrally through the MFTPlus server.
---

## Why MFTPlus?

Legacy MFT solutions are complex, expensive, and built for a pre-cloud era. Custom scripts are fragile and hard to maintain. MFTPlus gives you the reliability of enterprise MFT with the developer experience of a modern CLI tool.

**Built for DevOps teams:**
- CLI-first workflow with full API coverage
- Infrastructure as Code (Terraform provider included)
- Observable operations with structured logs
- Self-hosted or managed deployment options

**Built for compliance:**
- Complete audit trails for SOC2, HIPAA, GDPR
- Encryption at rest and in transit
- Role-based access control
- Retention policies and data classification

**Built to scale:**
- Handle 10 transfers or 10 million
- Horizontal scaling with agent pools
- Automatic retry with circuit breakers
- Priority queues and bandwidth throttling

## Quick Start

Install the agent in seconds:

```bash
# Download the agent
curl -fsSL https://docs.mftplus.co.za/install.sh | sh

# Configure your first transfer
mftctl transfer create --source s3://my-bucket/files \
                       --dest sftp://partners.example.com/incoming \
                       --schedule "0 2 * * *"
```

## Use Cases

**Customer Data Exports**
Automate nightly exports from your database to customer SFTP dropzones. Retry on failure, alert on completion.

**Partner Integrations**
Connect with external partners via SFTP/FTP. Schedule recurring transfers without managing SSH keys or credentials.

**Compliance Archiving**
Move files to cold storage with immutable logs. Track every file movement for audit requirements.

**Cloud Migration**
Batch transfer millions of files from on-prem to cloud storage. Resume from interruption, verify checksums.

---

[Get Started Free](/pricing) | [Read the Documentation](https://docs.mftplus.co.za) | [Contact Sales](mailto:sales@mftplus.co.za)
