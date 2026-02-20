# AI Agent Instructions for HeySalad AI

This document provides standard instructions and guidelines for AI agents working on the HeySalad AI project.

## Project Overview

HeySalad AI is a unified AI API platform that provides a single interface for multiple AI providers including OpenAI, Anthropic, Google Gemini, and HuggingFace. The project consists of:

- **Core Package** (`packages/core`): TypeScript SDK with provider implementations
- **Web Dashboard** (`packages/web`): React/Vite web interface for API management
- **Harmony Web** (`packages/heysalad-harmony-web`): Meal planning application (separate product)

## Code Standards

### TypeScript
- Use strict TypeScript with proper type definitions
- Prefer interfaces over types for object shapes
- Use async/await over promises
- Always handle errors with try/catch blocks
- Export types from `types/index.ts`

### React/Frontend
- Use functional components with hooks
- Keep components small and focused (< 200 lines)
- Use Tailwind CSS for styling (no inline styles)
- Follow the HeySalad brand colors:
  - Primary: `#E01D1D` (Cherry Red)
  - Background Dark: `#000000`
  - Background Secondary: `#1a1a1a`
  - Border: `#2a2a2a`

### File Organization
- Tests go in `__tests__` directories or `.test.ts` files
- Scripts go in `scripts/` directory
- Documentation goes in `docs/` directory
- Keep root directory clean (only essential config files)

## Development Workflow

### Before Making Changes
1. Read relevant documentation in `docs/`
2. Check existing code patterns
3. Run tests to ensure current state is working
4. Check for similar implementations

### Making Changes
1. Make minimal, focused changes
2. Follow existing code style and patterns
3. Update tests if modifying functionality
4. Update documentation if changing APIs

### After Making Changes
1. Run `npm test` to verify tests pass
2. Run `npm run build` to ensure builds succeed
3. Check for TypeScript errors with `tsc`
4. Update CHANGELOG.md for significant changes

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests for specific package
npm test -w packages/core

# Run specific test file
npm test packages/core/src/providers/gemini.test.ts
```

### Writing Tests
- Use Vitest for testing
- Mock external API calls
- Test both success and error cases
- Use descriptive test names
- Group related tests with `describe` blocks

## Provider Implementation

When adding a new AI provider:

1. Create provider file in `packages/core/src/providers/`
2. Implement `AIProviderInterface` from `types/index.ts`
3. Add provider to `AIProvider` union type
4. Update `HeySaladAI` client to support new provider
5. Write comprehensive tests
6. Update documentation

### Provider Template
```typescript
import { AIProviderInterface, ProviderConfig, ChatCompletionRequest, ChatCompletionResponse, StreamChunk } from '../types';

export class NewProvider implements AIProviderInterface {
  private apiKey: string;
  private baseURL: string;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required for NewProvider');
    }
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.provider.com';
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    // Implementation
  }

  async *stream(request: ChatCompletionRequest): AsyncIterableIterator<StreamChunk> {
    // Implementation
  }

  async listModels(): Promise<string[]> {
    // Implementation
  }
}
```

## Deployment

### Web Dashboard
```bash
cd packages/web
npm run build
npm run deploy  # Deploys to Cloudflare Pages
```

### Harmony Web
```bash
cd packages/heysalad-harmony-web
npm run build
npx wrangler pages deploy dist --project-name=heysalad-harmony-web
```

## Common Tasks

### Adding a New Feature
1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement feature with tests
3. Update documentation
4. Build and test locally
5. Commit with descriptive message
6. Push and create PR

### Fixing a Bug
1. Write a failing test that reproduces the bug
2. Fix the bug
3. Verify test passes
4. Check for similar bugs elsewhere
5. Commit with bug description

### Updating Dependencies
1. Check for breaking changes in changelogs
2. Update one dependency at a time
3. Run full test suite after each update
4. Test build process
5. Update code if APIs changed

## Documentation

### When to Update Docs
- Adding new features or APIs
- Changing existing behavior
- Adding new providers
- Updating configuration options
- Fixing bugs that affect usage

### Documentation Structure
- `README.md`: Project overview and quick start
- `docs/getting-started/`: Setup and basic usage
- `docs/architecture/`: System design and patterns
- `docs/providers/`: Provider-specific documentation
- `docs/deployment/`: Deployment guides
- `AGENTS.md`: This file - AI agent instructions

## Brand Guidelines

### HeySalad Branding
- Use official logo files from `branding/` folder
- Primary color: Cherry Red `#E01D1D`
- Fonts: Grandstander (headings), Figtree (body)
- Icon: Use `HeySalad_Icon-removebg-preview.png`
- Never use emojis as icons
- Maintain consistent spacing and layout

### Naming Conventions
- HeySalad AI: Main AI API platform
- HeySalad Harmony: Meal planning product
- Use "HeySalad" (not "Hey Salad" or "heysalad")
- Capitalize product names properly

## Error Handling

### Best Practices
- Always catch and handle errors
- Provide meaningful error messages
- Log errors with context
- Don't expose sensitive information in errors
- Use custom error classes for specific error types

### Example
```typescript
try {
  const response = await provider.chat(request);
  return response;
} catch (error) {
  if (error instanceof NetworkError) {
    throw new Error(`Failed to connect to ${provider}: ${error.message}`);
  }
  throw new Error(`Unexpected error: ${error.message}`);
}
```

## Security

### API Keys
- Never commit API keys to repository
- Use environment variables for sensitive data
- Rotate keys regularly
- Use different keys for dev/staging/prod

### Input Validation
- Validate all user inputs
- Sanitize data before processing
- Check for injection attacks
- Limit request sizes

## Performance

### Optimization Guidelines
- Use streaming for large responses
- Implement caching where appropriate
- Minimize bundle sizes
- Lazy load components when possible
- Use code splitting for large apps

## Git Workflow

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference issues when applicable
- Group related changes

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

## Questions?

If you're unsure about something:
1. Check existing code for patterns
2. Review documentation in `docs/`
3. Look at test files for examples
4. Check `PROJECT_STRUCTURE.md` for organization
5. Ask for clarification before making assumptions

## Remember

- **Keep it simple**: Write clear, maintainable code
- **Test thoroughly**: Don't break existing functionality
- **Document changes**: Help future developers understand your work
- **Follow patterns**: Consistency is key
- **Ask questions**: Better to clarify than assume

---

**Last Updated**: February 20, 2026
**Version**: 1.0
