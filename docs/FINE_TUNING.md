# Fine-Tuning Guide: Customize Your Own GPT Model

This guide shows you how to fine-tune open-source LLMs for your specific use case with HeySalad AI.

## Table of Contents

- [Understanding Fine-Tuning](#understanding-fine-tuning)
- [Approaches to Customization](#approaches-to-customization)
- [Preparing Your Data](#preparing-your-data)
- [Option 1: LoRA Fine-Tuning (Recommended)](#option-1-lora-fine-tuning-recommended)
- [Option 2: Full Fine-Tuning](#option-2-full-fine-tuning)
- [Option 3: RAG (No Training Required)](#option-3-rag-no-training-required)
- [Deploying Your Model](#deploying-your-model)

## Understanding Fine-Tuning

### What is Fine-Tuning?

Fine-tuning adapts a pre-trained model to your specific use case by training it on your custom data.

### When to Fine-Tune?

**Good Use Cases:**
- Specific domain knowledge (medical, legal, technical)
- Consistent tone/style requirements
- Specialized task performance
- Custom data formats

**Consider Alternatives:**
- Small datasets (< 1000 examples) → Use RAG or few-shot prompting
- Frequently changing requirements → Use RAG
- Quick experimentation → Use prompt engineering

## Approaches to Customization

| Method | Training Required | Cost | Time | Best For |
|--------|-------------------|------|------|----------|
| **Prompt Engineering** | No | Free | Minutes | Quick iteration |
| **RAG** | No | Low | Hours | Dynamic knowledge |
| **LoRA** | Yes | Medium | Hours | Task specialization |
| **Full Fine-Tune** | Yes | High | Days | Complete customization |

## Preparing Your Data

### Data Format

```jsonl
{"messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "What is AI?"}, {"role": "assistant", "content": "AI stands for..."}]}
{"messages": [{"role": "user", "content": "Explain machine learning"}, {"role": "assistant", "content": "Machine learning is..."}]}
```

### Data Quality Guidelines

1. **Quantity**: 100-10,000+ examples
   - Minimum: 100 examples
   - Good: 1,000+ examples
   - Excellent: 10,000+ examples

2. **Quality**: Clean, consistent, accurate
   - Remove duplicates
   - Fix typos and errors
   - Ensure consistent formatting
   - Validate factual accuracy

3. **Diversity**: Cover various scenarios
   - Different question types
   - Edge cases
   - Various difficulty levels

### Create Training Data

```python
# create_dataset.py
import json

# Example: Convert your data to training format
training_data = []

# Your existing data
conversations = [
    {
        "user": "How do I reset my password?",
        "assistant": "To reset your password, go to Settings > Security > Reset Password."
    },
    {
        "user": "What are your business hours?",
        "assistant": "We're open Monday-Friday, 9 AM - 5 PM EST."
    },
    # Add more examples...
]

# Convert to training format
for conv in conversations:
    training_data.append({
        "messages": [
            {"role": "system", "content": "You are a helpful customer support agent."},
            {"role": "user", "content": conv["user"]},
            {"role": "assistant", "content": conv["assistant"]}
        ]
    })

# Save as JSONL
with open('training_data.jsonl', 'w') as f:
    for item in training_data:
        f.write(json.dumps(item) + '\n')

print(f"Created {len(training_data)} training examples")
```

### Split Data

```python
# split_data.py
import json
import random

# Load data
with open('training_data.jsonl', 'r') as f:
    data = [json.loads(line) for line in f]

# Shuffle
random.shuffle(data)

# Split: 80% train, 10% validation, 10% test
train_size = int(0.8 * len(data))
val_size = int(0.1 * len(data))

train_data = data[:train_size]
val_data = data[train_size:train_size + val_size]
test_data = data[train_size + val_size:]

# Save splits
for name, split in [('train', train_data), ('val', val_data), ('test', test_data)]:
    with open(f'{name}.jsonl', 'w') as f:
        for item in split:
            f.write(json.dumps(item) + '\n')

print(f"Train: {len(train_data)}, Val: {len(val_data)}, Test: {len(test_data)}")
```

## Option 1: LoRA Fine-Tuning (Recommended)

**LoRA** (Low-Rank Adaptation) is the most efficient way to fine-tune large models.

### Advantages

- ✅ 90% less training time
- ✅ 90% less GPU memory
- ✅ Can run on single GPU
- ✅ Easy to deploy
- ✅ Multiple adapters for one base model

### Installation

```bash
pip install transformers peft accelerate bitsandbytes datasets
```

### LoRA Training Script

```python
# train_lora.py
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset

# Configuration
MODEL_NAME = "meta-llama/Llama-2-7b-chat-hf"
OUTPUT_DIR = "./heysalad-lora"
DATASET_PATH = "train.jsonl"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    load_in_8bit=True,  # Use 8-bit quantization
    device_map="auto",
    torch_dtype=torch.float16,
)

# Prepare model for training
model = prepare_model_for_kbit_training(model)

# LoRA configuration
lora_config = LoraConfig(
    r=16,  # Rank
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],  # Which layers to adapt
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# Apply LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # Shows % of trainable params

# Load dataset
dataset = load_dataset('json', data_files={'train': DATASET_PATH})

# Tokenize function
def tokenize_function(examples):
    # Format conversations
    texts = []
    for messages in examples['messages']:
        text = tokenizer.apply_chat_template(messages, tokenize=False)
        texts.append(text)

    return tokenizer(
        texts,
        truncation=True,
        max_length=512,
        padding="max_length",
    )

tokenized_dataset = dataset.map(
    tokenize_function,
    batched=True,
    remove_columns=dataset["train"].column_names
)

# Training arguments
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    logging_steps=10,
    save_steps=100,
    evaluation_strategy="steps",
    eval_steps=100,
    warmup_steps=50,
    fp16=True,
    optim="paged_adamw_8bit",
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
)

# Train!
print("Starting training...")
trainer.train()

# Save LoRA adapter
model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print(f"Training complete! Model saved to {OUTPUT_DIR}")
```

### Run Training

```bash
# On EC2 with g5.xlarge (24GB GPU)
python train_lora.py

# Monitor GPU usage
watch -n 1 nvidia-smi
```

### Training Time Estimates

| Model Size | GPU | Training Time (1000 examples) | Cost |
|------------|-----|-------------------------------|------|
| 7B (LoRA) | g5.xlarge | 2-3 hours | $3-5 |
| 13B (LoRA) | g5.2xlarge | 4-5 hours | $15-20 |
| 70B (LoRA) | g5.12xlarge | 10-12 hours | $400+ |

### Use Fine-Tuned Model

```python
# load_lora.py
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

# Load base model
base_model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-chat-hf",
    device_map="auto",
    torch_dtype=torch.float16,
)

# Load LoRA adapter
model = PeftModel.from_pretrained(base_model, "./heysalad-lora")
tokenizer = AutoTokenizer.from_pretrained("./heysalad-lora")

# Use it
inputs = tokenizer("How do I reset my password?", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=100)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(response)
```

## Option 2: Full Fine-Tuning

**Full fine-tuning** trains all model parameters.

### When to Use?

- You have a large dataset (10,000+ examples)
- You need maximum customization
- You have significant GPU resources

### Requirements

| Model Size | GPU Memory | Recommended Instance | Training Time |
|------------|------------|---------------------|---------------|
| 7B | 48GB | g5.2xlarge | 8-12 hours |
| 13B | 80GB | p3.8xlarge | 24-36 hours |
| 70B | 320GB+ | p4d.24xlarge | 3-7 days |

### Full Fine-Tuning Script

```python
# train_full.py
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
)
from datasets import load_dataset

MODEL_NAME = "meta-llama/Llama-2-7b-chat-hf"
OUTPUT_DIR = "./heysalad-full"

# Load model (no quantization)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    device_map="auto",
    torch_dtype=torch.float16,
)

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.pad_token = tokenizer.eos_token

# Load and prepare dataset (same as LoRA)
dataset = load_dataset('json', data_files={'train': 'train.jsonl'})

def tokenize_function(examples):
    texts = []
    for messages in examples['messages']:
        text = tokenizer.apply_chat_template(messages, tokenize=False)
        texts.append(text)

    return tokenizer(
        texts,
        truncation=True,
        max_length=512,
        padding="max_length",
    )

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=3,
    per_device_train_batch_size=1,  # Smaller batch size for full training
    gradient_accumulation_steps=16,
    learning_rate=5e-5,  # Lower learning rate
    logging_steps=10,
    save_steps=500,
    warmup_steps=100,
    fp16=True,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
)

# Train
trainer.train()
model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)
```

## Option 3: RAG (No Training Required)

**RAG** (Retrieval Augmented Generation) provides custom knowledge without training.

### Advantages

- ✅ No training required
- ✅ Update knowledge instantly
- ✅ Cheaper than fine-tuning
- ✅ Works with any model

### Implementation

```python
# rag_system.py
from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np
from typing import List

class RAGSystem:
    def __init__(self, knowledge_base: List[str]):
        # Load embedding model
        self.tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
        self.model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

        # Embed knowledge base
        self.knowledge_base = knowledge_base
        self.embeddings = self._embed_texts(knowledge_base)

    def _embed_texts(self, texts: List[str]) -> np.ndarray:
        encoded = self.tokenizer(texts, padding=True, truncation=True, return_tensors='pt')
        with torch.no_grad():
            embeddings = self.model(**encoded).last_hidden_state.mean(dim=1)
        return embeddings.numpy()

    def retrieve(self, query: str, top_k: int = 3) -> List[str]:
        # Embed query
        query_embedding = self._embed_texts([query])[0]

        # Compute similarities
        similarities = np.dot(self.embeddings, query_embedding)

        # Get top-k
        top_indices = np.argsort(similarities)[-top_k:][::-1]

        return [self.knowledge_base[i] for i in top_indices]

# Usage with HeySalad AI
from heysalad import HeySaladAI

# Create knowledge base
knowledge = [
    "Our password reset process: Go to Settings > Security > Reset Password",
    "Business hours: Monday-Friday, 9 AM - 5 PM EST",
    "Refund policy: 30-day money-back guarantee",
    # Add more...
]

# Initialize RAG
rag = RAGSystem(knowledge)

# Initialize AI client
client = HeySaladAI()
client.configureProvider('openai', {'apiKey': 'your-key'})

# Answer with RAG
def answer_with_rag(question: str) -> str:
    # Retrieve relevant context
    context = rag.retrieve(question, top_k=3)
    context_text = "\n".join(context)

    # Create augmented prompt
    prompt = f"""Use the following context to answer the question:

Context:
{context_text}

Question: {question}

Answer:"""

    # Get response
    response = client.chat({
        'model': 'gpt-3.5-turbo',
        'messages': [
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': prompt}
        ]
    })

    return response.content

# Test
answer = answer_with_rag("How do I reset my password?")
print(answer)
```

## Deploying Your Model

### Deploy LoRA Model with vLLM

```bash
# Merge LoRA adapter with base model (optional, for faster inference)
python -c "
from transformers import AutoModelForCausalLM
from peft import PeftModel

base = AutoModelForCausalLM.from_pretrained('meta-llama/Llama-2-7b-chat-hf')
model = PeftModel.from_pretrained(base, './heysalad-lora')
merged = model.merge_and_unload()
merged.save_pretrained('./heysalad-merged')
"

# Deploy with vLLM
python -m vllm.entrypoints.openai.api_server \
  --model ./heysalad-merged \
  --host 0.0.0.0 \
  --port 8000
```

### Use with HeySalad AI

```typescript
import { HeySaladAI } from '@heysalad/ai';

const client = new HeySaladAI();

// Connect to your fine-tuned model
client.configureProvider('huggingface', {
  apiKey: 'not-needed',
  baseURL: 'http://your-ec2-ip:8000/v1/models',
});

// Use your custom model!
const response = await client.chat({
  model: 'heysalad-merged',
  messages: [
    { role: 'user', content: 'How do I reset my password?' }
  ]
});

console.log(response.content);
```

## Evaluation

### Test Your Model

```python
# evaluate.py
from transformers import AutoModelForCausalLM, AutoTokenizer
import json

model = AutoModelForCausalLM.from_pretrained("./heysalad-merged")
tokenizer = AutoTokenizer.from_pretrained("./heysalad-merged")

# Load test data
with open('test.jsonl', 'r') as f:
    test_data = [json.loads(line) for line in f]

correct = 0
total = len(test_data)

for example in test_data:
    # Get model prediction
    inputs = tokenizer(example['input'], return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=100)
    prediction = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Compare with expected output
    if prediction.strip().lower() == example['expected'].strip().lower():
        correct += 1

accuracy = correct / total * 100
print(f"Accuracy: {accuracy:.2f}%")
```

## Cost Summary

| Method | GPU Instance | Training Cost | Deployment Cost/Month |
|--------|--------------|---------------|----------------------|
| LoRA (7B) | g5.xlarge | $5-10 | $500 |
| LoRA (13B) | g5.2xlarge | $15-30 | $750 |
| Full (7B) | g5.2xlarge | $50-100 | $750 |
| RAG | t3.medium | $0 | $30 |

## Best Practices

1. **Start with LoRA**: 90% of use cases work great with LoRA
2. **Test with small dataset first**: Verify pipeline before scaling
3. **Monitor training**: Watch loss curves, validate regularly
4. **Evaluate thoroughly**: Test on held-out data before deploying
5. **Version control**: Save checkpoints and track experiments
6. **Consider RAG first**: Often simpler and cheaper for knowledge tasks

## Resources

- [PEFT Library](https://github.com/huggingface/peft)
- [Hugging Face Training](https://huggingface.co/docs/transformers/training)
- [LoRA Paper](https://arxiv.org/abs/2106.09685)
- [Fine-Tuning Best Practices](https://huggingface.co/blog/fine-tune-llms)

---

Need help? Open an issue or contact dev@heysalad.app
