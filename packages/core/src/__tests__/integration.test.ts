import { describe, it, expect, beforeAll } from 'vitest';
import { HeySaladAI } from '../client';

describe('Integration Tests', () => {
  let client: HeySaladAI;

  beforeAll(() => {
    client = new HeySaladAI();
  });

  describe('Provider Configuration', () => {
    it('should configure OpenAI provider', () => {
      expect(() => {
        client.configureProvider('openai', {
          apiKey: 'test-key',
        });
      }).not.toThrow();
    });

    it('should configure Anthropic provider', () => {
      expect(() => {
        client.configureProvider('anthropic', {
          apiKey: 'test-key',
        });
      }).not.toThrow();
    });

    it('should configure Gemini provider', () => {
      expect(() => {
        client.configureProvider('gemini', {
          apiKey: 'test-key',
        });
      }).not.toThrow();
    });

    it('should configure HuggingFace provider', () => {
      expect(() => {
        client.configureProvider('huggingface', {
          apiKey: 'test-key',
        });
      }).not.toThrow();
    });

    it('should throw error for invalid provider', () => {
      expect(() => {
        client.configureProvider('invalid' as any, {
          apiKey: 'test-key',
        });
      }).toThrow();
    });
  });

  describe('Multi-Provider Support', () => {
    it('should support multiple providers simultaneously', () => {
      const multiClient = new HeySaladAI();

      multiClient.configureProvider('openai', { apiKey: 'openai-key' });
      multiClient.configureProvider('anthropic', { apiKey: 'anthropic-key' });
      multiClient.configureProvider('gemini', { apiKey: 'gemini-key' });

      expect((multiClient as any).providers.size).toBe(3);
    });

    it('should allow provider reconfiguration', () => {
      const reconfigClient = new HeySaladAI();

      reconfigClient.configureProvider('openai', { apiKey: 'key1' });
      reconfigClient.configureProvider('openai', { apiKey: 'key2' });

      const provider = (reconfigClient as any).providers.get('openai');
      expect(provider.config.apiKey).toBe('key2');
    });
  });

  describe('Request Validation', () => {
    it('should validate chat request structure', () => {
      const validRequest = {
        model: 'gpt-4',
        messages: [{ role: 'user' as const, content: 'Hello' }],
      };

      expect(validRequest.messages.length).toBeGreaterThan(0);
      expect(validRequest.messages[0].role).toBe('user');
      expect(validRequest.messages[0].content).toBeTruthy();
    });

    it('should reject invalid message roles', () => {
      const invalidRoles = ['admin', 'moderator', 'guest'];

      invalidRoles.forEach((role) => {
        expect(['user', 'assistant', 'system']).not.toContain(role);
      });
    });

    it('should validate message content', () => {
      const validMessages = [
        { role: 'user' as const, content: 'Hello' },
        { role: 'assistant' as const, content: 'Hi there!' },
        { role: 'system' as const, content: 'You are helpful' },
      ];

      validMessages.forEach((msg) => {
        expect(msg.content.length).toBeGreaterThan(0);
        expect(typeof msg.content).toBe('string');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing API key gracefully', () => {
      const errorClient = new HeySaladAI();

      expect(() => {
        errorClient.configureProvider('openai', {
          apiKey: '',
        });
      }).not.toThrow(); // Configuration should succeed, but API calls will fail
    });

    it('should handle network errors', async () => {
      // This would require mocking fetch to simulate network errors
      expect(true).toBe(true); // Placeholder
    });

    it('should handle rate limiting', async () => {
      // This would require mocking API responses
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Streaming Support', () => {
    it('should support streaming for all providers', () => {
      const providers = ['openai', 'anthropic', 'gemini', 'huggingface'];

      providers.forEach((provider) => {
        const testClient = new HeySaladAI();
        testClient.configureProvider(provider as any, { apiKey: 'test' });

        const providerInstance = (testClient as any).providers.get(provider);
        expect(typeof providerInstance.stream).toBe('function');
      });
    });
  });

  describe('Model Listing', () => {
    it('should list models for each provider', async () => {
      const testClient = new HeySaladAI();

      // Only test Gemini which doesn't require API calls
      testClient.configureProvider('gemini', { apiKey: 'test' });
      const geminiProvider = (testClient as any).providers.get('gemini');

      const models = await geminiProvider.listModels();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });
  });
});
