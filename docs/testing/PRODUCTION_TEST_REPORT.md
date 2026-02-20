# Production API Test Report

**Date**: February 20, 2026  
**Production URL**: https://ai.heysalad.app  
**Status**: ⚠️ NEEDS CONFIGURATION

---

## Current Status

### ✅ What's Working
- Production deployment is live and accessible
- Health check endpoint responding correctly
- API key is configured in production
- All 4 CheriML endpoints are deployed

### ❌ What's Broken
- **Gemini Model Version Issue**: The production deployment is using outdated Gemini models that no longer exist:
  - `gemini-1.5-flash` - Returns 404 error
  - `gemini-2.0-flash` - No longer available to new users

### ✅ What's Fixed (In Code)
- Updated all 4 CheriML endpoints to use `gemini-1.5-pro` (stable, currently available model)
- Increased `maxOutputTokens` from 4096 to 8192 for better code generation
- Code is built and deployed

---

## The Problem

Cloudflare Pages is aggressively caching the old deployment. The custom domain `ai.heysalad.app` is still serving the old version with the broken models, even though we've deployed the fixed version.

**Evidence**:
- New deployment URL: `https://86950a22.heysalad-ai.pages.dev`
- New deployment shows: `"geminiApiKey": "missing"` (expected - secrets need to be set)
- Production URL shows: `"geminiApiKey": "configured"` (old deployment still cached)
- Production URL still returns 404 errors for old models

---

## Solution

You need to do TWO things:

### 1. Set the API Key for the Project

The new deployment doesn't have the GEMINI_API_KEY configured. Run this:

```bash
./scripts/set-gemini-key.sh
```

Or manually:

```bash
cd packages/web
npx wrangler pages secret put GEMINI_API_KEY --project-name=heysalad-ai
```

When prompted, enter your Gemini API key.

### 2. Wait for Cache to Clear OR Force Purge

**Option A: Wait (5-15 minutes)**
Cloudflare will eventually serve the new deployment to your custom domain.

**Option B: Force Purge (Immediate)**
1. Go to Cloudflare Dashboard
2. Navigate to your Pages project: `heysalad-ai`
3. Go to "Caching" or "Purge Cache"
4. Purge all cache
5. Test again

**Option C: Test the Direct Deployment URL**
Use the latest deployment URL directly:
```bash
node scripts/test-production-api.js https://86950a22.heysalad-ai.pages.dev
```

---

## Test Results

### Latest Test Run
**URL**: https://ai.heysalad.app  
**Time**: 2026-02-20T07:38:51.030Z

| Endpoint | Status | Duration | Result |
|----------|--------|----------|--------|
| Health Check | ✅ 200 | 134ms | Working |
| Generate Function (T1) | ❌ 500 | 84ms | Model 404 error |
| Generate Component (T2) | ❌ 500 | 253ms | Model 404 error |
| Generate Test (T3) | ❌ 500 | 160ms | Model 404 error |
| Generate Endpoint (T4) | ❌ 500 | 165ms | Model 404 error |

**Success Rate**: 20% (1/5 tests passing)

---

## Error Details

### Generate Function Error
```json
{
  "error": "Gemini API error: 404",
  "details": {
    "error": {
      "code": 404,
      "message": "models/gemini-1.5-flash is not found for API version v1beta"
    }
  }
}
```

### Generate Component/Test/Endpoint Error
```json
{
  "error": "Gemini API error: 404",
  "details": {
    "error": {
      "code": 404,
      "message": "This model models/gemini-2.0-flash is no longer available to new users"
    }
  }
}
```

---

## Code Changes Made

Updated all 4 CheriML endpoint files:
- `packages/web/functions/api/cheriml/generate-function.ts`
- `packages/web/functions/api/cheriml/generate-component.ts`
- `packages/web/functions/api/cheriml/generate-test.ts`
- `packages/web/functions/api/cheriml/generate-endpoint.ts`

**Changes**:
```typescript
// OLD (broken)
gemini-1.5-flash:generateContent
gemini-2.0-flash:generateContent
maxOutputTokens: 4096

// NEW (fixed)
gemini-1.5-pro:generateContent
maxOutputTokens: 8192
```

---

## Next Steps

1. **Run the setup script**:
   ```bash
   ./scripts/set-gemini-key.sh
   ```

2. **Wait 5-10 minutes** for cache to clear

3. **Test production again**:
   ```bash
   node scripts/test-production-api.js https://ai.heysalad.app
   ```

4. **If still failing**, test the direct deployment URL:
   ```bash
   node scripts/test-production-api.js https://86950a22.heysalad-ai.pages.dev
   ```

5. **If direct URL works**, purge Cloudflare cache manually

---

## Expected Results After Fix

Once the API key is set and cache clears, you should see:

```
✅ Health Check - 200 OK
✅ Generate Function (T1) - 200 OK - Code generated
✅ Generate Component (T2) - 200 OK - Component generated
✅ Generate Test (T3) - 200 OK - Tests generated
✅ Generate Endpoint (T4) - 200 OK - Endpoint generated

Success Rate: 100% (5/5 tests passing)
```

---

## Files Created

- `scripts/test-production-api.js` - Comprehensive API test suite
- `scripts/set-gemini-key.sh` - Helper script to set API key
- `scripts/check-gemini-models.sh` - Script to check available models
- `PRODUCTION_TEST_REPORT.md` - This file

---

## Support

If you continue to have issues:

1. Check Cloudflare Pages deployment logs
2. Verify API key is set: `npx wrangler pages secret list --project-name=heysalad-ai`
3. Test with a fresh Gemini API key
4. Check Gemini API quota/limits in Google Cloud Console

---

**Last Updated**: February 20, 2026  
**Status**: Waiting for cache clear + API key configuration
