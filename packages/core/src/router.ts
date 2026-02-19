/**
 * HeySalad Intelligent Router
 * Routes requests to the optimal provider based on:
 * - Query type (grocery prices → RAG)
 * - Cost optimization
 * - Availability and fallbacks
 * - Performance requirements
 */

import {
  HeySaladAI,
  ChatCompletionRequest,
  ChatCompletionResponse,
  AIProvider
} from './client';

export interface RouterConfig {
  // Primary providers (in order of preference)
  primaryProviders: AIProvider[];

  // Fallback providers
  fallbackProviders?: AIProvider[];

  // Cost optimization
  costOptimization?: boolean;

  // Performance mode ('speed' | 'quality' | 'balanced')
  performanceMode?: 'speed' | 'quality' | 'balanced';

  // Custom routing rules
  customRules?: RoutingRule[];

  // Enable RAG for specific queries
  enableRAG?: boolean;
}

export interface RoutingRule {
  name: string;
  condition: (request: ChatCompletionRequest) => boolean;
  provider: AIProvider;
  priority: number;
}

export interface RoutingDecision {
  provider: AIProvider;
  reason: string;
  estimatedCost: number;
  estimatedLatency: number;
}

/**
 * Intelligent request router
 */
export class HeySaladRouter {
  private client: HeySaladAI;
  private config: RouterConfig;

  // Cost per 1M tokens (approximate)
  private costs: Record<AIProvider, number> = {
    'openai': 2.0,        // GPT-3.5
    'anthropic': 15.0,    // Claude 3
    'huggingface': 0.1,   // Self-hosted HeySalad-7B
    'bedrock': 3.0,
    'vertex': 3.0,
    'groq': 0.1,
    'deepseek': 0.5,
    'mistral': 1.0,
  };

  // Latency estimates (ms)
  private latencies: Record<AIProvider, number> = {
    'openai': 500,
    'anthropic': 800,
    'huggingface': 200,  // Self-hosted is faster!
    'bedrock': 600,
    'vertex': 700,
    'groq': 300,
    'deepseek': 400,
    'mistral': 500,
  };

  constructor(client: HeySaladAI, config: RouterConfig) {
    this.client = client;
    this.config = {
      performanceMode: 'balanced',
      costOptimization: true,
      enableRAG: true,
      ...config
    };
  }

  /**
   * Route a chat request intelligently
   */
  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const decision = this.route(request);

    console.log(`🎯 Routing to ${decision.provider}: ${decision.reason}`);

    try {
      return await this.client.chat(request, decision.provider);
    } catch (error) {
      console.warn(`⚠️  Primary provider ${decision.provider} failed, trying fallback...`);
      return await this.fallback(request, decision.provider);
    }
  }

  /**
   * Determine optimal provider
   */
  private route(request: ChatCompletionRequest): RoutingDecision {
    // Check custom rules first
    if (this.config.customRules) {
      for (const rule of this.config.customRules.sort((a, b) => b.priority - a.priority)) {
        if (rule.condition(request)) {
          return {
            provider: rule.provider,
            reason: `Custom rule: ${rule.name}`,
            estimatedCost: this.costs[rule.provider],
            estimatedLatency: this.latencies[rule.provider]
          };
        }
      }
    }

    // Check if this is a grocery price query (use RAG)
    if (this.config.enableRAG && this.isGroceryQuery(request)) {
      // Use cheapest provider for RAG (HF or self-hosted)
      const provider = this.client.listProviders().includes('huggingface')
        ? 'huggingface'
        : 'openai';

      return {
        provider,
        reason: 'Grocery price query (RAG optimized)',
        estimatedCost: this.costs[provider],
        estimatedLatency: this.latencies[provider]
      };
    }

    // Performance mode routing
    switch (this.config.performanceMode) {
      case 'speed':
        return this.routeForSpeed();

      case 'quality':
        return this.routeForQuality();

      case 'balanced':
      default:
        return this.routeBalanced(request);
    }
  }

  /**
   * Route for maximum speed
   */
  private routeForSpeed(): RoutingDecision {
    // Prefer self-hosted or fast APIs
    const fastProviders: AIProvider[] = ['huggingface', 'groq', 'openai'];

    for (const provider of fastProviders) {
      if (this.client.listProviders().includes(provider)) {
        return {
          provider,
          reason: 'Speed optimized',
          estimatedCost: this.costs[provider],
          estimatedLatency: this.latencies[provider]
        };
      }
    }

    // Fallback to primary
    return this.routeToPrimary();
  }

  /**
   * Route for maximum quality
   */
  private routeForQuality(): RoutingDecision {
    // Prefer best models
    const qualityProviders: AIProvider[] = ['anthropic', 'openai', 'bedrock'];

    for (const provider of qualityProviders) {
      if (this.client.listProviders().includes(provider)) {
        return {
          provider,
          reason: 'Quality optimized',
          estimatedCost: this.costs[provider],
          estimatedLatency: this.latencies[provider]
        };
      }
    }

    return this.routeToPrimary();
  }

  /**
   * Route with balanced approach
   */
  private routeBalanced(request: ChatCompletionRequest): RoutingDecision {
    // Complex queries → quality models
    if (this.isComplexQuery(request)) {
      return this.routeForQuality();
    }

    // Simple queries → fast/cheap models
    if (this.config.costOptimization) {
      // Prefer self-hosted if available (cheapest)
      if (this.client.listProviders().includes('huggingface')) {
        return {
          provider: 'huggingface',
          reason: 'Cost optimized (self-hosted)',
          estimatedCost: this.costs['huggingface'],
          estimatedLatency: this.latencies['huggingface']
        };
      }

      // Otherwise use cheapest API
      const cheapProviders: AIProvider[] = ['openai', 'deepseek', 'mistral'];
      for (const provider of cheapProviders) {
        if (this.client.listProviders().includes(provider)) {
          return {
            provider,
            reason: 'Cost optimized',
            estimatedCost: this.costs[provider],
            estimatedLatency: this.latencies[provider]
          };
        }
      }
    }

    return this.routeToPrimary();
  }

  /**
   * Route to primary provider
   */
  private routeToPrimary(): RoutingDecision {
    const provider = this.config.primaryProviders[0];
    return {
      provider,
      reason: 'Primary provider',
      estimatedCost: this.costs[provider],
      estimatedLatency: this.latencies[provider]
    };
  }

  /**
   * Fallback to alternative provider
   */
  private async fallback(
    request: ChatCompletionRequest,
    failedProvider: AIProvider
  ): Promise<ChatCompletionResponse> {
    const fallbacks = this.config.fallbackProviders || this.config.primaryProviders;

    for (const provider of fallbacks) {
      if (provider === failedProvider) continue;

      try {
        console.log(`🔄 Trying fallback: ${provider}`);
        return await this.client.chat(request, provider);
      } catch (error) {
        console.warn(`⚠️  Fallback ${provider} also failed`);
        continue;
      }
    }

    throw new Error('All providers failed');
  }

  /**
   * Check if query is about grocery prices
   */
  private isGroceryQuery(request: ChatCompletionRequest): boolean {
    const text = request.messages
      .map(m => m.content.toLowerCase())
      .join(' ');

    const groceryKeywords = [
      'price', 'cost', 'grocery', 'store', 'walmart', 'kroger', 'whole foods',
      'milk', 'bread', 'eggs', 'cheese', 'meat', 'chicken', 'beef',
      'produce', 'fruit', 'vegetable', 'banana', 'apple', 'tomato',
      'how much', 'cheapest', 'compare price', 'shopping'
    ];

    return groceryKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Check if query is complex
   */
  private isComplexQuery(request: ChatCompletionRequest): boolean {
    const lastMessage = request.messages[request.messages.length - 1];
    const text = lastMessage.content;

    // Heuristics for complexity
    return (
      text.length > 500 ||                     // Long query
      request.messages.length > 5 ||           // Long conversation
      /code|implement|build|create/.test(text) || // Code generation
      /explain|analyze|compare/.test(text)     // Analysis request
    );
  }

  /**
   * Get routing statistics
   */
  getStats(): Record<AIProvider, { requests: number; errors: number }> {
    // TODO: Implement request tracking
    return {} as any;
  }
}

/**
 * Create a router with smart defaults
 */
export function createRouter(
  client: HeySaladAI,
  options: Partial<RouterConfig> = {}
): HeySaladRouter {
  const defaultConfig: RouterConfig = {
    primaryProviders: ['huggingface', 'openai', 'anthropic'],
    fallbackProviders: ['openai', 'anthropic'],
    costOptimization: true,
    performanceMode: 'balanced',
    enableRAG: true,
    ...options
  };

  return new HeySaladRouter(client, defaultConfig);
}
