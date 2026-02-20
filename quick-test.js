#!/usr/bin/env node
/**
 * HeySalad AI Quick Test Script
 * Tests the platform with Hugging Face API
 *
 * Usage:
 *   export HF_API_KEY="your_token_here"
 *   node quick-test.js
 */

const { HeySaladAI } = require('./packages/core/dist/client');
const { createRouter } = require('./packages/core/dist/router');

async function testHeySaladAI() {
  console.log('🚀 HeySalad AI - Quick Test');
  console.log('=' .repeat(50));
  console.log('');

  // Check for API key
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: HF_API_KEY environment variable not set');
    console.log('');
    console.log('To fix this:');
    console.log('1. Visit https://huggingface.co');
    console.log('2. Sign up or log in');
    console.log('3. Go to Settings → Access Tokens');
    console.log('4. Create a new token');
    console.log('5. Run: export HF_API_KEY="your_token_here"');
    console.log('6. Run this script again');
    console.log('');
    process.exit(1);
  }

  try {
    console.log('✅ HF_API_KEY found');
    console.log('');

    // Initialize client
    console.log('📦 Initializing HeySalad AI client...');
    const client = new HeySaladAI();

    // Configure Hugging Face provider
    client.configureProvider('huggingface', {
      apiKey: apiKey,
    });
    console.log('✅ Hugging Face provider configured');
    console.log('');

    // Test 1: Simple chat completion
    console.log('🧪 Test 1: Simple Chat Completion');
    console.log('-'.repeat(50));
    console.log('Sending: "What is HeySalad?"');

    const response1 = await client.chat({
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      messages: [
        { role: 'user', content: 'What is HeySalad? Answer in one sentence.' }
      ],
      maxTokens: 100,
    });

    console.log('Response:', response1.content);
    console.log('✅ Test 1 passed');
    console.log('');

    // Test 2: Intelligent Router
    console.log('🧪 Test 2: Intelligent Router');
    console.log('-'.repeat(50));

    const router = createRouter(client, {
      primaryProviders: ['huggingface'],
      costOptimization: true,
    });

    console.log('Sending: "Tell me a short joke"');
    const response2 = await router.chat({
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      messages: [
        { role: 'user', content: 'Tell me a short joke about AI.' }
      ],
      maxTokens: 100,
    });

    console.log('Response:', response2.content);
    console.log('✅ Test 2 passed');
    console.log('');

    // Summary
    console.log('🎉 All Tests Passed!');
    console.log('=' .repeat(50));
    console.log('');
    console.log('Your HeySalad AI platform is working perfectly!');
    console.log('');
    console.log('Next steps:');
    console.log('1. ✅ Core AI client - WORKING');
    console.log('2. ✅ HF API integration - WORKING');
    console.log('3. ✅ Intelligent routing - WORKING');
    console.log('4. 📋 Deploy RAG system (packages/grocery-rag)');
    console.log('5. 🚀 Launch GPU instance for custom model');
    console.log('6. 🎯 Train HeySalad-7B');
    console.log('');
    console.log('See DEPLOYMENT_MASTER_PLAN.md for full deployment guide');
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('Common issues:');
    console.log('- Invalid HF_API_KEY: Check your token at huggingface.co');
    console.log('- Network error: Check your internet connection');
    console.log('- Rate limit: Wait a moment and try again');
    console.log('');
    process.exit(1);
  }
}

// Run tests
testHeySaladAI().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
