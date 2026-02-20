# HeySalad AI Authentication Setup

This guide explains how to set up the Cloudflare-based authentication system for HeySalad AI.

## Overview

The authentication system uses:
- **Cloudflare D1** (SQLite) for user data storage
- **Cloudflare Pages Functions** for API endpoints
- **JWT tokens** for session management
- **SHA-256** for password hashing

## Setup Steps

### 1. Create D1 Database

```bash
cd packages/web
./setup-db.sh
```

Or manually:

```bash
wrangler d1 create heysalad-ai-db
```

Copy the `database_id` from the output.

### 2. Update Configuration

Edit `wrangler.toml` and replace `YOUR_DATABASE_ID` with the actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "heysalad-ai-db"
database_id = "abc123-your-actual-id"
```

### 3. Initialize Database Schema

```bash
wrangler d1 execute heysalad-ai-db --file=schema.sql
```

### 4. Set JWT Secret

Generate a secure random string and set it as a secret:

```bash
# Generate a random secret (or use your own)
openssl rand -base64 32

# Set the secret
wrangler secret put JWT_SECRET
# Paste the generated secret when prompted
```

### 5. Test Locally

```bash
npm run dev
```

The auth API will be available at:
- `http://localhost:3000/api/auth/signup`
- `http://localhost:3000/api/auth/login`
- `http://localhost:3000/api/auth/me`

### 6. Deploy

```bash
npm run deploy
```

## API Endpoints

### POST /api/auth/signup
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "tier": "free"
  }
}
```

### POST /api/auth/login
Authenticate an existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "tier": "free"
  }
}
```

### GET /api/auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <your_jwt_token_here>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "tier": "free",
    "createdAt": "2026-02-20T00:00:00.000Z"
  }
}
```

## Database Schema

The system uses three main tables:

### users
- `id` - UUID primary key
- `email` - Unique email address
- `password_hash` - SHA-256 hashed password
- `name` - Optional display name
- `tier` - Subscription tier (free, pro, max)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp
- `last_login` - Last login timestamp

### api_keys
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `name` - Key description
- `key_hash` - Hashed API key
- `key_prefix` - First 8 chars for display
- `created_at` - Creation timestamp
- `last_used` - Last usage timestamp
- `expires_at` - Optional expiration
- `is_active` - Active status

### usage_logs
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `provider` - AI provider used
- `model` - Model name
- `tokens_used` - Token count
- `cost` - Cost in USD
- `created_at` - Usage timestamp

## Security Features

- Passwords are hashed with SHA-256
- JWT tokens expire after 30 days
- Email validation on signup
- Password minimum length: 8 characters
- CORS protection
- SQL injection prevention via prepared statements

## Frontend Integration

The frontend uses `src/services/authService.ts` which provides:

```typescript
// Sign up
const result = await signup(email, password, name);

// Login
const result = await login(email, password);

// Get current user
const user = await getCurrentUser();

// Logout
logout();

// Check authentication
const isAuth = isAuthenticated();
```

## Future Enhancements

- Magic link authentication
- Email OTP verification
- OAuth providers (Google, GitHub)
- Two-factor authentication
- Password reset flow
- Email verification
- Rate limiting
- Session management

## Troubleshooting

### Database not found
Make sure you've created the D1 database and updated `wrangler.toml` with the correct `database_id`.

### JWT_SECRET not set
Run `wrangler secret put JWT_SECRET` and enter a secure random string.

### CORS errors
Cloudflare Pages Functions automatically handle CORS. If you're testing locally, make sure you're using the dev server.

### Password hash mismatch
Passwords are hashed with SHA-256. Make sure you're using the same hashing algorithm on both signup and login.

## Support

For issues or questions, check:
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
