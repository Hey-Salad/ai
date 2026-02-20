import { HeySaladAI } from '../client';
import { AIProvider, Message } from '../types';
import {
  CodeGenerationRequest,
  CodeGenerationResult,
  GenerateFunctionRequest,
  GenerateComponentRequest,
  GenerateTestSuiteRequest,
  GenerateAPIEndpointRequest,
  AtomicTaskType,
} from './types';
import { codeGenerationPrompts } from './prompts';

/**
 * CheriML - AI-Powered Code Generation Client
 * Supports atomic tasks T1-T4 for code generation
 */
export class CheriML {
  private aiClient: HeySaladAI;
  private provider: AIProvider;
  private model: string;

  constructor(aiClient: HeySaladAI, provider: AIProvider = 'gemini', model: string = 'gemini-2.0-flash') {
    this.aiClient = aiClient;
    this.provider = provider;
    this.model = model;
  }

  /**
   * T1: Generate Function from Specification
   */
  async generateFunction(request: GenerateFunctionRequest): Promise<CodeGenerationResult> {
    return this.executeCodeGenerationTask(request, 'T1_GENERATE_FUNCTION');
  }

  /**
   * T2: Generate Component/Class Structure
   */
  async generateComponent(request: GenerateComponentRequest): Promise<CodeGenerationResult> {
    return this.executeCodeGenerationTask(request, 'T2_GENERATE_COMPONENT');
  }

  /**
   * T3: Generate Test Suite
   */
  async generateTestSuite(request: GenerateTestSuiteRequest): Promise<CodeGenerationResult> {
    return this.executeCodeGenerationTask(request, 'T3_GENERATE_TEST_SUITE');
  }

  /**
   * T4: Generate API Endpoint
   */
  async generateAPIEndpoint(request: GenerateAPIEndpointRequest): Promise<CodeGenerationResult> {
    return this.executeCodeGenerationTask(request, 'T4_GENERATE_API_ENDPOINT');
  }

  /**
   * Execute a code generation task
   */
  private async executeCodeGenerationTask(
    request: CodeGenerationRequest,
    taskType: AtomicTaskType
  ): Promise<CodeGenerationResult> {
    const startTime = Date.now();

    try {
      if (request.config.verbose) {
        console.log(`[${taskType}] Starting task: ${request.title}`);
      }

      // Build the prompt
      const prompt = this.buildPrompt(request, taskType);

      // Get system message for the task
      const systemMessage = codeGenerationPrompts[taskType]?.system || 'You are an expert code generation AI.';

      // Build messages
      const messages: Message[] = [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      // Call the AI provider
      if (request.config.verbose) {
        console.log(`[${taskType}] Calling ${this.provider} model: ${this.model}`);
      }

      const aiResponse = await this.aiClient.chat(
        {
          model: this.model,
          messages,
          temperature: 0.3, // Lower temperature for more deterministic code
          maxTokens: 4096,
          metadata: request.metadata,
        },
        this.provider
      );

      if (request.config.verbose) {
        console.log(`[${taskType}] Received response from AI provider`);
      }

      // Parse the response
      const code = this.extractCode(aiResponse.content);

      // Validate the generated code
      const validation = this.validateCode(code, request.context.language);

      const result: CodeGenerationResult = {
        id: request.id,
        taskType,
        status: validation.passed ? 'success' : 'needs_review',
        output: {
          code,
          summary: `Generated ${taskType} successfully`,
          details: aiResponse.content,
        },
        validation,
        metrics: {
          timeElapsed: Date.now() - startTime,
          linesChanged: code.split('\n').length,
        },
        nextSteps: this.suggestNextSteps(taskType, validation),
      };

      if (request.config.verbose) {
        console.log(`[${taskType}] Task completed: ${result.status}`);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return {
        id: request.id,
        taskType,
        status: 'failure',
        output: {
          summary: `Failed to generate code: ${errorMessage}`,
          details: errorMessage,
        },
        validation: {
          passed: false,
          errors: [
            {
              message: errorMessage,
              severity: 'error',
            },
          ],
        },
        metrics: {
          timeElapsed: Date.now() - startTime,
        },
        nextSteps: ['Review error message', 'Check input parameters', 'Try again with clearer requirements'],
      };
    }
  }

  /**
   * Build the prompt for the task
   */
  private buildPrompt(request: CodeGenerationRequest, taskType: AtomicTaskType): string {
    const promptTemplate = codeGenerationPrompts[taskType]?.template || '';

    // Replace placeholders in template
    let prompt = promptTemplate;

    // General replacements
    prompt = prompt.replace('{title}', request.title);
    prompt = prompt.replace('{description}', request.description);
    prompt = prompt.replace('{language}', request.context.language);
    prompt = prompt.replace('{constraints}', request.requirements.constraints.join('\n- '));
    prompt = prompt.replace('{acceptanceCriteria}', request.requirements.acceptanceCriteria.join('\n- '));

    // Add code context if available
    if (request.context.code) {
      prompt = prompt.replace('{code}', `\`\`\`${request.context.language}\n${request.context.code}\n\`\`\``);
    }

    // Add project config if available
    if (request.context.projectConfig) {
      const configStr = this.formatProjectConfig(request.context.projectConfig);
      prompt = prompt.replace('{projectConfig}', configStr);
    }

    // Task-specific placeholders
    if (taskType === 'T1_GENERATE_FUNCTION' && 'requirements' in request) {
      const req = request as GenerateFunctionRequest;
      if (req.requirements.functionName) {
        prompt = prompt.replace('{functionName}', req.requirements.functionName);
      }
      if (req.requirements.returnType) {
        prompt = prompt.replace('{returnType}', req.requirements.returnType);
      }
    }

    if (taskType === 'T2_GENERATE_COMPONENT' && 'requirements' in request) {
      const req = request as GenerateComponentRequest;
      if (req.requirements.framework) {
        prompt = prompt.replace('{framework}', req.requirements.framework);
      }
    }

    if (taskType === 'T3_GENERATE_TEST_SUITE' && 'requirements' in request) {
      const req = request as GenerateTestSuiteRequest;
      if (req.requirements.coverageTarget) {
        prompt = prompt.replace('{coverage}', String(req.requirements.coverageTarget));
      }
    }

    if (taskType === 'T4_GENERATE_API_ENDPOINT' && 'requirements' in request) {
      const req = request as GenerateAPIEndpointRequest;
      if (req.requirements.method) {
        prompt = prompt.replace('{method}', req.requirements.method);
      }
      if (req.requirements.path) {
        prompt = prompt.replace('{path}', req.requirements.path);
      }
    }

    return prompt;
  }

  /**
   * Extract code from AI response
   */
  private extractCode(content: string): string {
    // Try to extract code from markdown code blocks
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/;
    const match = content.match(codeBlockRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    // If no code block found, return the entire content
    return content;
  }

  /**
   * Validate generated code
   */
  private validateCode(code: string, language: string): { passed: boolean; errors: any[] } {
    const errors = [];

    // Basic validations
    if (!code || code.length === 0) {
      errors.push({
        message: 'Generated code is empty',
        severity: 'error',
      });
      return { passed: false, errors };
    }

    // Check for incomplete code markers
    if (code.includes('TODO') || code.includes('FIXME')) {
      errors.push({
        message: 'Generated code contains TODO/FIXME markers',
        severity: 'warning',
      });
    }

    // Language-specific validation
    if (language === 'typescript' || language === 'javascript') {
      if (!code.includes('export ') && !code.includes('function ') && !code.includes('const ')) {
        errors.push({
          message: 'No export or function definition found',
          severity: 'warning',
        });
      }
    }

    return {
      passed: errors.filter(e => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Format project configuration for prompt
   */
  private formatProjectConfig(config: any): string {
    const lines = [];

    if (config.framework) lines.push(`Framework: ${config.framework}`);
    if (config.styleGuide) lines.push(`Style Guide: ${config.styleGuide}`);
    if (config.typescriptStrict) lines.push(`TypeScript Strict Mode: Enabled`);
    if (config.testFramework) lines.push(`Test Framework: ${config.testFramework}`);
    if (config.linter) lines.push(`Linter: ${config.linter}`);
    if (config.formatter) lines.push(`Formatter: ${config.formatter}`);

    return lines.join('\n');
  }

  /**
   * Suggest next steps based on result
   */
  private suggestNextSteps(taskType: AtomicTaskType, validation: any): string[] {
    const steps = [];

    if (validation.passed) {
      steps.push('Review generated code');
      steps.push('Run tests to verify functionality');
      steps.push('Check linting and formatting');
      steps.push('Create pull request for review');
    } else {
      steps.push('Review validation errors');
      steps.push('Regenerate with corrected parameters');
      steps.push('Manual review and fixes');
    }

    switch (taskType) {
      case 'T1_GENERATE_FUNCTION':
        steps.push('Add to appropriate module');
        steps.push('Export from index file');
        break;
      case 'T2_GENERATE_COMPONENT':
        steps.push('Add styles/CSS');
        steps.push('Test with different props');
        break;
      case 'T3_GENERATE_TEST_SUITE':
        steps.push('Run test suite');
        steps.push('Check coverage report');
        break;
      case 'T4_GENERATE_API_ENDPOINT':
        steps.push('Register route in app');
        steps.push('Add API documentation');
        break;
    }

    return steps;
  }

  /**
   * Set the provider for code generation
   */
  setProvider(provider: AIProvider, model?: string): void {
    this.provider = provider;
    if (model) {
      this.model = model;
    }
  }

  /**
   * Get current provider and model
   */
  getProviderInfo(): { provider: AIProvider; model: string } {
    return {
      provider: this.provider,
      model: this.model,
    };
  }
}

/**
 * Create a CheriML client
 */
export const createCheriML = (
  aiClient: HeySaladAI,
  provider: AIProvider = 'gemini',
  model?: string
): CheriML => {
  return new CheriML(aiClient, provider, model);
};
