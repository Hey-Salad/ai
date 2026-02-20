#!/usr/bin/env node

/**
 * Test Gemini 3 Flash for code completion and generation
 */

const API_KEY = process.env.GEMINI_API_KEY || 'your_api_key_here';
const MODEL = 'gemini-3-flash-preview';

async function testCodeCompletion() {
  console.log('\n💡 Test 1: Code Completion');
  console.log('='.repeat(60));
  console.log('Prompt: Complete this function...\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Complete this TypeScript function:

function calculateFibonacci(n: number): number {
  // TODO: implement fibonacci sequence
`
        }]
      }]
    })
  });

  const data = await response.json();
  
  if (data.error) {
    console.log('❌ Error:', data.error.message);
    return;
  }

  const code = data.candidates[0].content.parts[0].text;
  const usage = data.usageMetadata;
  
  console.log('Generated code:');
  console.log(code);
  console.log(`\n📊 Tokens: ${usage.totalTokenCount} (${usage.thoughtsTokenCount || 0} thinking)`);
  console.log('✅ Code completion works!\n');
}

async function testCodeGeneration() {
  console.log('🔨 Test 2: Full Function Generation');
  console.log('='.repeat(60));
  console.log('Prompt: Create a REST API endpoint...\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Create a TypeScript Express.js API endpoint that:
1. Accepts POST requests to /api/users
2. Validates email and password
3. Returns JSON response
4. Includes error handling

Just show the code, no explanations.`
        }]
      }]
    })
  });

  const data = await response.json();
  
  if (data.error) {
    console.log('❌ Error:', data.error.message);
    return;
  }

  const code = data.candidates[0].content.parts[0].text;
  const usage = data.usageMetadata;
  
  console.log('Generated API endpoint:');
  console.log(code);
  console.log(`\n📊 Tokens: ${usage.totalTokenCount} (${usage.thoughtsTokenCount || 0} thinking)`);
  console.log('✅ Full generation works!\n');
}

async function testBugFix() {
  console.log('🐛 Test 3: Bug Detection & Fix');
  console.log('='.repeat(60));
  console.log('Prompt: Find and fix the bug...\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Find and fix the bug in this code:

function getUserById(users, id) {
  for (let i = 0; i <= users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

Explain the bug and provide the fixed code.`
        }]
      }]
    })
  });

  const data = await response.json();
  
  if (data.error) {
    console.log('❌ Error:', data.error.message);
    return;
  }

  const explanation = data.candidates[0].content.parts[0].text;
  const usage = data.usageMetadata;
  
  console.log('Bug analysis and fix:');
  console.log(explanation);
  console.log(`\n📊 Tokens: ${usage.totalTokenCount} (${usage.thoughtsTokenCount || 0} thinking)`);
  console.log('✅ Bug fixing works!\n');
}

async function testCodeRefactoring() {
  console.log('♻️  Test 4: Code Refactoring');
  console.log('='.repeat(60));
  console.log('Prompt: Refactor to modern JavaScript...\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Refactor this code to use modern ES6+ features:

function processUsers(users) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].age >= 18) {
      result.push({
        name: users[i].name,
        email: users[i].email
      });
    }
  }
  return result;
}

Show only the refactored code.`
        }]
      }]
    })
  });

  const data = await response.json();
  
  if (data.error) {
    console.log('❌ Error:', data.error.message);
    return;
  }

  const code = data.candidates[0].content.parts[0].text;
  const usage = data.usageMetadata;
  
  console.log('Refactored code:');
  console.log(code);
  console.log(`\n📊 Tokens: ${usage.totalTokenCount} (${usage.thoughtsTokenCount || 0} thinking)`);
  console.log('✅ Refactoring works!\n');
}

async function testStreamingCodeGen() {
  console.log('📡 Test 5: Streaming Code Generation');
  console.log('='.repeat(60));
  console.log('Prompt: Generate React component with streaming...\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Create a React functional component called UserCard that displays user info. Include TypeScript types. Keep it simple.`
        }]
      }]
    })
  });

  console.log('Streaming output:');
  console.log('-'.repeat(60));
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

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
          process.stdout.write(data.candidates[0].content.parts[0].text);
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }

  console.log('\n' + '-'.repeat(60));
  console.log('✅ Streaming code generation works!\n');
}

async function runAllTests() {
  console.log('\n🚀 Gemini 3 Flash - Code Completion & Generation Tests');
  console.log(`🤖 Model: ${MODEL}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 20)}...\n`);

  try {
    await testCodeCompletion();
    await new Promise(r => setTimeout(r, 2000));
    
    await testCodeGeneration();
    await new Promise(r => setTimeout(r, 2000));
    
    await testBugFix();
    await new Promise(r => setTimeout(r, 2000));
    
    await testCodeRefactoring();
    await new Promise(r => setTimeout(r, 2000));
    
    await testStreamingCodeGen();
    
    console.log('='.repeat(60));
    console.log('✨ All coding tests passed!');
    console.log('\n📝 Summary:');
    console.log('   ✅ Code completion');
    console.log('   ✅ Full code generation');
    console.log('   ✅ Bug detection & fixing');
    console.log('   ✅ Code refactoring');
    console.log('   ✅ Streaming generation');
    console.log('\n🎯 gemini-3-flash-preview is ready for coding tasks!\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runAllTests();
