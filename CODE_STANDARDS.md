# Code Standards

This document defines the coding standards and best practices for HeySalad AI.

## Table of Contents

- [General Principles](#general-principles)
- [TypeScript Standards](#typescript-standards)
- [API Design](#api-design)
- [Error Handling](#error-handling)
- [Testing Standards](#testing-standards)
- [Documentation](#documentation)
- [Performance](#performance)
- [Security](#security)

## General Principles

### SOLID Principles

- **Single Responsibility**: Each module should have one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Many specific interfaces over one general
- **Dependency Inversion**: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)

- Extract common logic into reusable functions
- Use inheritance and composition appropriately
- Create utility functions for repeated operations

### KISS (Keep It Simple, Stupid)

- Favor simplicity over cleverness
- Write code that's easy to understand
- Avoid premature optimization

## TypeScript Standards

### Type Safety

```typescript
// ✅ Good - Explicit types
interface UserConfig {
  apiKey: string;
  timeout?: number;
}

function configure(config: UserConfig): void {
  // Implementation
}

// ❌ Bad - Using any
function configure(config: any) {
  // Implementation
}
```

### Strict Mode

Enable strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Type vs Interface

```typescript
// Use interface for object shapes
interface User {
  id: string;
  name: string;
}

// Use type for unions, primitives, tuples
type Status = 'pending' | 'success' | 'error';
type Coordinate = [number, number];
```

### Generics

```typescript
// ✅ Good - Generic utility function
function first<T>(array: T[]): T | undefined {
  return array[0];
}

// ✅ Good - Generic class
class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}
```

## API Design

### Consistency

```typescript
// ✅ Good - Consistent naming
interface ChatAPI {
  chat(request: ChatRequest): Promise<ChatResponse>;
  stream(request: ChatRequest): AsyncIterableIterator<StreamChunk>;
  listModels(): Promise<string[]>;
}

// ❌ Bad - Inconsistent naming
interface ChatAPI {
  sendMessage(request: any): Promise<any>;
  getStreamingResponse(request: any): any;
  fetchAvailableModels(): Promise<any>;
}
```

### Return Types

```typescript
// ✅ Good - Explicit return types
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// ❌ Bad - Implicit return type
async function fetchUser(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
```

### Optional Parameters

```typescript
// ✅ Good - Optional parameters at end
function createUser(
  name: string,
  email: string,
  role?: string
): User {
  // Implementation
}

// ❌ Bad - Optional parameters in middle
function createUser(
  name: string,
  role?: string,
  email: string
): User {
  // Implementation
}
```

## Error Handling

### Custom Errors

```typescript
export class AIProviderError extends Error {
  constructor(
    public provider: string,
    message: string,
    public code?: string
  ) {
    super(`[${provider}] ${message}`);
    this.name = 'AIProviderError';
  }
}
```

### Try-Catch

```typescript
// ✅ Good - Specific error handling
async function fetchData(): Promise<Data> {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    if (error instanceof NetworkError) {
      throw new DataFetchError('Network error', { cause: error });
    }
    throw error;
  }
}

// ❌ Bad - Silent failures
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    return null; // Silent failure
  }
}
```

### Validation

```typescript
// ✅ Good - Early validation
function processUser(user: User): void {
  if (!user.id) {
    throw new ValidationError('User ID is required');
  }
  if (!user.email) {
    throw new ValidationError('User email is required');
  }

  // Process user
}
```

## Testing Standards

### Test Organization

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Initialize test state
  });

  // Group related tests
  describe('methodName', () => {
    it('should handle normal case', () => {
      // Test implementation
    });

    it('should handle edge case', () => {
      // Test implementation
    });

    it('should throw error for invalid input', () => {
      // Test implementation
    });
  });
});
```

### Test Names

```typescript
// ✅ Good - Descriptive test names
it('should return user when valid ID is provided', () => {});
it('should throw error when ID is empty string', () => {});
it('should cache results after first call', () => {});

// ❌ Bad - Vague test names
it('works', () => {});
it('test user', () => {});
it('error case', () => {});
```

### Mocking

```typescript
// ✅ Good - Clear mocking
import { vi } from 'vitest';

const mockApi = {
  get: vi.fn().mockResolvedValue({ data: mockUser }),
  post: vi.fn().mockResolvedValue({ data: mockResponse }),
};

it('should call API with correct parameters', async () => {
  await service.fetchUser('123');

  expect(mockApi.get).toHaveBeenCalledWith('/users/123');
});
```

### Test Coverage

Aim for:
- **80%+ overall coverage**
- **100% of public APIs**
- **All error paths**
- **Edge cases and boundaries**

## Documentation

### JSDoc Comments

```typescript
/**
 * Fetches user data from the API
 * @param userId - The unique identifier for the user
 * @param options - Optional fetch configuration
 * @returns Promise resolving to user data
 * @throws {NotFoundError} When user doesn't exist
 * @throws {NetworkError} When network request fails
 */
async function fetchUser(
  userId: string,
  options?: FetchOptions
): Promise<User> {
  // Implementation
}
```

### Inline Comments

```typescript
// ✅ Good - Explains why, not what
// Using exponential backoff to avoid rate limiting
const delay = Math.pow(2, attempt) * 1000;

// ❌ Bad - States the obvious
// Set delay variable to 2 to the power of attempt times 1000
const delay = Math.pow(2, attempt) * 1000;
```

### README Files

Each package should have:
- Overview and purpose
- Installation instructions
- Usage examples
- API reference
- Configuration options
- Contributing guidelines

## Performance

### Async Operations

```typescript
// ✅ Good - Parallel execution
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
]);

// ❌ Bad - Sequential execution
const users = await fetchUsers();
const posts = await fetchPosts();
const comments = await fetchComments();
```

### Memory Management

```typescript
// ✅ Good - Stream large data
async function* processLargeFile(filepath: string) {
  const stream = createReadStream(filepath);
  for await (const chunk of stream) {
    yield processChunk(chunk);
  }
}

// ❌ Bad - Load everything into memory
async function processLargeFile(filepath: string) {
  const content = await readFile(filepath);
  return processContent(content);
}
```

### Caching

```typescript
// ✅ Good - Cache expensive operations
class DataService {
  private cache = new Map<string, Data>();

  async getData(key: string): Promise<Data> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const data = await this.fetchData(key);
    this.cache.set(key, data);
    return data;
  }
}
```

## Security

### Input Validation

```typescript
// ✅ Good - Validate all inputs
function processQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    throw new ValidationError('Query must be a non-empty string');
  }

  if (query.length > 1000) {
    throw new ValidationError('Query too long');
  }

  return sanitize(query);
}
```

### API Keys

```typescript
// ✅ Good - Never expose keys
const config = {
  apiKey: process.env.API_KEY,
};

// ❌ Bad - Hardcoded keys
const config = {
  apiKey: 'sk-1234567890abcdef',
};
```

### Rate Limiting

```typescript
// ✅ Good - Implement rate limiting
class RateLimiter {
  private requests = 0;
  private resetTime = Date.now();

  async checkLimit(): Promise<void> {
    if (Date.now() > this.resetTime) {
      this.requests = 0;
      this.resetTime = Date.now() + 60000; // 1 minute
    }

    if (this.requests >= 100) {
      throw new RateLimitError('Too many requests');
    }

    this.requests++;
  }
}
```

## Checklist

Before submitting code, ensure:

- [ ] Code follows TypeScript strict mode
- [ ] All functions have explicit return types
- [ ] Error handling is comprehensive
- [ ] Tests are written and passing
- [ ] Code coverage is >80%
- [ ] Documentation is complete
- [ ] No hardcoded secrets
- [ ] Performance is considered
- [ ] Security best practices followed
- [ ] Linting passes without errors

---

Following these standards ensures consistent, maintainable, and high-quality code across HeySalad AI.
