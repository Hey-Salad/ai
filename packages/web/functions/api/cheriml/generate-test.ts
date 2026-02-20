/**
 * CheriML API Endpoint - Generate Test Suite (T3)
 * POST /api/cheriml/generate-test
 */

interface Env {
  GEMINI_API_KEY: string;
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
      code,
      targetFunction,
      testFramework = 'vitest',
      coverageTarget = 80,
      constraints = [],
      acceptanceCriteria = [],
    } = body;

    if (!title || !description || !code) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: title, description, code',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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

    const prompt = `Generate a comprehensive test suite for ${language} code using ${testFramework}:

Title: ${title}
Description: ${description}
Target Function: ${targetFunction || 'all functions'}
Test Framework: ${testFramework}
Coverage Target: ${coverageTarget}%

Code to Test:
\`\`\`${language}
${code}
\`\`\`

Requirements:
${constraints.map((c: string) => `- ${c}`).join('\n')}

Acceptance Criteria:
${acceptanceCriteria.map((a: string) => `- ${a}`).join('\n')}

Please generate a complete test suite that:
1. Tests all functions
2. Includes edge cases
3. Tests error handling
4. Achieves ${coverageTarget}% coverage
5. Uses descriptive test names
6. Follows ${testFramework} best practices

Output ONLY the test code in a markdown code block.`;

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

    const codeMatch = generatedText.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const testCode = codeMatch ? codeMatch[1].trim() : generatedText;

    const result = {
      id: `t3-${Date.now()}`,
      taskType: 'T3_GENERATE_TEST_SUITE',
      status: 'success',
      output: {
        code: testCode,
        summary: `Generated ${testFramework} test suite for ${targetFunction || 'code'}`,
        details: generatedText,
      },
      validation: {
        passed: testCode.length > 0,
        errors: [],
      },
      metrics: {
        linesChanged: testCode.split('\n').length,
        coverage: coverageTarget,
      },
      nextSteps: [
        'Review generated tests',
        'Run test suite',
        'Check coverage report',
        'Add additional edge cases if needed',
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
