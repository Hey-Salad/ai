/**
 * CheriML HuggingFace Health Check Endpoint
 * GET /api/cheriml-hf/health
 */

interface Env {
  HUGGINGFACE_API_KEY: string;
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const health = {
    status: 'healthy',
    service: 'CheriML HuggingFace API',
    version: '0.2.0',
    timestamp: new Date().toISOString(),
    model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    endpoints: {
      'POST /api/cheriml-hf/generate-function': 'Generate functions (T1)',
      'POST /api/cheriml-hf/generate-component': 'Generate components (T2)',
      'POST /api/cheriml-hf/generate-test': 'Generate tests (T3)',
      'POST /api/cheriml-hf/generate-endpoint': 'Generate API endpoints (T4)',
    },
    configuration: {
      huggingfaceApiKey: env.HUGGINGFACE_API_KEY ? 'configured' : 'missing',
    },
  };

  return new Response(JSON.stringify(health, null, 2), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
