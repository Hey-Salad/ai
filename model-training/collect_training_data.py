#!/usr/bin/env python3
"""
HeySalad Training Data Collection Tool
Helps collect and format training data for HeySalad model
"""

import json
import os
from datetime import datetime
from typing import List, Dict

class TrainingDataCollector:
    """Collects and formats training data for HeySalad model"""

    def __init__(self, output_path="./data/training_data.jsonl"):
        self.output_path = output_path
        self.data = []
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

    def add_conversation(self, messages: List[Dict[str, str]]):
        """Add a conversation to the training data"""
        # Validate message format
        for msg in messages:
            if 'role' not in msg or 'content' not in msg:
                raise ValueError("Each message must have 'role' and 'content'")
            if msg['role'] not in ['system', 'user', 'assistant']:
                raise ValueError(f"Invalid role: {msg['role']}")

        self.data.append({"messages": messages})

    def add_simple_qa(self, question: str, answer: str, system_prompt: str = None):
        """Add a simple Q&A pair"""
        messages = []

        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })

        messages.extend([
            {"role": "user", "content": question},
            {"role": "assistant", "content": answer}
        ])

        self.add_conversation(messages)

    def save(self):
        """Save training data to JSONL file"""
        with open(self.output_path, 'w') as f:
            for item in self.data:
                f.write(json.dumps(item) + '\n')

        print(f"✅ Saved {len(self.data)} training examples to {self.output_path}")

    def load_existing(self):
        """Load existing training data"""
        if os.path.exists(self.output_path):
            with open(self.output_path, 'r') as f:
                self.data = [json.loads(line) for line in f]
            print(f"📥 Loaded {len(self.data)} existing examples")

    def stats(self):
        """Print statistics about the dataset"""
        print(f"\n📊 Dataset Statistics:")
        print(f"   Total examples: {len(self.data)}")

        # Count message types
        user_msgs = sum(
            sum(1 for msg in item['messages'] if msg['role'] == 'user')
            for item in self.data
        )
        assistant_msgs = sum(
            sum(1 for msg in item['messages'] if msg['role'] == 'assistant')
            for item in self.data
        )

        print(f"   User messages: {user_msgs}")
        print(f"   Assistant messages: {assistant_msgs}")

        # Average conversation length
        avg_length = sum(len(item['messages']) for item in self.data) / len(self.data) if self.data else 0
        print(f"   Average conversation length: {avg_length:.1f} messages")


# Example: Create starter dataset for HeySalad
def create_starter_dataset():
    """Create a starter training dataset for HeySalad"""

    collector = TrainingDataCollector()

    # System prompt for HeySalad
    SYSTEM_PROMPT = """You are HeySalad Assistant, an AI designed to help users automate workflows and complete tasks efficiently. You have access to multiple AI providers (OpenAI, Anthropic, Hugging Face) and can help with:
- Workflow automation
- API integration
- Code generation
- Business process optimization
- Data analysis

Be helpful, concise, and technical when appropriate."""

    # Example 1: HeySalad API usage
    collector.add_simple_qa(
        question="How do I use HeySalad AI in my Node.js application?",
        answer="""To use HeySalad AI in Node.js:

1. Install the package:
```bash
npm install @heysalad/ai
```

2. Import and configure:
```javascript
import { HeySaladAI } from '@heysalad/ai';

const client = new HeySaladAI();
client.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY
});
```

3. Send a chat request:
```javascript
const response = await client.chat({
  model: 'gpt-4',
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});
console.log(response.content);
```

That's it! HeySalad provides a unified interface across multiple AI providers.""",
        system_prompt=SYSTEM_PROMPT
    )

    # Example 2: Multi-provider usage
    collector.add_simple_qa(
        question="Can I switch between OpenAI and Anthropic easily?",
        answer="""Yes! HeySalad makes it easy to switch providers:

```javascript
// Configure both providers
client.configureProvider('openai', { apiKey: 'sk-...' });
client.configureProvider('anthropic', { apiKey: 'sk-ant-...' });

// Use OpenAI
const response1 = await client.chat({
  model: 'gpt-4',
  messages: [...]
}, 'openai');

// Use Anthropic
const response2 = await client.chat({
  model: 'claude-3-opus',
  messages: [...]
}, 'anthropic');
```

The API is identical - just specify the provider. You can also set a default provider and switch dynamically based on cost, availability, or performance.""",
        system_prompt=SYSTEM_PROMPT
    )

    # Example 3: Self-hosting
    collector.add_simple_qa(
        question="How can I run my own LLM instead of using APIs?",
        answer="""HeySalad supports self-hosted models! Here's how:

1. Deploy a model with vLLM on your server:
```bash
python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-2-7b-chat-hf \\
  --host 0.0.0.0 \\
  --port 8000
```

2. Configure HeySalad to use your endpoint:
```javascript
client.configureProvider('huggingface', {
  apiKey: 'not-needed',
  baseURL: 'http://your-server:8000/v1/models'
});
```

3. Use it like any other provider:
```javascript
const response = await client.chat({
  model: 'meta-llama/Llama-2-7b-chat-hf',
  messages: [...]
});
```

This can save 70-98% on costs for high-volume use cases!""",
        system_prompt=SYSTEM_PROMPT
    )

    # Example 4: Workflow automation
    collector.add_simple_qa(
        question="How do I automate a workflow with HeySalad?",
        answer="""HeySalad has built-in workflow actions. Here's an example:

```javascript
// Get the action registry
const actions = client.actions;

// Register a custom action
actions.register({
  type: 'custom',
  name: 'send-email',
  description: 'Send an email notification',
  execute: async (params) => {
    // Your email logic here
    await sendEmail(params.to, params.subject, params.body);
    return { success: true };
  }
});

// Use the action
const result = await actions.execute('send-email', {
  to: 'user@example.com',
  subject: 'Task Complete',
  body: 'Your workflow has finished!'
});
```

You can chain actions, use AI to generate content, and create complex automated workflows.""",
        system_prompt=SYSTEM_PROMPT
    )

    # Example 5: Grocery price use case
    collector.add_simple_qa(
        question="I want to build a grocery price comparison tool. What's the best approach with HeySalad?",
        answer="""For a grocery price comparison tool, I recommend using RAG (Retrieval Augmented Generation):

1. **Store prices in a database**:
```javascript
const prices = {
  'milk': { price: 3.49, store: 'Walmart', date: '2025-02-19' },
  'bread': { price: 2.99, store: 'Kroger', date: '2025-02-19' },
  // ...
};
```

2. **Use RAG to answer questions**:
```javascript
function searchPrices(query) {
  // Simple search (or use vector similarity)
  return Object.entries(prices)
    .filter(([item, data]) => query.includes(item))
    .map(([item, data]) => `${item}: $${data.price} at ${data.store}`);
}

async function answerPriceQuestion(question) {
  const context = searchPrices(question).join('\\n');

  const response = await client.chat({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: `Context: ${context}\\n\\nQuestion: ${question}`
    }]
  });

  return response.content;
}
```

This approach:
- No training needed
- Updates instantly when prices change
- Much cheaper than fine-tuning
- Works with any AI model

For more advanced features, you could fine-tune a small model (7B) for better price reasoning.""",
        system_prompt=SYSTEM_PROMPT
    )

    # Save dataset
    collector.save()
    collector.stats()

    print("\n✅ Starter dataset created!")
    print("📝 Next steps:")
    print("   1. Add more examples to data/training_data.jsonl")
    print("   2. Run: python train_heysalad.py")


if __name__ == "__main__":
    create_starter_dataset()
