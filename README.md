# Puppeteer Profile Cloner

A tool for cloning and managing browser profiles using Puppeteer, designed for automation testing and development workflows.

## Features

- Clone existing browser profiles for consistent testing environments
- Create isolated browser profiles for different testing scenarios
- Manage profile configurations and settings
- Cross-platform support (macOS, Windows, Linux)
- Secure profile handling with built-in cleanup procedures

## Prerequisites

- Node.js (version 16 or higher)
- PNPM (recommended package manager)

## Installation

### Global Installation

```bash
# Install globally using PNPM
pnpm install -g puppeteer-profile-cloner
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/TheScottyB/puppeteer-profile-cloner.git
cd puppeteer-profile-cloner

# Install dependencies using PNPM
pnpm install
```

## Usage

### Programmatic API

You can use the library programmatically in your Node.js applications:

```ts
import { cloneProfile, launchBrowser, cleanupProfile } from 'puppeteer-profile-cloner';

// Clone a profile
const profilePath = await cloneProfile('./my-test-profile');

// Launch browser with the cloned profile
const browser = await launchBrowser(profilePath);

// Use the browser for your automation tasks
const page = await browser.newPage();
await page.goto('https://example.com');

// Clean up when done
await browser.close();
await cleanupProfile(profilePath);
```

#### Build and Test

```bash
# Build the project
pnpm build

# Use the programmatic API
node dist/example.js
```

### CLI Interface

After building the project, you can use the CLI:

```bash
# Install globally for system-wide access
npm install -g .

# Or use directly from the built dist folder
./dist/cli.js --help
```

#### CLI Commands

**Clone a profile:**
```bash
# Clone to default location (~/AutomationProfile)
profile-cloner clone

# Clone to custom directory
profile-cloner clone ./my-test-profile

# Clone with verbose output
profile-cloner clone --verbose /tmp/test-profile
```

**Launch browser with cloned profile:**
```bash
# Clone and launch browser (default location)
profile-cloner launch

# Clone to custom directory and launch
profile-cloner launch ./my-profile

# Launch in headless mode
profile-cloner launch --headless

# Launch without extensions
profile-cloner launch --no-extensions
```

**Clean up profiles:**
```bash
# Clean default profile (requires --force)
profile-cloner clean --force

# Clean custom profile
profile-cloner clean ./my-profile --force

# Clean with verbose output
profile-cloner clean --verbose --force /tmp/test-profile
```

**Get help:**
```bash
# General help
profile-cloner --help

# Command-specific help
profile-cloner clone --help
profile-cloner launch --help
profile-cloner clean --help
```

## Development

```bash
# Install development dependencies
pnpm install

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Security audit
pnpm audit
```

## Project Structure

```
puppeteer-profile-cloner/
├── src/                 # Source code
├── dist/               # Built output (ignored in git)
├── AutomationProfile/ # Generated profiles (ignored in git)
├── tests/             # Test files
├── docs/              # Documentation
├── .gitignore         # Git ignore rules
├── SECURITY.md        # Security policy
├── package.json       # Project configuration
└── README.md          # This file
```

## Configuration

The tool can be configured through environment variables or a configuration file:

- `PROFILE_PATH`: Directory to store cloned profiles
- `BROWSER_PATH`: Custom browser executable path (optional)
- `HEADLESS`: Run in headless mode (default: true)

## Security

This project follows security best practices for browser automation:

- Profiles are isolated and sandboxed
- No sensitive data is stored in profiles
- Regular dependency audits using PNPM
- Secure cleanup procedures for temporary profiles

See [SECURITY.md](SECURITY.md) for more details on our security policy.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [documentation](docs/)
2. Search existing [GitHub issues](https://github.com/TheScottyB/puppeteer-profile-cloner/issues)
3. Create a new issue with detailed information about your problem

For security vulnerabilities, please follow the reporting process outlined in [SECURITY.md](SECURITY.md).
