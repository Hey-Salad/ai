/**
 * CheriML - Code Generation Types
 * Atomic task definitions and interfaces
 */

export type AtomicTaskType =
  | 'T1_GENERATE_FUNCTION'
  | 'T2_GENERATE_COMPONENT'
  | 'T3_GENERATE_TEST_SUITE'
  | 'T4_GENERATE_API_ENDPOINT';

export interface CodeContext {
  code?: string;
  language: 'typescript' | 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'cpp';
  relatedFiles?: FileReference[];
  projectConfig?: ProjectConfig;
  git?: GitContext;
}

export interface FileReference {
  path: string;
  content?: string;
  relationship?: 'import' | 'export' | 'test' | 'type' | 'dependency';
}

export interface ProjectConfig {
  framework?: string;
  styleGuide?: string;
  typescriptStrict?: boolean;
  testFramework?: 'jest' | 'vitest' | 'mocha' | 'pytest';
  linter?: string;
  formatter?: string;
}

export interface GitContext {
  branch?: string;
  recentCommits?: string[];
  uncommittedChanges?: number;
}

export interface TaskRequirements {
  constraints: string[];
  acceptanceCriteria: string[];
  successMetrics?: string[];
}

export interface TaskConfig {
  verbose?: boolean;
  dryRun?: boolean;
  autoFix?: boolean;
}

export interface CodeGenerationRequest {
  id: string;
  taskType: AtomicTaskType;
  title: string;
  description: string;
  context: CodeContext;
  requirements: TaskRequirements;
  config: TaskConfig;
  metadata?: Record<string, any>;
}

export interface CodeFile {
  path: string;
  content: string;
}

export interface ValidationError {
  message: string;
  location?: string;
  severity: 'error' | 'warning';
}

export interface CodeGenerationResult {
  id: string;
  taskType: AtomicTaskType;
  status: 'success' | 'partial' | 'needs_review' | 'failure';

  output: {
    code?: string;
    files?: CodeFile[];
    summary: string;
    details: string;
  };

  metrics?: {
    linesChanged?: number;
    complexity?: number;
    coverage?: number;
    timeElapsed?: number;
  };

  validation: {
    passed: boolean;
    errors: ValidationError[];
  };

  suggestion?: string;
  nextSteps?: string[];
}

/**
 * Specific task types for T1-T4
 */

export interface GenerateFunctionRequest extends CodeGenerationRequest {
  taskType: 'T1_GENERATE_FUNCTION';
  requirements: TaskRequirements & {
    functionName?: string;
    parameters?: Array<{ name: string; type: string }>;
    returnType?: string;
    examples?: Array<{ input: any; output: any }>;
  };
}

export interface GenerateComponentRequest extends CodeGenerationRequest {
  taskType: 'T2_GENERATE_COMPONENT';
  requirements: TaskRequirements & {
    componentName?: string;
    framework?: 'react' | 'vue' | 'angular' | 'svelte';
    props?: Array<{ name: string; type: string; required?: boolean }>;
    state?: Array<{ name: string; type: string }>;
  };
}

export interface GenerateTestSuiteRequest extends CodeGenerationRequest {
  taskType: 'T3_GENERATE_TEST_SUITE';
  requirements: TaskRequirements & {
    targetFunction?: string;
    targetFile?: string;
    coverageTarget?: number; // 0-100
    testTypes?: Array<'unit' | 'integration' | 'e2e'>;
  };
}

export interface GenerateAPIEndpointRequest extends CodeGenerationRequest {
  taskType: 'T4_GENERATE_API_ENDPOINT';
  requirements: TaskRequirements & {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path?: string;
    description?: string;
    requestSchema?: Record<string, any>;
    responseSchema?: Record<string, any>;
    authentication?: 'none' | 'jwt' | 'oauth' | 'api-key';
  };
}
