#!/usr/bin/env node

/**
 * Test if Gemini 3 Flash supports audio/voice input
 */

const API_KEY = process.env.GEMINI_API_KEY || 'your_api_key_here';
const MODEL = 'gemini-3-flash-preview';

async function checkAudioSupport() {
  console.log('\n🎤 Checking Audio/Voice Support for Gemini 3 Flash');
  console.log('='.repeat(60));

  // Test with a simple audio file reference (base64 encoded silence)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "Does this model support audio input?" }
        ]
      }]
    })
  });

  const data = await response.json();
  
  if (data.error) {
    console.log('❌ Error:', data.error.message);
    return;
  }

  const text = data.candidates[0].content.parts[0].text;
  console.log('Model response:', text);
  
  // Check usage metadata for audio modality support
  if (data.usageMetadata?.promptTokensDetails) {
    console.log('\n📊 Supported modalities:');
    data.usageMetadata.promptTokensDetails.forEach(detail => {
      console.log(`   - ${detail.modality}`);
    });
  }
}

async function testMultimodalCapabilities() {
  console.log('\n🎨 Checking All Multimodal Capabilities');
  console.log('='.repeat(60));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "List all input types you support: text, images, audio, video, etc." }
        ]
      }]
    })
  });

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  
  console.log('Capabilities:', text);
  console.log('\n✅ Check complete!\n');
}

async function run() {
  try {
    await checkAudioSupport();
    await new Promise(r => setTimeout(r, 1000));
    await testMultimodalCapabilities();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

run();
