#!/usr/bin/env node
/**
 * Direct CheriML Test - Tests the CheriML module directly without API
 * This tests the core functionality without needing a running server
 */

import { HeySaladAI } from '../packages/core/src/client.js';
import { createCheriML } from '../packages/core/src/cheri-ml/index.js';

console.log('🧪 Testing CheriML Module Directly...\n');

async function testCheriML() {
  try {
    // Check if we have a Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!geminiKey) {
      console.log('⚠️  No GEMINI_API_KEY found in environment');
      console.log('Please set GEMINI_API_KEY to test CheriML functionality');
      console.log('\nExample:');
      console.log('  export GEMINI_API_KEY="your_key_here"');
      console.log('  node scripts/test-cheriml-direct.js');
      process.exit(1);
    }

    console.log('✅ Found Gemini API key');
    console.log(`   Key: ${geminiKey.substring(0, 20)}...`);

    // Create HeySalad AI client
    console.log('\n📦 Creating HeySalad AI client...');
    const aiClient = new HeySaladAI({
      gemini: {
        apiKey: geminiKey,
      },
    });

    // Create CheriML client
    console.log('📦 Creating CheriML client...');
    const cheriml = createCheriML(aiClient, 'gemini', 'gemini-2.0-flash-exp');

    const providerInfo = cheriml.getProviderInfo();
    console.log(`   Provider: ${providerInfo.provider}`);
    console.log(`   Model: ${providerInfo.model}`);

    // Test T1: Generate Function
    console.log('\n' + '='.repeat(60));
    console.log('Test 1: Generate Function (T1)');
    console.log('='.repeat(60));

    const t1Request = {
      id: 'test-t1-' + Date.now(),
      taskType: 'T1_GENERATE_FUNCTION',
      title: 'Generate Fibonacci function',
      description: 'Create a TypeScript function that calculates the nth Fibonacci number using memoization for efficiency.',
      context: {
        language: 'typescript',
        projectConfig: {
          typescriptStrict: true,
          testFramework: 'vitest',
        },
      },
      requirements: {
        functionName: 'fibonacci',
        returnType: 'number',
        parameters: [
          { name: 'n', type: 'number' }
        ],
        constraints: [
          'Use memoization for efficiency',
          'Handle negative numbers',
          'Include JSDoc comments',
          'Export the function',
        ],
        acceptanceCriteria: [
          'Returns correct Fibonacci number',
          'Efficient for large numbers',
          'Handles edge cases',
        ],
      },
      config: {
        verbose: true,
        dryRun: false,
      },
    };

    console.log('Generating function...');
    const t1Result = await cheriml.generateFunction(t1Request);

    console.log(`\nStatus: ${t1Result.status}`);
    console.log(`Validation: ${t1Result.validation.passed ? '✅ Passed' : '❌ Failed'}`);
    
    if (t1Result.output.code) {
      console.log('\nGenerated Code:');
      console.log('─'.repeat(60));
      console.log(t1Result.output.code);
      console.log('─'.repeat(60));
    }

    if (t1Result.metrics) {
      console.log(`\nMetrics:`);
      console.log(`  Time: ${t1Result.metrics.timeElapsed}ms`);
      console.log(`  Lines: ${t1Result.metrics.linesChanged || 0}`);
    }

    if (t1Result.nextSteps) {
      console.log(`\nNext Steps:`);
      t1Result.nextSteps.forEach(step => console.log(`  - ${step}`));
    }

    // Test T2: Generate Component
    console.log('\n' + '='.repeat(60));
    console.log('Test 2: Generate Component (T2)');
    console.log('='.repeat(60));

    const t2Request = {
      id: 'test-t2-' + Date.now(),
      taskType: 'T2_GENERATE_COMPONENT',
      title: 'Generate Card component',
      description: 'Create a reusable Card component for displaying content with optional header, footer, and actions.',
      context: {
        language: 'typescript',
        projectConfig: {
          framework: 'react',
          typescriptStrict: true,
        },
      },
      requirements: {
        componentName: 'Card',
        framework: 'react',
        props: [
          { name: 'title', type: 'string', required: false },
          { name: 'children', type: 'React.ReactNode', required: true },
          { name: 'footer', type: 'React.ReactNode', required: false },
          { name: 'className', type: 'string', required: false },
        ],
        constraints: [
          'Use TypeScript interfaces',
          'Include accessibility attributes',
          'Support custom styling via className',
          'Use semantic HTML',
        ],
        acceptanceCriteria: [
          'Renders children content',
          'Optional title and footer',
          'Fully typed with TypeScript',
          'Accessible markup',
        ],
      },
      config: {
        verbose: true,
        dryRun: false,
      },
    };

    console.log('Generating component...');
    const t2Result = await cheriml.generateComponent(t2Request);

    console.log(`\nStatus: ${t2Result.status}`);
    console.log(`Validation: ${t2Result.validation.passed ? '✅ Passed' : '❌ Failed'}`);
    
    if (t2Result.output.code) {
      console.log('\nGenerated Code:');
      console.log('─'.repeat(60));
      console.log(t2Result.output.code);
      console.log('─'.repeat(60));
    }

    if (t2Result.metrics) {
      console.log(`\nMetrics:`);
      console.log(`  Time: ${t2Result.metrics.timeElapsed}ms`);
      console.log(`  Lines: ${t2Result.metrics.linesChanged || 0}`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    
    const tests = [
      { name: 'T1: Generate Function', result: t1Result },
      { name: 'T2: Generate Component', result: t2Result },
    ];

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
      const status = test.result.status === 'success' || test.result.status === 'needs_review' ? '✅' : '❌';
      console.log(`${status} ${test.name}: ${test.result.status}`);
      
      if (test.result.status === 'success' || test.result.status === 'needs_review') {
        passed++;
      } else {
        failed++;
      }
    });

    console.log(`\nTotal: ${tests.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${Math.round((passed / tests.length) * 100)}%`);

    if (failed === 0) {
      console.log('\n🎉 All tests passed! CheriML is working correctly.');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
testCheriML();
