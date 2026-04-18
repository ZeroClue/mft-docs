# MFT Documentation Site

Official documentation for MFT (Modern File Transfer).

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

## Deployment

This site is automatically deployed to Vercel:

- **Production**: Deployed on push to `main` branch
- **Preview**: Deployed on pull requests

### Required Secrets

Configure these in your repository settings:

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

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
