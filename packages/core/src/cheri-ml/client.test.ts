import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HeySaladAI } from '../client';
import { CheriML, createCheriML } from './client';
import type { GenerateFunctionRequest, GenerateComponentRequest } from './types';

describe('CheriML', () => {
  let aiClient: HeySaladAI;
  let cheriml: CheriML;

  beforeEach(() => {
    aiClient = new HeySaladAI();
    aiClient.configureProvider('gemini', {
      apiKey: 'test-key',
    });
    cheriml = new CheriML(aiClient, 'gemini', 'gemini-2.0-flash');
  });

  describe('initialization', () => {
    it('should create CheriML instance', () => {
      expect(cheriml).toBeInstanceOf(CheriML);
    });

    it('should use default provider and model', () => {
      const info = cheriml.getProviderInfo();
      expect(info.provider).toBe('gemini');
      expect(info.model).toBe('gemini-2.0-flash');
    });

    it('should allow custom provider and model', () => {
      const customCheriml = new CheriML(aiClient, 'openai', 'gpt-4');
      const info = customCheriml.getProviderInfo();
      expect(info.provider).toBe('openai');
      expect(info.model).toBe('gpt-4');
    });

    it('should create via factory function', () => {
      const instance = createCheriML(aiClient);
      expect(instance).toBeInstanceOf(CheriML);
    });
  });

  describe('provider management', () => {
    it('should get provider info', () => {
      const info = cheriml.getProviderInfo();
      expect(info).toHaveProperty('provider');
      expect(info).toHaveProperty('model');
    });

    it('should set provider', () => {
      cheriml.setProvider('anthropic', 'claude-3-opus');
      const info = cheriml.getProviderInfo();
      expect(info.provider).toBe('anthropic');
      expect(info.model).toBe('claude-3-opus');
    });

    it('should set provider without model', () => {
      const originalModel = cheriml.getProviderInfo().model;
      cheriml.setProvider('anthropic');
      const info = cheriml.getProviderInfo();
      expect(info.provider).toBe('anthropic');
      expect(info.model).toBe(originalModel);
    });
  });

  describe('T1: generateFunction', () => {
    it('should generate function with valid request', async () => {
      // Mock AI response
      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: '```typescript\nexport function add(a: number, b: number): number {\n  return a + b;\n}\n```',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      const request: GenerateFunctionRequest = {
        id: 'test-1',
        taskType: 'T1_GENERATE_FUNCTION',
        title: 'Generate add function',
        description: 'Create a function that adds two numbers',
        context: {
          language: 'typescript',
        },
        requirements: {
          functionName: 'add',
          returnType: 'number',
          constraints: ['Must be pure function'],
          acceptanceCriteria: ['Returns sum of two numbers'],
        },
        config: {
          verbose: false,
        },
      };

      const result = await cheriml.generateFunction(request);

      expect(result.id).toBe('test-1');
      expect(result.taskType).toBe('T1_GENERATE_FUNCTION');
      expect(result.status).toBe('success');
      expect(result.output.code).toContain('function add');
      expect(result.validation.passed).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      vi.spyOn(aiClient, 'chat').mockRejectedValue(new Error('API Error'));

      const request: GenerateFunctionRequest = {
        id: 'test-error',
        taskType: 'T1_GENERATE_FUNCTION',
        title: 'Test error handling',
        description: 'This should fail',
        context: {
          language: 'typescript',
        },
        requirements: {
          constraints: [],
          acceptanceCriteria: [],
        },
        config: {},
      };

      const result = await cheriml.generateFunction(request);

      expect(result.status).toBe('failure');
      expect(result.validation.passed).toBe(false);
      expect(result.validation.errors.length).toBeGreaterThan(0);
    });

    it('should extract code from markdown blocks', async () => {
      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: 'Here is the code:\n```typescript\nfunction test() {}\n```\nDone!',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      const request: GenerateFunctionRequest = {
        id: 'test-extract',
        taskType: 'T1_GENERATE_FUNCTION',
        title: 'Test extraction',
        description: 'Test code extraction',
        context: {
          language: 'typescript',
        },
        requirements: {
          constraints: [],
          acceptanceCriteria: [],
        },
        config: {},
      };

      const result = await cheriml.generateFunction(request);

      expect(result.output.code).toBe('function test() {}');
      expect(result.output.code).not.toContain('```');
    });

    it('should validate generated code', async () => {
      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: '```typescript\n// TODO: Implement this\nfunction incomplete() {}\n```',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      const request: GenerateFunctionRequest = {
        id: 'test-validation',
        taskType: 'T1_GENERATE_FUNCTION',
        title: 'Test validation',
        description: 'Test code validation',
        context: {
          language: 'typescript',
        },
        requirements: {
          constraints: [],
          acceptanceCriteria: [],
        },
        config: {},
      };

      const result = await cheriml.generateFunction(request);

      expect(result.validation.errors.length).toBeGreaterThan(0);
      expect(result.validation.errors.some(e => e.message.includes('TODO'))).toBe(true);
    });
  });

  describe('T2: generateComponent', () => {
    it('should generate component with valid request', async () => {
      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: '```typescript\nexport const Button = () => <button>Click</button>;\n```',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      const request: GenerateComponentRequest = {
        id: 'test-2',
        taskType: 'T2_GENERATE_COMPONENT',
        title: 'Generate Button component',
        description: 'Create a button component',
        context: {
          language: 'typescript',
        },
        requirements: {
          componentName: 'Button',
          framework: 'react',
          constraints: ['Use TypeScript'],
          acceptanceCriteria: ['Renders button element'],
        },
        config: {
          verbose: false,
        },
      };

      const result = await cheriml.generateComponent(request);

      expect(result.id).toBe('test-2');
      expect(result.taskType).toBe('T2_GENERATE_COMPONENT');
      expect(result.status).toBe('success');
      expect(result.output.code).toContain('Button');
    });
  });

  describe('T3: generateTestSuite', () => {
    it('should generate test suite', async () => {
      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: '```typescript\ndescribe("test", () => {\n  it("works", () => {});\n});\n```',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      const result = await cheriml.generateTestSuite({
        id: 'test-3',
        taskType: 'T3_GENERATE_TEST_SUITE',
        title: 'Generate tests',
        description: 'Create test suite',
        context: {
          language: 'typescript',
          code: 'function add(a, b) { return a + b; }',
        },
        requirements: {
          targetFunction: 'add',
          coverageTarget: 80,
          constraints: [],
          acceptanceCriteria: [],
        },
        config: {},
      });

      expect(result.taskType).toBe('T3_GENERATE_TEST_SUITE');
      expect(result.output.code).toContain('describe');
    });
  });

  describe('T4: generateAPIEndpoint', () => {
    it('should generate API endpoint', async () => {
      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: '```typescript\napp.get("/api/users", (req, res) => {});\n```',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      const result = await cheriml.generateAPIEndpoint({
        id: 'test-4',
        taskType: 'T4_GENERATE_API_ENDPOINT',
        title: 'Generate endpoint',
        description: 'Create API endpoint',
        context: {
          language: 'typescript',
        },
        requirements: {
          method: 'GET',
          path: '/api/users',
          constraints: [],
          acceptanceCriteria: [],
        },
        config: {},
      });

      expect(result.taskType).toBe('T4_GENERATE_API_ENDPOINT');
      expect(result.output.code).toContain('api/users');
    });
  });

  describe('metrics and reporting', () => {
    it('should include metrics in result', async () => {
      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: '```typescript\nfunction test() {}\n```',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      const result = await cheriml.generateFunction({
        id: 'test-metrics',
        taskType: 'T1_GENERATE_FUNCTION',
        title: 'Test metrics',
        description: 'Test metrics collection',
        context: {
          language: 'typescript',
        },
        requirements: {
          constraints: [],
          acceptanceCriteria: [],
        },
        config: {},
      });

      expect(result.metrics).toBeDefined();
      expect(result.metrics?.timeElapsed).toBeGreaterThanOrEqual(0);
      expect(result.metrics?.linesChanged).toBeGreaterThan(0);
    });

    it('should include next steps', async () => {
      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: '```typescript\nfunction test() {}\n```',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      const result = await cheriml.generateFunction({
        id: 'test-steps',
        taskType: 'T1_GENERATE_FUNCTION',
        title: 'Test steps',
        description: 'Test next steps',
        context: {
          language: 'typescript',
        },
        requirements: {
          constraints: [],
          acceptanceCriteria: [],
        },
        config: {},
      });

      expect(result.nextSteps).toBeDefined();
      expect(result.nextSteps?.length).toBeGreaterThan(0);
    });
  });

  describe('verbose mode', () => {
    it('should log when verbose is enabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const mockResponse = {
        id: 'test-id',
        model: 'gemini-2.0-flash',
        content: '```typescript\nfunction test() {}\n```',
        role: 'assistant' as const,
        finishReason: 'stop' as const,
      };

      vi.spyOn(aiClient, 'chat').mockResolvedValue(mockResponse);

      await cheriml.generateFunction({
        id: 'test-verbose',
        taskType: 'T1_GENERATE_FUNCTION',
        title: 'Test verbose',
        description: 'Test verbose logging',
        context: {
          language: 'typescript',
        },
        requirements: {
          constraints: [],
          acceptanceCriteria: [],
        },
        config: {
          verbose: true,
        },
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
