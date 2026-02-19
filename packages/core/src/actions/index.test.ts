import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ActionRegistry,
  createDefaultActionRegistry,
  createChatAction,
  createVerifyAction,
  createWebhookAction,
} from './index';
import { Action } from '../types';

describe('ActionRegistry', () => {
  let registry: ActionRegistry;

  beforeEach(() => {
    registry = new ActionRegistry();
  });

  describe('register', () => {
    it('should register an action', () => {
      const action: Action = {
        type: 'custom',
        name: 'test-action',
        description: 'Test action',
        execute: async () => ({ success: true }),
      };

      registry.register(action);
      expect(registry.get('test-action')).toBe(action);
    });
  });

  describe('get', () => {
    it('should return registered action', () => {
      const action: Action = {
        type: 'custom',
        name: 'test-action',
        description: 'Test action',
        execute: async () => ({ success: true }),
      };

      registry.register(action);
      const retrieved = registry.get('test-action');
      expect(retrieved).toBe(action);
    });

    it('should return undefined for unregistered action', () => {
      expect(registry.get('non-existent')).toBeUndefined();
    });
  });

  describe('list', () => {
    it('should return empty array when no actions registered', () => {
      expect(registry.list()).toEqual([]);
    });

    it('should return all registered actions', () => {
      const action1: Action = {
        type: 'custom',
        name: 'action-1',
        description: 'Action 1',
        execute: async () => ({}),
      };
      const action2: Action = {
        type: 'custom',
        name: 'action-2',
        description: 'Action 2',
        execute: async () => ({}),
      };

      registry.register(action1);
      registry.register(action2);

      const actions = registry.list();
      expect(actions).toHaveLength(2);
      expect(actions).toContain(action1);
      expect(actions).toContain(action2);
    });
  });

  describe('execute', () => {
    it('should execute registered action', async () => {
      const action: Action = {
        type: 'custom',
        name: 'test-action',
        description: 'Test action',
        execute: async (params) => ({ result: params.value * 2 }),
      };

      registry.register(action);
      const result = await registry.execute('test-action', { value: 5 });
      expect(result).toEqual({ result: 10 });
    });

    it('should throw error for unregistered action', async () => {
      await expect(
        registry.execute('non-existent', {})
      ).rejects.toThrow("Action 'non-existent' not found");
    });
  });
});

describe('Built-in Actions', () => {
  describe('createChatAction', () => {
    it('should create chat action with correct properties', () => {
      const action = createChatAction();
      expect(action.type).toBe('chat');
      expect(action.name).toBe('chat');
      expect(action.description).toBeTruthy();
      expect(typeof action.execute).toBe('function');
    });

    it('should execute chat action', async () => {
      const action = createChatAction();
      const mockProvider = {
        chat: vi.fn().mockResolvedValue({ content: 'response' }),
      };

      const result = await action.execute({
        provider: mockProvider,
        request: { messages: [] },
      });

      expect(mockProvider.chat).toHaveBeenCalled();
      expect(result).toEqual({ content: 'response' });
    });
  });

  describe('createVerifyAction', () => {
    it('should create verify action with correct properties', () => {
      const action = createVerifyAction();
      expect(action.type).toBe('verify');
      expect(action.name).toBe('verify');
      expect(action.description).toBeTruthy();
      expect(typeof action.execute).toBe('function');
    });

    it('should execute verify action', async () => {
      const action = createVerifyAction();
      const result = await action.execute({
        method: 'otp',
        identifier: 'user@example.com',
      });

      expect(result).toHaveProperty('verificationId');
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('expiresAt');
      expect(result.status).toBe('pending');
    });
  });

  describe('createWebhookAction', () => {
    it('should create webhook action with correct properties', () => {
      const action = createWebhookAction();
      expect(action.type).toBe('webhook');
      expect(action.name).toBe('webhook');
      expect(action.description).toBeTruthy();
      expect(typeof action.execute).toBe('function');
    });

    it('should execute webhook action', async () => {
      const action = createWebhookAction();

      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({ success: true }),
      });

      const result = await action.execute({
        url: 'https://example.com/webhook',
        data: { test: 'data' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/webhook',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual({ success: true });
    });
  });
});

describe('createDefaultActionRegistry', () => {
  it('should create registry with default actions', () => {
    const registry = createDefaultActionRegistry();
    const actions = registry.list();

    expect(actions).toHaveLength(3);
    expect(registry.get('chat')).toBeDefined();
    expect(registry.get('verify')).toBeDefined();
    expect(registry.get('webhook')).toBeDefined();
  });
});
