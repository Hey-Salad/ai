import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const host = url.hostname;

  // Determine environment based on hostname
  let environment = 'production';
  if (host.includes('ai-dev.')) {
    environment = 'development';
  } else if (host.includes('.staging.')) {
    environment = 'staging';
  }

  return json({
    name: '@heysalad/ai',
    version: '0.1.0',
    description: 'HeySalad AI REST API',
    environment,
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
      'gemini',
      'deepseek',
      'mistral',
    ],
    geminiModels: [
      'gemini-3.1-pro-preview',
      'gemini-3-flash-preview',
      'gemini-3-pro-preview',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-pro',
      'gemini-2.5-flash-image',
    ],
    documentation: 'https://ai.heysalad.app/docs',
    github: 'https://github.com/Hey-Salad/ai',
    npm: 'https://www.npmjs.com/package/@heysalad/ai',
  });
}
