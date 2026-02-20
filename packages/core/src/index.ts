/**
 * @heysalad/ai
 * Unified AI provider interface for workflow automation
 */

export { HeySaladAI, createClient } from './client';
export { ActionRegistry, createDefaultActionRegistry } from './actions';
export * from './types';
export * from './providers';
export * from './cheri-ml';

// Re-export for convenience
export type {
  AIProvider,
  AIModel,
  Message,
  ChatCompletionRequest,
  ChatCompletionResponse,
  Tool,
  ToolCall,
  StreamChunk,
  Action,
  ActionType,
  WorkflowContext,
  VerificationRequest,
  VerificationResponse,
  ProviderConfig,
  AIProviderInterface
} from './types';
