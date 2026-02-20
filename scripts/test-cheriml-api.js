#!/usr/bin/env node
/**
 * CheriML API Test Script
 * Tests all code generation endpoints (T1-T4)
 *
 * Usage:
 *   node scripts/test-cheriml-api.js [url]
 *
 * Examples:
 *   node scripts/test-cheriml-api.js http://localhost:8788
 *   node scripts/test-cheriml-api.js https://ai.heysalad.app
 */

const baseURL = process.argv[2] || 'http://localhost:8788';

console.log('🧪 Testing CheriML API...');
console.log(`📍 Base URL: ${baseURL}\n`);

async function testEndpoint(name, endpoint, data) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${name}`);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`${'='.repeat(60)}`);

  const startTime = Date.now();

  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const elapsed = Date.now() - startTime;

    if (!response.ok) {
      const error = await response.text();
      console.log(`❌ FAILED (${response.status})`);
      console.log(`Response: ${error}`);
      return false;
    }

    const result = await response.json();
    console.log(`✅ SUCCESS (${elapsed}ms)`);
    console.log(`Status: ${result.status}`);
    console.log(`Task ID: ${result.id}`);

    if (result.output?.code) {
      console.log(`\nGenerated Code (first 500 chars):`);
      console.log('─'.repeat(60));
      console.log(result.output.code.substring(0, 500));
      if (result.output.code.length > 500) {
        console.log(`\n... (${result.output.code.length - 500} more characters)`);
      }
    }

    if (result.validation) {
      console.log(`\nValidation: ${result.validation.passed ? '✅ Passed' : '❌ Failed'}`);
      if (result.validation.errors?.length > 0) {
        console.log(`Errors: ${result.validation.errors.length}`);
        result.validation.errors.forEach(err => {
          console.log(`  - ${err.severity}: ${err.message}`);
        });
      }
    }

    if (result.metrics) {
      console.log(`\nMetrics:`);
      console.log(`  Time: ${result.metrics.timeElapsed}ms`);
      console.log(`  Lines: ${result.metrics.linesChanged || 0}`);
    }

    return true;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.log(`❌ ERROR (${elapsed}ms)`);
    console.log(`Message: ${error.message}`);
    return false;
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: Generate Function (T1)
  const t1Success = await testEndpoint(
    'T1: Generate Function',
    '/api/v1/code/function',
    {
      id: 'test-t1-' + Date.now(),
      title: 'Generate isPrime function',
      description: 'Create a TypeScript function that checks if a number is prime. It should handle edge cases like negative numbers and return a boolean.',
      context: {
        language: 'typescript',
        projectConfig: {
          typescriptStrict: true,
          testFramework: 'vitest',
        },
      },
      requirements: {
        functionName: 'isPrime',
        returnType: 'boolean',
        parameters: [
          { name: 'num', type: 'number' }
        ],
        constraints: [
          'Must be efficient for large numbers',
          'Handle negative numbers and zero',
          'Include JSDoc comments',
        ],
        acceptanceCriteria: [
          'Returns true for prime numbers',
          'Returns false for non-prime numbers',
          'Handles edge cases correctly',
        ],
      },
      config: {
        verbose: false,
        dryRun: false,
      },
    }
  );
  t1Success ? passed++ : failed++;

  // Test 2: Generate Component (T2)
  const t2Success = await testEndpoint(
    'T2: Generate Component',
    '/api/v1/code/component',
    {
      id: 'test-t2-' + Date.now(),
      title: 'Generate Button component',
      description: 'Create a reusable Button component with variants and loading state',
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
          { name: 'variant', type: 'primary | secondary | danger', required: false },
          { name: 'loading', type: 'boolean', required: false },
          { name: 'onClick', type: '() => void', required: false },
          { name: 'children', type: 'React.ReactNode', required: true },
        ],
        constraints: [
          'Use TypeScript interfaces',
          'Include accessibility attributes',
          'Handle loading state with spinner',
        ],
        acceptanceCriteria: [
          'Supports multiple variants',
          'Shows loading spinner when loading',
          'Fully typed with TypeScript',
        ],
      },
      config: {
        verbose: false,
        dryRun: false,
      },
    }
  );
  t2Success ? passed++ : failed++;

  // Test 3: API Info
  console.log(`\n${'='.repeat(60)}`);
  console.log('Testing: API Info');
  console.log(`${'='.repeat(60)}`);

  try {
    const response = await fetch(`${baseURL}/api/v1/code`);
    const info = await response.json();
    console.log('✅ API Info retrieved');
    console.log(`Name: ${info.name}`);
    console.log(`Version: ${info.version}`);
    console.log(`Tasks: ${info.tasks?.length || 0}`);
    passed++;
  } catch (error) {
    console.log('❌ Failed to get API info');
    failed++;
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('TEST SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total: ${passed + failed}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
