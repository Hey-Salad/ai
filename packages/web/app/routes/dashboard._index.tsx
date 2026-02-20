import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { requireAuth } from '~/utils/auth.server';
import { createKey, listKeys, revokeKey, type ApiKeyPublic } from '~/utils/keys.server';
import { ThemeToggle } from '~/components/ThemeToggle';

interface Env {
  API_KEYS: KVNamespace;
  DASHBOARD_PASSWORD: string;
  SESSION_SECRET: string;
}

export const meta: MetaFunction = () => [{ title: 'Dashboard – HeySalad AI' }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  await requireAuth(request, env);
  const keys = await listKeys(env.API_KEYS);
  return json({ keys });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  await requireAuth(request, env);

  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');

  if (intent === 'create') {
    const name = String(formData.get('name') ?? '').trim();
    if (!name) return json({ error: 'Key name is required.' }, { status: 400 });
    const newKey = await createKey(env.API_KEYS, name);
    return json({ created: newKey });
  }

  if (intent === 'revoke') {
    const id = String(formData.get('id') ?? '');
    await revokeKey(env.API_KEYS, id);
    return json({ revoked: true });
  }

  return json({ error: 'Unknown action.' }, { status: 400 });
}

type LoaderData = { keys: ApiKeyPublic[] };
type ActionData =
  | { created: { id: string; name: string; key: string; secret: string; createdAt: string; revoked: boolean } }
  | { revoked: boolean }
  | { error: string };

export default function DashboardPage() {
  const { keys } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const isSubmitting = navigation.state === 'submitting';

  // When a key is freshly created, open reveal panel
  const createdKey =
    actionData && 'created' in actionData ? actionData.created : null;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div
          style={{
            padding: '0 1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1rem',
          }}
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>🥗</span>
            <span className="brand-gradient" style={{ fontSize: '0.95rem', fontWeight: '800' }}>
              HeySalad
            </span>
          </a>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Dashboard
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {[
            { label: 'Overview', href: '/dashboard', active: true },
            { label: 'API Keys', href: '/dashboard', active: false },
            { label: 'Models', href: '/models', active: false },
            { label: 'API Docs', href: '/api/v1', active: false },
          ].map(({ label, href, active }) => (
            <a
              key={label}
              href={href}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ThemeToggle />
          <Form method="post" action="/auth/logout">
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: 0,
              }}
            >
              Sign out →
            </button>
          </Form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '900px' }}>
        <div className="flex justify-between" style={{ alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>API Keys</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Manage your API keys and client secrets
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
          >
            + Generate New Key
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard label="Active Keys" value={String(keys.length)} />
          <StatCard label="Total Generated" value={String(keys.length)} />
        </div>

        {/* Newly created key reveal */}
        {createdKey && (
          <div
            className="card"
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid var(--success)',
              marginBottom: '1.5rem',
            }}
          >
            <p
              style={{
                color: 'var(--brand-teal)',
                fontWeight: '600',
                margin: '0 0 0.75rem',
                fontSize: '0.9rem',
              }}
            >
              Key created! Copy your secret now — it will not be shown again.
            </p>

            <KeyRevealRow
              label="API Key"
              value={createdKey.key}
              copiedLabel={copied}
              onCopy={copyToClipboard}
            />
            <KeyRevealRow
              label="Client Secret"
              value={createdKey.secret}
              copiedLabel={copied}
              onCopy={copyToClipboard}
            />
          </div>
        )}

        {/* Keys table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {keys.length === 0 ? (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                fontSize: '0.9rem',
              }}
            >
              No API keys yet. Generate one to get started.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  {['Name', 'Key', 'Created', 'Actions'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id}>
                    <td style={{ fontWeight: '500' }}>{k.name}</td>
                    <td>
                      <code>{k.key.slice(0, 18)}...</code>
                    </td>
                    <td style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                      {new Date(k.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Form method="post">
                        <input type="hidden" name="intent" value="revoke" />
                        <input type="hidden" name="id" value={k.id} />
                        <button type="submit" disabled={isSubmitting} className="btn btn-danger" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                          Revoke
                        </button>
                      </Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Create Key Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem' }}>Generate New API Key</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
              Give your key a memorable name (e.g. "Production App").
            </p>

            <Form method="post" onSubmit={() => setShowModal(false)}>
              <input type="hidden" name="intent" value="create" />
              <label
                htmlFor="keyName"
                style={{
                  display: 'block',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  marginBottom: '0.4rem',
                }}
              >
                Key Name
              </label>
              <input
                id="keyName"
                name="name"
                type="text"
                placeholder="e.g. My App"
                required
                autoFocus
                style={{ marginBottom: '1.25rem' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.7rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.7rem' }}
                >
                  Generate
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{value}</div>
    </div>
  );
}

function KeyRevealRow({
  label,
  value,
  copiedLabel,
  onCopy,
}: {
  label: string;
  value: string;
  copiedLabel: string | null;
  onCopy: (text: string, label: string) => void;
}) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <code
          style={{
            flex: 1,
            background: 'var(--bg-primary)',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: 'var(--brand-teal)',
            wordBreak: 'break-all',
          }}
        >
          {value}
        </code>
        <button
          type="button"
          onClick={() => onCopy(value, label)}
          style={{
            padding: '0.4rem 0.75rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--success)',
            borderRadius: '6px',
            color: 'var(--brand-teal)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {copiedLabel === label ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
