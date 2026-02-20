/**
 * CheriML HuggingFace API Endpoint - Generate Function (T1)
 * POST /api/cheriml-hf/generate-function
 * Uses Qwen2.5-Coder-32B-Instruct for code generation
 */

interface Env {
  HUGGINGFACE_API_KEY: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      language = 'typescript',
      functionName,
      returnType,
      parameters = [],
      constraints = [],
      acceptanceCriteria = [],
    } = body;

    if (!title || !description) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: title, description',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!env.HUGGINGFACE_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'HUGGINGFACE_API_KEY not configured',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build prompt for code generation
    const prompt = `Generate a ${language} function with the following specifications:

Title: ${title}
Description: ${description}
${functionName ? `Function Name: ${functionName}` : ''}
${returnType ? `Return Type: ${returnType}` : ''}
${parameters.length > 0 ? `Parameters: ${JSON.stringify(parameters)}` : ''}

Requirements:
${constraints.map((c: string) => `- ${c}`).join('\n')}

Acceptance Criteria:
${acceptanceCriteria.map((a: string) => `- ${a}`).join('\n')}

Generate a complete, production-ready function with:
1. Full implementation with error handling
2. JSDoc comments
3. Type annotations
4. Example usage in comments

Output ONLY the code in a markdown code block.`;

    // Call HuggingFace Inference API (new router endpoint)
    const hfResponse = await fetch(
      'https://router.huggingface.co/models/Qwen/Qwen2.5-Coder-7B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2048,
            temperature: 0.3,
            return_full_text: false,
          },
        }),
      }
    );

    if (!hfResponse.ok) {
      const error = await hfResponse.text();
      return new Response(
        JSON.stringify({
          error: `HuggingFace API error: ${hfResponse.status}`,
          details: error,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const hfData = await hfResponse.json();
    const generatedText = Array.isArray(hfData) ? hfData[0]?.generated_text : hfData.generated_text || '';

    // Extract code from markdown
    const codeMatch = generatedText.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : generatedText;

    const result = {
      id: `t1-hf-${Date.now()}`,
      taskType: 'T1_GENERATE_FUNCTION',
      provider: 'huggingface',
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      status: 'success',
      output: {
        code,
        summary: `Generated ${language} function: ${functionName || title}`,
        details: generatedText,
      },
      validation: {
        passed: code.length > 0,
        errors: [],
      },
      metrics: {
        linesChanged: code.split('\n').length,
      },
      nextSteps: [
        'Review generated code',
        'Run tests to verify functionality',
        'Add to appropriate module',
        'Export from index file',
      ],
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
