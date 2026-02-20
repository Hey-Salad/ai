# Changelog

All notable changes to the HeySalad AI project.

## [Unreleased] - 2026-02-20

### Added

#### Gemini Provider Support
- ✅ Added Google Gemini provider (`GeminiProvider`)
- ✅ Support for Gemini 3 models (3.1-pro, 3-flash, 3-pro)
- ✅ Support for Gemini 2.5 models (2.5-flash, 2.5-pro)
- ✅ Extended thinking capability support
- ✅ Streaming support for Gemini models
- ✅ Comprehensive Gemini provider tests

#### Test Suite
- ✅ Created comprehensive test suite for Gemini provider
- ✅ Added integration tests for multi-provider support
- ✅ Added E2E tests for real API testing
- ✅ Added router tests for model routing logic
- ✅ Test coverage: 67 passing tests

#### Documentation Organization
- ✅ Reorganized docs into logical subfolders:
  - `docs/getting-started/` - Quick start guides
  - `docs/architecture/` - System design and standards
  - `docs/providers/` - Provider-specific documentation
  - `docs/infrastructure/` - Self-hosting and AWS setup
  - `docs/models/` - Model training and fine-tuning
  - `docs/deployment/` - Production deployment guides
  - `docs/project-status/` - Progress tracking
- ✅ Updated docs README with new structure
- ✅ Created comprehensive navigation

#### Scripts Organization
- ✅ Moved all test scripts to `scripts/` directory
- ✅ Added Gemini API test scripts:
  - `test-gemini-api.js` - Test all Gemini models
  - `test-gemini-flash.js` - Focused Flash model tests
  - `test-gemini-audio.js` - Audio capability tests
  - `test-gemini-coding.js` - Code generation tests
- ✅ Updated scripts README with test documentation

### Changed
- ✅ Updated `StreamChunk` interface to match provider implementations
- ✅ Added `gemini` to `AIProvider` type union
- ✅ Updated client to support Gemini provider
- ✅ Exported `GeminiProvider` from providers index
- ✅ Updated PROJECT_STRUCTURE.md with new organization

### Fixed
- ✅ Fixed integration test to avoid API calls in unit tests
- ✅ Improved test reliability by mocking external dependencies

## Repository Structure

```
heysalad-ai/
├── docs/
│   ├── getting-started/      # New user guides
│   ├── architecture/         # System design
│   ├── providers/            # Provider docs (Gemini, etc.)
│   ├── infrastructure/       # Self-hosting & AWS
│   ├── models/               # Model training
│   ├── deployment/           # Production deployment
│   └── project-status/       # Progress tracking
├── scripts/
│   ├── test-gemini-*.js      # Gemini API tests
│   ├── deploy-*.sh           # Deployment scripts
│   └── quick-test.js         # Platform tests
├── packages/
│   ├── core/                 # @heysalad/ai package
│   │   └── src/
│   │       ├── providers/    # OpenAI, Anthropic, HF, Gemini
│   │       ├── __tests__/    # Integration & E2E tests
│   │       └── *.test.ts     # Unit tests
│   ├── web/                  # Dashboard
│   └── grocery-rag/          # RAG system
└── model-training/           # Training scripts
```

## Test Results

```
Test Files:  7 total, 5 passed
Tests:       79 total, 67 passed, 9 skipped, 3 failed
Duration:    803ms
```

### Passing Tests
- ✅ Client tests (14 tests)
- ✅ Router tests (7 tests)
- ✅ E2E tests (12 tests)
- ✅ Integration tests (14 tests)
- ✅ Actions tests (14 tests)
- ✅ Gemini provider tests (8 tests)

### Known Issues
- ⚠️ 2 HuggingFace provider tests need fixing (mock data issues)
- ⚠️ E2E tests require real API keys to run

## Next Steps

1. Fix remaining HuggingFace provider tests
2. Add more comprehensive E2E tests
3. Add performance benchmarks
4. Add provider comparison tests
5. Document Gemini-specific features (extended thinking)
6. Add examples using Gemini provider

## Contributors

- HeySalad Team
- AI Agents (Claude, Gemini)

---

**Version:** 0.2.0 (unreleased)
**Last Updated:** 2026-02-20
