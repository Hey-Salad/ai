# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please email: **security@heysalad.app**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

1. **Acknowledgment**: Within 48 hours
2. **Initial Assessment**: Within 5 business days
3. **Status Updates**: Every 7 days
4. **Resolution**: Varies by severity

### Disclosure Policy

- We will work with you to understand and resolve the issue
- We request that you do not publicly disclose the issue until we've addressed it
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

### API Keys

**Never commit API keys to version control**

```typescript
// ✅ Good - Use environment variables
const client = new HeySaladAI();
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY,
});

// ❌ Bad - Hardcoded keys
const client = new HeySaladAI();
client.configureProvider('openai', {
  apiKey: 'sk-1234567890abcdef',
});
```

### Environment Variables

Use `.env` files for sensitive data:

```bash
# .env (add to .gitignore)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
```

```typescript
// Load environment variables
import 'dotenv/config';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is required');
}
```

### Input Validation

Always validate and sanitize user input:

```typescript
function processUserInput(input: string): string {
  // Validate input
  if (!input || typeof input !== 'string') {
    throw new ValidationError('Invalid input');
  }

  // Check length
  if (input.length > 10000) {
    throw new ValidationError('Input too long');
  }

  // Sanitize
  return input.trim().replace(/[<>]/g, '');
}
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later',
});

app.use('/api/', limiter);
```

### Authentication

For production deployments:

```typescript
// Verify API keys
function authenticateRequest(req: Request): void {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    throw new AuthError('API key required');
  }

  if (!isValidApiKey(apiKey)) {
    throw new AuthError('Invalid API key');
  }
}
```

### CORS Configuration

Configure CORS properly:

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://app.yourdomain.com',
  ],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Content Security Policy

```typescript
import helmet from 'helmet';

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  },
}));
```

## Dependency Security

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Automated Scanning

We use:
- **Dependabot**: Automated dependency updates
- **GitHub Security Advisories**: Vulnerability alerts
- **npm audit**: Regular security audits

## Data Protection

### Sensitive Data

- Never log API keys or secrets
- Redact sensitive information in logs
- Use secure storage for credentials

```typescript
// ✅ Good - Redact sensitive data
function logRequest(config: any) {
  const safe = { ...config };
  if (safe.apiKey) {
    safe.apiKey = '***REDACTED***';
  }
  console.log('Request:', safe);
}
```

### Data Retention

- Minimize data collection
- Delete data when no longer needed
- Follow privacy regulations (GDPR, CCPA)

## Production Security

### HTTPS

Always use HTTPS in production:

```typescript
// Enforce HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### Error Handling

Don't expose sensitive information in errors:

```typescript
// ✅ Good - Generic error message
app.use((err, req, res, next) => {
  console.error(err); // Log full error internally
  res.status(500).json({
    error: 'Internal server error',
  });
});

// ❌ Bad - Exposes internal details
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
});
```

### Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true,
}));
```

## Cloudflare Workers Security

For the web dashboard:

### Environment Secrets

```bash
# Set secrets (not in wrangler.toml)
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
```

### Bindings Security

```typescript
// Access secrets securely
export default {
  async fetch(request: Request, env: Env) {
    const apiKey = env.OPENAI_API_KEY;
    // Use apiKey
  },
};
```

## Incident Response

If a security incident occurs:

1. **Contain**: Isolate affected systems
2. **Assess**: Determine scope and impact
3. **Notify**: Inform affected users
4. **Remediate**: Fix the vulnerability
5. **Document**: Record lessons learned

## Security Checklist

Before deploying to production:

- [ ] All API keys in environment variables
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Error messages don't expose internals
- [ ] Dependencies up to date
- [ ] npm audit shows no vulnerabilities
- [ ] Authentication required for protected routes
- [ ] CORS properly configured
- [ ] Logging doesn't include sensitive data

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Cloudflare Workers Security](https://developers.cloudflare.com/workers/platform/security/)

## Contact

Security concerns: **security@heysalad.app**

General questions: **dev@heysalad.app**

---

Thank you for helping keep HeySalad AI secure!
