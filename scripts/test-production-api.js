#!/usr/bin/env node

/**
 * Production CheriML API Test Suite
 * Tests all endpoints on the deployed Cloudflare Pages instance
 */

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

// Get production URL from command line or use default
const PRODUCTION_URL = process.argv[2] || 'https://heysalad-ai.pages.dev';

async function testEndpoint(name, method, path, body = null) {
  section(`Testing: ${name}`);
  
  const url = `${PRODUCTION_URL}${path}`;
  log(`\n📍 URL: ${url}`, 'blue');
  log(`📋 Method: ${method}`, 'blue');
  
  if (body) {
    log(`\n📝 Request Body:`, 'blue');
    console.log(JSON.stringify(body, null, 2));
  }
  
  const startTime = Date.now();
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    log(`\n⏳ Sending request...`, 'yellow');
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    log(`\n📊 Response Status: ${response.status} ${response.statusText}`, 
        response.ok ? 'green' : 'red');
    log(`⏱️  Duration: ${duration}ms`, 'blue');
    
    const contentType = response.headers.get('content-type');
    log(`📄 Content-Type: ${contentType}`, 'blue');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      log(`\n✅ Response Data:`, 'green');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      log(`\n📄 Response Text:`, 'yellow');
      console.log(text.substring(0, 500));
    }
    
    return {
      name,
      passed: response.ok,
      status: response.status,
      duration,
      data,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    log(`\n❌ Request Failed: ${error.message}`, 'red');
    console.error(error);
    
    return {
      name,
      passed: false,
      status: 'error',
      duration,
      error: error.message,
    };
  }
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         CheriML Production API Test Suite                       ║', 'cyan');
  log('║         Testing Deployed Cloudflare Pages Instance              ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`\n🌐 Production URL: ${PRODUCTION_URL}`, 'blue');
  log(`📅 Test Date: ${new Date().toISOString()}`, 'blue');
  
  const results = [];
  
  // Test 1: Health Check
  results.push(await testEndpoint(
    'Health Check',
    'GET',
    '/api/cheriml/health'
  ));
  
  // Test 2: Generate Function (T1)
  results.push(await testEndpoint(
    'Generate Function (T1)',
    'POST',
    '/api/cheriml/generate-function',
    {
      title: 'Generate add function',
      description: 'Create a simple function that adds two numbers',
      language: 'typescript',
      functionName: 'add',
      returnType: 'number',
      parameters: [
        { name: 'a', type: 'number' },
        { name: 'b', type: 'number' }
      ],
      constraints: ['Must be a pure function', 'Include JSDoc comments'],
      acceptanceCriteria: ['Returns sum of two numbers', 'Handles all number types']
    }
  ));
  
  // Test 3: Generate Component (T2)
  results.push(await testEndpoint(
    'Generate Component (T2)',
    'POST',
    '/api/cheriml/generate-component',
    {
      title: 'Generate Button component',
      description: 'Create a simple reusable button component',
      language: 'typescript',
      componentName: 'Button',
      framework: 'react',
      props: [
        { name: 'children', type: 'React.ReactNode', required: true },
        { name: 'onClick', type: '() => void', required: false },
        { name: 'disabled', type: 'boolean', required: false }
      ],
      constraints: ['Use TypeScript', 'Include accessibility attributes'],
      acceptanceCriteria: ['Renders children', 'Handles click events', 'Fully typed']
    }
  ));
  
  // Test 4: Generate Test Suite (T3)
  results.push(await testEndpoint(
    'Generate Test Suite (T3)',
    'POST',
    '/api/cheriml/generate-test',
    {
      title: 'Generate tests for add function',
      description: 'Create comprehensive test suite',
      language: 'typescript',
      code: 'export function add(a: number, b: number): number { return a + b; }',
      targetFunction: 'add',
      testFramework: 'vitest',
      coverageTarget: 80,
      constraints: ['Test edge cases', 'Use descriptive names'],
      acceptanceCriteria: ['80% coverage', 'All edge cases covered']
    }
  ));
  
  // Test 5: Generate API Endpoint (T4)
  results.push(await testEndpoint(
    'Generate API Endpoint (T4)',
    'POST',
    '/api/cheriml/generate-endpoint',
    {
      title: 'Generate GET user endpoint',
      description: 'Create endpoint to retrieve user by ID',
      language: 'typescript',
      method: 'GET',
      path: '/api/users/:id',
      authentication: 'jwt',
      constraints: ['Validate user ID', 'Handle not found', 'Return proper errors'],
      acceptanceCriteria: ['Returns user data', 'Handles errors', 'Validates input']
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
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'blue');
  log(`Total Tests: ${total}`, 'blue');
  log(`✅ Passed: ${passed}`, passed > 0 ? 'green' : 'red');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${Math.round((passed / total) * 100)}%`, passed === total ? 'green' : 'yellow');
  
  const avgDuration = Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length);
  console.log(`Average Response Time: ${avgDuration}ms`);
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'blue');
  
  // Final verdict
  console.log();
  if (passed === total) {
    log('╔══════════════════════════════════════════════════════════════════╗', 'green');
    log('║  🎉 SUCCESS! Production API is fully functional!                ║', 'green');
    log('║                                                                  ║', 'green');
    log('║  All CheriML endpoints (T1-T4) are working correctly.           ║', 'green');
    log('║  Your production deployment is ready for use!                   ║', 'green');
    log('╚══════════════════════════════════════════════════════════════════╝', 'green');
    process.exit(0);
  } else if (passed > 0) {
    log('╔══════════════════════════════════════════════════════════════════╗', 'yellow');
    log('║  ⚠️  PARTIAL SUCCESS - Some endpoints failed                    ║', 'yellow');
    log('║                                                                  ║', 'yellow');
    log('║  Review the errors above. Common issues:                        ║', 'yellow');
    log('║  • API secrets not configured in Cloudflare                     ║', 'yellow');
    log('║  • Deployment still in progress                                 ║', 'yellow');
    log('║  • Network connectivity issues                                  ║', 'yellow');
    log('╚══════════════════════════════════════════════════════════════════╝', 'yellow');
    process.exit(1);
  } else {
    log('╔══════════════════════════════════════════════════════════════════╗', 'red');
    log('║  ❌ FAILURE - API is not responding                             ║', 'red');
    log('║                                                                  ║', 'red');
    log('║  Possible causes:                                               ║', 'red');
    log('║  • Application not deployed yet                                 ║', 'red');
    log('║  • Wrong production URL                                         ║', 'red');
    log('║  • Deployment failed                                            ║', 'red');
    log('║  • Network issues                                               ║', 'red');
    log('╚══════════════════════════════════════════════════════════════════╝', 'red');
    process.exit(1);
  }
}

// Run tests
main().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
