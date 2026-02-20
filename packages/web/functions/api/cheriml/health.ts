/**
 * CheriML Health Check Endpoint
 * GET /api/cheriml/health
 */

interface Env {
  GEMINI_API_KEY: string;
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
    service: 'CheriML API',
    version: '0.2.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/cheriml/generate-function': 'Generate functions (T1)',
      'POST /api/cheriml/generate-component': 'Generate components (T2)',
      'POST /api/cheriml/generate-test': 'Generate tests (T3)',
      'POST /api/cheriml/generate-endpoint': 'Generate API endpoints (T4)',
    },
    configuration: {
      geminiApiKey: env.GEMINI_API_KEY ? 'configured' : 'missing',
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
