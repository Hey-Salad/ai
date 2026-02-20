import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { destroyUserSession } from '~/utils/auth.server';

interface Env {
  API_KEYS: KVNamespace;
  DASHBOARD_PASSWORD: string;
  SESSION_SECRET: string;
}

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  return destroyUserSession(request, env.SESSION_SECRET);
}

export async function loader() {
  return new Response(null, { status: 404 });
}
