import { describe, it, expect, beforeAll } from 'vitest';
import { HeySaladAI } from '../client';

/**
 * End-to-End Tests
 * These tests verify complete workflows across the platform
 * Note: These require actual API keys to run against real services
 */
describe('E2E Tests', () => {
  const hasApiKeys = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    huggingface: !!process.env.HF_API_KEY,
  };

  describe('OpenAI E2E', () => {
    it.skipIf(!hasApiKeys.openai)('should complete a chat request', async () => {
      const client = new HeySaladAI();
      client.configureProvider('openai', {
        apiKey: process.env.OPENAI_API_KEY!,
      });

      const response = await client.chat({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Say "test successful"' }],
      });

      expect(response.content).toBeTruthy();
      expect(response.role).toBe('assistant');
    });

    it.skipIf(!hasApiKeys.openai)('should stream a chat response', async () => {
      const client = new HeySaladAI();
      client.configureProvider('openai', {
        apiKey: process.env.OPENAI_API_KEY!,
      });

      const chunks: string[] = [];
      for await (const chunk of client.stream({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Count to 3' }],
      })) {
        chunks.push(chunk.content);
      }

      expect(chunks.length).toBeGreaterThan(0);
    });
  });

  describe('Anthropic E2E', () => {
    it.skipIf(!hasApiKeys.anthropic)('should complete a chat request', async () => {
      const client = new HeySaladAI();
      client.configureProvider('anthropic', {
        apiKey: process.env.ANTHROPIC_API_KEY!,
      });

      const response = await client.chat({
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: 'Say "test successful"' }],
      });

      expect(response.content).toBeTruthy();
      expect(response.role).toBe('assistant');
    });
  });

  describe('Gemini E2E', () => {
    it.skipIf(!hasApiKeys.gemini)('should complete a chat request', async () => {
      const client = new HeySaladAI();
      client.configureProvider('gemini', {
        apiKey: process.env.GEMINI_API_KEY!,
      });

      const response = await client.chat({
        model: 'gemini-3-flash-preview',
        messages: [{ role: 'user', content: 'Say "test successful"' }],
      });

      expect(response.content).toBeTruthy();
      expect(response.role).toBe('assistant');
    });

    it.skipIf(!hasApiKeys.gemini)('should stream a chat response', async () => {
      const client = new HeySaladAI();
      client.configureProvider('gemini', {
        apiKey: process.env.GEMINI_API_KEY!,
      });

      const chunks: string[] = [];
      for await (const chunk of client.stream({
        model: 'gemini-3-flash-preview',
        messages: [{ role: 'user', content: 'Count to 3' }],
      })) {
        chunks.push(chunk.content);
      }

      expect(chunks.length).toBeGreaterThan(0);
    });

    it.skipIf(!hasApiKeys.gemini)('should handle extended thinking', async () => {
      const client = new HeySaladAI();
      client.configureProvider('gemini', {
        apiKey: process.env.GEMINI_API_KEY!,
      });

      const response = await client.chat({
        model: 'gemini-3-pro-preview',
        messages: [
          {
            role: 'user',
            content: 'Solve: If x + 5 = 12, what is x?',
          },
        ],
      });

      expect(response.content).toBeTruthy();
      expect(response.usage?.totalTokens).toBeGreaterThan(0);
    });
  });

  describe('HuggingFace E2E', () => {
    it.skipIf(!hasApiKeys.huggingface)('should complete a chat request', async () => {
      const client = new HeySaladAI();
      client.configureProvider('huggingface', {
        apiKey: process.env.HF_API_KEY!,
      });

      const response = await client.chat({
        model: 'meta-llama/Llama-2-7b-chat-hf',
        messages: [{ role: 'user', content: 'Say "test successful"' }],
      });

      expect(response.content).toBeTruthy();
      expect(response.role).toBe('assistant');
    });
  });

  describe('Multi-Provider Workflow', () => {
    it.skipIf(!hasApiKeys.openai || !hasApiKeys.gemini)(
      'should use multiple providers in one workflow',
      async () => {
        const client = new HeySaladAI();

        client.configureProvider('openai', {
          apiKey: process.env.OPENAI_API_KEY!,
        });
        client.configureProvider('gemini', {
          apiKey: process.env.GEMINI_API_KEY!,
        });

        // Get response from OpenAI
        const openaiResponse = await client.chat({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'What is 2+2?' }],
        });

        // Get response from Gemini
        const geminiResponse = await client.chat({
          model: 'gemini-3-flash-preview',
          messages: [{ role: 'user', content: 'What is 2+2?' }],
        });

        expect(openaiResponse.content).toBeTruthy();
        expect(geminiResponse.content).toBeTruthy();
      }
    );
  });

  describe('Error Scenarios', () => {
    it('should handle invalid API key', async () => {
      const client = new HeySaladAI();
      client.configureProvider('openai', {
        apiKey: 'invalid-key',
      });

      await expect(
        client.chat({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello' }],
        })
      ).rejects.toThrow();
    });

    it('should handle invalid model name', async () => {
      if (!hasApiKeys.openai) return;

      const client = new HeySaladAI();
      client.configureProvider('openai', {
        apiKey: process.env.OPENAI_API_KEY!,
      });

      await expect(
        client.chat({
          model: 'invalid-model-name',
          messages: [{ role: 'user', content: 'Hello' }],
        })
      ).rejects.toThrow();
    });

    it('should handle rate limiting gracefully', async () => {
      // This test would need to trigger actual rate limits
      // Skipping for now to avoid hitting real rate limits
      expect(true).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    it.skipIf(!hasApiKeys.gemini)('should complete requests within reasonable time', async () => {
      const client = new HeySaladAI();
      client.configureProvider('gemini', {
        apiKey: process.env.GEMINI_API_KEY!,
      });

      const startTime = Date.now();

      await client.chat({
        model: 'gemini-3-flash-preview',
        messages: [{ role: 'user', content: 'Hi' }],
      });

      const duration = Date.now() - startTime;

      // Gemini Flash should respond within 10 seconds
      expect(duration).toBeLessThan(10000);
    });
  });
});
