/**
 * Login API - Authenticate user
 */

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { email, password } = await context.request.json() as LoginRequest;

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user from database
    const user = await context.env.DB.prepare(
      'SELECT id, email, password_hash, name, tier FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify password
    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.password_hash) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update last login
    await context.env.DB.prepare(
      'UPDATE users SET last_login = ? WHERE id = ?'
    ).bind(new Date().toISOString(), user.id).run();

    // Create session token
    const token = await createToken(user.id as string, user.email as string, user.tier as string, context.env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Hash password using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Create JWT token
async function createToken(userId: string, email: string, tier: string, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: userId,
    email,
    tier,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const message = `${encodedHeader}.${encodedPayload}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  return `${message}.${encodedSignature}`;
}
