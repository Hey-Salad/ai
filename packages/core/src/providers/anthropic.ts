import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './base';
import {
  AIProvider,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  ProviderConfig,
  Message
} from '../types';

export class AnthropicProvider extends BaseProvider {
  readonly provider: AIProvider = 'anthropic';
  private client: Anthropic;

  constructor(config: ProviderConfig) {
    super(config);
    this.client = new Anthropic({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: config.timeout,
      maxRetries: config.retries,
    });
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const { system, messages } = this.formatMessages(request.messages);

      const response = await this.client.messages.create({
        model: request.model,
        system,
        messages: messages as any,
        temperature: request.temperature,
        max_tokens: request.maxTokens || 4096,
        stream: false,
      });

      const content = response.content
        .filter(block => block.type === 'text')
        .map(block => (block as any).text)
        .join('');

      return {
        id: response.id,
        model: response.model,
        content,
        finishReason: this.mapFinishReason(response.stop_reason),
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        metadata: request.metadata,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async *stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk> {
    try {
      const { system, messages } = this.formatMessages(request.messages);

      const stream = await this.client.messages.create({
        model: request.model,
        system,
        messages: messages as any,
        temperature: request.temperature,
        max_tokens: request.maxTokens || 4096,
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield {
            id: `anthropic-${Date.now()}`,
            model: request.model,
            content: event.delta.text,
            role: 'assistant',
          };
        } else if (event.type === 'message_delta') {
          yield {
            id: `anthropic-${Date.now()}`,
            model: request.model,
            content: '',
            role: 'assistant',
            finishReason: this.mapFinishReason(event.delta.stop_reason || null),
          };
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async listModels(): Promise<string[]> {
    // Anthropic doesn't have a models list endpoint, return common models
    return [
      'claude-opus-4-6',
      'claude-sonnet-4-5',
      'claude-sonnet-3-5-20241022',
      'claude-3-5-sonnet-20240620',
      'claude-3-opus-20240229',
      'claude-3-haiku-20240307',
    ];
  }

  private formatMessages(messages: Message[]): {
    system?: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  } {
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    return {
      system: systemMessage?.content,
      messages: conversationMessages,
    };
  }

  private mapFinishReason(reason: string | null): 'stop' | 'length' | 'tool_calls' | 'error' {
    switch (reason) {
      case 'end_turn':
        return 'stop';
      case 'max_tokens':
        return 'length';
      case 'tool_use':
        return 'tool_calls';
      default:
        return 'stop';
    }
  }
}
