import {
  AIProvider,
  ProviderConfig,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  AIProviderInterface
} from './types';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { HuggingFaceProvider } from './providers/huggingface';
import { ActionRegistry, createDefaultActionRegistry } from './actions';

/**
 * Main client for HeySalad AI
 * Supports multiple providers with a unified interface
 */
export class HeySaladAI {
  private providers: Map<AIProvider, AIProviderInterface> = new Map();
  private defaultProvider?: AIProvider;
  public actions: ActionRegistry;

  constructor() {
    this.actions = createDefaultActionRegistry();
  }

  /**
   * Configure a provider
   */
  configureProvider(provider: AIProvider, config: ProviderConfig): void {
    let providerInstance: AIProviderInterface;

    switch (provider) {
      case 'openai':
        providerInstance = new OpenAIProvider(config);
        break;
      case 'anthropic':
        providerInstance = new AnthropicProvider(config);
        break;
      case 'huggingface':
        providerInstance = new HuggingFaceProvider(config);
        break;
      case 'bedrock':
      case 'vertex':
      case 'deepseek':
      case 'mistral':
      case 'groq':
        throw new Error(`Provider '${provider}' is not yet implemented. Coming soon!`);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    this.providers.set(provider, providerInstance);

    // Set as default if it's the first provider
    if (!this.defaultProvider) {
      this.defaultProvider = provider;
    }
  }

  /**
   * Set the default provider
   */
  setDefaultProvider(provider: AIProvider): void {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider '${provider}' is not configured`);
    }
    this.defaultProvider = provider;
  }

  /**
   * Get a configured provider instance
   */
  getProvider(provider?: AIProvider): AIProviderInterface {
    const targetProvider = provider || this.defaultProvider;

    if (!targetProvider) {
      throw new Error('No provider specified and no default provider set');
    }

    const providerInstance = this.providers.get(targetProvider);
    if (!providerInstance) {
      throw new Error(`Provider '${targetProvider}' is not configured`);
    }

    return providerInstance;
  }

  /**
   * Send a chat completion request
   */
  async chat(request: ChatCompletionRequest, provider?: AIProvider): Promise<ChatCompletionResponse> {
    return await this.getProvider(provider).chat(request);
  }

  /**
   * Stream a chat completion request
   */
  async *stream(request: ChatCompletionRequest, provider?: AIProvider): AsyncIterableIterator<StreamChunk> {
    yield* this.getProvider(provider).stream(request);
  }

  /**
   * List available models for a provider
   */
  async listModels(provider?: AIProvider): Promise<string[]> {
    return await this.getProvider(provider).listModels();
  }

  /**
   * List all configured providers
   */
  listProviders(): AIProvider[] {
    return Array.from(this.providers.keys());
  }
}

/**
 * Create a new HeySalad AI client
 */
export const createClient = (): HeySaladAI => {
  return new HeySaladAI();
};
