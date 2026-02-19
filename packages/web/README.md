# @heysalad/web

HeySalad AI Dashboard and API - Hosted at ai.heysalad.app

## Environments

### Development
```bash
npm run dev
# Local development server at http://localhost:5173
```

### Staging
```bash
npm run deploy:staging
# Deploys to staging.ai.heysalad.app
```

### Production
```bash
npm run deploy:prod
# Deploys to ai.heysalad.app
```

## Tech Stack

- **Framework**: Remix (React Router v7)
- **Runtime**: Cloudflare Workers
- **Bundler**: Vite
- **Language**: TypeScript
- **Styling**: Plain CSS (can add Tailwind later)

## Features

- Server-Side Rendering (SSR) for SEO
- Edge deployment on Cloudflare Workers
- API routes at `/api/v1/*`
- Agentic discovery (robots.txt, manifest.json, OpenAPI)
- Multi-environment support (dev, staging, prod)

## Project Structure

```
app/
├── routes/
│   ├── _index.tsx           # Home page
│   ├── api.v1._index.tsx    # API index
│   └── dashboard.tsx         # Dashboard (coming soon)
├── root.tsx                  # Root layout
├── entry.server.tsx          # Server entry
└── entry.client.tsx          # Client entry
public/
├── robots.txt                # SEO & agentic discovery
└── manifest.json             # PWA manifest
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build
```

## Deployment

Set up Cloudflare Pages:

1. Connect to GitHub repo
2. Set build command: `npm run build`
3. Set build output: `build/client`
4. Add environment variables (secrets)

Or deploy via CLI:

```bash
# Development
npm run deploy:dev

# Staging
npm run deploy:staging

# Production
npm run deploy:prod
```

## Environment Variables

Set via Wrangler:

```bash
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put SESSION_SECRET
```

## API Routes

- `GET /api/v1` - API index
- `POST /api/v1/chat` - Chat completion (coming soon)
- `POST /api/v1/stream` - Streaming chat (coming soon)
- `GET /api/v1/models` - List models (coming soon)
- `POST /api/v1/actions` - Execute action (coming soon)
- `POST /api/v1/verify` - Human verification (coming soon)

## SEO & Agentic Discovery

The site is optimized for both human users and AI agents:

- **robots.txt**: Clear crawling rules
- **sitemap.xml**: Site structure (coming soon)
- **manifest.json**: PWA support
- **OpenAPI spec**: API documentation (coming soon)
- **Structured meta tags**: Rich social previews
- **SSR**: Fast initial page load, SEO-friendly
