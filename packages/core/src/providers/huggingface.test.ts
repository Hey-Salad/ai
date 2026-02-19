import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HuggingFaceProvider } from './huggingface';
import { ChatCompletionRequest } from '../types';

describe('HuggingFaceProvider', () => {
  let provider: HuggingFaceProvider;

  beforeEach(() => {
    provider = new HuggingFaceProvider({
      apiKey: 'test-hf-key',
    });
  });

  describe('constructor', () => {
    it('should create provider with default baseURL', () => {
      expect(provider.provider).toBe('huggingface');
    });

    it('should accept custom baseURL for self-hosted', () => {
      const customProvider = new HuggingFaceProvider({
        apiKey: 'test-key',
        baseURL: 'http://localhost:8000',
      });
      expect(customProvider.provider).toBe('huggingface');
    });
  });

  describe('chat', () => {
    it('should send chat request to Hugging Face API', async () => {
      const mockResponse = [
        { generated_text: 'This is a test response' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const request: ChatCompletionRequest = {
        model: 'meta-llama/Llama-2-7b-chat-hf',
        messages: [
          { role: 'user', content: 'Hello' },
        ],
      };

      const response = await provider.chat(request);

      expect(response.content).toBe('This is a test response');
      expect(response.model).toBe('meta-llama/Llama-2-7b-chat-hf');
      expect(response.finishReason).toBe('stop');
    });

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      const request: ChatCompletionRequest = {
        model: 'meta-llama/Llama-2-7b-chat-hf',
        messages: [
          { role: 'user', content: 'Hello' },
        ],
      };

      await expect(provider.chat(request)).rejects.toThrow();
    });

    it('should include temperature and maxTokens in parameters', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ generated_text: 'response' }],
      });

      const request: ChatCompletionRequest = {
        model: 'meta-llama/Llama-2-7b-chat-hf',
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: 0.9,
        maxTokens: 1024,
      };

      await provider.chat(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"temperature":0.9'),
        })
      );
    });
  });

  describe('listModels', () => {
    it('should return list of popular HF models', async () => {
      const models = await provider.listModels();

      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      expect(models).toContain('meta-llama/Llama-2-7b-chat-hf');
      expect(models).toContain('mistralai/Mistral-7B-Instruct-v0.2');
    });
  });

  describe('createSelfHosted', () => {
    it('should create provider for self-hosted endpoint', () => {
      const selfHosted = HuggingFaceProvider.createSelfHosted({
        endpoint: 'http://localhost:8000',
      });

      expect(selfHosted.provider).toBe('huggingface');
    });

    it('should accept custom timeout and retries', () => {
      const selfHosted = HuggingFaceProvider.createSelfHosted({
        endpoint: 'http://localhost:8000',
        timeout: 60000,
        retries: 5,
      });

      expect(selfHosted).toBeInstanceOf(HuggingFaceProvider);
    });
  });

  describe('message formatting', () => {
    it('should format messages in ChatML format', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ generated_text: 'response' }],
      });

      const request: ChatCompletionRequest = {
        model: 'test-model',
        messages: [
          { role: 'system', content: 'You are a helpful assistant' },
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
          { role: 'user', content: 'How are you?' },
        ],
      };

      await provider.chat(request);

      const callBody = JSON.parse(
        (global.fetch as any).mock.calls[0][1].body
      );

      expect(callBody.inputs).toContain('<|im_start|>system');
      expect(callBody.inputs).toContain('<|im_start|>user');
      expect(callBody.inputs).toContain('<|im_start|>assistant');
    });
  });
});
