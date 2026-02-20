import { createCookieSessionStorage, redirect } from '@remix-run/cloudflare';

interface Env {
  API_KEYS: KVNamespace;
  DASHBOARD_PASSWORD: string;
  SESSION_SECRET: string;
}

function getSessionStorage(secret: string) {
  return createCookieSessionStorage({
    cookie: {
      name: '__heysalad_session',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [secret],
      secure: true,
    },
  });
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getSession(request: Request, secret: string) {
  const storage = getSessionStorage(secret);
  return storage.getSession(request.headers.get('Cookie'));
}

export async function createUserSession(
  request: Request,
  secret: string,
  redirectTo: string
): Promise<Response> {
  const storage = getSessionStorage(secret);
  const session = await storage.getSession(request.headers.get('Cookie'));
  session.set('authenticated', true);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export async function destroyUserSession(
  request: Request,
  secret: string
): Promise<Response> {
  const storage = getSessionStorage(secret);
  const session = await storage.getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export async function requireAuth(request: Request, env: Env): Promise<void> {
  const session = await getSession(request, env.SESSION_SECRET);
  if (!session.get('authenticated')) {
    throw redirect('/auth/login');
  }
}

export async function checkAuth(request: Request, env: Env): Promise<boolean> {
  const session = await getSession(request, env.SESSION_SECRET);
  return Boolean(session.get('authenticated'));
}
