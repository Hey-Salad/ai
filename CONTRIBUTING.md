# Contributing to HeySalad AI

Thank you for your interest in contributing to HeySalad AI! This document provides guidelines and standards for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- TypeScript knowledge

### Setup

```bash
# Clone the repository
git clone https://github.com/Hey-Salad/ai.git
cd ai

# Install dependencies
npm install

# Build packages
npm run build

# Run tests
npm test
```

## Development Workflow

### Monorepo Structure

```
packages/
  core/     - @heysalad/ai npm package
  web/      - Web dashboard and API
```

### Running Development Servers

```bash
# Core package (watch mode)
cd packages/core
npm run dev

# Web dashboard
cd packages/web
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Provide proper type annotations
- Avoid `any` types when possible

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline objects/arrays
- Use meaningful variable and function names
- Keep functions small and focused
- Document complex logic with comments

### File Organization

```typescript
// 1. Imports (grouped by external, internal, types)
import { externalPackage } from 'external';
import { internalModule } from './internal';
import type { TypeImport } from './types';

// 2. Type definitions
export interface MyInterface {}
export type MyType = string;

// 3. Constants
const CONSTANT_VALUE = 'value';

// 4. Functions/Classes
export function myFunction() {}
export class MyClass {}
```

### Naming Conventions

- **Files**: kebab-case (e.g., `my-module.ts`)
- **Classes**: PascalCase (e.g., `MyClass`)
- **Functions**: camelCase (e.g., `myFunction`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MY_CONSTANT`)
- **Interfaces**: PascalCase with 'I' prefix optional (e.g., `UserConfig`)
- **Types**: PascalCase (e.g., `AIProvider`)

## Testing Requirements

### Test Coverage

- Aim for >80% code coverage
- Test all public APIs
- Test error cases and edge cases
- Use descriptive test names

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = myFunction(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Lint code
npm run lint
npm run lint:fix
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(core): add support for Groq provider

Implements Groq AI provider with streaming support.
Includes tests and documentation.

Closes #123
```

```bash
fix(web): resolve API endpoint CORS issue

Updates middleware configuration to allow proper
CORS headers for API routes.
```

## Pull Request Process

### Before Submitting

1. **Write tests** for new features
2. **Update documentation** if needed
3. **Run tests** and ensure they pass
4. **Run linter** and fix any issues
5. **Update CHANGELOG** if applicable

### PR Title

Use the same format as commit messages:
```
feat(core): add new feature
```

### PR Description

Include:
- **Purpose**: What does this PR do?
- **Approach**: How does it work?
- **Testing**: How was it tested?
- **Screenshots**: If UI changes
- **Breaking changes**: If any
- **Related issues**: Link issues

### Example PR Description

```markdown
## Purpose
Adds support for the Groq AI provider

## Approach
- Extends BaseProvider class
- Implements chat and stream methods
- Adds model listing support

## Testing
- Unit tests for all methods
- Integration tests with mock API
- Manual testing with real API key

## Related Issues
Closes #123
```

### Review Process

1. Maintainers will review your PR
2. Address feedback and comments
3. Update PR if requested
4. Once approved, maintainers will merge

### CI/CD

All PRs must pass:
- TypeScript compilation
- ESLint checks
- Unit tests
- Build process

## Security

Please report security vulnerabilities to security@heysalad.app

See [SECURITY.md](SECURITY.md) for details.

## Questions?

- Open an issue for bugs or features
- Discussions for questions
- Email: dev@heysalad.app

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HeySalad AI! 🎉
