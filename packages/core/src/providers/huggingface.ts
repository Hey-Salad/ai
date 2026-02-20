import { BaseProvider } from './base';
import {
  AIProvider,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  ProviderConfig,
  Message
} from '../types';

/**
 * Hugging Face Provider
 * Supports both Hugging Face Inference API and self-hosted endpoints
 */
export class HuggingFaceProvider extends BaseProvider {
  readonly provider: AIProvider = 'huggingface';
  private apiKey: string;
  private baseURL: string;

  constructor(config: ProviderConfig) {
    super(config);
    this.apiKey = config.apiKey;
    // Default to Hugging Face Router API (OpenAI-compatible), but can be overridden for self-hosted
    this.baseURL = config.baseURL || 'https://router.huggingface.co/v1';
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const endpoint = `${this.baseURL}/chat/completions`;

      const payload = {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 512,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
      }

      const data = await response.json() as any;

      // OpenAI-compatible response format
      const content = data.choices?.[0]?.message?.content || '';
      const usage = data.usage;

      return {
        id: data.id || `hf-${Date.now()}`,
        model: data.model || request.model,
        content: content.trim(),
        finishReason: data.choices?.[0]?.finish_reason || 'stop',
        usage: usage ? {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        } : undefined,
        metadata: request.metadata,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async *stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk> {
    try {
      const endpoint = `${this.baseURL}/${request.model}`;

      const payload = {
        inputs: this.formatMessages(request.messages),
        parameters: {
          temperature: request.temperature ?? 0.7,
          max_new_tokens: request.maxTokens ?? 512,
          return_full_text: false,
        },
        stream: true,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          try {
            const data = JSON.parse(line);
            const delta = data.token?.text || data.generated_text || '';

            if (delta) {
              yield {
                delta,
                finishReason: data.finish_reason ? 'stop' : undefined,
              };
            }
          } catch (e) {
            // Skip invalid JSON lines
            continue;
          }
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async listModels(): Promise<string[]> {
    // For Hugging Face, return popular models
    // In production, you might want to fetch this from your own model registry
    return [
      'meta-llama/Llama-2-7b-chat-hf',
      'meta-llama/Llama-2-13b-chat-hf',
      'meta-llama/Llama-2-70b-chat-hf',
      'meta-llama/Meta-Llama-3-8B-Instruct',
      'meta-llama/Meta-Llama-3-70B-Instruct',
      'mistralai/Mistral-7B-Instruct-v0.2',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'HuggingFaceH4/zephyr-7b-beta',
      'microsoft/phi-2',
      'tiiuae/falcon-7b-instruct',
    ];
  }

  /**
   * Format messages for Hugging Face models
   * Many HF models expect a specific chat template format
   */
  private formatMessages(messages: Message[]): string {
    // Use ChatML format which many models support
    let formatted = '';

    for (const message of messages) {
      switch (message.role) {
        case 'system':
          formatted += `<|im_start|>system\n${message.content}<|im_end|>\n`;
          break;
        case 'user':
          formatted += `<|im_start|>user\n${message.content}<|im_end|>\n`;
          break;
        case 'assistant':
          formatted += `<|im_start|>assistant\n${message.content}<|im_end|>\n`;
          break;
      }
    }

    // Add assistant prompt for response
    formatted += '<|im_start|>assistant\n';

    return formatted;
  }

  /**
   * Create a provider instance for self-hosted endpoint
   */
  static createSelfHosted(config: {
    apiKey?: string;
    endpoint: string;
    timeout?: number;
    retries?: number;
  }): HuggingFaceProvider {
    return new HuggingFaceProvider({
      apiKey: config.apiKey || 'no-key-needed',
      baseURL: config.endpoint,
      timeout: config.timeout,
      retries: config.retries,
    });
  }
}
