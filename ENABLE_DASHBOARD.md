# 🔐 Enable Dashboard & API Keys Management

Your dashboard and API key management system is **fully coded and ready**. You just need to configure the secrets in Cloudflare Pages.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Generate SESSION_SECRET

```bash
# Generate a random 32-byte secret
openssl rand -hex 32
```

Save the output. You'll need it in a moment. Example: `a1b2c3d4e5f6...`

### Step 2: Set DASHBOARD_PASSWORD

Choose a strong password you'll use to login. Example: `SuperSecurePassword123!`

### Step 3: Add Secrets to Cloudflare Pages

Go to: https://dash.cloudflare.com/

1. **Navigate to Workers & Pages**
   - Click "Workers & Pages" in sidebar
   - Click on `heysalad-ai` project

2. **Add Environment Secrets**

   **For Production:**
   ```bash
   wrangler pages secret put SESSION_SECRET --project heysalad-ai --env production
   # Paste your secret from step 1

   wrangler pages secret put DASHBOARD_PASSWORD --project heysalad-ai --env production
   # Paste your password from step 2
   ```

   **For Preview:**
   ```bash
   wrangler pages secret put SESSION_SECRET --project heysalad-ai --env preview
   # Paste your secret from step 1

   wrangler pages secret put DASHBOARD_PASSWORD --project heysalad-ai --env preview
   # Paste your password from step 2
   ```

   Or use the Cloudflare Dashboard UI:
   - Go to Settings tab
   - Click "Environment variables" or "Secrets"
   - Add both variables

---

## ✅ Dashboard Features Once Enabled

### 1. **Login Page** (`/auth/login`)
- Access at: https://22d92bd5.heysalad-ai.pages.dev/auth/login
- Sign in with your DASHBOARD_PASSWORD

### 2. **Dashboard** (`/dashboard`)
- View API keys
- See key statistics
- Copy API keys

### 3. **API Key Management**
- **Generate new keys** - Click "+ Generate New Key"
- **Copy key/secret** - Click "Copy" button (auto-hides secret after generation)
- **Revoke keys** - Click "Revoke" to disable a key
- **View all keys** - Table shows name, key prefix, creation date

### 4. **API Endpoint** (`/api/v1/keys`)
- **GET /api/v1/keys** - List all active keys (requires auth)
- **POST /api/v1/keys** - Create new key (requires auth)
- **DELETE /api/v1/keys** - Revoke key (requires auth)

---

## 🔑 Key Generation Format

Keys are generated with a specific format for security:

```
API Key:      hsk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Secret:       hss_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- `hsk_live_` prefix = API Key (safe to expose in client)
- `hss_` prefix = Client Secret (keep private!)

---

## 📋 How It Works

### Authentication Flow
1. User visits `/auth/login`
2. Enters DASHBOARD_PASSWORD
3. Browser receives session cookie
4. Cookie stored in KV Namespace
5. Access to `/dashboard` and API endpoints allowed

### API Key Storage
- **Storage:** Cloudflare KV Namespace (`API_KEYS`)
- **Format:** `key:{id}` → JSON record
- **Index:** `keys:index` → Array of key IDs
- **Encryption:** KV handles encryption at rest

### Session Management
- **Cookies:** `__heysalad_session` (httpOnly, secure, sameSite)
- **Duration:** Session lasts until browser closes or cookie expires
- **Secret:** Signed with SESSION_SECRET for security

---

## 🧪 Test the Dashboard

### Once secrets are set:

1. **Visit Login Page**
   ```
   https://22d92bd5.heysalad-ai.pages.dev/auth/login
   ```

2. **Enter Password**
   - Use the DASHBOARD_PASSWORD you set

3. **Generate API Key**
   - Click "+ Generate New Key"
   - Enter a name (e.g., "My App")
   - Copy the key and secret
   - **Save them somewhere safe** - secret won't be shown again!

4. **Use the Key**
   ```bash
   curl -X POST https://your-api.com/api/v1/chat \
     -H "Authorization: Bearer hsk_live_xxxxx" \
     -H "Content-Type: application/json" \
     -d '{
       "model": "gpt-4",
       "messages": [{"role": "user", "content": "Hello!"}]
     }'
   ```

---

## 🔗 URLs After Setup

| Page | URL |
|------|-----|
| **Home** | https://22d92bd5.heysalad-ai.pages.dev/ |
| **Login** | https://22d92bd5.heysalad-ai.pages.dev/auth/login |
| **Dashboard** | https://22d92bd5.heysalad-ai.pages.dev/dashboard |
| **Models** | https://22d92bd5.heysalad-ai.pages.dev/models |
| **API Docs** | https://22d92bd5.heysalad-ai.pages.dev/api/v1 |

---

## 🛠️ Environment Variables Reference

### Required for Dashboard

| Variable | Purpose | Example |
|----------|---------|---------|
| `SESSION_SECRET` | Signs session cookies | Random 32+ byte hex |
| `DASHBOARD_PASSWORD` | Login password | `MySecurePassword123!` |

### Optional API Provider Keys

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | OpenAI integration |
| `ANTHROPIC_API_KEY` | Claude integration |
| `HUGGINGFACE_API_KEY` | HF models integration |
| `GEMINI_API_KEY` | Gemini integration |

---

## 🐛 Troubleshooting

### "Unauthorized" error at /dashboard
**Problem:** SESSION_SECRET not set
**Fix:** Set SESSION_SECRET environment variable

### Can't login
**Problem:** Wrong password or DASHBOARD_PASSWORD not set
**Fix:** Verify password matches DASHBOARD_PASSWORD value

### API key endpoint returns 401
**Problem:** Not authenticated
**Fix:** Log in at `/auth/login` first

### Session expires immediately
**Problem:** SESSION_SECRET changed or cookie settings wrong
**Fix:** Ensure SESSION_SECRET is consistent and HTTPS is enabled

---

## 🚀 Next Steps

1. **Generate secrets**
   ```bash
   openssl rand -hex 32  # For SESSION_SECRET
   ```

2. **Set environment variables**
   ```bash
   wrangler pages secret put SESSION_SECRET --project heysalad-ai
   wrangler pages secret put DASHBOARD_PASSWORD --project heysalad-ai
   ```

3. **Redeploy** (optional - secrets take effect immediately)
   ```bash
   npm run deploy
   ```

4. **Test login**
   ```
   https://22d92bd5.heysalad-ai.pages.dev/auth/login
   ```

5. **Create first API key**
   - Login with your password
   - Click "+ Generate New Key"
   - Copy and save the key + secret

---

## 📚 Code Locations

- **Auth Logic:** `/packages/web/app/utils/auth.server.ts`
- **Key Management:** `/packages/web/app/utils/keys.server.ts`
- **Login Page:** `/packages/web/app/routes/auth.login.tsx`
- **Logout Route:** `/packages/web/app/routes/auth.logout.tsx`
- **Dashboard:** `/packages/web/app/routes/dashboard._index.tsx`
- **API Keys Endpoint:** `/packages/web/app/routes/api.v1.keys._index.tsx`

---

## 💡 Security Notes

- ✅ Secrets never logged or exposed in source code
- ✅ Passwords hashed with SHA-256
- ✅ Sessions signed with SESSION_SECRET
- ✅ Cookies httpOnly and secure
- ✅ CSRF protection via Remix Forms
- ✅ Client secrets masked in UI (only shown once)
- ✅ Client secrets hashed in KV (never retrievable)

---

**Your dashboard is ready to go! Just set 2 environment variables and you're live! 🎉**
