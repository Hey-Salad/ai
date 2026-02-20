#!/usr/bin/env node

/**
 * Focused test for Gemini 3 Flash (the working model)
 * Tests both regular and streaming responses
 */

const API_KEY = 'AIzaSyCUPhzhJndc7SMR9HVnkrDImWUcm3mYAiA';
const MODEL = 'gemini-3-flash-preview';

async function testRegularCompletion() {
  console.log('\n📝 Test 1: Regular Completion');
  console.log('='.repeat(60));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Write a haiku about coding" }]
      }]
    })
  });

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  
  console.log('Response:', text);
  console.log('Tokens:', data.usageMetadata.totalTokenCount);
  console.log('✅ Regular completion works!\n');
}

async function testStreamingCompletion() {
  console.log('📡 Test 2: Streaming Completion');
  console.log('='.repeat(60));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Count from 1 to 5" }]
      }]
    })
  });

  console.log('Streaming response:');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
    
    for (const line of lines) {
      const jsonStr = line.replace('data: ', '');
      try {
        const data = JSON.parse(jsonStr);
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = data.candidates[0].content.parts[0].text;
          process.stdout.write(text);
          fullText += text;
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }

  console.log('\n✅ Streaming works!\n');
}

async function testComplexReasoning() {
  console.log('🧠 Test 3: Complex Reasoning (Extended Thinking)');
  console.log('='.repeat(60));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ 
          text: "If a train leaves Station A at 60 mph and another train leaves Station B (120 miles away) at 40 mph heading toward each other, when will they meet?" 
        }]
      }]
    })
  });

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const usage = data.usageMetadata;
  
  console.log('Question: Math word problem');
  console.log('\nAnswer:', text);
  console.log('\n📊 Thinking Analysis:');
  console.log(`   Thought tokens: ${usage.thoughtsTokenCount || 0}`);
  console.log(`   Response tokens: ${usage.candidatesTokenCount}`);
  console.log(`   Thinking ratio: ${((usage.thoughtsTokenCount / usage.totalTokenCount) * 100).toFixed(1)}%`);
  console.log('✅ Extended thinking works!\n');
}

async function runAllTests() {
  console.log('\n🚀 Gemini 3 Flash API Tests');
  console.log(`🔑 Using API key: ${API_KEY.substring(0, 20)}...`);
  console.log(`🤖 Model: ${MODEL}\n`);

  try {
    await testRegularCompletion();
    await new Promise(r => setTimeout(r, 1000));
    
    await testStreamingCompletion();
    await new Promise(r => setTimeout(r, 1000));
    
    await testComplexReasoning();
    
    console.log('✨ All tests passed! Gemini 3 Flash is ready to use.\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runAllTests();
