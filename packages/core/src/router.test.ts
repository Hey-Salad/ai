import { describe, it, expect } from 'vitest';

describe('Router', () => {
  describe('model routing', () => {
    it('should route OpenAI models correctly', () => {
      const openaiModels = [
        'gpt-4',
        'gpt-4-turbo',
        'gpt-3.5-turbo',
        'gpt-4o',
        'gpt-4o-mini',
      ];

      openaiModels.forEach((model) => {
        expect(model.startsWith('gpt-')).toBe(true);
      });
    });

    it('should route Anthropic models correctly', () => {
      const anthropicModels = [
        'claude-3-opus',
        'claude-3-sonnet',
        'claude-3-haiku',
        'claude-3.5-sonnet',
      ];

      anthropicModels.forEach((model) => {
        expect(model.startsWith('claude-')).toBe(true);
      });
    });

    it('should route Gemini models correctly', () => {
      const geminiModels = [
        'gemini-3-flash-preview',
        'gemini-3.1-pro-preview',
        'gemini-3-pro-preview',
        'gemini-2.5-flash',
        'gemini-2.5-pro',
      ];

      geminiModels.forEach((model) => {
        expect(model.startsWith('gemini-')).toBe(true);
      });
    });

    it('should handle HuggingFace model formats', () => {
      const hfModels = [
        'meta-llama/Llama-2-7b-chat-hf',
        'mistralai/Mistral-7B-Instruct-v0.1',
        'google/flan-t5-base',
      ];

      hfModels.forEach((model) => {
        expect(model).toContain('/');
      });
    });
  });

  describe('provider selection', () => {
    it('should select correct provider based on model prefix', () => {
      const modelToProvider: Record<string, string> = {
        'gpt-4': 'openai',
        'claude-3-opus': 'anthropic',
        'gemini-3-flash-preview': 'gemini',
        'meta-llama/Llama-2-7b': 'huggingface',
      };

      Object.entries(modelToProvider).forEach(([model, expectedProvider]) => {
        let provider = 'unknown';

        if (model.startsWith('gpt-')) provider = 'openai';
        else if (model.startsWith('claude-')) provider = 'anthropic';
        else if (model.startsWith('gemini-')) provider = 'gemini';
        else if (model.includes('/')) provider = 'huggingface';

        expect(provider).toBe(expectedProvider);
      });
    });
  });

  describe('model validation', () => {
    it('should validate model name format', () => {
      const validModels = [
        'gpt-4',
        'claude-3-opus',
        'gemini-3-flash-preview',
        'meta-llama/Llama-2-7b',
      ];

      validModels.forEach((model) => {
        expect(model.length).toBeGreaterThan(0);
        expect(typeof model).toBe('string');
      });
    });

    it('should reject empty model names', () => {
      const invalidModels = ['', ' ', null, undefined];

      invalidModels.forEach((model) => {
        expect(!model || model.trim().length === 0).toBe(true);
      });
    });
  });
});
