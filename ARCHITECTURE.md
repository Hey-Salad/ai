# Architecture

## Overview

HeySalad AI is designed as a multi-layer system with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Applications Layer              │
│  (Dashboard, API, CLI, Integrations)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Action Layer                    │
│  (Workflows, Verification, Security)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Abstraction Layer               │
│      (Unified Provider Interface)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Provider Layer                  │
│  (OpenAI, Anthropic, Bedrock, etc.)     │
└─────────────────────────────────────────┘
```

## Core Components

### 1. Provider Layer

**Purpose**: Interface with AI provider APIs

**Design Principles**:
- Each provider extends `BaseProvider`
- Implements `AIProviderInterface`
- Handles provider-specific API quirks
- Normalizes responses to unified format

**Implementation**:
```typescript
interface AIProviderInterface {
  readonly provider: AIProvider;
  chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk>;
  listModels(): Promise<string[]>;
}
```

### 2. Abstraction Layer

**Purpose**: Unified interface across all providers

**Key Classes**:
- `HeySaladAI`: Main client
- `ProviderConfig`: Provider configuration
- Type definitions for requests/responses

**Benefits**:
- Switch providers without code changes
- Use multiple providers simultaneously
- Consistent error handling
- Standardized request/response format

### 3. Action Layer

**Purpose**: Workflow automation primitives

**Components**:
- `ActionRegistry`: Register and execute actions
- Built-in actions: chat, verify, webhook
- Custom action support

**Usage in Workflows**:
```typescript
// Register custom action
client.actions.register({
  type: 'custom',
  name: 'notify-slack',
  execute: async (params) => {
    // Implementation
  }
});

// Execute in workflow
await client.actions.execute('notify-slack', { message: 'Done!' });
```

### 4. Application Layer (Future)

**Components**:
- **Dashboard**: Web UI at ai.heysalad.app
- **API**: RESTful API for remote access
- **CLI**: Command-line interface
- **Integrations**: OpenClaw, Zapier, etc.

## Data Flow

### Chat Request Flow

```
User Code
   ↓
HeySaladAI.chat()
   ↓
Provider Selection (getProvider)
   ↓
Provider Implementation (OpenAI/Anthropic/etc)
   ↓
Provider API Call
   ↓
Response Normalization
   ↓
Return to User
```

### Action Execution Flow

```
Workflow Trigger
   ↓
Action Registry Lookup
   ↓
Action.execute()
   ↓
Action Logic (may call HeySaladAI)
   ↓
Return Result
```

## Design Patterns

### 1. Strategy Pattern
Providers are interchangeable strategies for AI completion

### 2. Registry Pattern
Actions registered and retrieved by name

### 3. Builder Pattern
Client configuration through method chaining

### 4. Iterator Pattern
Streaming responses as async iterators

## Type Safety

**TypeScript First**:
- All APIs fully typed
- Generic types for extensibility
- Discriminated unions for provider types
- Branded types for IDs

**Example**:
```typescript
type AIProvider =
  | 'openai'
  | 'anthropic'
  | 'bedrock'
  // ... extensible

interface ChatCompletionRequest {
  model: AIModel;
  messages: Message[];
  temperature?: number;
  // ... fully typed
}
```

## Error Handling

**Consistent Error Strategy**:
- Providers throw descriptive errors
- Errors prefixed with provider name
- Network errors caught and wrapped
- Rate limit handling
- Retry logic with exponential backoff

## Future Architecture

### Cloudflare Worker API

```
User Request → Cloudflare Worker
                    ↓
              Authentication
                    ↓
              Rate Limiting
                    ↓
              @heysalad/ai Core
                    ↓
              AI Provider
                    ↓
              Log & Return
```

### Verification System

```
AI Agent Request → Generate Verification Link
                         ↓
                   Send to User (SMS/Email)
                         ↓
                   User Opens Link
                         ↓
                   Passkey/OTP Verification
                         ↓
                   Return Auth Token
                         ↓
                   AI Agent Continues
```

## Scalability Considerations

1. **Stateless Core**: No client-side state except config
2. **Provider Pooling**: Connection pooling for efficiency
3. **Rate Limiting**: Built-in provider rate limit handling
4. **Caching**: Response caching layer (future)
5. **Edge Deployment**: Cloudflare Workers for global distribution

## Security Architecture

1. **API Keys**: Never logged, encrypted at rest
2. **Request Validation**: Schema validation on all inputs
3. **Rate Limiting**: Per-user and per-provider
4. **Audit Logging**: All actions logged immutably
5. **Verification**: Human-in-the-loop for sensitive operations

## Testing Strategy

1. **Unit Tests**: Each provider tested independently
2. **Integration Tests**: Cross-provider compatibility
3. **Mock Providers**: For deterministic testing
4. **Contract Tests**: Ensure provider interface compliance
5. **E2E Tests**: Full workflow testing

## Deployment

### NPM Package
- Published to npm registry
- Semantic versioning
- Automated releases via CI/CD

### Cloudflare Worker (Future)
- Deployed via Wrangler
- Environment-based configuration
- Zero-downtime deployments
- Automatic rollback on errors

## Monitoring & Observability

### Metrics (Future)
- Request count by provider
- Latency percentiles
- Error rates
- Token usage
- Cost tracking

### Logging
- Structured JSON logs
- Request/response correlation IDs
- Provider-specific metadata
- Privacy-safe logging (no PII)

## Contributing Guidelines

1. **Provider Implementation**:
   - Extend `BaseProvider`
   - Implement all interface methods
   - Add comprehensive tests
   - Document model support

2. **Action Implementation**:
   - Clear, descriptive name
   - Type-safe parameters
   - Error handling
   - Documentation with examples

3. **Code Style**:
   - TypeScript strict mode
   - Functional programming preferred
   - Async/await over promises
   - Clear variable names

## Roadmap

### Phase 1: Core Package (v0.1.0) ✅
- OpenAI + Anthropic providers
- Unified interface
- Action system
- TypeScript types

### Phase 2: Provider Expansion (v0.2.0)
- AWS Bedrock
- Google Vertex
- Groq
- Verification system

### Phase 3: Hosted Service (v1.0.0)
- Cloudflare Worker API
- Dashboard at ai.heysalad.app
- Authentication
- Logging & analytics

### Phase 4: AI Agents (v2.0.0)
- Self-managing codebase
- AI-powered PR reviews
- Automated testing
- Performance optimization

---

This architecture is designed to be:
- **Extensible**: Easy to add providers and actions
- **Type-Safe**: Full TypeScript coverage
- **Performant**: Minimal overhead, efficient APIs
- **Scalable**: Edge-ready, stateless design
- **Secure**: Privacy-first, verification-enabled
