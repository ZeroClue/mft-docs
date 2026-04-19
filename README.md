# MFTPlus Documentation

Official documentation for **MFTPlus** — Managed File Transfer, reimagined for modern teams.

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

🔗 **Production**: https://docs.mftplus.co.za
🔗 **Repository**: https://github.com/ZeroClue/mft-docs

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
2. Run `npm run docs:dev` to preview changes locally
3. Create a pull request for review

## Links

- **Website**: [https://MFTPlus.co.za](https://MFTPlus.co.za)

## License

Copyright © 2026 MFTPlus. All rights reserved.
