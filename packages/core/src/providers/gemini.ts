import { BaseProvider } from './base';
import type {
  AIProvider,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  ProviderConfig,
} from '../types';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      role: 'model';
      parts: Array<{ text: string }>;
    };
    finishReason?: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

/**
 * Google Gemini provider implementation
 * Uses REST API directly for Cloudflare edge compatibility
 */
export class GeminiProvider extends BaseProvider {
  readonly provider: AIProvider = 'gemini';
  private readonly baseURL: string;

  constructor(config: ProviderConfig) {
    super(config);
    this.baseURL = config.baseURL || 'https://generativelanguage.googleapis.com/v1beta';
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const model = request.model || 'gemini-2.0-flash';
    const url = `${this.baseURL}/models/${model}:generateContent?key=${this.config.apiKey}`;

    const systemInstruction = request.messages.find(m => m.role === 'system')?.content;
    const geminiMessages: GeminiMessage[] = request.messages
      .filter(msg => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    try {
      const body: Record<string, unknown> = { contents: geminiMessages };
      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
      if (request.temperature !== undefined || request.maxTokens !== undefined) {
        body.generationConfig = {
          ...(request.temperature !== undefined && { temperature: request.temperature }),
          ...(request.maxTokens !== undefined && { maxOutputTokens: request.maxTokens }),
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: { message?: string } };
        throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json() as GeminiResponse;
      const candidate = data.candidates[0];

      return {
        id: `gemini-${Date.now()}`,
        model,
        content: candidate.content.parts[0].text,
        role: 'assistant',
        finishReason: (candidate.finishReason as 'stop' | 'length' | 'tool_calls' | 'error') || 'stop',
        usage: data.usageMetadata ? {
          promptTokens: data.usageMetadata.promptTokenCount,
          completionTokens: data.usageMetadata.candidatesTokenCount,
          totalTokens: data.usageMetadata.totalTokenCount,
        } : undefined,
        metadata: request.metadata,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async *stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk> {
    const model = request.model || 'gemini-2.0-flash';
    const url = `${this.baseURL}/models/${model}:streamGenerateContent?alt=sse&key=${this.config.apiKey}`;

    const systemInstruction = request.messages.find(m => m.role === 'system')?.content;
    const geminiMessages: GeminiMessage[] = request.messages
      .filter(msg => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    try {
      const body: Record<string, unknown> = { contents: geminiMessages };
      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: { message?: string } };
        throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6)) as GeminiResponse;
              const candidate = data.candidates?.[0];
              if (candidate?.content?.parts?.[0]?.text) {
                yield {
                  id: `gemini-${Date.now()}`,
                  model,
                  content: candidate.content.parts[0].text,
                  role: 'assistant',
                  finishReason: candidate.finishReason as 'stop' | 'length' | 'tool_calls' | 'error' | undefined,
                };
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async listModels(): Promise<string[]> {
    return [
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
    ];
  }
}
