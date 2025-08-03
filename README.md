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

```bash
# Clone the repository
git clone https://github.com/TheScottyB/puppeteer-profile-cloner.git
cd puppeteer-profile-cloner

# Install dependencies using PNPM
pnpm install
```

## Usage

```bash
# Build the project
pnpm build

# Run the profile cloner
pnpm start
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
