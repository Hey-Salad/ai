# HeySalad AI - Quick Start Guide

**Test the platform in 5 minutes!** 🚀

## Step 1: Get Your Hugging Face API Token (2 minutes)

1. Visit **https://huggingface.co**
2. Click **Sign Up** (or **Log In** if you have an account)
3. Go to **Settings** → **Access Tokens**
4. Click **New token**
5. Give it a name like "HeySalad AI"
6. Select **Read** permission
7. Click **Generate**
8. **Copy the token** (starts with `hf_...`)

## Step 2: Set Up Environment (1 minute)

```bash
cd ~/heysalad-ai

# Set your HF API token
export HF_API_KEY="hf_your_token_here"

# Verify it's set
echo $HF_API_KEY
```

## Step 3: Run the Test (2 minutes)

```bash
# Run the quick test script
node quick-test.js
```

**Expected output:**
```
🚀 HeySalad AI - Quick Test
==================================================

✅ HF_API_KEY found

📦 Initializing HeySalad AI client...
✅ Hugging Face provider configured

🧪 Test 1: Simple Chat Completion
--------------------------------------------------
Sending: "What is HeySalad?"
Response: HeySalad is an AI-powered workflow automation platform...
✅ Test 1 passed

🧪 Test 2: Intelligent Router
--------------------------------------------------
Sending: "Tell me a short joke"
Response: Why did the AI go to therapy? Because it had too many layers...
✅ Test 2 passed

🎉 All Tests Passed!
```

## ✅ Success!

If you see "All Tests Passed!", your HeySalad AI platform is working!

## Next Steps

### Option A: Keep Testing with HF API (Immediate)

Use the platform right now with Hugging Face Inference API:

```javascript
const { HeySaladAI } = require('./packages/core/dist/client');

const client = new HeySaladAI();
client.configureProvider('huggingface', {
  apiKey: process.env.HF_API_KEY
});

const response = await client.chat({
  model: 'meta-llama/Llama-3.2-3B-Instruct',
  messages: [{ role: 'user', content: 'Your question here' }]
});

console.log(response.content);
```

**Cost:** $0.60 per 1M tokens (pay as you go)

### Option B: Deploy Custom Infrastructure (This Week)

Deploy your own HeySalad-7B model:

```bash
# Launch GPU instance
./scripts/launch-gpu-instance.sh

# Collect training data
cd model-training
python collect_training_data.py

# Train model
python train_heysalad.py

# Deploy to production
./scripts/deploy-model-production.sh
```

See `DEPLOYMENT_MASTER_PLAN.md` for detailed guide.

**Cost:** $560/month for full control

### Option C: Production Deployment (This Month)

Full production setup with auto-scaling:

```bash
# Execute everything
./scripts/execute-all-tasks.sh
```

See `DEPLOYMENT_MASTER_PLAN.md` for 30-day roadmap.

**Cost:** $1,730/month for production scale

## Available Models

With Hugging Face API, you can use:

- **Llama 3.2 3B Instruct** - Fast, efficient
- **Llama 3.1 8B** - Balanced performance
- **Mistral 7B** - Quality responses
- **GPT-OSS 120B** - Large model (slower but powerful)

Update the `model` parameter in your requests:

```javascript
const response = await client.chat({
  model: 'meta-llama/Llama-3.2-3B-Instruct',  // Change this
  messages: [...]
});
```

## Cost Comparison

| Provider | Cost per 1M tokens | Notes |
|----------|-------------------|-------|
| **HF API (what you're using)** | $0.60 | Pay per use, instant setup |
| **Self-hosted 7B** | $0.10 | $500/month fixed cost |
| **OpenAI GPT-3.5** | $2.00 | Industry standard |
| **OpenAI GPT-4** | $30.00 | Highest quality |

**You're already saving 97% vs GPT-4!** 🎉

## Troubleshooting

### Error: HF_API_KEY not set

```bash
# Make sure you exported the variable
export HF_API_KEY="hf_your_token"

# Verify it's set
echo $HF_API_KEY

# Run test again
node quick-test.js
```

### Error: Cannot find module

```bash
# Make sure packages are built
cd ~/heysalad-ai
npm run build --workspace=packages/core
npm run build --workspace=packages/grocery-rag

# Run test again
node quick-test.js
```

### Error: Invalid API token

- Check your token at https://huggingface.co/settings/tokens
- Make sure you copied the entire token (starts with `hf_`)
- Generate a new token if needed

### Error: Rate limit exceeded

- HF free tier has rate limits
- Wait 1 minute and try again
- Consider upgrading to HF Pro ($9/month for higher limits)

## Testing the RAG System

The RAG system for grocery prices is ready to use:

```javascript
const { GroceryRAG } = require('./packages/grocery-rag/dist/index');

const rag = new GroceryRAG(client);

// Load sample data
await rag.loadData([
  {
    id: '1',
    name: 'Whole Milk',
    price: 3.49,
    store: 'Walmart',
    category: 'Dairy',
    unit: 'gallon'
  },
  // ... more items
]);

// Query
const result = await rag.query('What is the cheapest milk?');
console.log(result.answer);
```

## Real-World Usage Example

```javascript
// Customer service bot
const bot = new HeySaladAI();
bot.configureProvider('huggingface', {
  apiKey: process.env.HF_API_KEY
});

async function handleCustomerQuestion(question) {
  const response = await bot.chat({
    model: 'meta-llama/Llama-3.2-3B-Instruct',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful customer service assistant.'
      },
      {
        role: 'user',
        content: question
      }
    ],
    temperature: 0.7,
    maxTokens: 200
  });

  return response.content;
}

// Use it
const answer = await handleCustomerQuestion(
  'How do I reset my password?'
);
console.log(answer);
```

## Monitoring Usage

Track your API usage at:
- https://huggingface.co/settings/billing

## Support

- **Documentation:** See `docs/` folder
- **Deployment:** See `DEPLOYMENT_MASTER_PLAN.md`
- **Issues:** Create an issue on GitHub
- **Questions:** Check `CURRENT_STATUS.md`

## What's Next?

1. ✅ **You're already using the AI platform!**
2. 📊 Monitor your usage on Hugging Face
3. 🎯 Decide if you want to deploy custom infrastructure
4. 🚀 Scale as needed

**Congratulations! You're now using HeySalad AI!** 🥗🎉

---

For production deployment, see:
- `DEPLOYMENT_MASTER_PLAN.md` - 30-day roadmap
- `CURRENT_STATUS.md` - Project status
- `docs/EC2_SETUP.md` - AWS infrastructure
- `docs/SELF_HOSTING.md` - Model deployment
