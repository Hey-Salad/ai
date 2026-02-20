import { BaseProvider } from './base';
import type {
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
      parts: Array<{
        text: string;
        thoughtSignature?: string;
      }>;
    };
    finishReason?: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
    thoughtsTokenCount?: number;
  };
}

/**
 * Google Gemini provider implementation
 * Supports Gemini 3 models with extended thinking capability
 */
export class GeminiProvider extends BaseProvider {
  private readonly baseURL: string;

  constructor(config: ProviderConfig) {
    super(config);
    this.baseURL = config.baseURL || 'https://generativelanguage.googleapis.com/v1beta';
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const url = `${this.baseURL}/models/${request.model}:generateContent?key=${this.config.apiKey}`;

    const geminiMessages: GeminiMessage[] = request.messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const candidate = data.candidates[0];

      return {
        id: `gemini-${Date.now()}`,
        model: request.model,
        content: candidate.content.parts[0].text,
        role: 'assistant',
        finishReason: candidate.finishReason || 'stop',
        usage: data.usageMetadata
          ? {
              promptTokens: data.usageMetadata.promptTokenCount,
              completionTokens: data.usageMetadata.candidatesTokenCount,
              totalTokens: data.usageMetadata.totalTokenCount,
            }
          : undefined,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async *stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk> {
    const url = `${this.baseURL}/models/${request.model}:streamGenerateContent?alt=sse&key=${this.config.apiKey}`;

    const geminiMessages: GeminiMessage[] = request.messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

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
              const data: GeminiResponse = JSON.parse(line.slice(6));
              const candidate = data.candidates?.[0];

              if (candidate?.content?.parts?.[0]?.text) {
                yield {
                  id: `gemini-${Date.now()}`,
                  model: request.model,
                  content: candidate.content.parts[0].text,
                  role: 'assistant',
                  finishReason: candidate.finishReason,
                };
              }
            } catch (e) {
              // Skip invalid JSON
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
      'gemini-3.1-pro-preview',
      'gemini-3-flash-preview',
      'gemini-3-pro-preview',
      'gemini-2.5-flash',
      'gemini-2.5-pro',
    ];
  }
}
