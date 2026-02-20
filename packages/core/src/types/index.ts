/**
 * Core types for HeySalad AI
 */

export type AIProvider =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'bedrock'
  | 'vertex'
  | 'huggingface'
  | 'deepseek'
  | 'mistral'
  | 'groq';

export type AIModel = string;

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: AIModel;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: Tool[];
  metadata?: Record<string, any>;
}

export interface ChatCompletionResponse {
  id: string;
  model: string;
  content: string;
  role?: 'assistant';
  finishReason: 'stop' | 'length' | 'tool_calls' | 'error';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  toolCalls?: ToolCall[];
  metadata?: Record<string, any>;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface StreamChunk {
  id: string;
  model: string;
  content: string;
  role: 'assistant';
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'error';
}

/**
 * Action system for workflow automation
 */
export type ActionType =
  | 'chat'
  | 'voice'
  | 'sms'
  | 'email'
  | 'verify'
  | 'webhook'
  | 'custom';

export interface Action {
  type: ActionType;
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}

export interface WorkflowContext {
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
  actions: Action[];
}

/**
 * Security & verification types
 */
export interface VerificationRequest {
  method: 'passkey' | 'otp' | 'sso';
  identifier: string; // email, phone, etc.
  metadata?: Record<string, any>;
}

export interface VerificationResponse {
  verificationId: string;
  url: string;
  expiresAt: Date;
  status: 'pending' | 'verified' | 'expired';
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  apiKey: string;
  baseURL?: string;
  defaultModel?: string;
  timeout?: number;
  retries?: number;
  metadata?: Record<string, any>;
}

export interface AIProviderInterface {
  readonly provider: AIProvider;
  chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk>;
  listModels(): Promise<string[]>;
}
