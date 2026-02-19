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
- ✅ Multi-provider support (OpenAI, Anthropic)
- ✅ Unified chat interface
- ✅ Streaming support
- ✅ Action system for workflows
- ✅ TypeScript native
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

## 🏗️ Architecture

```
heysalad-ai/
├── packages/
│   └── core/                # @heysalad/ai NPM package
│       ├── src/
│       │   ├── providers/   # AI provider implementations
│       │   ├── actions/     # Workflow action system
│       │   ├── types/       # TypeScript definitions
│       │   └── client.ts    # Main client
├── apps/                    # Coming soon: Dashboard & API
├── .github/
│   └── workflows/           # CI/CD automation
└── docs/                    # Coming soon: Documentation
```

## 🚀 Provider Roadmap

| Provider | Status | Priority |
|----------|--------|----------|
| OpenAI | ✅ v0.1.0 | High |
| Anthropic | ✅ v0.1.0 | High |
| AWS Bedrock | 🔄 v0.2.0 | High |
| Google Vertex | 🔄 v0.2.0 | High |
| Groq | 🔄 v0.2.0 | Medium |
| Hugging Face | 🔄 v0.3.0 | Medium |
| DeepSeek | 🔄 v0.3.0 | Low |
| Mistral | 🔄 v0.3.0 | Low |

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

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

### How to Contribute
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### AI Agents Welcome
This codebase is designed to be AI-friendly:
- Clear, documented architecture
- Strong typing with TypeScript
- Automated CI/CD checks
- Self-managing workflows (coming soon)

## 🔐 Security

Security is our top priority:

- **API Keys**: Never logged or exposed
- **Verification System**: Human-in-the-loop for sensitive actions
- **Audit Logs**: Complete action history
- **Rate Limiting**: Built-in protection
- **Encryption**: All data encrypted in transit

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 🔗 Links

- **GitHub**: https://github.com/Hey-Salad/ai
- **NPM**: https://npmjs.com/package/@heysalad/ai (coming soon)
- **Dashboard**: https://ai.heysalad.app (coming soon)
- **Docs**: https://ai.heysalad.app/docs (coming soon)

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
