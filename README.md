# MFT Documentation Site

[![Deployed with Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black.svg)](https://vercel.com/new?utm_source=github&utm_medium=repository)

Official documentation for MFT (Modern File Transfer).

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

🔗 **Production**: https://mft-docs.vercel.app ✅
🔗 **Repository**: https://github.com/ZeroClue/mft-docs

## Deployment

This site is deployed to Vercel (project: `zeroclues-projects/mft-docs`)

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

## Contributing

1. Edit documentation in `docs/` directory
2. Run `npm run docs:dev` to preview changes
3. Create a pull request for review
4. Preview deployment will be created automatically

## License

MIT
