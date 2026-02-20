import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Form, useActionData } from '@remix-run/react';
import { checkAuth, createUserSession, hashPassword } from '~/utils/auth.server';

interface Env {
  API_KEYS: KVNamespace;
  DASHBOARD_PASSWORD: string;
  SESSION_SECRET: string;
}

export const meta: MetaFunction = () => [{ title: 'Login – HeySalad AI' }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const authed = await checkAuth(request, env);
  if (authed) throw redirect('/dashboard');
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const formData = await request.formData();
  const password = String(formData.get('password') ?? '');

  const expectedHash = await hashPassword(env.DASHBOARD_PASSWORD ?? '');
  const inputHash = await hashPassword(password);

  if (inputHash !== expectedHash) {
    return json({ error: 'Incorrect password.' }, { status: 401 });
  }

  throw await createUserSession(request, env.SESSION_SECRET, '/dashboard');
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          background: '#111118',
          border: '1px solid #222230',
          borderRadius: '12px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
            }}
          >
            🥗
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #ED4C4C, #FF6B6B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 0.5rem',
            }}
          >
            HeySalad AI
          </h1>
          <p style={{ color: '#8888aa', fontSize: '0.9rem', margin: 0 }}>
            Sign in to your dashboard
          </p>
        </div>

        <Form method="post">
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                color: '#ccccdd',
                fontSize: '0.85rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
              }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#0a0a0f',
                border: actionData?.error ? '1px solid #ef4444' : '1px solid #222230',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {actionData?.error && (
              <p
                style={{
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  marginTop: '0.4rem',
                  margin: '0.4rem 0 0',
                }}
              >
                {actionData.error}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </Form>

        <p
          style={{
            textAlign: 'center',
            color: '#555566',
            fontSize: '0.8rem',
            marginTop: '1.5rem',
          }}
        >
          <a href="/" style={{ color: '#6ee7b7', textDecoration: 'none' }}>
            ← Back to home
          </a>
        </p>
      </div>
    </div>
  );
}
