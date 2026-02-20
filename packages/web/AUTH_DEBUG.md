# Authentication Debug Guide

## Changes Made

### 1. LoginModal Updates
- Updated onboarding copy to focus on AI platform features
- Changed heading from "Sign in" to "Welcome back" for login
- Changed heading from "Create account" to "Start building with AI" for signup
- Updated description to highlight "One API for OpenAI, Anthropic, Gemini, and more"
- Added benefits section for signup showing:
  - Unified API for multiple AI providers
  - Secure API key management
  - Usage analytics and monitoring
  - Free tier to get started

### 2. Auth Service Debugging
- Added console.log statements to track:
  - Request URLs
  - Response status codes
  - Response data
- This will help identify where the authentication is failing

### 3. Test Page Created
- Created `test-auth.html` for direct API testing
- Access at: https://ai.heysalad.app/test-auth.html
- Tests signup, login, and get user endpoints directly
- Shows raw API responses

## Current Status

### What's Working
✅ D1 Database is created and initialized
✅ Database binding is configured in wrangler.toml
✅ JWT_SECRET is set in Cloudflare secrets
✅ API endpoints tested successfully via curl
✅ Signup API returns proper response format
✅ Login API returns proper response format
✅ Me API validates tokens correctly

### What Needs Testing
🔍 Frontend authentication flow
🔍 Browser console errors
🔍 Network requests in browser DevTools
🔍 Token storage in localStorage
🔍 Redirect to /dashboard after successful auth

## How to Debug

### Step 1: Test API Directly
1. Go to https://ai.heysalad.app/test-auth.html
2. Click "Test Signup" with default values
3. Check if you get a success response with token
4. If successful, click "Test Login" with same credentials
5. Then click "Test Get User" to verify token works

### Step 2: Check Browser Console
1. Go to https://ai.heysalad.app
2. Open browser DevTools (F12)
3. Go to Console tab
4. Click "Get Started" button
5. Try to sign up or login
6. Look for console.log messages showing:
   - "Signup request to: /api/auth/signup"
   - "Signup response status: XXX"
   - "Signup response data: {...}"

### Step 3: Check Network Tab
1. In DevTools, go to Network tab
2. Try authentication again
3. Look for requests to `/api/auth/signup` or `/api/auth/login`
4. Check:
   - Request payload (should have email, password)
   - Response status (should be 200 or 201)
   - Response body (should have success: true, token, user)

### Step 4: Check localStorage
1. In DevTools, go to Application tab
2. Look under Storage > Local Storage
3. Check if `heysalad_ai_token` is being stored after successful auth

## Common Issues & Solutions

### Issue: "Authentication failed. Please try again"
**Possible Causes:**
1. API endpoint not responding (check Network tab)
2. Response format mismatch (check Console logs)
3. CORS issues (check Console for CORS errors)
4. Database binding not working (check Cloudflare dashboard)

**Solutions:**
- Use test-auth.html to verify API works
- Check browser console for detailed error messages
- Verify D1 binding in Cloudflare Pages settings

### Issue: "Internal server error"
**Possible Causes:**
1. Database not accessible
2. JWT_SECRET not set
3. Database schema not initialized

**Solutions:**
- Check Cloudflare Pages > Settings > Functions > D1 database bindings
- Verify JWT_SECRET in Cloudflare Pages > Settings > Environment variables
- Re-run database initialization if needed

### Issue: Token not being saved
**Possible Causes:**
1. Response doesn't include token
2. localStorage is blocked
3. Response format is incorrect

**Solutions:**
- Check Network tab response body
- Try in incognito mode
- Verify response has `success: true` and `token` fields

## API Response Format

### Successful Signup/Login Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "User Name",
    "tier": "free"
  }
}
```

### Error Response
```json
{
  "error": "Email already registered"
}
```

### Get User Response
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "User Name",
    "tier": "free"
  }
}
```

## Next Steps

1. Test authentication using test-auth.html
2. Check browser console for detailed logs
3. Verify API responses match expected format
4. If API works but frontend doesn't, check:
   - Response parsing in authService.ts
   - Error handling in LoginModal.tsx
   - Token storage logic
5. Once auth works, clean up console.log statements
6. Update remaining pages to match AI platform theme

## Deployment Info

- Production URL: https://ai.heysalad.app
- Latest deployment: https://8ce3dfbc.heysalad-ai.pages.dev
- Test page: https://ai.heysalad.app/test-auth.html
- Database: heysalad-ai-db (517ee5cd-fd45-4e92-9628-28d60e83a05a)

## Files Modified

- `packages/web/src/components/LoginModal.tsx` - Updated onboarding copy
- `packages/web/src/services/authService.ts` - Added debug logging
- `packages/web/test-auth.html` - Created test page

---

Last Updated: February 20, 2026
