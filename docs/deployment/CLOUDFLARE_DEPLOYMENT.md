# Cloudflare Deployment Guide

Complete guide for deploying HeySalad AI to Cloudflare Pages with secure secret management.

---

## Prerequisites

1. **Cloudflare Account** - Sign up at https://dash.cloudflare.com
2. **Wrangler CLI** - Already installed in the project
3. **API Keys** - Gemini, OpenAI, or other AI provider keys
4. **Git Repository** - Connected to Cloudflare Pages

---

## Quick Start

### 1. Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authenticate.

### 2. Set Environment Variables (Secure)

**IMPORTANT**: Never commit API keys to git. Use Cloudflare secrets:

```bash
# Navigate to web package
cd packages/web

# Set Gemini API key (for CheriML)
npx wrangler pages secret put GEMINI_API_KEY
# Paste your key when prompted

# Set other provider keys (optional)
npx wrangler pages secret put OPENAI_API_KEY
npx wrangler pages secret put ANTHROPIC_API_KEY
npx wrangler pages secret put HUGGINGFACE_API_KEY

# Set JWT secret for authentication
npx wrangler pages secret put JWT_SECRET
# Use a strong random string
```

### 3. Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

---

## Detailed Setup

### Step 1: Create Cloudflare Pages Project

#### Option A: Via Dashboard (Recommended for first time)

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages**
3. Click **Create Application** → **Pages**
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `packages/web`

#### Option B: Via CLI

```bash
cd packages/web
npx wrangler pages project create heysalad-ai
```

### Step 2: Configure Environment Variables

#### For Development (Local)

Create `.env.local` file (gitignored):

```bash
# Copy example
cp .env.example .env.local

# Edit with your keys
nano .env.local
```

Add your keys:
```env
VITE_GEMINI_API_KEY=your_actual_key_here
VITE_OPENAI_API_KEY=sk-proj-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

#### For Production (Cloudflare)

Use Wrangler CLI to set secrets:

```bash
# Set secrets one by one
npx wrangler pages secret put GEMINI_API_KEY --project-name=heysalad-ai
npx wrangler pages secret put OPENAI_API_KEY --project-name=heysalad-ai
npx wrangler pages secret put JWT_SECRET --project-name=heysalad-ai
```

Or use the deployment script:

```bash
./scripts/deploy-cloudflare.sh
```

### Step 3: Configure Database (D1)

If using D1 database for user management:

```bash
# Create D1 database
npx wrangler d1 create heysalad-ai-db

# Update wrangler.toml with the database ID
# (Copy from the output above)

# Run migrations
npx wrangler d1 execute heysalad-ai-db --file=./schema.sql
```

### Step 4: Deploy

```bash
# Build
npm run build

# Deploy
npm run deploy

# Or use the deployment script
./scripts/deploy-cloudflare.sh
```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key | https://makersuite.google.com/app/apikey |
| `JWT_SECRET` | Secret for JWT tokens | Generate random string |

### Optional Provider Keys

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Anthropic Claude key | https://console.anthropic.com/ |
| `HUGGINGFACE_API_KEY` | HuggingFace key | https://huggingface.co/settings/tokens |

### Configuration Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_AI_PROVIDER` | Default AI provider | `gemini` |
| `VITE_GEMINI_MODEL` | Gemini model to use | `gemini-2.0-flash` |
| `VITE_ENABLE_REMOTE_LOGS` | Enable logging | `false` |

---

## Deployment Scripts

### Automated Deployment

Use the provided deployment script:

```bash
# Make executable
chmod +x scripts/deploy-cloudflare.sh

# Run deployment
./scripts/deploy-cloudflare.sh
```

The script will:
1. Check for required tools
2. Build the project
3. Run tests
4. Deploy to Cloudflare
5. Verify deployment

### Manual Deployment

```bash
cd packages/web

# Install dependencies
npm install

# Build
npm run build

# Deploy
npx wrangler pages deploy dist --project-name=heysalad-ai
```

---

## Security Best Practices

### 1. Never Commit Secrets

Add to `.gitignore`:
```
.env
.env.local
.env.production
*.key
*.pem
```

### 2. Use Cloudflare Secrets

```bash
# Set secrets via CLI (encrypted)
npx wrangler pages secret put SECRET_NAME

# List secrets (values hidden)
npx wrangler pages secret list

# Delete secrets
npx wrangler pages secret delete SECRET_NAME
```

### 3. Rotate Keys Regularly

```bash
# Update a secret
npx wrangler pages secret put GEMINI_API_KEY
# Enter new key when prompted
```

### 4. Use Different Keys for Environments

- **Development**: Use test/development keys
- **Staging**: Use staging keys with limits
- **Production**: Use production keys with monitoring

### 5. Monitor Usage

- Set up Cloudflare Analytics
- Monitor API usage in provider dashboards
- Set up alerts for unusual activity

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Deployment Fails

```bash
# Check Wrangler authentication
npx wrangler whoami

# Re-login if needed
npx wrangler login

# Check project name
npx wrangler pages project list
```

### Secrets Not Working

```bash
# List secrets to verify
npx wrangler pages secret list --project-name=heysalad-ai

# Re-set the secret
npx wrangler pages secret put SECRET_NAME --project-name=heysalad-ai
```

### API Key Issues

1. Verify key is valid in provider dashboard
2. Check key has correct permissions
3. Verify key is set in Cloudflare secrets
4. Check environment variable names match

### CORS Issues

Add to `wrangler.toml`:
```toml
[env.production]
routes = [
  { pattern = "api.heysalad.app/*", zone_name = "heysalad.app" }
]

[[env.production.headers]]
name = "Access-Control-Allow-Origin"
value = "*"
```

---

## Custom Domain Setup

### 1. Add Custom Domain

```bash
# Via CLI
npx wrangler pages domain add heysalad.app --project-name=heysalad-ai

# Or via Dashboard
# Pages → heysalad-ai → Custom domains → Add domain
```

### 2. Configure DNS

Add CNAME record in Cloudflare DNS:
```
Type: CNAME
Name: www (or @)
Target: heysalad-ai.pages.dev
```

### 3. Enable HTTPS

Cloudflare automatically provisions SSL certificates.

---

## Monitoring & Analytics

### Enable Analytics

In `wrangler.toml`:
```toml
[analytics]
enabled = true
```

### View Metrics

```bash
# Via CLI
npx wrangler pages deployment list --project-name=heysalad-ai

# Or via Dashboard
# Pages → heysalad-ai → Analytics
```

### Set Up Alerts

1. Go to Cloudflare Dashboard
2. Navigate to Notifications
3. Create alerts for:
   - High error rates
   - Unusual traffic
   - Deployment failures

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
        working-directory: packages/web
      
      - name: Build
        run: npm run build
        working-directory: packages/web
      
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: packages/web
          command: pages deploy dist --project-name=heysalad-ai
```

### Set GitHub Secrets

1. Go to repository Settings → Secrets
2. Add `CLOUDFLARE_API_TOKEN`
3. Get token from Cloudflare Dashboard → API Tokens

---

## Performance Optimization

### 1. Enable Caching

In `wrangler.toml`:
```toml
[build]
command = "npm run build"
caching = true
```

### 2. Optimize Assets

```bash
# Install optimization tools
npm install -D vite-plugin-compression

# Update vite.config.ts
import compression from 'vite-plugin-compression'

export default {
  plugins: [compression()]
}
```

### 3. Use CDN

Cloudflare automatically serves assets via CDN.

---

## Rollback

### Rollback to Previous Deployment

```bash
# List deployments
npx wrangler pages deployment list --project-name=heysalad-ai

# Rollback to specific deployment
npx wrangler pages deployment rollback <deployment-id> --project-name=heysalad-ai
```

### Via Dashboard

1. Go to Pages → heysalad-ai → Deployments
2. Find previous successful deployment
3. Click "Rollback to this deployment"

---

## Cost Estimation

### Cloudflare Pages Pricing

- **Free Tier**:
  - 500 builds/month
  - Unlimited requests
  - Unlimited bandwidth
  - 100 custom domains

- **Paid Tier** ($20/month):
  - 5,000 builds/month
  - Everything in Free
  - Advanced features

### AI Provider Costs

- **Gemini**: Free tier available, then pay-per-use
- **OpenAI**: Pay-per-token
- **Anthropic**: Pay-per-token

Monitor usage in provider dashboards.

---

## Support

### Documentation

- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- HeySalad AI: See README.md

### Community

- GitHub Issues: https://github.com/Hey-Salad/ai/issues
- Cloudflare Discord: https://discord.gg/cloudflaredev

---

## Checklist

Before deploying to production:

- [ ] All secrets set in Cloudflare
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] Tests passing
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Monitoring set up
- [ ] Backup plan ready
- [ ] Documentation updated

---

**Last Updated**: February 20, 2026  
**Version**: 1.0
