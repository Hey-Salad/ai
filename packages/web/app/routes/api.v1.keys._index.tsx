import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { checkAuth } from '~/utils/auth.server';
import { createKey, listKeys, revokeKey } from '~/utils/keys.server';

interface Env {
  API_KEYS: KVNamespace;
  DASHBOARD_PASSWORD: string;
  SESSION_SECRET: string;
}

async function enforceAuth(request: Request, env: Env): Promise<Response | null> {
  const authed = await checkAuth(request, env);
  if (!authed) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const denied = await enforceAuth(request, env);
  if (denied) return denied;

  const keys = await listKeys(env.API_KEYS);
  return json({ keys });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const denied = await enforceAuth(request, env);
  if (denied) return denied;

  if (request.method === 'POST') {
    const body = await request.json<{ name?: string }>();
    const name = body?.name?.trim();
    if (!name) return json({ error: 'name is required' }, { status: 400 });
    const newKey = await createKey(env.API_KEYS, name);
    return json({ key: newKey }, { status: 201 });
  }

  if (request.method === 'DELETE') {
    const body = await request.json<{ id?: string }>();
    const id = body?.id;
    if (!id) return json({ error: 'id is required' }, { status: 400 });
    await revokeKey(env.API_KEYS, id);
    return json({ revoked: true });
  }

  return json({ error: 'Method not allowed' }, { status: 405 });
}
