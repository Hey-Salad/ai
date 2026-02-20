# HeySalad AI - Project Structure

Clean, organized repository structure for the HeySalad AI platform.

## 📁 Root Directory

```
heysalad-ai/
├── .github/              # GitHub Actions & CI/CD
├── docs/                 # All documentation
├── examples/             # Usage examples
├── model-training/       # Model training scripts
├── packages/             # NPM packages (monorepo)
├── scripts/              # Deployment & test scripts
├── CONTRIBUTING.md       # Contribution guidelines
├── LICENSE               # MIT License
├── README.md             # Main documentation
├── SECURITY.md           # Security policy
└── package.json          # Root package config
```

## 📦 Packages

### Core Package (`packages/core/`)
Main NPM package `@heysalad/ai` - unified AI provider interface

```
packages/core/
├── src/
│   ├── providers/        # OpenAI, Anthropic, HuggingFace, Gemini
│   ├── actions/          # Workflow action system
│   ├── types/            # TypeScript definitions
│   ├── client.ts         # Main client
│   ├── router.ts         # Model routing
│   └── index.ts          # Public API
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### Web Package (`packages/web/`)
Remix + Cloudflare Workers dashboard

```
packages/web/
├── app/
│   ├── routes/           # Remix routes
│   └── utils/            # Auth & utilities
├── public/               # Static assets
├── worker.ts             # Cloudflare Worker
└── wrangler.toml         # Cloudflare config
```

### Grocery RAG (`packages/grocery-rag/`)
RAG system for grocery data

## 📚 Documentation (`docs/`)

### Getting Started
- `README.md` - Documentation index
- `QUICK_START.md` - Quick start guide
- `ARCHITECTURE.md` - System architecture

### Infrastructure
- `EC2_SETUP.md` - AWS EC2 setup guide
- `SELF_HOSTING.md` - Self-hosting LLMs
- `FINE_TUNING.md` - Model fine-tuning

### Gemini Integration
- `GEMINI_3_IMPLEMENTATION.md` - Implementation guide
- `GEMINI_MODELS_DOCUMENTATION.md` - Model details

### Project Status
- `CURRENT_STATUS.md` - Current project status
- `WHERE_WE_ARE.md` - Progress overview
- `COMPLETED_TASKS.md` - Completed work
- `DEPLOYMENT_SUCCESS.md` - Deployment notes

### Other
- `CODE_STANDARDS.md` - Coding standards
- `AWS_LIMIT_ISSUE.md` - AWS quota issues
- `GET_HF_TOKEN.md` - HuggingFace token setup

## 🧪 Scripts (`scripts/`)

### Test Scripts
- `test-gemini-api.js` - Test all Gemini models
- `test-gemini-flash.js` - Test Gemini Flash
- `test-gemini-audio.js` - Test audio capabilities
- `test-gemini-coding.js` - Test code generation
- `quick-test.js` - Quick platform test

### Deployment Scripts
- `deploy-model-production.sh` - Deploy models
- `execute-all-tasks.sh` - Run all deployment tasks
- `launch-gpu-instance.sh` - Launch GPU instances
- `setup-production-infrastructure.sh` - Setup infrastructure
- `validate-deployment.sh` - Validate deployment

### Setup Scripts
- `GET_STARTED.sh` - Quick start setup
- `STATUS_CHECK.sh` - System health check

## 🎓 Model Training (`model-training/`)

```
model-training/
├── collect_training_data.py      # Collect training data
├── train_heysalad.py              # Train models
├── push_to_hub.py                 # Publish to HuggingFace
├── setup_training_instance.sh    # Setup training environment
└── README.md                      # Training documentation
```

## 💡 Examples (`examples/`)

```
examples/
└── complete-platform.ts           # Full platform example
```

## 🔧 Configuration Files

- `.gitignore` - Git ignore rules
- `package.json` - Root package config
- `package-lock.json` - Dependency lock file

## 📝 Key Documents

### For Contributors
1. Read `README.md` - Overview and features
2. Read `CONTRIBUTING.md` - Contribution guidelines
3. Read `docs/CODE_STANDARDS.md` - Coding standards
4. Check `docs/ARCHITECTURE.md` - System design

### For Users
1. Read `README.md` - Getting started
2. Read `docs/QUICK_START.md` - Quick setup
3. Check `examples/` - Usage examples
4. Read provider docs in `packages/core/src/providers/`

### For Deployment
1. Read `docs/EC2_SETUP.md` - Infrastructure setup
2. Read `docs/SELF_HOSTING.md` - Self-hosting guide
3. Check `scripts/README.md` - Script documentation
4. Run `scripts/validate-deployment.sh` - Validate setup

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Test Gemini integration
node scripts/test-gemini-coding.js

# Deploy to production
bash scripts/execute-all-tasks.sh

# Validate deployment
bash scripts/validate-deployment.sh
```

## 🧹 Maintenance

### Keep It Clean
- Tests go in `scripts/` or package-specific test directories
- Documentation goes in `docs/`
- Scripts go in `scripts/`
- Examples go in `examples/`
- No loose files in root (except config files)

### File Naming
- Documentation: `UPPERCASE_WITH_UNDERSCORES.md`
- Scripts: `kebab-case.js` or `kebab-case.sh`
- Code: `camelCase.ts` or `PascalCase.ts` (classes)

---

**Last Updated:** 2026-02-20

This structure keeps the repository clean, organized, and easy to navigate for both humans and AI agents.
