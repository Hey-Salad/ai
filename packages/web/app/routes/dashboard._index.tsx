import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { requireAuth } from '~/utils/auth.server';
import { createKey, listKeys, revokeKey, type ApiKeyPublic } from '~/utils/keys.server';

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
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#e0e0f0',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          minHeight: '100vh',
          background: '#111118',
          borderRight: '1px solid #222230',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 0',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '0 1.25rem 1.5rem',
            borderBottom: '1px solid #222230',
            marginBottom: '1rem',
          }}
        >
          <a
            href="/"
            style={{
              fontSize: '1.1rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
            HeySalad AI
          </a>
          <div style={{ fontSize: '0.7rem', color: '#555566', marginTop: '0.25rem' }}>
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
              style={{
                display: 'block',
                padding: '0.6rem 0.75rem',
                borderRadius: '6px',
                color: active ? '#6ee7b7' : '#8888aa',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: active ? '600' : '400',
                background: active ? 'rgba(110,231,183,0.08)' : 'transparent',
                marginBottom: '0.25rem',
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #222230' }}>
          <Form method="post" action="/auth/logout">
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                color: '#555566',
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>API Keys</h1>
            <p style={{ color: '#8888aa', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Manage your API keys and client secrets
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
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
            style={{
              background: '#0d1f1a',
              border: '1px solid #10b981',
              borderRadius: '10px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <p
              style={{
                color: '#6ee7b7',
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
        <div
          style={{
            background: '#111118',
            border: '1px solid #222230',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {keys.length === 0 ? (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                color: '#555566',
                fontSize: '0.9rem',
              }}
            >
              No API keys yet. Generate one to get started.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222230' }}>
                  {['Name', 'Key', 'Created', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        color: '#555566',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr
                    key={k.id}
                    style={{ borderBottom: '1px solid #1a1a28' }}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', fontWeight: '500' }}>
                      {k.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <code
                        style={{
                          fontSize: '0.8rem',
                          color: '#8888aa',
                          background: '#0a0a0f',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {k.key.slice(0, 18)}...
                      </code>
                    </td>
                    <td
                      style={{
                        padding: '0.85rem 1rem',
                        color: '#555566',
                        fontSize: '0.8rem',
                      }}
                    >
                      {new Date(k.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Form method="post">
                        <input type="hidden" name="intent" value="revoke" />
                        <input type="hidden" name="id" value={k.id} />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          style={{
                            background: 'none',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            padding: '0.25rem 0.75rem',
                            cursor: 'pointer',
                          }}
                        >
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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#111118',
              border: '1px solid #222230',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '440px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem' }}>Generate New API Key</h2>
            <p style={{ color: '#8888aa', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
              Give your key a memorable name (e.g. "Production App").
            </p>

            <Form
              method="post"
              onSubmit={() => setShowModal(false)}
            >
              <input type="hidden" name="intent" value="create" />
              <label
                htmlFor="keyName"
                style={{
                  display: 'block',
                  color: '#ccccdd',
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
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  background: '#0a0a0f',
                  border: '1px solid #222230',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  marginBottom: '1.25rem',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.7rem',
                    background: 'none',
                    border: '1px solid #222230',
                    borderRadius: '8px',
                    color: '#8888aa',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '0.7rem',
                    background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
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
    <div
      style={{
        background: '#111118',
        border: '1px solid #222230',
        borderRadius: '10px',
        padding: '1.25rem',
      }}
    >
      <div style={{ color: '#555566', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{label}</div>
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
      <div style={{ color: '#8888aa', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <code
          style={{
            flex: 1,
            background: '#0a0a0f',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: '#6ee7b7',
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
            background: '#1a2a22',
            border: '1px solid #10b981',
            borderRadius: '6px',
            color: '#6ee7b7',
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
