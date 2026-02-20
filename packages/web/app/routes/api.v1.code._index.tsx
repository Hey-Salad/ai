/**
 * CheriML Code Generation API
 * Main endpoint for all code generation tasks (T1-T4)
 */

import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { createClient, createCheriML } from '@heysalad/ai';
import type {
  CodeGenerationRequest,
  GenerateFunctionRequest,
  GenerateComponentRequest,
  GenerateTestSuiteRequest,
  GenerateAPIEndpointRequest,
} from '@heysalad/ai';

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { taskType, ...taskRequest } = body as CodeGenerationRequest & { taskType: string };

    // Validate request
    if (!taskType) {
      return json({ error: 'taskType is required' }, { status: 400 });
    }

    // Get API keys from environment
    const env = context.cloudflare.env as any;
    const geminiApiKey = env.GEMINI_API_KEY;
    const anthropicApiKey = env.ANTHROPIC_API_KEY;
    const openaiApiKey = env.OPENAI_API_KEY;

    // Check if at least one API key is configured
    if (!geminiApiKey && !anthropicApiKey && !openaiApiKey) {
      return json(
        { error: 'No AI provider API keys configured' },
        { status: 500 }
      );
    }

    // Create AI client
    const client = createClient();

    // Configure providers (prioritize Gemini for code generation)
    if (geminiApiKey) {
      client.configureProvider('gemini', {
        apiKey: geminiApiKey,
        defaultModel: 'gemini-2.0-flash',
      });
    }
    if (anthropicApiKey) {
      client.configureProvider('anthropic', {
        apiKey: anthropicApiKey,
        defaultModel: 'claude-sonnet-4.5',
      });
    }
    if (openaiApiKey) {
      client.configureProvider('openai', {
        apiKey: openaiApiKey,
        defaultModel: 'gpt-4-turbo',
      });
    }

    // Create CheriML client
    const cheriML = createCheriML(client, 'gemini', 'gemini-2.0-flash');

    // Route to appropriate task
    let result;
    switch (taskType) {
      case 'T1_GENERATE_FUNCTION':
        result = await cheriML.generateFunction(taskRequest as GenerateFunctionRequest);
        break;

      case 'T2_GENERATE_COMPONENT':
        result = await cheriML.generateComponent(taskRequest as GenerateComponentRequest);
        break;

      case 'T3_GENERATE_TEST_SUITE':
        result = await cheriML.generateTestSuite(taskRequest as GenerateTestSuiteRequest);
        break;

      case 'T4_GENERATE_API_ENDPOINT':
        result = await cheriML.generateAPIEndpoint(taskRequest as GenerateAPIEndpointRequest);
        break;

      default:
        return json({ error: `Unknown task type: ${taskType}` }, { status: 400 });
    }

    return json(result);
  } catch (error: any) {
    console.error('CheriML API error:', error);
    return json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function loader() {
  return json({
    name: 'CheriML Code Generation API',
    version: '1.0.0',
    description: 'AI-powered code generation with atomic tasks T1-T4',
    endpoints: {
      POST: '/api/v1/code',
    },
    tasks: [
      {
        type: 'T1_GENERATE_FUNCTION',
        description: 'Generate a production-ready function from specifications',
      },
      {
        type: 'T2_GENERATE_COMPONENT',
        description: 'Generate UI component (React, Vue, Angular, Svelte)',
      },
      {
        type: 'T3_GENERATE_TEST_SUITE',
        description: 'Generate comprehensive test suite with coverage',
      },
      {
        type: 'T4_GENERATE_API_ENDPOINT',
        description: 'Generate RESTful API endpoint with validation',
      },
    ],
    example: {
      taskType: 'T1_GENERATE_FUNCTION',
      id: 'task-123',
      title: 'Generate isPrime function',
      description: 'Create a function that checks if a number is prime',
      context: {
        language: 'typescript',
      },
      requirements: {
        constraints: ['Must be efficient', 'Handle edge cases'],
        acceptanceCriteria: ['Returns boolean', 'Works for all integers'],
      },
      config: {
        verbose: false,
        dryRun: false,
      },
    },
  });
}
