# Cloudflare Pages Secret Setup

## Issue
The GEMINI_API_KEY secret is set via CLI but not being picked up by the Functions.

## Solution: Set Secrets via Cloudflare Dashboard

### Step 1: Access Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Select your account
3. Go to "Workers & Pages"
4. Click on "heysalad-ai" project

### Step 2: Add Environment Variables
1. Click on "Settings" tab
2. Scroll down to "Environment variables"
3. Click "Add variable" or "Edit variables"
4. Add the following:
   - Variable name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Environment: Select "Production" (and "Preview" if needed)
5. Click "Save"

### Step 3: Redeploy
After saving the environment variable, you need to trigger a new deployment:

```bash
cd packages/web
npm run deploy
```

Or wait for the next automatic deployment from Git.

### Step 4: Verify
Test the health endpoint:

```bash
curl https://heysalad-ai.pages.dev/api/cheriml/health | jq '.configuration'
```

Should show:
```json
{
  "geminiApiKey": "configured"
}
```

## Alternative: Use Wrangler CLI (If Dashboard Doesn't Work)

### Delete and Re-add Secret
```bash
# Delete existing secret
npx wrangler pages secret delete GEMINI_API_KEY --project-name=heysalad-ai

# Add it again
npx wrangler pages secret put GEMINI_API_KEY --project-name=heysalad-ai
```

### Verify Secret is Set
```bash
npx wrangler pages secret list --project-name=heysalad-ai
```

## Current Status

✅ API endpoints are working (returning JSON)
✅ Functions routing is correct
✅ CORS headers configured
✅ Secret is set in Cloudflare (confirmed via CLI)
⚠️ Secret not being passed to Functions runtime

## Possible Causes

1. **Propagation Delay**: Cloudflare secrets can take 1-2 minutes to propagate
2. **Environment Mismatch**: Secret might be set for wrong environment
3. **Binding Issue**: Functions might need explicit binding in wrangler.toml
4. **Cache**: Cloudflare edge cache might be serving old version

## Troubleshooting Steps

### 1. Wait and Retry
Sometimes secrets take a few minutes to propagate:
```bash
# Wait 2 minutes, then test
sleep 120
curl https://heysalad-ai.pages.dev/api/cheriml/health | jq '.configuration'
```

### 2. Force New Deployment
```bash
cd packages/web
npm run build
npx wrangler pages deploy dist --project-name=heysalad-ai --commit-dirty=true
```

### 3. Check Cloudflare Dashboard
- Go to Workers & Pages > heysalad-ai > Settings
- Verify GEMINI_API_KEY is listed under Environment variables
- Check it's enabled for "Production" environment

### 4. Test with Different URL
Try the latest deployment URL directly:
```bash
curl https://f3965a24.heysalad-ai.pages.dev/api/cheriml/health | jq '.configuration'
```

## Test Full Workflow

Once the API key is configured, test code generation:

```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-function \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Factorial Calculator",
    "description": "Calculate factorial of a number recursively",
    "language": "typescript",
    "functionName": "factorial"
  }' | jq '.output.code'
```

Expected: Generated TypeScript code

## Next Steps

1. Set GEMINI_API_KEY via Cloudflare Dashboard (recommended)
2. Wait 2-3 minutes for propagation
3. Redeploy if needed
4. Test all endpoints

---

**Note**: Cloudflare Pages secrets are sometimes finicky with the CLI. The dashboard method is more reliable.
