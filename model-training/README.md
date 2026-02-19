# HeySalad Model Training

Train and deploy your own **HeySalad-7B** model.

## 🚀 Quick Start

### 1. Launch GPU Instance

```bash
# Launch g5.xlarge instance (AWS)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type g5.xlarge \
  --key-name your-key \
  --security-group-ids sg-xxxxxx \
  --region eu-west-2 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=HeySalad-Training}]'
```

Cost: **$1.50/hour** (~$500/month 24/7)

### 2. Setup Instance

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@<instance-ip>

# Download and run setup script
wget https://raw.githubusercontent.com/Hey-Salad/ai/main/model-training/setup_training_instance.sh
chmod +x setup_training_instance.sh
./setup_training_instance.sh

# This takes ~15 minutes
```

### 3. Prepare Training Data

```bash
cd ~/heysalad-ai/model-training

# Create starter dataset (5 examples)
python collect_training_data.py

# Or add your own data to data/training_data.jsonl
```

**Training data format:**

```jsonl
{"messages": [
  {"role": "system", "content": "You are HeySalad Assistant..."},
  {"role": "user", "content": "How do I use HeySalad?"},
  {"role": "assistant", "content": "To use HeySalad..."}
]}
```

### 4. Train Model

```bash
# Start training (takes 2-4 hours for 1,000 examples)
python train_heysalad.py

# Monitor progress
# Training will print updates every 10 steps
```

**Cost:** $3-6 per training run

### 5. Test Model

```bash
# Test trained model
python test_heysalad.py --model ./heysalad-7b-XXXXXXXX

# Example prompts:
# - "How do I use HeySalad AI?"
# - "What providers does HeySalad support?"
# - "Help me automate my workflow"
```

### 6. Deploy Model

```bash
# Deploy with vLLM (production-ready)
python -m vllm.entrypoints.openai.api_server \
  --model ./heysalad-7b-XXXXXXXX \
  --host 0.0.0.0 \
  --port 8000
```

### 7. Use Your Model

```typescript
import { HeySaladAI } from '@heysalad/ai';

const client = new HeySaladAI();

// Connect to your model
client.configureProvider('huggingface', {
  apiKey: 'not-needed',
  baseURL: 'http://your-server:8000/v1/models'
});

// Use it!
const response = await client.chat({
  model: 'heysalad-7b',
  messages: [
    { role: 'user', content: 'Hello HeySalad!' }
  ]
});
```

### 8. Publish to Hugging Face (Optional)

```bash
# Login to Hugging Face
huggingface-cli login

# Push model
python push_to_hub.py \
  --model ./heysalad-7b-XXXXXXXX \
  --repo heysalad/heysalad-7b \
  --private  # or --public
```

## 📊 Training Configuration

### Default Settings

- **Base Model**: Llama 2 7B Chat
- **Method**: LoRA (Parameter-Efficient Fine-Tuning)
- **LoRA Rank**: 16
- **Learning Rate**: 2e-4
- **Epochs**: 3
- **Batch Size**: 4 (effective: 16 with gradient accumulation)
- **Max Length**: 512 tokens
- **GPU Memory**: ~20 GB (8-bit quantization)

### Customization

Edit `train_heysalad.py` CONFIG dict:

```python
CONFIG = {
    "base_model": "meta-llama/Llama-2-7b-chat-hf",  # or Mistral, Llama 3
    "num_epochs": 3,                                 # more epochs = better fit
    "learning_rate": 2e-4,                           # lower = more stable
    "lora_r": 16,                                    # higher = more parameters
    # ...
}
```

## 📚 Training Data Best Practices

### 1. Quality > Quantity

- 1,000 high-quality examples > 10,000 low-quality
- Manually review and validate data
- Remove duplicates and errors

### 2. Format Consistency

```jsonl
{"messages": [
  {"role": "system", "content": "System prompt (optional)"},
  {"role": "user", "content": "User question"},
  {"role": "assistant", "content": "Assistant response"}
]}
```

### 3. Diverse Examples

- Cover different use cases
- Include edge cases
- Vary response styles
- Test with challenging queries

### 4. Domain Specificity

For HeySalad model:
- ✅ Workflow automation examples
- ✅ API integration help
- ✅ Multi-provider usage
- ✅ Self-hosting guidance
- ✅ Code generation
- ❌ General knowledge (base model handles this)
- ❌ Off-topic conversations

## 🔧 Troubleshooting

### Out of GPU Memory

```python
# Reduce batch size in CONFIG
"batch_size": 2,  # instead of 4
"gradient_accumulation_steps": 8,  # instead of 4
```

### Slow Training

- Check GPU utilization: `watch -n 1 nvidia-smi`
- Should be 90-100% during training
- If low, increase batch size

### Poor Model Quality

1. **Collect more data** (target: 1,000+ examples)
2. **Improve data quality** (review and validate)
3. **Train longer** (increase epochs)
4. **Lower learning rate** (2e-5 instead of 2e-4)
5. **Test with different prompts**

### Model Not Loading

```bash
# Check model files exist
ls -lah ./heysalad-7b-XXXXXXXX/

# Should contain:
# - adapter_config.json
# - adapter_model.bin
# - tokenizer files
```

## 💰 Cost Breakdown

### Training Costs

| Dataset Size | Training Time | Cost (g5.xlarge @ $1.50/hr) |
|--------------|---------------|------------------------------|
| 100 examples | 30 min | $0.75 |
| 1,000 examples | 2-3 hours | $3-5 |
| 10,000 examples | 6-8 hours | $9-12 |
| 50,000 examples | 24-36 hours | $36-54 |

### Deployment Costs

| Setup | Instance | Monthly Cost |
|-------|----------|--------------|
| Development | g5.xlarge | $500 |
| Production (3x) | 3x g5.xlarge | $1,500 |
| High-traffic | 5x g5.xlarge + ALB | $2,550 |

### Cost Comparison

Running HeySalad-7B vs API costs:

```
1M tokens/day for 30 days = 30M tokens

HeySalad-7B (self-hosted): $500/month
OpenAI GPT-3.5: $60/month ($2 per 1M tokens)
OpenAI GPT-4: $900/month ($30 per 1M tokens)

At 10M tokens/day:
HeySalad-7B: $500/month (fixed)
OpenAI GPT-3.5: $600/month
OpenAI GPT-4: $9,000/month

Breakeven: ~5M tokens/day
Above that, self-hosting is cheaper!
```

## 📈 Scaling

### Single GPU (Development)

```bash
python train_heysalad.py
# g5.xlarge: $500/month
```

### Multi-GPU (Production Training)

```bash
# Use g5.12xlarge (4x A10G)
accelerate launch --multi_gpu --num_processes 4 train_heysalad.py
# 4x faster training
```

### Distributed Inference

```bash
# Deploy to multiple instances
# Add load balancer (ALB)
# Auto-scaling based on traffic
```

## 🎓 Advanced Topics

### Custom Base Models

```python
# Try Mistral (faster)
"base_model": "mistralai/Mistral-7B-Instruct-v0.2"

# Try Llama 3 (newest)
"base_model": "meta-llama/Meta-Llama-3-8B-Instruct"

# Try Phi-2 (smaller, faster)
"base_model": "microsoft/phi-2"
```

### Multi-Task Learning

Train one model for multiple tasks:

```jsonl
{"messages": [...], "task": "chat"}
{"messages": [...], "task": "code"}
{"messages": [...], "task": "pricing"}
```

### Continuous Learning

Retrain monthly with new data:

```bash
# Collect user feedback
# Add to training_data.jsonl
# Retrain (LoRA adapters are small)
# Deploy new version
```

## 📖 Resources

- [Full Documentation](../docs/HEYSALAD_MODEL.md)
- [Fine-Tuning Guide](../docs/FINE_TUNING.md)
- [Self-Hosting Guide](../docs/SELF_HOSTING.md)
- [PEFT Library](https://huggingface.co/docs/peft)
- [vLLM Docs](https://vllm.readthedocs.io/)

## 🤝 Contributing

Have improvements to the training pipeline? Submit a PR!

- Better training data
- Improved configurations
- New base models
- Evaluation scripts

## ⚖️ License

Training scripts: MIT License

Models: Depends on base model license
- Llama 2: Meta's Llama 2 License
- Mistral: Apache 2.0
- Your LoRA adapters: Your choice

## 🆘 Support

- Issues: GitHub Issues
- Questions: GitHub Discussions
- Email: dev@heysalad.app

---

**Ready to build HeySalad's own model? Let's go! 🚀**
