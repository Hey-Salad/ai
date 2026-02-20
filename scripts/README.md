# HeySalad AI - Test Scripts

This directory contains test scripts for various AI providers and functionality.

## Security Notice

All test scripts now use environment variables for API keys. Never commit API keys directly in code.

## Setup

1. Create a `.env` file in the project root (already in .gitignore):

```bash
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_PROJECT=projects/your_project_id

# Add other provider keys as needed
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
HUGGINGFACE_API_KEY=your_huggingface_key_here
```

2. Load environment variables before running scripts:

```bash
# Option 1: Export in your shell
export GEMINI_API_KEY="your_key_here"

# Option 2: Use dotenv (install: npm install -g dotenv-cli)
dotenv node scripts/test-gemini-api.js

# Option 3: Inline (not recommended for security)
GEMINI_API_KEY="your_key" node scripts/test-gemini-api.js
```

## Available Scripts

### Gemini API Tests

- `test-gemini-api.js` - Tests all Gemini 3 models (Pro, Flash, Pro Preview)
- `test-gemini-flash.js` - Focused tests for Gemini 3 Flash (regular & streaming)
- `test-gemini-coding.js` - Code completion and generation tests
- `test-gemini-audio.js` - Audio/multimodal capability tests

### Security

- `check-secrets.js` - Scans codebase for exposed API keys and sensitive data

Run before every commit:
```bash
npm run check-secrets
```

## Running Tests

```bash
# Make scripts executable
chmod +x scripts/*.js

# Run a specific test
node scripts/test-gemini-flash.js

# Run security check
npm run check-secrets
```

## Pre-commit Hook

The repository includes a pre-commit hook that automatically runs the security check. If any sensitive data is detected, the commit will be blocked.

To bypass (not recommended):
```bash
git commit --no-verify
```

## Best Practices

1. Never commit `.env` files
2. Always use `.env.example` for documentation
3. Rotate API keys if accidentally exposed
4. Run `npm run check-secrets` before pushing
5. Use environment variables in all scripts
6. Keep test data separate from production keys

## Troubleshooting

If scripts fail with "API key not found":
1. Check that your `.env` file exists
2. Verify the environment variable name matches
3. Ensure the key is properly exported
4. Try running with explicit environment variable

## Contributing

When adding new test scripts:
1. Use `process.env.VARIABLE_NAME` for all secrets
2. Provide fallback placeholder values
3. Document required environment variables
4. Update this README
5. Test with the security scanner
