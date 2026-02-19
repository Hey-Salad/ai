import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HeySaladAI, createClient } from './client';
import { AIProvider, ChatCompletionRequest } from './types';

describe('HeySaladAI Client', () => {
  let client: HeySaladAI;

  beforeEach(() => {
    client = new HeySaladAI();
  });

  describe('createClient', () => {
    it('should create a new client instance', () => {
      const newClient = createClient();
      expect(newClient).toBeInstanceOf(HeySaladAI);
      expect(newClient.actions).toBeDefined();
    });
  });

  describe('configureProvider', () => {
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

    it('should throw error for unimplemented providers', () => {
      expect(() => {
        client.configureProvider('bedrock', {
          apiKey: 'test-key',
        });
      }).toThrow("Provider 'bedrock' is not yet implemented");
    });

    it('should set first provider as default', () => {
      client.configureProvider('openai', { apiKey: 'test-key' });
      const providers = client.listProviders();
      expect(providers).toContain('openai');
    });
  });

  describe('setDefaultProvider', () => {
    it('should set default provider', () => {
      client.configureProvider('openai', { apiKey: 'test-key' });
      client.configureProvider('anthropic', { apiKey: 'test-key' });

      expect(() => {
        client.setDefaultProvider('anthropic');
      }).not.toThrow();
    });

    it('should throw error for unconfigured provider', () => {
      expect(() => {
        client.setDefaultProvider('openai');
      }).toThrow("Provider 'openai' is not configured");
    });
  });

  describe('getProvider', () => {
    beforeEach(() => {
      client.configureProvider('openai', { apiKey: 'test-key' });
    });

    it('should return default provider when no provider specified', () => {
      const provider = client.getProvider();
      expect(provider).toBeDefined();
      expect(provider.provider).toBe('openai');
    });

    it('should return specific provider when specified', () => {
      client.configureProvider('anthropic', { apiKey: 'test-key' });
      const provider = client.getProvider('anthropic');
      expect(provider.provider).toBe('anthropic');
    });

    it('should throw error when no default provider set', () => {
      const newClient = new HeySaladAI();
      expect(() => {
        newClient.getProvider();
      }).toThrow('No provider specified and no default provider set');
    });

    it('should throw error for unconfigured provider', () => {
      expect(() => {
        client.getProvider('anthropic');
      }).toThrow("Provider 'anthropic' is not configured");
    });
  });

  describe('listProviders', () => {
    it('should return empty array when no providers configured', () => {
      const providers = client.listProviders();
      expect(providers).toEqual([]);
    });

    it('should return list of configured providers', () => {
      client.configureProvider('openai', { apiKey: 'test-key' });
      client.configureProvider('anthropic', { apiKey: 'test-key' });

      const providers = client.listProviders();
      expect(providers).toHaveLength(2);
      expect(providers).toContain('openai');
      expect(providers).toContain('anthropic');
    });
  });

  describe('actions', () => {
    it('should have actions registry initialized', () => {
      expect(client.actions).toBeDefined();
      expect(typeof client.actions.register).toBe('function');
      expect(typeof client.actions.get).toBe('function');
      expect(typeof client.actions.list).toBe('function');
    });
  });
});
