#!/usr/bin/env node

/**
 * Comprehensive API Test Script
 * Tests all providers and features of HeySalad AI
 */

const { HeySaladAI } = require('../packages/core/dist/index.js');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function testProvider(client, provider, config, model) {
  section(`Testing ${provider.toUpperCase()} Provider`);

  try {
    // Configure provider
    log(`\n1. Configuring ${provider}...`, 'blue');
    client.configureProvider(provider, config);
    log('✓ Provider configured successfully', 'green');

    // List models
    log(`\n2. Listing available models...`, 'blue');
    const models = await client.listModels(provider);
    log(`✓ Found ${models.length} models`, 'green');
    console.log(`   Models: ${models.slice(0, 3).join(', ')}...`);

    // Test chat completion
    log(`\n3. Testing chat completion...`, 'blue');
    const chatResponse = await client.chat({
      model,
      messages: [
        { role: 'user', content: 'Say "Hello from HeySalad AI!" and nothing else.' }
      ],
    }, provider);
    log('✓ Chat completion successful', 'green');
    console.log(`   Response: ${chatResponse.content.substring(0, 100)}...`);
    console.log(`   Model: ${chatResponse.model}`);
    console.log(`   Tokens: ${chatResponse.usage?.totalTokens || 'N/A'}`);

    // Test streaming
    log(`\n4. Testing streaming...`, 'blue');
    const chunks = [];
    for await (const chunk of client.stream({
      model,
      messages: [
        { role: 'user', content: 'Count to 3 slowly.' }
      ],
    }, provider)) {
      chunks.push(chunk.content);
      process.stdout.write('.');
    }
    console.log();
    log(`✓ Streaming successful (${chunks.length} chunks)`, 'green');
    console.log(`   Full response: ${chunks.join('')}`);

    log(`\n✓ All ${provider} tests passed!`, 'green');
    return true;
  } catch (error) {
    log(`\n✗ ${provider} test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testActions(client) {
  section('Testing Action System');

  try {
    log('\n1. Listing available actions...', 'blue');
    const actions = client.actions.list();
    log(`✓ Found ${actions.length} actions`, 'green');
    actions.forEach(action => {
      console.log(`   - ${action.name}: ${action.description}`);
    });

    log('\n2. Registering custom action...', 'blue');
    client.actions.register({
      type: 'custom',
      name: 'test-action',
      description: 'A test action',
      execute: async (params) => {
        return { success: true, message: 'Test action executed', params };
      },
    });
    log('✓ Custom action registered', 'green');

    log('\n3. Executing custom action...', 'blue');
    const result = await client.actions.execute('test-action', { test: 'data' });
    log('✓ Action executed successfully', 'green');
    console.log(`   Result: ${JSON.stringify(result)}`);

    log('\n✓ All action tests passed!', 'green');
    return true;
  } catch (error) {
    log(`\n✗ Action test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testMultiProvider(client) {
  section('Testing Multi-Provider Support');

  try {
    log('\n1. Listing configured providers...', 'blue');
    const providers = client.listProviders();
    log(`✓ Found ${providers.length} configured providers`, 'green');
    console.log(`   Providers: ${providers.join(', ')}`);

    log('\n2. Testing provider switching...', 'blue');
    if (providers.length >= 2) {
      const [provider1, provider2] = providers;
      
      log(`   Testing ${provider1}...`, 'blue');
      const response1 = await client.chat({
        model: provider1 === 'openai' ? 'gpt-3.5-turbo' : 
               provider1 === 'anthropic' ? 'claude-3-haiku-20240307' :
               provider1 === 'gemini' ? 'gemini-2.0-flash' :
               'meta-llama/Llama-2-7b-chat-hf',
        messages: [{ role: 'user', content: 'Hi' }],
      }, provider1);
      log(`   ✓ ${provider1} response received`, 'green');

      log(`   Testing ${provider2}...`, 'blue');
      const response2 = await client.chat({
        model: provider2 === 'openai' ? 'gpt-3.5-turbo' : 
               provider2 === 'anthropic' ? 'claude-3-haiku-20240307' :
               provider2 === 'gemini' ? 'gemini-2.0-flash' :
               'meta-llama/Llama-2-7b-chat-hf',
        messages: [{ role: 'user', content: 'Hi' }],
      }, provider2);
      log(`   ✓ ${provider2} response received`, 'green');

      log('✓ Provider switching works correctly', 'green');
    } else {
      log('⚠ Only one provider configured, skipping switch test', 'yellow');
    }

    log('\n✓ All multi-provider tests passed!', 'green');
    return true;
  } catch (error) {
    log(`\n✗ Multi-provider test failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         HeySalad AI - Comprehensive API Test Suite        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  const client = new HeySaladAI();
  const results = [];

  // Check for API keys
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasHuggingFace = !!process.env.HF_API_KEY;

  log('\nAPI Key Status:', 'blue');
  log(`  OpenAI: ${hasOpenAI ? '✓' : '✗'}`, hasOpenAI ? 'green' : 'yellow');
  log(`  Anthropic: ${hasAnthropic ? '✓' : '✗'}`, hasAnthropic ? 'green' : 'yellow');
  log(`  Gemini: ${hasGemini ? '✓' : '✗'}`, hasGemini ? 'green' : 'yellow');
  log(`  HuggingFace: ${hasHuggingFace ? '✓' : '✗'}`, hasHuggingFace ? 'green' : 'yellow');

  // Test OpenAI
  if (hasOpenAI) {
    const result = await testProvider(
      client,
      'openai',
      { apiKey: process.env.OPENAI_API_KEY },
      'gpt-3.5-turbo'
    );
    results.push({ provider: 'OpenAI', passed: result });
  } else {
    log('\n⚠ Skipping OpenAI tests (no API key)', 'yellow');
  }

  // Test Anthropic
  if (hasAnthropic) {
    const result = await testProvider(
      client,
      'anthropic',
      { apiKey: process.env.ANTHROPIC_API_KEY },
      'claude-3-haiku-20240307'
    );
    results.push({ provider: 'Anthropic', passed: result });
  } else {
    log('\n⚠ Skipping Anthropic tests (no API key)', 'yellow');
  }

  // Test Gemini
  if (hasGemini) {
    const result = await testProvider(
      client,
      'gemini',
      { apiKey: process.env.GEMINI_API_KEY },
      'gemini-2.0-flash'
    );
    results.push({ provider: 'Gemini', passed: result });
  } else {
    log('\n⚠ Skipping Gemini tests (no API key)', 'yellow');
  }

  // Test HuggingFace
  if (hasHuggingFace) {
    const result = await testProvider(
      client,
      'huggingface',
      { apiKey: process.env.HF_API_KEY },
      'meta-llama/Llama-2-7b-chat-hf'
    );
    results.push({ provider: 'HuggingFace', passed: result });
  } else {
    log('\n⚠ Skipping HuggingFace tests (no API key)', 'yellow');
  }

  // Test Actions
  const actionsResult = await testActions(client);
  results.push({ provider: 'Actions', passed: actionsResult });

  // Test Multi-Provider
  if (client.listProviders().length > 0) {
    const multiResult = await testMultiProvider(client);
    results.push({ provider: 'Multi-Provider', passed: multiResult });
  }

  // Summary
  section('Test Summary');
  console.log();
  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  results.forEach(result => {
    const status = result.passed ? '✓' : '✗';
    const color = result.passed ? 'green' : 'red';
    log(`  ${status} ${result.provider}`, color);
  });

  console.log();
  if (passed === total) {
    log(`\n🎉 All tests passed! (${passed}/${total})`, 'green');
    process.exit(0);
  } else {
    log(`\n⚠ Some tests failed (${passed}/${total} passed)`, 'yellow');
    process.exit(1);
  }
}

// Run tests
main().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
