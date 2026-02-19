import {
  AIProvider,
  AIProviderInterface,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  ProviderConfig
} from '../types';

/**
 * Base abstract class for AI providers
 * All provider implementations should extend this class
 */
export abstract class BaseProvider implements AIProviderInterface {
  abstract readonly provider: AIProvider;
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  abstract stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk>;
  abstract listModels(): Promise<string[]>;

  protected handleError(error: any): never {
    throw new Error(`[${this.provider}] ${error.message || 'Unknown error'}`);
  }
}
