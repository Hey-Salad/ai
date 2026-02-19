import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    name: '@heysalad/ai',
    version: '0.1.0',
    description: 'HeySalad AI REST API',
    endpoints: {
      chat: '/api/v1/chat',
      stream: '/api/v1/stream',
      models: '/api/v1/models',
      actions: '/api/v1/actions',
      verify: '/api/v1/verify',
    },
    providers: [
      'openai',
      'anthropic',
      'bedrock',
      'vertex',
      'groq',
      'huggingface',
      'deepseek',
      'mistral',
    ],
    documentation: 'https://ai.heysalad.app/docs',
    github: 'https://github.com/Hey-Salad/ai',
    npm: 'https://www.npmjs.com/package/@heysalad/ai',
  });
}
