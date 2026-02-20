# HeySalad AI - API Usage Guide

Complete guide to using the HeySalad AI unified API platform.

---

## Installation

```bash
npm install @heysalad/ai
```

---

## Quick Start

```typescript
import { createClient } from '@heysalad/ai';

// Create client
const client = createClient();

// Configure provider
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY,
});

// Send chat request
const response = await client.chat({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'user', content: 'Hello, world!' }
  ],
});

console.log(response.content);
```

---

## Provider Configuration

### OpenAI

```typescript
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo',
  timeout: 60000,
  retries: 3,
});

// Use it
const response = await client.chat({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

### Anthropic (Claude)

```typescript
client.configureProvider('anthropic', {
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-opus-20240229',
});

const response = await client.chat({
  model: 'claude-3-opus-20240229',
  messages: [{ role: 'user', content: 'Analyze this code...' }],
});
```

### Google Gemini

```typescript
client.configureProvider('gemini', {
  apiKey: process.env.GEMINI_API_KEY,
  defaultModel: 'gemini-2.0-flash',
});

const response = await client.chat({
  model: 'gemini-2.0-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing' }],
});
```

### HuggingFace

```typescript
// Using HuggingFace Inference API
client.configureProvider('huggingface', {
  apiKey: process.env.HF_API_KEY,
});

const response = await client.chat({
  model: 'meta-llama/Llama-2-7b-chat-hf',
  messages: [{ role: 'user', content: 'Hello!' }],
});

// Self-hosted endpoint
const selfHosted = HuggingFaceProvider.createSelfHosted({
  endpoint: 'http://localhost:8000',
});
```

---

## Chat Completions

### Basic Chat

```typescript
const response = await client.chat({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is TypeScript?' },
  ],
});

console.log(response.content);
console.log(response.usage?.totalTokens);
```

### With Parameters

```typescript
const response = await client.chat({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Write a poem' }],
  temperature: 0.9,        // Creativity (0-2)
  maxTokens: 500,          // Max response length
  metadata: {              // Custom metadata
    userId: 'user-123',
    sessionId: 'session-456',
  },
});
```

### Multi-turn Conversation

```typescript
const messages = [
  { role: 'system', content: 'You are a coding tutor.' },
  { role: 'user', content: 'How do I use async/await?' },
];

const response1 = await client.chat({
  model: 'gpt-4-turbo',
  messages,
});

// Add assistant response to history
messages.push({
  role: 'assistant',
  content: response1.content,
});

// Continue conversation
messages.push({
  role: 'user',
  content: 'Can you show me an example?',
});

const response2 = await client.chat({
  model: 'gpt-4-turbo',
  messages,
});
```

---

## Streaming

### Basic Streaming

```typescript
const stream = client.stream({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'user', content: 'Write a long story about AI' }
  ],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}
```

### Streaming with Processing

```typescript
let fullResponse = '';
let tokenCount = 0;

for await (const chunk of client.stream({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Explain machine learning' }],
})) {
  fullResponse += chunk.content;
  tokenCount++;
  
  // Process each chunk
  process.stdout.write(chunk.content);
  
  // Check finish reason
  if (chunk.finishReason === 'stop') {
    console.log('\n\nStream completed!');
    console.log(`Total chunks: ${tokenCount}`);
  }
}
```

---

## Multi-Provider Usage

### Using Multiple Providers

```typescript
// Configure multiple providers
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY,
});

client.configureProvider('anthropic', {
  apiKey: process.env.ANTHROPIC_API_KEY,
});

client.configureProvider('gemini', {
  apiKey: process.env.GEMINI_API_KEY,
});

// Use different providers for different tasks
const summary = await client.chat({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Summarize this...' }],
}, 'openai');

const analysis = await client.chat({
  model: 'claude-3-opus-20240229',
  messages: [{ role: 'user', content: 'Analyze deeply...' }],
}, 'anthropic');

const creative = await client.chat({
  model: 'gemini-2.0-flash',
  messages: [{ role: 'user', content: 'Write creatively...' }],
}, 'gemini');
```

### Provider Fallback

```typescript
async function chatWithFallback(request) {
  const providers = ['openai', 'anthropic', 'gemini'];
  
  for (const provider of providers) {
    try {
      return await client.chat(request, provider);
    } catch (error) {
      console.log(`${provider} failed, trying next...`);
    }
  }
  
  throw new Error('All providers failed');
}

const response = await chatWithFallback({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

---

## Action System

### Built-in Actions

```typescript
// List available actions
const actions = client.actions.list();
console.log(actions);
// [
//   { name: 'chat', description: 'Send a chat message using AI' },
//   { name: 'verify', description: 'Request human verification' },
//   { name: 'webhook', description: 'Send data to a webhook endpoint' }
// ]

// Execute an action
const result = await client.actions.execute('webhook', {
  url: 'https://api.example.com/webhook',
  data: { message: 'Hello from HeySalad!' },
});
```

### Custom Actions

```typescript
// Register custom action
client.actions.register({
  type: 'custom',
  name: 'send-email',
  description: 'Send an email notification',
  execute: async (params) => {
    // Your email sending logic
    const { to, subject, body } = params;
    
    // Send email...
    
    return {
      success: true,
      messageId: 'msg-123',
      timestamp: new Date(),
    };
  },
});

// Use custom action
const emailResult = await client.actions.execute('send-email', {
  to: 'user@example.com',
  subject: 'AI Analysis Complete',
  body: 'Your analysis is ready!',
});
```

### Workflow Example

```typescript
// AI-powered workflow with actions
async function analyzeAndNotify(data) {
  // Step 1: Analyze with AI
  const analysis = await client.chat({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: 'You are a data analyst.' },
      { role: 'user', content: `Analyze this data: ${JSON.stringify(data)}` },
    ],
  });
  
  // Step 2: Send webhook
  await client.actions.execute('webhook', {
    url: 'https://api.example.com/analysis',
    data: {
      analysis: analysis.content,
      timestamp: new Date(),
    },
  });
  
  // Step 3: Send notification
  await client.actions.execute('send-email', {
    to: 'team@example.com',
    subject: 'Analysis Complete',
    body: analysis.content,
  });
  
  return analysis;
}
```

---

## Model Management

### List Available Models

```typescript
// List models for a provider
const openaiModels = await client.listModels('openai');
console.log(openaiModels);
// ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', ...]

const geminiModels = await client.listModels('gemini');
console.log(geminiModels);
// ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro', ...]
```

### List Configured Providers

```typescript
const providers = client.listProviders();
console.log(providers);
// ['openai', 'anthropic', 'gemini']
```

### Set Default Provider

```typescript
client.setDefaultProvider('anthropic');

// Now this uses Anthropic by default
const response = await client.chat({
  model: 'claude-3-opus-20240229',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

---

## Error Handling

### Basic Error Handling

```typescript
try {
  const response = await client.chat({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: 'Hello!' }],
  });
  console.log(response.content);
} catch (error) {
  console.error('Chat failed:', error.message);
}
```

### Detailed Error Handling

```typescript
try {
  const response = await client.chat({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: 'Hello!' }],
  });
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('Invalid API key');
  } else if (error.message.includes('Rate limit')) {
    console.error('Rate limit exceeded, retry later');
  } else if (error.message.includes('timeout')) {
    console.error('Request timed out');
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Retry Logic

```typescript
async function chatWithRetry(request, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.chat(request);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

const response = await chatWithRetry({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

---

## Advanced Usage

### Custom Base URL

```typescript
// Use custom endpoint (e.g., proxy or self-hosted)
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://my-proxy.example.com/v1',
});
```

### Request Metadata

```typescript
const response = await client.chat({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
  metadata: {
    userId: 'user-123',
    sessionId: 'session-456',
    requestId: 'req-789',
    tags: ['production', 'customer-support'],
  },
});

// Metadata is preserved in response
console.log(response.metadata);
```

### Timeout Configuration

```typescript
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,  // 30 seconds
  retries: 3,      // Retry 3 times
});
```

---

## TypeScript Support

### Full Type Safety

```typescript
import {
  HeySaladAI,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  AIProvider,
} from '@heysalad/ai';

const client = new HeySaladAI();

// Type-safe request
const request: ChatCompletionRequest = {
  model: 'gpt-4-turbo',
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  maxTokens: 500,
};

// Type-safe response
const response: ChatCompletionResponse = await client.chat(request);

// Type-safe streaming
const stream: AsyncIterableIterator<StreamChunk> = client.stream(request);
```

---

## Best Practices

### 1. Environment Variables

```typescript
// ✅ Good - Use environment variables
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY,
});

// ❌ Bad - Hardcoded API keys
client.configureProvider('openai', {
  apiKey: 'sk-1234567890',
});
```

### 2. Error Handling

```typescript
// ✅ Good - Always handle errors
try {
  const response = await client.chat(request);
  return response.content;
} catch (error) {
  console.error('Chat failed:', error);
  throw error;
}

// ❌ Bad - No error handling
const response = await client.chat(request);
```

### 3. Provider Selection

```typescript
// ✅ Good - Choose provider based on task
const summary = await client.chat(request, 'openai');      // Fast
const analysis = await client.chat(request, 'anthropic');  // Deep thinking
const creative = await client.chat(request, 'gemini');     // Creative

// ❌ Bad - Using same provider for everything
```

### 4. Streaming for Long Responses

```typescript
// ✅ Good - Use streaming for long content
for await (const chunk of client.stream(request)) {
  process.stdout.write(chunk.content);
}

// ❌ Bad - Waiting for entire response
const response = await client.chat(request);  // Slow for long content
```

---

## Examples

See the `examples/` directory for complete examples:

- `examples/complete-platform.ts` - Full platform usage
- `examples/multi-provider.ts` - Multi-provider workflows
- `examples/streaming.ts` - Streaming examples
- `examples/actions.ts` - Custom actions

---

## Support

- **Documentation**: [docs/README.md](docs/README.md)
- **GitHub**: https://github.com/Hey-Salad/ai
- **Issues**: https://github.com/Hey-Salad/ai/issues

---

**Last Updated**: February 20, 2026
