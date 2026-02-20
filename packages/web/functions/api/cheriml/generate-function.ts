/**
 * CheriML API Endpoint - Generate Function (T1)
 * POST /api/cheriml/generate-function
 */

interface Env {
  GEMINI_API_KEY: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
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

    // Validate required fields
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

    // Check for API key
    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY not configured',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build prompt
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

Please generate a complete, production-ready function that meets all requirements. Include:
1. Full implementation with error handling
2. JSDoc comments explaining parameters and return value
3. Type annotations (if applicable)
4. Example usage in comments

Output ONLY the code in a markdown code block.`;

    // Call Gemini 3 API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      return new Response(
        JSON.stringify({
          error: `Gemini API error: ${geminiResponse.status}`,
          details: error,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract code from markdown
    const codeMatch = generatedText.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : generatedText;

    // Build response
    const result = {
      id: `t1-${Date.now()}`,
      taskType: 'T1_GENERATE_FUNCTION',
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
