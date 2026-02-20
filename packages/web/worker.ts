import { createRequestHandler } from '@remix-run/cloudflare';
import * as serverBuild from './build/server/index.js';

// @ts-ignore
const handleRequest = createRequestHandler(serverBuild);

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, { cloudflare: { env, ctx } });
  },
};
