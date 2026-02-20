import OpenAI from 'openai';
import { BaseProvider } from './base';
import {
  AIProvider,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  ProviderConfig,
  Message
} from '../types';

export class OpenAIProvider extends BaseProvider {
  readonly provider: AIProvider = 'openai';
  private client: OpenAI;

  constructor(config: ProviderConfig) {
    super(config);
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: config.timeout,
      maxRetries: config.retries,
    });
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: request.model,
        messages: request.messages as any,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        stream: false,
      });

      const choice = response.choices[0];

      return {
        id: response.id,
        model: response.model,
        content: choice.message.content || '',
        finishReason: this.mapFinishReason(choice.finish_reason),
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
        metadata: request.metadata,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async *stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk> {
    try {
      const stream = await this.client.chat.completions.create({
        model: request.model,
        messages: request.messages as any,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        const finishReason = chunk.choices[0]?.finish_reason;

        yield {
          id: chunk.id || `openai-${Date.now()}`,
          model: chunk.model || request.model,
          content: delta,
          role: 'assistant',
          finishReason: finishReason ? this.mapFinishReason(finishReason) : undefined,
        };
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await this.client.models.list();
      return response.data.map(model => model.id);
    } catch (error) {
      this.handleError(error);
    }
  }

  private mapFinishReason(reason: string | null): 'stop' | 'length' | 'tool_calls' | 'error' {
    switch (reason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      case 'tool_calls':
        return 'tool_calls';
      default:
        return 'stop';
    }
  }
}
