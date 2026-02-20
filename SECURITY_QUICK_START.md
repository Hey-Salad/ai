# Security Quick Start Guide

Quick reference for developers working with HeySalad AI.

## Setup (First Time)

```bash
# 1. Clone and install
git clone https://github.com/Hey-Salad/ai.git
cd ai
npm install

# 2. Create your local .env files
cp packages/web/.env.example packages/web/.env
cp packages/heysalad-harmony-web/.env.example packages/heysalad-harmony-web/.env

# 3. Add your API keys to the .env files
# Edit packages/web/.env and add your real keys
# NEVER commit these files!
```

## Daily Development

```bash
# Security check runs automatically on commit
git add .
git commit -m "your message"
# Pre-commit hook will scan for secrets

# Run manual check anytime
npm run check-secrets

# Before pushing
npm run pre-push
```

## Running Test Scripts

```bash
# Set environment variable
export GEMINI_API_KEY="your_key_here"

# Run test
node scripts/test-gemini-api.js
```

## What's Protected

✅ API keys (OpenAI, Anthropic, Google, HuggingFace, AWS, Stripe)  
✅ Authentication tokens  
✅ Database connection strings  
✅ Private keys  
✅ Passwords

## What's Allowed

✅ `process.env.*` references  
✅ Placeholder values like `your_api_key_here`  
✅ Test/mock/example patterns  
✅ Contact emails in documentation

## If You Accidentally Commit a Secret

1. **Immediately rotate the exposed credential**
2. Run: `npm run check-secrets` to verify
3. Contact: security@heysalad.app

## Files to NEVER Commit

- `.env`
- `.env.local`
- `.env.production`
- Any file with real API keys
- Private keys (`.pem`, `.key`)
- Credentials files

## Files That Are Safe

- `.env.example` (placeholders only)
- Documentation with examples
- Test files with mock data
- Code using `process.env.*`

## Quick Commands

```bash
npm run check-secrets    # Run security scan
npm run pre-push         # Check before push
npm test                 # Run all tests
npm run build            # Build all packages
```

## Need Help?

- Full docs: `docs/SECURITY_SETUP.md`
- Test scripts: `scripts/README.md`
- Guidelines: `AGENTS.md`
- Security: security@heysalad.app

---

**Remember**: When in doubt, run `npm run check-secrets` before committing!
