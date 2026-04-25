# Screenshots Needed for MFTPlus Documentation

This document specifies the screenshots required for the MFTPlus documentation site.

## Technical Specifications

- **Format**: PNG (lossless)
- **Recommended dimensions**: 1200-1600px width, height as needed
- **UI Scale**: 100% (no Retina/HiDPI scaling artifacts)
- **Theme**: Light mode default (dark mode if supported)
- **Privacy**: Blur/redact any sensitive info (credentials, internal URLs, personal data)
- **Filenames**: Use kebab-case, descriptive names

## Screenshots by Page

### Quick Start Guide (`/guide/quick-start.md`)

| # | Filename | Description | Section |
|---|----------|-------------|---------|
| 1 | `server-url-config.png` | First launch prompt asking for dashboard server URL | Step 1 |
| 2 | `agent-registration.png` | Agent registration form/interface | Step 2 |
| 3 | `dashboard-agents-list.png` | Dashboard showing registered agents | Step 2 |
| 4 | `dashboard-jobs-list.png` | Dashboard Jobs page before creating first job | Step 3 |
| 5 | `create-job-form.png` | Create Job form filled with example configuration | Step 3 |
| 6 | `job-history.png` | Job History/Execution view showing transfer results | Step 4 |

### Installation Guide (`/guide/installation.md`)

| # | Filename | Description | Section |
|---|---|---|---|
| 7 | `desktop-app-welcome.png` | Desktop app first-launch/welcome screen | Desktop Agent Installers |
| 8 | `config-init-cli.png` | CLI showing `mftctl config init` command output | Quick Install |

## Screenshot Content Guidelines

### server-url-config.png
- Show the prompt that appears on first launch
- Include placeholder example: `http://localhost:8080`
- Full window capture

### agent-registration.png
- Registration form with example credentials (use placeholders)
- Show any success/confirmation UI

### dashboard-agents-list.png
- Show at least one registered agent
- Display agent ID, status, last seen columns
- Crop to show the agents table clearly

### dashboard-jobs-list.png
- Show empty or populated jobs list
- Include "Create Job" button visible
- Show page header/title

### create-job-form.png
- Show the form filled with quickstart example:
  - Name: `my-first-transfer`
  - Schedule: `0 2 * * *`
  - Protocol: SFTP dropdown selected
  - Source and destination fields filled
- Show "Save" or "Create" button

### job-history.png
- Show executed job with status (Success if possible)
- Display timestamps and file counts
- Show the detail view or list with execution info

### desktop-app-welcome.png
- Windows or macOS desktop app first launch
- Show welcome screen or initial configuration prompt
- Full window capture

### config-init-cli.png
- Terminal showing `mftctl config init` command
- Show the interactive prompts and responses
- Use a clean terminal background

## Privacy Guidelines

- **Redact**: Real passwords, API keys, internal hostnames, personal email addresses
- **Use placeholders**: `user@example.com`, `your-server.com`, `********`
- **Clean test data**: Use example filenames like `backup-2024-04-25.log`
- **Test environment**: Prefer demo/staging URLs over production

## Delivery

Place screenshots in: `docs/public/images/`

After adding screenshots, update the corresponding markdown files to include:
```markdown
![Description](/images/filename.png)
```
