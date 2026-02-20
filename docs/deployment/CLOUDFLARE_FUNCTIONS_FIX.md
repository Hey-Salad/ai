# Cloudflare Functions Fix

## Problem
API endpoints were returning HTML instead of JSON because Cloudflare Pages wasn't routing to the Functions properly. The Functions directory wasn't being included in the deployment.

## Solution
Three changes were made to fix the routing:

### 1. Build Script Update
Updated `packages/web/package.json` to copy Functions to dist directory:
```json
"build": "tsc && vite build && node scripts/copy-functions.js"
```

### 2. Copy Functions Script
Created `packages/web/scripts/copy-functions.js` to copy the `functions/` directory to `dist/functions/` during build.

### 3. Routes Configuration
Created `packages/web/public/_routes.json` to tell Cloudflare Pages which routes should be handled by Functions:
```json
{
  "version": 1,
  "include": ["/api/*"],
  "exclude": []
}
```

## How to Deploy

### Quick Deploy
```bash
cd packages/web
npm run deploy
```

This will:
1. Build the React app
2. Copy Functions to dist directory
3. Deploy to Cloudflare Pages

### Manual Deploy
```bash
cd packages/web
npm run build
npx wrangler pages deploy dist --project-name=heysalad-ai
```

## Testing the API

### Health Check
```bash
curl https://heysalad-ai.pages.dev/api/cheriml/health
```

Expected response:
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

### Generate Function (T1)
```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-function \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Calculate fibonacci number",
    "language": "typescript"
  }'
```

### Generate Component (T2)
```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-component \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Button component with loading state",
    "framework": "react"
  }'
```

### Generate Test (T3)
```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-test \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function add(a, b) { return a + b; }",
    "framework": "vitest"
  }'
```

### Generate Endpoint (T4)
```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-endpoint \
  -H "Content-Type: application/json" \
  -d '{
    "description": "User registration endpoint",
    "method": "POST",
    "framework": "express"
  }'
```

## Verification Checklist

After deployment, verify:

- [ ] Health endpoint returns JSON (not HTML)
- [ ] All 4 CheriML endpoints are accessible
- [ ] CORS headers are present
- [ ] Gemini API key is configured
- [ ] Error responses are JSON formatted

## Troubleshooting

### Still Getting HTML?
1. Check deployment logs for errors
2. Verify `_routes.json` is in dist directory
3. Verify `functions/` directory is in dist directory
4. Clear Cloudflare cache and redeploy

### Functions Not Found?
```bash
# Check if functions were copied
ls -la packages/web/dist/functions/api/cheriml/

# Should show:
# - health.ts
# - generate-function.ts
# - generate-component.ts
# - generate-test.ts
# - generate-endpoint.ts
```

### API Key Issues?
```bash
# Verify secrets are set
npx wrangler pages secret list --project-name=heysalad-ai

# Should show:
# - GEMINI_API_KEY
# - JWT_SECRET
# - HUGGINGFACE_API_KEY
```

## Next Steps

1. Deploy with the fix: `npm run deploy`
2. Test health endpoint
3. Test all 4 CheriML endpoints
4. Integrate into your application

---

**Last Updated**: February 20, 2026
