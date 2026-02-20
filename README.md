# HeySalad AI

🚀 **AI-powered workflow automation platform for the future**

HeySalad AI is a unified interface for building automated human-agent workflows across multiple AI providers. Built for speed, reliability, and extensibility.

## 🌟 Vision

We're building the infrastructure to make AI workflows faster, better, and more accessible. Our goal is to enable developers to:

- **Build Once, Run Anywhere**: Write workflows that work across OpenAI, Anthropic, AWS Bedrock, Google Vertex, and more
- **Automate Intelligently**: Combine AI agents with human verification for secure, reliable automation
- **Scale Effortlessly**: From NPM package to hosted API at ai.heysalad.app
- **Integrate Seamlessly**: First-class support for OpenClaw and other automation platforms

## 📦 Packages

### [@heysalad/ai](./packages/core)

Core NPM package providing unified AI provider interface.

```bash
npm install @heysalad/ai
```

```typescript
import { createClient } from '@heysalad/ai';

const ai = createClient();
ai.configureProvider('openai', { apiKey: process.env.OPENAI_API_KEY });

const response = await ai.chat({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

## 🎯 Features

### v0.1.0 (Current)
- ✅ Multi-provider support (OpenAI, Anthropic, Hugging Face)
- ✅ Unified chat interface
- ✅ Streaming support
- ✅ Self-hosted model support
- ✅ Action system for workflows
- ✅ TypeScript native
- ✅ Comprehensive testing (80%+ coverage)
- ✅ OpenClaw ready

### v0.2.0 (Planned)
- 🔄 AWS Bedrock support
- 🔄 Google Vertex AI support
- 🔄 Groq support
- 🔄 Verification system (passkey, OTP, SSO)
- 🔄 Voice & SMS actions

### v1.0.0 (Vision)
- 🎯 Cloudflare Worker API at ai.heysalad.app
- 🎯 Web dashboard
- 🎯 User authentication & sessions
- 🎯 Logging & analytics
- 🎯 Self-managing AI agents
- 🎯 CI/CD automation

## 🏗️ Repository Structure

```
heysalad-ai/
├── packages/
│   ├── core/                # @heysalad/ai NPM package
│   │   ├── src/
│   │   │   ├── providers/   # AI provider implementations
│   │   │   ├── actions/     # Workflow action system
│   │   │   ├── types/       # TypeScript definitions
│   │   │   └── client.ts    # Main client
│   ├── web/                 # Web dashboard (Remix + Cloudflare)
│   └── grocery-rag/         # RAG system for grocery data
├── scripts/                 # Deployment & test scripts
│   ├── test-gemini-*.js     # Gemini API tests
│   ├── deploy-*.sh          # Deployment automation
│   └── quick-test.js        # Platform tests
├── docs/                    # Documentation
│   ├── EC2_SETUP.md         # AWS infrastructure
│   ├── SELF_HOSTING.md      # Self-hosting guide
│   ├── GEMINI_*.md          # Gemini integration docs
│   └── *.md                 # Additional documentation
├── model-training/          # Model training scripts
├── examples/                # Usage examples
└── .github/workflows/       # CI/CD automation
```

## 🚀 Provider Roadmap

| Provider | Status | Priority | Notes |
|----------|--------|----------|-------|
| OpenAI | ✅ v0.1.0 | High | GPT-3.5, GPT-4 |
| Anthropic | ✅ v0.1.0 | High | Claude 3 family |
| Hugging Face | ✅ v0.1.0 | High | API + Self-hosted |
| AWS Bedrock | 🔄 v0.2.0 | High | Claude, Llama, Titan |
| Google Vertex | 🔄 v0.2.0 | High | Gemini, PaLM |
| Groq | 🔄 v0.2.0 | Medium | High-speed inference |
| DeepSeek | 🔄 v0.3.0 | Medium | Chinese models |
| Mistral | 🔄 v0.3.0 | Low | Mistral AI models |

## 🛠️ Self-Hosting & Infrastructure

HeySalad AI supports running open-source models on your own infrastructure:

```typescript
import { HeySaladAI, HuggingFaceProvider } from '@heysalad/ai';

const client = new HeySaladAI();

// Option 1: Hugging Face Inference API
client.configureProvider('huggingface', {
  apiKey: process.env.HF_API_KEY,
});

// Option 2: Self-hosted on EC2
client.configureProvider('huggingface', {
  apiKey: 'not-needed',
  baseURL: 'http://your-ec2-instance:8000/v1/models',
});

// Use it like any other provider
const response = await client.chat({
  model: 'meta-llama/Llama-2-7b-chat-hf',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### 📚 Infrastructure Guides

- **[EC2 Setup Guide](./docs/EC2_SETUP.md)** - AWS instance setup, GPU requirements, cost analysis
- **[Self-Hosting Guide](./docs/SELF_HOSTING.md)** - Deploy LLMs with vLLM, TGI, or Ollama
- **[Fine-Tuning Guide](./docs/FINE_TUNING.md)** - Customize models with LoRA or full fine-tuning
- **[Full Documentation](./docs/README.md)** - Complete platform documentation

### Cost Comparison

| Setup | Monthly Cost | Tokens/Month | Cost per 1M |
|-------|--------------|--------------|-------------|
| Self-hosted (7B) | $500 | Unlimited | $0.10 |
| HF Inference API | Pay per use | Variable | $0.60 |
| OpenAI GPT-3.5 | Pay per use | Variable | $2.00 |
| OpenAI GPT-4 | Pay per use | Variable | $30.00 |

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Test with coverage
npm run test:coverage

# Lint code
npm run lint

# Development mode
npm run dev
```

## 🌐 Hosted Service (Coming Soon)

We're building a hosted version at **ai.heysalad.app** with:

- **Dashboard**: Manage workflows, view logs, monitor usage
- **API**: RESTful API at `ai.heysalad.app/api/v1`
- **Authentication**: SSO, OAuth, Passkey support
- **Verification**: Human-in-the-loop security
- **Analytics**: Usage tracking and insights

## 🤝 Contributing

We believe in building in public and attracting AI agents to help build this project. Contributions welcome!

See our [Contributing Guide](./CONTRIBUTING.md) for:
- Development workflow and setup
- Coding standards and best practices
- Testing requirements
- Commit guidelines
- Pull request process

Read our [Code Standards](./CODE_STANDARDS.md) for detailed guidelines on:
- TypeScript best practices
- API design patterns
- Error handling
- Testing standards
- Security practices

### AI Agents Welcome
This codebase is designed to be AI-friendly:
- Clear, documented architecture
- Strong typing with TypeScript
- Comprehensive testing (80%+ coverage)
- Automated CI/CD checks
- Self-managing workflows (coming soon)

## 🔐 Security

Security is our top priority. See our [Security Policy](./SECURITY.md) for:

- **Vulnerability Reporting**: How to report security issues
- **API Key Management**: Best practices for secrets
- **Input Validation**: Sanitization and rate limiting
- **Production Security**: HTTPS, authentication, monitoring
- **Verification System**: Human-in-the-loop for sensitive actions

Key principles:
- **API Keys**: Never logged or exposed
- **Rate Limiting**: Built-in protection
- **Encryption**: All data encrypted in transit
- **Audit Logs**: Complete action history

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 🔗 Links

- **GitHub**: https://github.com/Hey-Salad/ai
- **NPM**: https://npmjs.com/package/@heysalad/ai
- **Dashboard**: https://ai.heysalad.app (coming soon)
- **Documentation**: [./docs](./docs/README.md)

### 📚 Documentation

- [Full Documentation](./docs/README.md) - Complete platform guide
- [Quick Start](./docs/QUICK_START.md) - Get started quickly
- [Architecture](./docs/ARCHITECTURE.md) - System architecture
- [EC2 Setup](./docs/EC2_SETUP.md) - AWS infrastructure setup
- [Self-Hosting](./docs/SELF_HOSTING.md) - Deploy your own LLMs
- [Fine-Tuning](./docs/FINE_TUNING.md) - Customize models
- [Gemini Integration](./docs/GEMINI_3_IMPLEMENTATION.md) - Google Gemini 3 support
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines
- [Code Standards](./docs/CODE_STANDARDS.md) - Coding best practices
- [Security](./SECURITY.md) - Security policy

## 💡 Philosophy

We're building infrastructure that:

1. **Empowers Developers**: Simple, powerful APIs
2. **Enables AI Agents**: Self-managing, self-improving systems
3. **Prioritizes Security**: Human verification when it matters
4. **Scales Globally**: From edge to cloud
5. **Builds in Public**: Open source, community-driven

---

Built with ❤️ by the HeySalad team

**Let's make AI workflows better, faster, and more accessible for everyone.**
