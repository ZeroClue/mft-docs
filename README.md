# MFTPlus Documentation

[![Deployed with Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black.svg)](https://vercel.com/new?utm_source=github&utm_medium=repository)

Official documentation for **MFTPlus** — Managed File Transfer, reimagined for modern teams.

**Status**: ✅ Live and operational

## Quick Setup

1. **Create Vercel token**: Visit [vercel.com/account/tokens](https://vercel.com/account/tokens) and create a classic token
2. **Add to GitHub secrets**: Run `gh secret set VERCEL_TOKEN --body "<your-token>"` in this repo
3. **Push changes**: Deployments will start automatically

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## Live Site

🔗 **Production**: https://docs.mftplus.co.za ✅
🔗 **Repository**: https://github.com/ZeroClue/mft-docs

## Deployment

This site is deployed to Vercel (project: `mft-docs`)

**GitHub Actions CI/CD**:
- **Production**: Deployed on push to `main` branch
- **Preview**: Deployed on pull requests with auto-comment

## Documentation Structure

```
docs/
├── .vitepress/
│   └── config.ts     # VitePress configuration
├── guide/            # User guide
├── api/              # API reference
├── plugins/          # Plugin documentation
└── index.md          # Homepage
```

## About MFTPlus

MFTPlus is the first file transfer tool built for DevOps workflows—lightweight, secure, and audit-ready without the enterprise baggage.

- **Desktop Agent**: Standalone ~5MB agent, no central server required
- **Multi-Protocol**: SFTP, FTP, FTPS, and local file transfers
- **Scheduled Jobs**: Cron-based scheduling with reliable execution
- **Security**: AES-256-GCM encryption with OS keychain integration
- **Audit Trail**: Built-in SQLite logging for compliance requirements

## Contributing

1. Edit documentation in `docs/` directory
2. Run `npm run docs:dev` to preview changes
3. Create a pull request for review
4. Preview deployment will be created automatically

## Links

- **Website**: [https://MFTPlus.co.za](https://MFTPlus.co.za)

## License

Copyright © 2026 MFTPlus. All rights reserved.
