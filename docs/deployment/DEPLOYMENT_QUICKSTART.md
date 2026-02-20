# Cloudflare Deployment - Quick Start

Get HeySalad AI deployed to Cloudflare Pages in 5 minutes.

---

## Prerequisites

- ✅ Cloudflare account (free): https://dash.cloudflare.com
- ✅ Gemini API key: https://makersuite.google.com/app/apikey
- ✅ Node.js 18+ installed

---

## 3-Step Deployment

### Step 1: Setup Secrets (2 minutes)

Run the interactive setup script:

```bash
./scripts/setup-secrets.sh
```

This will prompt you to enter:
1. **GEMINI_API_KEY** - Your new Gemini API key (required)
2. **JWT_SECRET** - A random string for auth (required)
3. **Other provider keys** - Optional (OpenAI, Anthropic, etc.)

**IMPORTANT**: The script will securely store these in Cloudflare. They will never be committed to git.

### Step 2: Deploy (2 minutes)

Run the automated deployment script:

```bash
./scripts/deploy-cloudflare.sh
```

This will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Run tests
- ✅ Build the project
- ✅ Deploy to Cloudflare Pages
- ✅ Give you the deployment URL

### Step 3: Test (1 minute)

Visit your deployment URL (shown at the end of deployment):

```
https://heysalad-ai.pages.dev
```

Test CheriML:
1. Navigate to the CheriML section
2. Try generating a function
3. Verify it works!

---

## Manual Deployment (Alternative)

If you prefer manual control:

### 1. Login to Cloudflare

```bash
npx wrangler login
```

### 2. Set Secrets

```bash
cd packages/web

# Required
npx wrangler pages secret put GEMINI_API_KEY
npx wrangler pages secret put JWT_SECRET

# Optional
npx wrangler pages secret put OPENAI_API_KEY
npx wrangler pages secret put ANTHROPIC_API_KEY
```

### 3. Build and Deploy

```bash
npm install
npm run build
npm run deploy
```

---

## Verify Deployment

### Check Secrets

```bash
npx wrangler pages secret list --project-name=heysalad-ai
```

You should see:
- ✅ GEMINI_API_KEY
- ✅ JWT_SECRET
- ✅ Any other keys you set

### Test API

```bash
# Test CheriML endpoint
curl https://heysalad-ai.pages.dev/api/cheriml/health
```

### View Dashboard

Visit: https://dash.cloudflare.com
- Navigate to **Workers & Pages**
- Click **heysalad-ai**
- View deployments, analytics, and logs

---

## Troubleshooting

### "Not logged in to Wrangler"

```bash
npx wrangler login
```

### "Project not found"

Create the project first:
```bash
npx wrangler pages project create heysalad-ai
```

### "Build failed"

Clear cache and rebuild:
```bash
cd packages/web
rm -rf dist node_modules
npm install
npm run build
```

### "Secrets not working"

Re-set the secrets:
```bash
npx wrangler pages secret put GEMINI_API_KEY --project-name=heysalad-ai
```

### "API key invalid"

1. Check your key at: https://makersuite.google.com/app/apikey
2. Make sure you copied the entire key
3. Re-set the secret in Cloudflare

---

## Next Steps

### Custom Domain

Add your own domain:

```bash
npx wrangler pages domain add yourdomain.com --project-name=heysalad-ai
```

Then add a CNAME record in your DNS:
```
Type: CNAME
Name: www (or @)
Target: heysalad-ai.pages.dev
```

### CI/CD Setup

Enable automatic deployments on git push:

1. Go to Cloudflare Dashboard
2. Pages → heysalad-ai → Settings
3. Connect your GitHub repository
4. Enable automatic deployments

### Monitoring

Set up alerts:

1. Cloudflare Dashboard → Notifications
2. Create alerts for:
   - Deployment failures
   - High error rates
   - Unusual traffic

---

## Security Checklist

Before going to production:

- [ ] All secrets set in Cloudflare (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] API keys rotated from any exposed keys
- [ ] Custom domain with SSL configured
- [ ] Rate limiting enabled
- [ ] Monitoring and alerts set up
- [ ] Backup plan documented

---

## Cost

### Cloudflare Pages
- **Free tier**: Unlimited requests, 500 builds/month
- **Paid tier**: $20/month for 5,000 builds/month

### Gemini API
- **Free tier**: 15 requests/minute, 1,500 requests/day
- **Paid tier**: Pay-per-use after free tier

**Estimated monthly cost for small project**: $0-20

---

## Support

### Documentation
- Full guide: See `CLOUDFLARE_DEPLOYMENT.md`
- API docs: See `API_USAGE_GUIDE.md`
- CheriML: See `CHERIML_TEST_REPORT.md`

### Help
- GitHub Issues: https://github.com/Hey-Salad/ai/issues
- Cloudflare Docs: https://developers.cloudflare.com/pages/

---

## Quick Commands Reference

```bash
# Setup secrets
./scripts/setup-secrets.sh

# Deploy
./scripts/deploy-cloudflare.sh

# Manual deploy
cd packages/web && npm run deploy

# List secrets
npx wrangler pages secret list --project-name=heysalad-ai

# View deployments
npx wrangler pages deployment list --project-name=heysalad-ai

# Rollback
npx wrangler pages deployment rollback <id> --project-name=heysalad-ai

# View logs
npx wrangler pages deployment tail --project-name=heysalad-ai
```

---

**Ready to deploy?** Run: `./scripts/setup-secrets.sh`

**Questions?** Check `CLOUDFLARE_DEPLOYMENT.md` for detailed documentation.

---

**Last Updated**: February 20, 2026
