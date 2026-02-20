#!/usr/bin/env node

/**
 * Test script for Google Gemini 3 API
 * Tests the three Gemini 3 models with extended thinking capability
 */

const API_KEY = 'AIzaSyCUPhzhJndc7SMR9HVnkrDImWUcm3mYAiA';
const PROJECT_NAME = 'projects/882320138928';

const MODELS = {
  'gemini-3.1-pro-preview': 'Balanced performance with 95 thought tokens',
  'gemini-3-flash-preview': 'Fast responses with 65 thought tokens',
  'gemini-3-pro-preview': 'Deep reasoning with 263 thought tokens'
};

async function testGeminiModel(modelName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${modelName}`);
  console.log(`Description: ${MODELS[modelName]}`);
  console.log('='.repeat(60));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: "Hello! Can you explain what makes you special in one sentence?"
      }]
    }]
  };

  try {
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const endTime = Date.now();
    const responseTime = ((endTime - startTime) / 1000).toFixed(2);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      console.error(`Response: ${errorText}`);
      return null;
    }

    const data = await response.json();
    
    console.log(`\n✅ Success! Response time: ${responseTime}s`);
    
    // Extract response text
    if (data.candidates && data.candidates[0]) {
      const candidate = data.candidates[0];
      const text = candidate.content?.parts?.[0]?.text || 'No text found';
      const thoughtSignature = candidate.content?.parts?.[0]?.thoughtSignature;
      
      console.log(`\n📝 Response:`);
      console.log(text);
      
      if (thoughtSignature) {
        console.log(`\n🧠 Thinking: Yes (signature: ${thoughtSignature.substring(0, 20)}...)`);
      }
    }
    
    // Show token usage
    if (data.usageMetadata) {
      const usage = data.usageMetadata;
      console.log(`\n📊 Token Usage:`);
      console.log(`   Prompt tokens: ${usage.promptTokenCount || 0}`);
      console.log(`   Response tokens: ${usage.candidatesTokenCount || 0}`);
      console.log(`   Thought tokens: ${usage.thoughtsTokenCount || 0}`);
      console.log(`   Total tokens: ${usage.totalTokenCount || 0}`);
    }
    
    // Show model version
    if (data.modelVersion) {
      console.log(`\n🏷️  Model version: ${data.modelVersion}`);
    }
    
    return data;
    
  } catch (error) {
    console.error(`❌ Error testing ${modelName}:`, error.message);
    return null;
  }
}

async function testAllModels() {
  console.log('\n🚀 Starting Gemini 3 API Tests');
  console.log(`📋 Project: ${PROJECT_NAME}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 20)}...`);
  
  const results = {};
  
  for (const [modelName, description] of Object.entries(MODELS)) {
    const result = await testGeminiModel(modelName);
    results[modelName] = result !== null;
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 Summary');
  console.log('='.repeat(60));
  
  for (const [modelName, success] of Object.entries(results)) {
    const status = success ? '✅ Working' : '❌ Failed';
    console.log(`${status} - ${modelName}`);
  }
  
  console.log('\n✨ Test complete!\n');
}

// Run the tests
testAllModels().catch(console.error);
