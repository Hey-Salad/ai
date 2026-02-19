# HeySalad AI Documentation

Comprehensive guides for building a full AI platform with HeySalad AI.

## Getting Started

- [Quick Start](../README.md#quick-start) - Get up and running in 5 minutes
- [Installation](../README.md#installation) - Install HeySalad AI packages
- [Contributing](../CONTRIBUTING.md) - How to contribute to the project
- [Code Standards](../CODE_STANDARDS.md) - Coding standards and best practices
- [Security](../SECURITY.md) - Security policy and best practices

## Infrastructure Guides

### [EC2 Setup Guide](EC2_SETUP.md)

Learn how to set up AWS EC2 instances for running LLMs:

- Instance type recommendations for different model sizes
- GPU instances (g5, p3, p4d) for inference and training
- CPU instances for API gateway
- Cost analysis and optimization strategies
- Step-by-step setup instructions
- Production deployment architecture

**When to read:** Setting up your own infrastructure to run LLMs

### [Self-Hosting Guide](SELF_HOSTING.md)

Deploy and run open-source LLMs on your infrastructure:

- **vLLM** (Recommended) - High-performance inference server
- **Text Generation Inference** - Hugging Face's production server
- **Ollama** - Easy local development
- **Custom FastAPI** - Full customization
- Production deployment with HTTPS, authentication, monitoring
- Performance optimization and troubleshooting
- Integration with HeySalad AI

**When to read:** Ready to deploy models on your EC2 instances

### [Fine-Tuning Guide](FINE_TUNING.md)

Customize LLMs for your specific use case:

- Understanding when to fine-tune vs. other approaches
- **LoRA fine-tuning** (Recommended) - Efficient and cost-effective
- **Full fine-tuning** - Maximum customization
- **RAG** (Retrieval Augmented Generation) - No training required
- Preparing training data
- Training scripts and examples
- Deployment and evaluation
- Cost comparison

**When to read:** Want to specialize a model for your specific needs

## API Documentation

### Core Package (@heysalad/ai)

The unified interface for multiple AI providers.

```typescript
import { HeySaladAI } from '@heysalad/ai';

const client = new HeySaladAI();

// Configure providers
client.configureProvider('openai', { apiKey: process.env.OPENAI_API_KEY });
client.configureProvider('anthropic', { apiKey: process.env.ANTHROPIC_API_KEY });
client.configureProvider('huggingface', { apiKey: process.env.HF_API_KEY });

// Chat with any provider
const response = await client.chat({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
}, 'openai');
```

**Supported Providers:**
- ✅ OpenAI (GPT-3.5, GPT-4)
- ✅ Anthropic (Claude)
- ✅ Hugging Face (Open-source models)
- 🚧 AWS Bedrock (Coming soon)
- 🚧 Google Vertex AI (Coming soon)
- 🚧 DeepSeek, Mistral, Groq (Coming soon)

### Web Package (@heysalad/web)

Dashboard and REST API for HeySalad AI.

**Endpoints:**
- `GET /api/v1` - API information
- `POST /api/v1/chat` - Chat completion
- `POST /api/v1/stream` - Streaming chat
- `GET /api/v1/models` - List models
- `POST /api/v1/actions` - Execute action
- `POST /api/v1/verify` - Human verification

## Architecture

### Full Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Application                      │
│                      (@heysalad/ai client)                   │
└───────────────┬─────────────────────────────────────────────┘
                │
                ├─── Hugging Face Inference API
                │    (Managed, pay per use)
                │
                ├─── OpenAI / Anthropic APIs
                │    (Managed, production fallback)
                │
                └─── Self-Hosted Infrastructure
                     │
                     ├─── Load Balancer (ALB/Nginx)
                     │
                     ├─── API Gateway (EC2 t3/c5)
                     │    (@heysalad/web)
                     │
                     └─── Inference Cluster (EC2 g5/p3)
                          ├─── vLLM Servers
                          ├─── Custom Models
                          └─── Fine-Tuned Models
```

### Deployment Options

#### Option 1: API-Only (Quickest)

Use Hugging Face Inference API, OpenAI, or Anthropic:

```typescript
client.configureProvider('openai', { apiKey: 'sk-...' });
// Start using immediately!
```

**Cost:** Pay per use (~$0.60 per 1M tokens)
**Setup time:** 5 minutes

#### Option 2: Self-Hosted (Cost-Effective)

Run your own inference servers:

```bash
# Launch EC2 g5.xlarge
# Install vLLM
# Deploy model
```

**Cost:** ~$500/month (unlimited usage)
**Setup time:** 2-4 hours

#### Option 3: Hybrid (Best of Both)

Use self-hosted for regular traffic, APIs for overflow:

```typescript
// Primary: Self-hosted
client.configureProvider('huggingface', {
  baseURL: 'https://inference.yourdomain.com'
});

// Fallback: Managed API
client.configureProvider('openai', { apiKey: 'sk-...' });
```

**Cost:** Optimized for your traffic
**Setup time:** 4-8 hours

#### Option 4: Full Platform (Maximum Control)

Self-hosted + Fine-tuned models + Custom actions:

- Train custom models with LoRA
- Deploy on your infrastructure
- Full control and customization

**Cost:** Variable based on scale
**Setup time:** 1-2 weeks

## Use Cases

### 1. Customer Support Chatbot

**Approach:** Fine-tuned Llama 2 7B with LoRA

```typescript
// Train on your support conversations
// Deploy with vLLM
// Use with HeySalad AI
const response = await client.chat({
  model: 'heysalad-support',
  messages: [
    { role: 'system', content: 'You are a helpful support agent.' },
    { role: 'user', content: 'How do I reset my password?' }
  ]
});
```

**Cost:** ~$500/month (vs $5,000+ with OpenAI GPT-4)

### 2. Content Generation

**Approach:** RAG with Hugging Face API

```typescript
// Use RAG for brand guidelines
// Generate content with consistency
const content = await generateWithRAG(prompt, brandGuidelines);
```

**Cost:** Pay per use, highly scalable

### 3. Code Assistant

**Approach:** Self-hosted CodeLlama

```typescript
client.configureProvider('huggingface', {
  baseURL: 'https://code.yourdomain.com'
});

const code = await client.chat({
  model: 'codellama/CodeLlama-13b-Instruct-hf',
  messages: [
    { role: 'user', content: 'Write a function to validate email addresses' }
  ]
});
```

**Cost:** ~$750/month for 13B model

### 4. Multi-Provider Application

**Approach:** Unified interface with fallbacks

```typescript
// Try self-hosted first
try {
  return await client.chat(request, 'huggingface');
} catch {
  // Fallback to OpenAI
  return await client.chat(request, 'openai');
}
```

**Cost:** Optimized, high reliability

## Quick Reference

### Model Size vs. GPU Requirements

| Model | Parameters | GPU Memory | Instance | Monthly Cost |
|-------|-----------|------------|----------|--------------|
| Tiny | 1-3B | 8 GB | g4dn.xlarge | $300 |
| Small | 7B | 16-24 GB | g5.xlarge | $500 |
| Medium | 13B | 24-32 GB | g5.2xlarge | $750 |
| Large | 33B | 48-64 GB | g5.4xlarge | $1,200 |
| XLarge | 70B | 80-96 GB | g5.12xlarge | $3,800 |

### Common Commands

```bash
# Install HeySalad AI
npm install @heysalad/ai

# Run tests
npm test

# Deploy to EC2
ssh -i key.pem ubuntu@ip
python -m vllm.entrypoints.openai.api_server --model llama2

# Connect to self-hosted
client.configureProvider('huggingface', {
  baseURL: 'http://your-ip:8000/v1/models'
});
```

## Troubleshooting

### Out of GPU Memory

**Solution 1:** Use quantization
```bash
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-7b-chat-hf \
  --quantization awq
```

**Solution 2:** Use smaller model or larger instance

### Slow Inference

**Solution 1:** Enable tensor parallelism
```bash
--tensor-parallel-size 2
```

**Solution 2:** Use vLLM instead of vanilla transformers

**Solution 3:** Optimize batch size
```bash
--max-num-batched-tokens 8192
```

### API Connection Issues

**Check:**
- Security group allows inbound traffic on port 8000
- Service is running: `sudo systemctl status vllm`
- Correct endpoint URL in configuration

## Support

- **Documentation Issues:** Open an issue on GitHub
- **Questions:** Start a discussion
- **Security:** security@heysalad.app
- **General:** dev@heysalad.app

## What's Next?

1. **[Install HeySalad AI](../README.md#installation)**
2. **[Set up EC2](EC2_SETUP.md)** if self-hosting
3. **[Deploy your first model](SELF_HOSTING.md)**
4. **[Fine-tune for your use case](FINE_TUNING.md)** (optional)
5. **Build something amazing!**

---

**Made with ❤️ by the HeySalad team**
