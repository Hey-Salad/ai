# Deploy CheriML API Now

## The Fix
Your API endpoints were returning HTML because Cloudflare Pages wasn't routing to the Functions. I've fixed this by:

1. ✅ Adding a build script to copy Functions to dist directory
2. ✅ Creating `_routes.json` to configure API routing
3. ✅ Updated package.json build command

## Deploy in 2 Steps

### Step 1: Build and Deploy
```bash
cd packages/web
npm run deploy
```

This will:
- Build the React app
- Copy Functions to dist/functions/
- Deploy to Cloudflare Pages

### Step 2: Test the API
```bash
# Test health endpoint
curl https://heysalad-ai.pages.dev/api/cheriml/health

# Or use the test script
./scripts/test-live-api.sh https://heysalad-ai.pages.dev
```

## What Changed?

### Before (Broken)
```
dist/
├── index.html
├── assets/
└── (no functions directory)
```
Result: `/api/cheriml/health` → Returns HTML (React app)

### After (Fixed)
```
dist/
├── index.html
├── assets/
├── _routes.json          ← Routes /api/* to Functions
└── functions/            ← API endpoints
    └── api/
        └── cheriml/
            ├── health.ts
            ├── generate-function.ts
            ├── generate-component.ts
            ├── generate-test.ts
            └── generate-endpoint.ts
```
Result: `/api/cheriml/health` → Returns JSON ✅

## Expected Response

After deployment, this should work:

```bash
curl https://heysalad-ai.pages.dev/api/cheriml/health
```

```json
{
  "status": "healthy",
  "service": "CheriML API",
  "version": "0.2.0",
  "timestamp": "2026-02-20T...",
  "endpoints": {
    "POST /api/cheriml/generate-function": "Generate functions (T1)",
    "POST /api/cheriml/generate-component": "Generate components (T2)",
    "POST /api/cheriml/generate-test": "Generate tests (T3)",
    "POST /api/cheriml/generate-endpoint": "Generate API endpoints (T4)"
  },
  "configuration": {
    "geminiApiKey": "configured"
  }
}
```

## Test All Endpoints

Use the comprehensive test script:
```bash
./scripts/test-live-api.sh
```

Or test individually:

```bash
# Generate a function
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-function \
  -H "Content-Type: application/json" \
  -d '{"description": "Calculate factorial", "language": "typescript"}'

# Generate a component
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-component \
  -H "Content-Type: application/json" \
  -d '{"description": "Loading spinner", "framework": "react"}'

# Generate tests
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-test \
  -H "Content-Type: application/json" \
  -d '{"code": "function add(a,b){return a+b}", "framework": "vitest"}'

# Generate endpoint
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-endpoint \
  -H "Content-Type: application/json" \
  -d '{"description": "Get user by ID", "method": "GET", "framework": "express"}'
```

## Troubleshooting

### Still getting HTML?
1. Check if functions were copied:
   ```bash
   ls -la packages/web/dist/functions/api/cheriml/
   ```

2. Check if _routes.json exists:
   ```bash
   cat packages/web/dist/_routes.json
   ```

3. Redeploy:
   ```bash
   cd packages/web
   npm run build
   npm run deploy
   ```

### API Key Not Configured?
```bash
# Check secrets
npx wrangler pages secret list --project-name=heysalad-ai

# Set if missing
npx wrangler pages secret put GEMINI_API_KEY --project-name=heysalad-ai
```

## Your Live API URLs

- **Production**: https://heysalad-ai.pages.dev
- **Latest**: https://c1b43906.heysalad-ai.pages.dev
- **Main Branch**: https://main.heysalad-ai.pages.dev

All URLs should work after deployment!

---

**Ready to deploy?** Run: `cd packages/web && npm run deploy`
