# Security Setup - HeySalad AI

This document outlines the security measures implemented to protect sensitive information in the HeySalad AI repository.

## Overview

We've implemented a comprehensive security system to prevent accidental exposure of API keys, credentials, and other sensitive data.

## Security Components

### 1. Automated Security Scanner

**Location**: `scripts/check-secrets.js`

A Node.js script that scans the entire codebase for:
- API keys (OpenAI, Anthropic, Google, HuggingFace, AWS, Stripe, GitHub, Slack)
- Authentication tokens (Bearer, JWT)
- Database connection strings (PostgreSQL, MongoDB, MySQL)
- Private keys (RSA, SSH)
- Passwords and credentials
- Email addresses (in code, not documentation)
- Private IP addresses

**Severity Levels**:
- **CRITICAL**: Private keys, live Stripe keys
- **HIGH**: API keys, tokens, passwords, database URLs
- **MEDIUM**: Private IPs, test Stripe keys
- **LOW**: Email addresses

**Usage**:
```bash
# Run manually
npm run check-secrets

# Or directly
node scripts/check-secrets.js
```

### 2. Pre-commit Hook

**Location**: `.husky/pre-commit`

Automatically runs the security scanner before every commit. If sensitive data is detected, the commit is blocked.

**Setup**:
```bash
# Install Husky (already in package.json)
npm install

# Husky will automatically set up the pre-commit hook
```

**Bypass** (not recommended):
```bash
git commit --no-verify
```

### 3. GitHub Actions Workflow

**Location**: `.github/workflows/security-check.yml`

Runs on every push and pull request to ensure no sensitive data reaches the repository.

**Features**:
- Automatic scanning on push/PR
- Fails the build if issues found
- Provides detailed reports in Actions tab

### 4. Enhanced .gitignore

**Location**: `.gitignore`

Comprehensive patterns to prevent committing:
- Environment files (`.env`, `.env.local`, `.env.*`)
- API keys and secrets directories
- Private keys and certificates
- Database files
- Credentials and service account files

## Environment Variables

### Setup Instructions

1. **Create local .env files** (already in .gitignore):

```bash
# For web dashboard
cp packages/web/.env.example packages/web/.env

# For harmony web
cp packages/heysalad-harmony-web/.env.example packages/heysalad-harmony-web/.env
```

2. **Add your API keys**:

```bash
# packages/web/.env
VITE_OPENAI_API_KEY=sk-proj-your_actual_key_here
VITE_ANTHROPIC_API_KEY=sk-ant-your_actual_key_here
VITE_GEMINI_API_KEY=your_actual_gemini_key_here
VITE_HUGGINGFACE_API_KEY=hf_your_actual_key_here
```

3. **For test scripts**, create root `.env`:

```bash
# .env (in project root)
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

### Environment Variable Naming

All environment variables use the `VITE_` prefix for Vite projects:
- `VITE_OPENAI_API_KEY`
- `VITE_ANTHROPIC_API_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_HUGGINGFACE_API_KEY`
- `VITE_FIREBASE_API_KEY`

Test scripts use unprefixed names:
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`

## Test Scripts Security

All test scripts in `scripts/` directory now use environment variables:

**Before** (INSECURE):
```javascript
const API_KEY = 'your_actual_api_key_hardcoded_here';
```

**After** (SECURE):
```javascript
const API_KEY = process.env.GEMINI_API_KEY || 'your_api_key_here';
```

**Running tests**:
```bash
# Option 1: Export environment variable
export GEMINI_API_KEY="your_key_here"
node scripts/test-gemini-api.js

# Option 2: Use dotenv-cli
npm install -g dotenv-cli
dotenv node scripts/test-gemini-api.js

# Option 3: Inline (not recommended)
GEMINI_API_KEY="your_key" node scripts/test-gemini-api.js
```

## Security Best Practices

### DO:
✅ Use environment variables for all secrets
✅ Add `.env` files to `.gitignore`
✅ Use `.env.example` files with placeholder values
✅ Run `npm run check-secrets` before pushing
✅ Rotate keys immediately if accidentally exposed
✅ Use different keys for dev/staging/production
✅ Keep test data separate from production credentials

### DON'T:
❌ Commit `.env` files
❌ Hardcode API keys in source code
❌ Share API keys in chat/email
❌ Use production keys in development
❌ Bypass pre-commit hooks without good reason
❌ Commit real credentials in test files

## What We Fixed

### Removed Files
- `packages/web/.env` (contained real API keys)
- `packages/web/.env.local` (contained real API keys)
- `packages/heysalad-harmony-web/.env` (contained real API keys)
- `packages/heysalad-harmony-web/.env.local` (contained real API keys)

### Updated Files
- `scripts/test-gemini-api.js` - Now uses `process.env.GEMINI_API_KEY`
- `scripts/test-gemini-flash.js` - Now uses `process.env.GEMINI_API_KEY`
- `scripts/test-gemini-coding.js` - Now uses `process.env.GEMINI_API_KEY`
- `scripts/test-gemini-audio.js` - Now uses `process.env.GEMINI_API_KEY`
- `packages/web/src/pages/APIKeys.tsx` - Changed mock Stripe key to HeySalad format
- `SECURITY.md` - Updated example connection strings
- `packages/web/AUTH_SETUP.md` - Updated Bearer token example

### Created Files
- `packages/web/.env.example` - Template with placeholder values
- `packages/heysalad-harmony-web/.env.example` - Template with placeholder values
- `scripts/README.md` - Documentation for test scripts
- `docs/SECURITY_SETUP.md` - This file

## Incident Response

If you accidentally commit sensitive data:

1. **Immediately rotate the exposed credentials**
   - Generate new API keys
   - Update your local `.env` files
   - Update production environment variables

2. **Remove from Git history**:
```bash
# Use BFG Repo-Cleaner or git-filter-repo
git filter-repo --path packages/web/.env --invert-paths
```

3. **Force push** (coordinate with team):
```bash
git push --force
```

4. **Notify the team** and security contacts

## Cloudflare Secrets

For Cloudflare Workers/Pages, use Wrangler secrets:

```bash
# Set secrets (not in code)
npx wrangler secret put JWT_SECRET
npx wrangler secret put OPENAI_API_KEY

# List secrets
npx wrangler secret list
```

## Monitoring

### Regular Checks
- Run `npm run check-secrets` weekly
- Review GitHub Actions security scan results
- Audit environment variables quarterly
- Rotate API keys every 90 days

### Alerts
- GitHub Actions will fail if secrets detected
- Pre-commit hook blocks commits with secrets
- Security scanner provides detailed reports

## Support

If you have questions about security:
- Email: security@heysalad.app
- Review: `SECURITY.md` for vulnerability reporting
- Check: `AGENTS.md` for development guidelines

## Compliance

This security setup helps ensure:
- No credentials in version control
- Automated detection of sensitive data
- Separation of dev/prod environments
- Audit trail of security scans
- Quick incident response

---

**Last Updated**: February 20, 2026
**Status**: ✅ All critical and high-severity issues resolved
**Next Review**: May 20, 2026
