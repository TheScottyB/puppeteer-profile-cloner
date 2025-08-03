# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability in puppeteer-profile-cloner, please report it to us as described below.

### Reporting Process

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to security@[your-domain].com with the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide a detailed response within 7 days indicating next steps
- We will notify you when the vulnerability is fixed

## Security Best Practices

### Package Management
- Use PNPM for secure package management
- Regularly audit dependencies with `pnpm audit`
- Keep dependencies up to date with `pnpm update`
- Use exact version pinning for critical dependencies
- Verify package integrity using PNPM's built-in verification

### Development Practices
- Never commit secrets, API keys, or sensitive data to the repository
- Use environment variables for configuration
- Implement proper input validation and sanitization
- Follow the principle of least privilege
- Regular security testing and code reviews

### Browser Automation Security
- Run Puppeteer in sandboxed environments when possible
- Be cautious with `--no-sandbox` flag usage
- Validate and sanitize all user inputs that affect browser behavior
- Use headless mode by default for production environments
- Implement proper timeout and resource limits

### Data Protection
- Never store sensitive user data in browser profiles
- Implement secure profile cleanup procedures
- Use encryption for any persistent data storage
- Follow GDPR and other applicable data protection regulations

## Dependencies Security

This project uses PNPM for package management, which provides:
- Strict dependency resolution
- Built-in package verification
- Reduced attack surface through content-addressable storage
- Automatic deduplication reducing duplicate vulnerable packages

Regular security auditing should be performed using:
```bash
pnpm audit
pnpm audit --fix
```

## License

This security policy is provided under the same license as the project.
