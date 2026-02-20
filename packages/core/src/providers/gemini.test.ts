import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiProvider } from './gemini';

describe('GeminiProvider', () => {
  let provider: GeminiProvider;

  beforeEach(() => {
    provider = new GeminiProvider({
      apiKey: 'test-api-key',
    });
  });

  describe('chat', () => {
    it('should make a successful chat completion request', async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              role: 'model',
              parts: [{ text: 'Hello! How can I help you?' }],
            },
            finishReason: 'STOP',
          },
        ],
        usageMetadata: {
          promptTokenCount: 5,
          candidatesTokenCount: 10,
          totalTokenCount: 15,
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await provider.chat({
        model: 'gemini-3-flash-preview',
        messages: [{ role: 'user', content: 'Hello' }],
      });

      expect(response.content).toBe('Hello! How can I help you?');
      expect(response.role).toBe('assistant');
      expect(response.usage?.totalTokens).toBe(15);
    });

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({
          error: { message: 'Rate limit exceeded' },
        }),
      });

      await expect(
        provider.chat({
          model: 'gemini-3-flash-preview',
          messages: [{ role: 'user', content: 'Hello' }],
        })
      ).rejects.toThrow('Rate limit exceeded');
    });

    it('should convert message roles correctly', async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              role: 'model',
              parts: [{ text: 'Response' }],
            },
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await provider.chat({
        model: 'gemini-3-flash-preview',
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi' },
          { role: 'user', content: 'How are you?' },
        ],
      });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.contents[0].role).toBe('user');
      expect(body.contents[1].role).toBe('model');
      expect(body.contents[2].role).toBe('user');
    });
  });

  describe('stream', () => {
    it('should stream chat completion chunks', async () => {
      const mockChunks = [
        'data: {"candidates":[{"content":{"role":"model","parts":[{"text":"Hello"}]}}]}\n',
        'data: {"candidates":[{"content":{"role":"model","parts":[{"text":" there"}]}}]}\n',
        'data: {"candidates":[{"content":{"role":"model","parts":[{"text":"!"}]},"finishReason":"STOP"}]}\n',
      ];

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          mockChunks.forEach((chunk) => {
            controller.enqueue(encoder.encode(chunk));
          });
          controller.close();
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        body: stream,
      });

      const chunks: string[] = [];
      for await (const chunk of provider.stream({
        model: 'gemini-3-flash-preview',
        messages: [{ role: 'user', content: 'Hello' }],
      })) {
        chunks.push(chunk.content);
      }

      expect(chunks).toEqual(['Hello', ' there', '!']);
    });

    it('should handle streaming errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          error: { message: 'Internal server error' },
        }),
      });

      const stream = provider.stream({
        model: 'gemini-3-flash-preview',
        messages: [{ role: 'user', content: 'Hello' }],
      });

      await expect(stream.next()).rejects.toThrow('Internal server error');
    });
  });

  describe('listModels', () => {
    it('should return list of supported models', async () => {
      const models = await provider.listModels();

      expect(models).toContain('gemini-3-flash-preview');
      expect(models).toContain('gemini-3.1-pro-preview');
      expect(models).toContain('gemini-3-pro-preview');
      expect(models).toContain('gemini-2.5-flash');
      expect(models).toContain('gemini-2.5-pro');
    });
  });

  describe('configuration', () => {
    it('should use custom base URL if provided', () => {
      const customProvider = new GeminiProvider({
        apiKey: 'test-key',
        baseURL: 'https://custom.api.com',
      });

      expect((customProvider as any).baseURL).toBe('https://custom.api.com');
    });

    it('should use default base URL if not provided', () => {
      expect((provider as any).baseURL).toBe(
        'https://generativelanguage.googleapis.com/v1beta'
      );
    });
  });
});
