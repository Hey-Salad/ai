# @heysalad/ai

Unified AI provider interface for workflow automation. Build AI-powered workflows that work across OpenAI, Anthropic, AWS Bedrock, Google Vertex, and more.

## Features

- 🔄 **Multi-Provider Support**: OpenAI, Anthropic (+ Bedrock, Vertex, Groq coming soon)
- 🎯 **Unified API**: Same interface across all providers
- 🛠️ **Action System**: Built-in workflow actions (chat, verify, webhook)
- 🔐 **Security First**: Verification system for human-in-the-loop workflows
- 📦 **TypeScript Native**: Full type safety and autocomplete
- 🚀 **OpenClaw Ready**: Designed for workflow automation

## Installation

```bash
npm install @heysalad/ai
```

## Quick Start

```typescript
import { createClient } from '@heysalad/ai';

// Create client
const client = createClient();

// Configure providers
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY!,
  defaultModel: 'gpt-4-turbo',
});

client.configureProvider('anthropic', {
  apiKey: process.env.ANTHROPIC_API_KEY!,
  defaultModel: 'claude-opus-4-6',
});

// Chat with default provider
const response = await client.chat({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'user', content: 'Hello, world!' }
  ],
});

console.log(response.content);

// Chat with specific provider
const anthropicResponse = await client.chat({
  model: 'claude-opus-4-6',
  messages: [
    { role: 'user', content: 'Analyze this code...' }
  ],
}, 'anthropic');
```

## Streaming

```typescript
const stream = client.stream({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'user', content: 'Write a story...' }
  ],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
}
```

## Actions & Workflows

```typescript
// Register custom action
client.actions.register({
  type: 'custom',
  name: 'send-email',
  description: 'Send an email notification',
  execute: async (params) => {
    // Your email logic here
    return { sent: true, messageId: '123' };
  },
});

// Execute action
const result = await client.actions.execute('send-email', {
  to: 'user@example.com',
  subject: 'Hello',
  body: 'World',
});
```

## Provider Support

| Provider | Status | Models |
|----------|--------|--------|
| OpenAI | ✅ Ready | GPT-4, GPT-3.5, etc. |
| Anthropic | ✅ Ready | Claude Opus, Sonnet, Haiku |
| AWS Bedrock | 🔄 Coming Soon | All Bedrock models |
| Google Vertex | 🔄 Coming Soon | Gemini, PaLM |
| Hugging Face | 🔄 Coming Soon | Open source models |
| DeepSeek | 🔄 Coming Soon | DeepSeek models |
| Mistral | 🔄 Coming Soon | Mistral models |
| Groq | 🔄 Coming Soon | Fast inference |

## Configuration

```typescript
client.configureProvider('openai', {
  apiKey: 'sk-...',
  baseURL: 'https://api.openai.com/v1', // Optional
  defaultModel: 'gpt-4-turbo',
  timeout: 60000, // 60 seconds
  retries: 3,
  metadata: { /* custom metadata */ },
});
```

## Advanced Usage

### Multiple Providers

```typescript
// Use different providers for different tasks
const summary = await client.chat({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Summarize...' }],
}, 'openai');

const analysis = await client.chat({
  model: 'claude-opus-4-6',
  messages: [{ role: 'user', content: 'Analyze deeply...' }],
}, 'anthropic');
```

### List Models

```typescript
const models = await client.listModels('openai');
console.log(models);
```

## OpenClaw Integration

```typescript
// Perfect for OpenClaw workflows
import { createClient } from '@heysalad/ai';

const ai = createClient();
ai.configureProvider('anthropic', {
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Use in OpenClaw workflow
async function analyzeAndAct(input: string) {
  const analysis = await ai.chat({
    model: 'claude-opus-4-6',
    messages: [
      { role: 'system', content: 'You are a workflow automation expert.' },
      { role: 'user', content: input },
    ],
  });

  // Execute workflow action
  await ai.actions.execute('webhook', {
    url: 'https://api.example.com/action',
    data: { result: analysis.content },
  });
}
```

## License

MIT

## Links

- [GitHub](https://github.com/Hey-Salad/ai)
- [Dashboard](https://ai.heysalad.app)
- [Documentation](https://ai.heysalad.app/docs)
