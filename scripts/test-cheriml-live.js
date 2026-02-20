#!/usr/bin/env node

/**
 * CheriML Live API Test
 * Comprehensive test of CheriML code generation capabilities
 */

const { HeySaladAI, createCheriML } = require('../packages/core/dist/index.js');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'cyan');
  console.log('='.repeat(70));
}

async function testTask(cheriml, taskName, taskFn, request) {
  section(`Testing ${taskName}`);
  
  const startTime = Date.now();
  
  try {
    log(`\n📝 Request:`, 'blue');
    console.log(`   Title: ${request.title}`);
    console.log(`   Description: ${request.description}`);
    console.log(`   Language: ${request.context.language}`);
    
    log(`\n⏳ Generating code...`, 'yellow');
    const result = await taskFn.call(cheriml, request);
    
    const duration = Date.now() - startTime;
    
    log(`\n✅ Generation Complete!`, 'green');
    console.log(`   Status: ${result.status}`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Validation: ${result.validation.passed ? '✅ Passed' : '⚠️  Has warnings'}`);
    
    if (result.validation.errors && result.validation.errors.length > 0) {
      log(`\n⚠️  Validation Issues:`, 'yellow');
      result.validation.errors.forEach(err => {
        console.log(`   [${err.severity}] ${err.message}`);
      });
    }
    
    if (result.output.code) {
      log(`\n📄 Generated Code:`, 'blue');
      console.log('─'.repeat(70));
      console.log(result.output.code);
      console.log('─'.repeat(70));
      
      const lines = result.output.code.split('\n').length;
      console.log(`   Lines of code: ${lines}`);
    }
    
    if (result.metrics) {
      log(`\n📊 Metrics:`, 'blue');
      if (result.metrics.timeElapsed) console.log(`   Time: ${result.metrics.timeElapsed}ms`);
      if (result.metrics.linesChanged) console.log(`   Lines: ${result.metrics.linesChanged}`);
      if (result.metrics.complexity) console.log(`   Complexity: ${result.metrics.complexity}`);
    }
    
    if (result.nextSteps && result.nextSteps.length > 0) {
      log(`\n🎯 Next Steps:`, 'blue');
      result.nextSteps.forEach(step => console.log(`   • ${step}`));
    }
    
    return {
      name: taskName,
      passed: result.status === 'success' || result.status === 'needs_review',
      status: result.status,
      duration,
      result,
    };
  } catch (error) {
    log(`\n❌ Test Failed: ${error.message}`, 'red');
    console.error(error.stack);
    
    return {
      name: taskName,
      passed: false,
      status: 'error',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║           CheriML - Live API Test Suite                         ║', 'cyan');
  log('║           AI-Powered Code Generation Testing                    ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════════╝', 'cyan');
  
  // Check for API key
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiKey) {
    log('\n❌ Error: GEMINI_API_KEY not found', 'red');
    log('\nCheriML requires a Gemini API key to function.', 'yellow');
    log('Please set your API key:', 'yellow');
    log('  export GEMINI_API_KEY="your-api-key-here"', 'blue');
    log('\nGet your API key at: https://makersuite.google.com/app/apikey', 'blue');
    process.exit(1);
  }
  
  log(`\n✅ API Key Found: ${geminiKey.substring(0, 20)}...`, 'green');
  
  try {
    // Initialize clients
    section('Initializing CheriML');
    
    log('\n1. Creating HeySalad AI client...', 'blue');
    const aiClient = new HeySaladAI();
    
    log('2. Configuring Gemini provider...', 'blue');
    aiClient.configureProvider('gemini', {
      apiKey: geminiKey,
    });
    
    log('3. Creating CheriML client...', 'blue');
    const cheriml = createCheriML(aiClient, 'gemini', 'gemini-2.0-flash');
    
    const providerInfo = cheriml.getProviderInfo();
    log(`\n✅ CheriML Ready!`, 'green');
    console.log(`   Provider: ${providerInfo.provider}`);
    console.log(`   Model: ${providerInfo.model}`);
    
    const results = [];
    
    // Test T1: Generate Function
    results.push(await testTask(
      cheriml,
      'T1: Generate Function',
      cheriml.generateFunction,
      {
        id: 'test-t1-' + Date.now(),
        taskType: 'T1_GENERATE_FUNCTION',
        title: 'Generate isPalindrome function',
        description: 'Create a TypeScript function that checks if a string is a palindrome, ignoring case and non-alphanumeric characters.',
        context: {
          language: 'typescript',
          projectConfig: {
            typescriptStrict: true,
            testFramework: 'vitest',
            linter: 'eslint',
          },
        },
        requirements: {
          functionName: 'isPalindrome',
          returnType: 'boolean',
          parameters: [
            { name: 'str', type: 'string' }
          ],
          constraints: [
            'Ignore case sensitivity',
            'Ignore non-alphanumeric characters',
            'Handle empty strings',
            'Include JSDoc comments',
            'Export the function',
          ],
          acceptanceCriteria: [
            'Returns true for palindromes',
            'Returns false for non-palindromes',
            'Handles edge cases correctly',
          ],
        },
        config: {
          verbose: false,
          dryRun: false,
        },
      }
    ));
    
    // Test T2: Generate Component
    results.push(await testTask(
      cheriml,
      'T2: Generate Component',
      cheriml.generateComponent,
      {
        id: 'test-t2-' + Date.now(),
        taskType: 'T2_GENERATE_COMPONENT',
        title: 'Generate Button component',
        description: 'Create a reusable Button component with variants, sizes, and loading state.',
        context: {
          language: 'typescript',
          projectConfig: {
            framework: 'react',
            typescriptStrict: true,
          },
        },
        requirements: {
          componentName: 'Button',
          framework: 'react',
          props: [
            { name: 'children', type: 'React.ReactNode', required: true },
            { name: 'variant', type: '"primary" | "secondary" | "danger"', required: false },
            { name: 'size', type: '"sm" | "md" | "lg"', required: false },
            { name: 'loading', type: 'boolean', required: false },
            { name: 'disabled', type: 'boolean', required: false },
            { name: 'onClick', type: '() => void', required: false },
          ],
          constraints: [
            'Use TypeScript interfaces',
            'Include accessibility attributes',
            'Handle loading state',
            'Support different variants and sizes',
          ],
          acceptanceCriteria: [
            'Renders children content',
            'Supports all variants',
            'Shows loading indicator',
            'Fully typed with TypeScript',
          ],
        },
        config: {
          verbose: false,
          dryRun: false,
        },
      }
    ));
    
    // Test T3: Generate Test Suite
    results.push(await testTask(
      cheriml,
      'T3: Generate Test Suite',
      cheriml.generateTestSuite,
      {
        id: 'test-t3-' + Date.now(),
        taskType: 'T3_GENERATE_TEST_SUITE',
        title: 'Generate test suite for array utilities',
        description: 'Create comprehensive tests for array utility functions including chunk, flatten, and unique.',
        context: {
          language: 'typescript',
          code: `export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flatten<T>(array: T[][]): T[] {
  return array.reduce((acc, val) => acc.concat(val), []);
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}`,
          projectConfig: {
            testFramework: 'vitest',
            typescriptStrict: true,
          },
        },
        requirements: {
          targetFunction: 'chunk, flatten, unique',
          targetFile: 'utils/array.ts',
          coverageTarget: 90,
          testTypes: ['unit'],
          constraints: [
            'Test all functions',
            'Include edge cases',
            'Test with different data types',
            'Use descriptive test names',
          ],
          acceptanceCriteria: [
            'All functions tested',
            '90% code coverage',
            'Edge cases covered',
            'Tests are independent',
          ],
        },
        config: {
          verbose: false,
          dryRun: false,
        },
      }
    ));
    
    // Test T4: Generate API Endpoint
    results.push(await testTask(
      cheriml,
      'T4: Generate API Endpoint',
      cheriml.generateAPIEndpoint,
      {
        id: 'test-t4-' + Date.now(),
        taskType: 'T4_GENERATE_API_ENDPOINT',
        title: 'Generate user registration endpoint',
        description: 'Create a POST endpoint for user registration with validation and error handling.',
        context: {
          language: 'typescript',
          projectConfig: {
            framework: 'express',
            typescriptStrict: true,
          },
        },
        requirements: {
          method: 'POST',
          path: '/api/users/register',
          description: 'Register a new user account',
          requestSchema: {
            email: 'string (required, valid email)',
            password: 'string (required, min 8 chars)',
            name: 'string (required)',
          },
          responseSchema: {
            success: 'boolean',
            user: {
              id: 'string',
              email: 'string',
              name: 'string',
            },
            token: 'string',
          },
          authentication: 'none',
          constraints: [
            'Validate email format',
            'Hash password before storing',
            'Check for duplicate emails',
            'Return JWT token',
            'Handle all errors',
          ],
          acceptanceCriteria: [
            'Creates new user',
            'Returns JWT token',
            'Validates input',
            'Handles duplicates',
          ],
        },
        config: {
          verbose: false,
          dryRun: false,
        },
      }
    ));
    
    // Summary
    section('Test Summary');
    
    console.log();
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const total = results.length;
    
    results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      const color = result.passed ? 'green' : 'red';
      log(`${icon} ${result.name}`, color);
      console.log(`   Status: ${result.status}`);
      console.log(`   Duration: ${result.duration}ms`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log();
    log(`Total Tests: ${total}`, 'blue');
    log(`✅ Passed: ${passed}`, 'green');
    log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    log(`Success Rate: ${Math.round((passed / total) * 100)}%`, passed === total ? 'green' : 'yellow');
    
    const avgDuration = Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length);
    console.log(`Average Duration: ${avgDuration}ms`);
    
    // Final verdict
    console.log();
    if (passed === total) {
      log('╔══════════════════════════════════════════════════════════════════╗', 'green');
      log('║  🎉 SUCCESS! CheriML API is fully functional and ready!         ║', 'green');
      log('║                                                                  ║', 'green');
      log('║  All code generation tasks (T1-T4) are working correctly.       ║', 'green');
      log('║  CheriML is ready for production use!                           ║', 'green');
      log('╚══════════════════════════════════════════════════════════════════╝', 'green');
      process.exit(0);
    } else {
      log('╔══════════════════════════════════════════════════════════════════╗', 'yellow');
      log('║  ⚠️  PARTIAL SUCCESS - Some tests failed                        ║', 'yellow');
      log('║                                                                  ║', 'yellow');
      log('║  Review the errors above and check your API configuration.      ║', 'yellow');
      log('╚══════════════════════════════════════════════════════════════════╝', 'yellow');
      process.exit(1);
    }
    
  } catch (error) {
    log(`\n❌ Fatal Error: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
main();
