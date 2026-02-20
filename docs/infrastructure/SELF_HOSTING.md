# Self-Hosting Guide: Running LLMs on Your EC2

This guide shows you how to run open-source LLMs on your own infrastructure with HeySalad AI.

## Table of Contents

- [Quick Start](#quick-start)
- [Option 1: vLLM (Recommended)](#option-1-vllm-recommended)
- [Option 2: Text Generation Inference (TGI)](#option-2-text-generation-inference-tgi)
- [Option 3: Ollama](#option-3-ollama)
- [Option 4: Custom FastAPI](#option-4-custom-fastapi)
- [Connecting to HeySalad AI](#connecting-to-heysalad-ai)
- [Production Deployment](#production-deployment)

## Quick Start

### Prerequisites

- EC2 instance with GPU (see [EC2_SETUP.md](EC2_SETUP.md))
- NVIDIA drivers and CUDA installed
- Docker installed
- At least 24GB GPU memory for 7B models

### Quick Test with Ollama (Easiest)

```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2:7b

# Start server (runs on port 11434)
ollama serve

# Test it
curl http://localhost:11434/api/generate -d '{
  "model": "llama2:7b",
  "prompt": "Hello, how are you?"
}'
```

## Option 1: vLLM (Recommended)

**Best for**: High-throughput production inference

### Why vLLM?

- ✅ Fastest inference (PagedAttention)
- ✅ High throughput with batching
- ✅ OpenAI-compatible API
- ✅ Supports most popular models
- ✅ Active development

### Installation

```bash
# Install vLLM
pip install vllm

# Or use Docker
docker pull vllm/vllm-openai:latest
```

### Running vLLM

#### Small Model (7B - Llama 2)

```bash
# Start vLLM server
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-7b-chat-hf \
  --host 0.0.0.0 \
  --port 8000 \
  --dtype auto \
  --gpu-memory-utilization 0.9
```

#### Medium Model (13B - Llama 2)

```bash
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-13b-chat-hf \
  --host 0.0.0.0 \
  --port 8000 \
  --dtype float16 \
  --gpu-memory-utilization 0.95 \
  --max-model-len 4096
```

#### Large Model (70B - Llama 2) - Multi-GPU

```bash
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-70b-chat-hf \
  --host 0.0.0.0 \
  --port 8000 \
  --tensor-parallel-size 4 \
  --dtype float16 \
  --gpu-memory-utilization 0.95
```

#### Using Docker

```bash
# Run vLLM in Docker
docker run --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -p 8000:8000 \
  --ipc=host \
  vllm/vllm-openai:latest \
  --model meta-llama/Llama-2-7b-chat-hf \
  --host 0.0.0.0
```

### Test vLLM

```bash
# Chat completion (OpenAI-compatible)
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-2-7b-chat-hf",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Systemd Service for vLLM

```bash
# Create service file
sudo tee /etc/systemd/system/vllm.service << EOF
[Unit]
Description=vLLM Inference Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
Environment="PATH=/home/ubuntu/heysalad-env/bin"
ExecStart=/home/ubuntu/heysalad-env/bin/python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-7b-chat-hf \
  --host 0.0.0.0 \
  --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl daemon-reload
sudo systemctl enable vllm
sudo systemctl start vllm

# Check status
sudo systemctl status vllm

# View logs
sudo journalctl -u vllm -f
```

## Option 2: Text Generation Inference (TGI)

**Best for**: Hugging Face ecosystem integration

### Why TGI?

- ✅ Built by Hugging Face
- ✅ Great model support
- ✅ Production-ready
- ✅ Streaming support
- ✅ Flash Attention support

### Running TGI with Docker

```bash
# Run TGI
docker run --gpus all \
  --shm-size 1g \
  -p 8080:80 \
  -v $PWD/data:/data \
  ghcr.io/huggingface/text-generation-inference:latest \
  --model-id meta-llama/Llama-2-7b-chat-hf \
  --num-shard 1 \
  --max-input-length 2048 \
  --max-total-tokens 4096
```

### Test TGI

```bash
curl http://localhost:8080/generate \
  -X POST \
  -d '{"inputs":"What is deep learning?","parameters":{"max_new_tokens":100}}' \
  -H 'Content-Type: application/json'
```

### TGI with Multiple GPUs

```bash
docker run --gpus all \
  --shm-size 1g \
  -p 8080:80 \
  -v $PWD/data:/data \
  ghcr.io/huggingface/text-generation-inference:latest \
  --model-id meta-llama/Llama-2-70b-chat-hf \
  --num-shard 4 \
  --max-input-length 2048 \
  --max-total-tokens 4096
```

## Option 3: Ollama

**Best for**: Quick local development and testing

### Installation

```bash
curl https://ollama.ai/install.sh | sh
```

### Available Models

```bash
# List available models
ollama list

# Pull models
ollama pull llama2:7b
ollama pull llama2:13b
ollama pull mistral:7b
ollama pull mixtral:8x7b
ollama pull codellama:7b
```

### Running Models

```bash
# Start Ollama service
ollama serve

# In another terminal, run a model
ollama run llama2:7b

# Or use API
curl http://localhost:11434/api/generate -d '{
  "model": "llama2:7b",
  "prompt": "Explain quantum computing"
}'
```

### Ollama API

```bash
# Chat API
curl http://localhost:11434/api/chat -d '{
  "model": "llama2:7b",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}'

# Streaming
curl http://localhost:11434/api/chat -d '{
  "model": "llama2:7b",
  "messages": [
    {"role": "user", "content": "Tell me a story"}
  ],
  "stream": true
}'
```

## Option 4: Custom FastAPI Server

**Best for**: Full customization and control

### Installation

```bash
pip install fastapi uvicorn transformers torch accelerate
```

### Create Server

```python
# server.py
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI()

# Load model
model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)

class ChatRequest(BaseModel):
    prompt: str
    max_tokens: int = 256
    temperature: float = 0.7

@app.post("/generate")
async def generate(request: ChatRequest):
    inputs = tokenizer(request.prompt, return_tensors="pt").to("cuda")

    outputs = model.generate(
        **inputs,
        max_new_tokens=request.max_tokens,
        temperature=request.temperature,
        do_sample=True
    )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {"response": response}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### Run Server

```bash
# Start server
uvicorn server:app --host 0.0.0.0 --port 8000

# Test it
curl http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

## Connecting to HeySalad AI

### Using vLLM (OpenAI-compatible)

```typescript
import { HeySaladAI, HuggingFaceProvider } from '@heysalad/ai';

const client = new HeySaladAI();

// Connect to self-hosted vLLM
const selfHosted = HuggingFaceProvider.createSelfHosted({
  endpoint: 'http://your-ec2-ip:8000/v1/models',
  apiKey: 'optional-key' // if you added auth
});

client.configureProvider('huggingface', {
  apiKey: 'not-needed',
  baseURL: 'http://your-ec2-ip:8000/v1/models',
});

// Use it
const response = await client.chat({
  model: 'meta-llama/Llama-2-7b-chat-hf',
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});

console.log(response.content);
```

### Using Custom Endpoint

```typescript
import { HeySaladAI } from '@heysalad/ai';

const client = new HeySaladAI();

// Configure custom endpoint
client.configureProvider('huggingface', {
  apiKey: 'your-key-if-needed',
  baseURL: 'http://your-ec2-ip:8000', // Your custom API
});
```

### Environment Variables

```bash
# .env
SELF_HOSTED_ENDPOINT=http://your-ec2-ip:8000
SELF_HOSTED_API_KEY=optional-key
```

```typescript
// In your app
const endpoint = process.env.SELF_HOSTED_ENDPOINT;

client.configureProvider('huggingface', {
  apiKey: process.env.SELF_HOSTED_API_KEY || 'none',
  baseURL: endpoint,
});
```

## Production Deployment

### 1. Add HTTPS with Nginx

```nginx
# /etc/nginx/sites-available/heysalad-inference
server {
    listen 80;
    server_name inference.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/heysalad-inference /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Add SSL with Let's Encrypt
sudo certbot --nginx -d inference.yourdomain.com
```

### 2. Add Authentication

```python
# Add API key auth to FastAPI
from fastapi import Security, HTTPException
from fastapi.security.api_key import APIKeyHeader

API_KEY = "your-secret-key"
api_key_header = APIKeyHeader(name="X-API-Key")

def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

@app.post("/generate")
async def generate(request: ChatRequest, api_key: str = Security(verify_api_key)):
    # Your inference code
    pass
```

### 3. Monitor with CloudWatch

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure monitoring
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
```

### 4. Auto-restart on Failure

```bash
# Systemd handles this with Restart=always
# Or use Docker with restart policies

docker run --gpus all \
  --restart unless-stopped \
  -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model meta-llama/Llama-2-7b-chat-hf
```

### 5. Load Balancing (Multiple Instances)

```nginx
# Nginx load balancer
upstream inference_backend {
    least_conn;
    server 10.0.1.10:8000;
    server 10.0.1.11:8000;
    server 10.0.1.12:8000;
}

server {
    listen 80;
    location / {
        proxy_pass http://inference_backend;
    }
}
```

## Performance Optimization

### 1. Use Quantization

```bash
# Run with 4-bit quantization (2x less memory)
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-7b-chat-hf \
  --quantization awq \
  --dtype half
```

### 2. Adjust Batch Size

```bash
# Increase batch size for throughput
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-7b-chat-hf \
  --max-num-batched-tokens 8192
```

### 3. Enable Flash Attention

```bash
# Install flash-attn
pip install flash-attn

# vLLM uses it automatically if available
```

## Troubleshooting

### Out of Memory

```bash
# Reduce GPU memory usage
--gpu-memory-utilization 0.8

# Or use quantization
--quantization awq

# Or use smaller batch size
--max-num-batched-tokens 2048
```

### Slow Inference

```bash
# Check GPU usage
nvidia-smi

# Enable tensor parallelism
--tensor-parallel-size 2

# Use faster dtype
--dtype float16
```

### Model Download Issues

```bash
# Pre-download model
python -c "from transformers import AutoModel; AutoModel.from_pretrained('meta-llama/Llama-2-7b-chat-hf')"

# Or use Hugging Face CLI
huggingface-cli download meta-llama/Llama-2-7b-chat-hf
```

## Cost Comparison

| Setup | Cost/Month | Requests/Day | Cost per 1M tokens |
|-------|------------|--------------|---------------------|
| g5.xlarge + vLLM | $500 | Unlimited | $0.10 |
| HF Inference API | Variable | 10,000 | $0.60 |
| OpenAI GPT-3.5 | Variable | Unlimited | $2.00 |
| OpenAI GPT-4 | Variable | Unlimited | $30.00 |

## Next Steps

1. Choose your deployment option (vLLM recommended)
2. Set up the inference server
3. Configure HeySalad AI to use your endpoint
4. Test with sample requests
5. Set up monitoring and alerts
6. Implement authentication
7. Add HTTPS and load balancing

## Resources

- [vLLM Documentation](https://vllm.readthedocs.io/)
- [Text Generation Inference](https://github.com/huggingface/text-generation-inference)
- [Ollama Documentation](https://ollama.ai/docs)
- [Hugging Face Models](https://huggingface.co/models)

---

Need help? Open an issue or contact dev@heysalad.app
