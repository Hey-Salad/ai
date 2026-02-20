# Gemini 3 Models Implementation Guide

## Focus Models for HeySalad Integration

We're implementing support for three Gemini 3 models with **Extended Thinking** capability:

---

## 1. gemini-3.1-pro-preview

**Best for:** Latest features with balanced performance

### Characteristics
- ✅ Extended Thinking: 95 thought tokens
- ✅ Response Speed: Medium (~5 seconds)
- ✅ Quality: Excellent
- ✅ Production Ready: Preview but stable

### Token Economics
```
Prompt Tokens:    2
Response Tokens:  9
Thought Tokens:   95
Total Tokens:     106
```

### Example Response
```json
{
  "candidates": [{
    "content": {
      "role": "model",
      "parts": [{
        "text": "Hello! How can I help you today?",
        "thoughtSignature": "CmMBjz1rX6gGlecA3TmZ7uPq..."
      }]
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": {
    "promptTokenCount": 2,
    "candidatesTokenCount": 9,
    "totalTokenCount": 106,
    "trafficType": "ON_DEMAND"
  },
  "modelVersion": "gemini-3.1-pro-preview",
  "createTime": "2026-02-19T22:11:22.267218Z",
  "responseId": "ioqXadKnEImuvNkP1enAmAk"
}
```

### Use Cases
- General purpose AI tasks
- Complex reasoning problems
- Content generation
- Code assistance
- Analysis and summarization

---

## 2. gemini-3-flash-preview

**Best for:** Fast responses with thinking capability

### Characteristics
- ✅ Extended Thinking: 65 thought tokens
- ✅ Response Speed: Fast (~3 seconds)
- ✅ Quality: Very Good
- ✅ Production Ready: Preview but stable

### Token Economics
```
Prompt Tokens:    2
Response Tokens:  9
Thought Tokens:   65
Total Tokens:     76
```

### Example Response
```json
{
  "candidates": [{
    "content": {
      "role": "model",
      "parts": [{
        "text": "Hello! How can I help you today?",
        "thoughtSignature": "CiQBjz1rX94p1vOFXtHLlpbU..."
      }]
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": {
    "promptTokenCount": 2,
    "candidatesTokenCount": 9,
    "totalTokenCount": 76,
    "trafficType": "ON_DEMAND"
  },
  "modelVersion": "gemini-3-flash-preview",
  "createTime": "2026-02-19T22:11:25.555734Z",
  "responseId": "jYqXadb1IZfPhcIP1cuVwAY"
}
```

### Use Cases
- Real-time chat applications
- Quick Q&A
- Customer support
- Simple reasoning tasks
- High-throughput scenarios

---

## 3. gemini-3-pro-preview

**Best for:** Deep reasoning with maximum thinking tokens

### Characteristics
- ✅ Extended Thinking: 263 thought tokens (HIGHEST!)
- ⚠️ Response Speed: Slow (~6 seconds)
- ✅ Quality: Best
- ✅ Production Ready: Preview but stable

### Token Economics
```
Prompt Tokens:    2
Response Tokens:  9
Thought Tokens:   263
Total Tokens:     274
```

### Example Response
```json
{
  "candidates": [{
    "content": {
      "role": "model",
      "parts": [{
        "text": "Hello! How can I help you today?",
        "thoughtSignature": "ClkBjz1rXz/rHvwyXE3lHrgZ..."
      }]
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": {
    "promptTokenCount": 2,
    "candidatesTokenCount": 9,
    "totalTokenCount": 274,
    "thoughtsTokenCount": 263,
    "trafficType": "ON_DEMAND"
  },
  "modelVersion": "gemini-3-pro-preview",
  "createTime": "2026-02-19T22:11:27.800682Z",
  "responseId": "j4qXaarvMKaRkDtZDk..."
}
```

### Use Cases
- Complex problem solving
- Mathematical reasoning
- Deep analysis
- Research tasks
- Strategic planning
- Code debugging with detailed reasoning

---

## Implementation Comparison

| Feature | 3.1 Pro | 3 Flash | 3 Pro |
|---------|---------|---------|-------|
| **Speed** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Thinking Depth** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Cost (tokens)** | 106 | 76 | 274 |
| **Best For** | Balanced | Speed | Reasoning |

---

## API Configuration

### Endpoint Template
```
https://aiplatform.googleapis.com/v1/publishers/google/models/{MODEL_NAME}:streamGenerateContent?key={API_KEY}
```

### API Key
```
AQ.Ab8RN6KEEs9pIcRoGvul1NVTF8UItwUHo-wqlgtYUDT7uTzJkw
```

### Model Names
```typescript
const GEMINI_MODELS = {
  PRO_3_1: 'gemini-3.1-pro-preview',
  FLASH_3: 'gemini-3-flash-preview',
  PRO_3: 'gemini-3-pro-preview'
}
```

---

## Request Format

```typescript
interface GeminiRequest {
  contents: Array<{
    role: 'user' | 'model'
    parts: Array<{
      text: string
    }>
  }>
  // Optional parameters
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
  }
}
```

### Example Request
```bash
curl "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-3.1-pro-preview:streamGenerateContent?key=${API_KEY}" \
-X POST \
-H "Content-Type: application/json" \
-d '{
  "contents": [{
    "role": "user",
    "parts": [{"text": "Explain quantum computing"}]
  }]
}'
```

---

## Response Format

### Streaming Response Structure
```typescript
interface GeminiStreamChunk {
  candidates: Array<{
    content: {
      role: 'model'
      parts: Array<{
        text: string
        thoughtSignature?: string  // Base64 encoded thinking
      }>
    }
    finishReason?: 'STOP' | 'MAX_TOKENS' | 'SAFETY'
    avgLogprobs?: number
  }>
  usageMetadata?: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
    thoughtsTokenCount?: number
    trafficType: 'ON_DEMAND'
    promptTokensDetails: Array<{
      modality: 'TEXT' | 'IMAGE' | 'AUDIO'
      tokenCount: number
    }>
    candidatesTokensDetails: Array<{
      modality: 'TEXT' | 'IMAGE' | 'AUDIO'
      tokenCount: number
    }>
  }
  modelVersion: string
  createTime: string
  responseId: string
}
```

### Key Response Fields

1. **text** - The actual response content
2. **thoughtSignature** - Base64 encoded thinking process (unique to Gemini 3)
3. **finishReason** - Why generation stopped
4. **usageMetadata** - Token counts and costs
5. **thoughtsTokenCount** - Number of tokens used for thinking

---

## Implementation Tasks

### 1. Create Gemini Provider
```typescript
// packages/core/src/providers/gemini.ts
export class GeminiProvider implements Provider {
  async complete(params: CompletionParams): Promise<string> {
    // Implementation
  }

  async stream(params: CompletionParams): AsyncIterator<string> {
    // Implementation
  }

  extractThinking(thoughtSignature: string): string {
    // Decode and extract thinking
  }
}
```

### 2. Handle Streaming Responses
- Parse JSON stream chunks
- Combine text fragments
- Extract thoughtSignature
- Track token usage

### 3. Error Handling
```typescript
interface GeminiError {
  error: {
    code: 400 | 404 | 429 | 500
    message: string
    status: 'INVALID_ARGUMENT' | 'NOT_FOUND' | 'RESOURCE_EXHAUSTED' | 'INTERNAL'
  }
}
```

Common errors:
- **404**: Model not found or no access
- **429**: Rate limit exceeded
- **401**: Invalid API key
- **400**: Invalid request format

### 4. Model Selection Logic
```typescript
function selectGeminiModel(task: TaskType): string {
  switch (task) {
    case 'quick-response':
      return GEMINI_MODELS.FLASH_3  // Fast
    case 'deep-reasoning':
      return GEMINI_MODELS.PRO_3    // Deep thinking
    default:
      return GEMINI_MODELS.PRO_3_1  // Balanced
  }
}
```

---

## Testing Strategy

### 1. Basic Completion Test
```typescript
test('gemini-3.1-pro-preview generates text', async () => {
  const response = await gemini.complete({
    model: 'gemini-3.1-pro-preview',
    prompt: 'Say hello'
  })
  expect(response).toContain('hello')
})
```

### 2. Streaming Test
```typescript
test('gemini-3-flash-preview streams responses', async () => {
  const chunks = []
  for await (const chunk of gemini.stream({
    model: 'gemini-3-flash-preview',
    prompt: 'Count to 5'
  })) {
    chunks.push(chunk)
  }
  expect(chunks.length).toBeGreaterThan(1)
})
```

### 3. Thinking Extraction Test
```typescript
test('gemini-3-pro-preview includes thinking', async () => {
  const response = await gemini.completeWithThinking({
    model: 'gemini-3-pro-preview',
    prompt: 'Solve 2+2'
  })
  expect(response.thinking).toBeDefined()
  expect(response.thoughtTokens).toBeGreaterThan(0)
})
```

---

## Performance Metrics

### Average Response Times (Simple Prompt)
- **gemini-3-flash-preview**: ~3 seconds
- **gemini-3.1-pro-preview**: ~5 seconds
- **gemini-3-pro-preview**: ~6 seconds

### Token Efficiency (Same Prompt)
- **gemini-3-flash-preview**: 76 total tokens
- **gemini-3.1-pro-preview**: 106 total tokens
- **gemini-3-pro-preview**: 274 total tokens

### Thinking Token Ratio
- **gemini-3-flash-preview**: 65/76 = 85% thinking
- **gemini-3.1-pro-preview**: 95/106 = 90% thinking
- **gemini-3-pro-preview**: 263/274 = 96% thinking

---

## Next Steps

1. ✅ Document all models
2. ⏳ Create Gemini provider class
3. ⏳ Implement streaming support
4. ⏳ Add thinking extraction
5. ⏳ Update router with Gemini models
6. ⏳ Add comprehensive tests
7. ⏳ Deploy and monitor

---

## Notes

- All three models support streaming by default
- thoughtSignature is unique to Gemini 3 series
- Higher thinking tokens = deeper reasoning but slower/more expensive
- Choose model based on use case: Flash for speed, Pro for depth
- API key works across all three models
- Consider implementing caching for repeated queries
