/**
 * CheriML API Endpoint - Generate Component (T2)
 * POST /api/cheriml/generate-component
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
      componentName,
      framework = 'react',
      props = [],
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

    const prompt = `Generate a ${framework} component in ${language} with the following specifications:

Title: ${title}
Description: ${description}
Component Name: ${componentName || title}
Framework: ${framework}
${props.length > 0 ? `Props: ${JSON.stringify(props, null, 2)}` : ''}

Requirements:
${constraints.map((c: string) => `- ${c}`).join('\n')}

Acceptance Criteria:
${acceptanceCriteria.map((a: string) => `- ${a}`).join('\n')}

Please generate a complete, production-ready ${framework} component. Include:
1. Full component implementation
2. TypeScript interfaces for props
3. JSDoc comments
4. Accessibility attributes
5. Example usage

Output ONLY the code in a markdown code block.`;

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
    const code = codeMatch ? codeMatch[1].trim() : generatedText;

    const result = {
      id: `t2-${Date.now()}`,
      taskType: 'T2_GENERATE_COMPONENT',
      status: 'success',
      output: {
        code,
        summary: `Generated ${framework} component: ${componentName || title}`,
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
        'Review generated component',
        'Add styles/CSS',
        'Test with different props',
        'Add to component library',
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
