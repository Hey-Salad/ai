# ⚠️ AWS GPU Instance Limit Issue

**Status:** Cannot launch g5.xlarge instance
**Reason:** Your AWS account has a vCPU limit of **0** for G-series (GPU) instances
**This is normal** for new AWS accounts or accounts that haven't used GPU instances before.

---

## 🚨 What Happened

When trying to launch the HeySalad training instance:

```
Instance Type: g5.xlarge (GPU instance for training)
Current Limit: 0 vCPUs (G-series)
Required: 4 vCPUs
Status: ❌ Blocked by AWS quota
```

Security group created: ✅ sg-0783dc7dbe0a5a0a5
SSH key imported: ✅ yumi-builder-2026
Network setup: ✅ VPC and subnet configured

**Only issue:** GPU instance quota

---

## 🎯 Your Options

### Option A: Request AWS Limit Increase (Recommended) 🎫

**Time:** 1-2 business days for AWS to approve
**Cost:** Free to request
**Result:** Can use GPU instances for training

**How to request:**

1. Visit: https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas
2. Search for: "Running On-Demand G and VT instances"
3. Click "Request quota increase"
4. Request value: **32 vCPUs** (allows up to 8x g5.xlarge instances)
5. Reason: "Training custom AI models for HeySalad platform"
6. Submit

**What AWS will ask:**
- Your use case (AI model training)
- Expected usage (periodic training runs)
- Why you need GPU instances

**AWS typically approves these requests within 24-48 hours.**

### Option B: Use HuggingFace API NOW (Immediate) ⚡

**Time:** 5 minutes
**Cost:** $0.60 per 1M tokens (pay as you go)
**Result:** Working AI platform today

```bash
cd ~/heysalad-ai

# Get token from huggingface.co
export HF_API_KEY="hf_your_token"

# Test immediately
./GET_STARTED.sh
```

**Then request the GPU limit increase in parallel.** When approved (1-2 days), train your custom model.

### Option C: Use Alternative AWS Instance Type

**Try p3.2xlarge or p2.xlarge** (older GPU instances, may have quota):

```bash
# Check p3 instance quota
aws service-quotas get-service-quota \
  --service-code ec2 \
  --quota-code L-417A185B \
  --region us-east-1

# If >0, use p3 instead of g5
```

However, p-series instances are typically also quota-limited for new accounts.

### Option D: Try Different AWS Region

Some regions have different quotas:

```bash
# Check other regions
for region in us-west-2 eu-west-1 ap-southeast-1; do
  echo "Region: $region"
  aws service-quotas get-service-quota \
    --service-code ec2 \
    --quota-code L-DB2E81BA \
    --region $region \
    --query 'Quota.Value' \
    --output text 2>/dev/null || echo "0"
done
```

---

## 💡 My Recommendation

**Do BOTH:**

1. **Start using HF API NOW** (Option B)
   - Takes 5 minutes
   - Zero infrastructure
   - Start building your application
   - Cost: ~$0.60 per 1M tokens

2. **Request GPU quota increase** (Option A)
   - Takes 2 minutes to submit
   - AWS approves in 1-2 days
   - Then train custom HeySalad-7B model
   - Cost: $500/month for unlimited usage

**This way you're productive immediately while waiting for quota approval.**

---

## 📋 Detailed Quota Request Instructions

### Step 1: Open AWS Service Quotas

Visit: https://us-east-1.console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-DB2E81BA

### Step 2: Request Increase

Click "Request quota increase"

### Step 3: Fill Out Form

**Quota value:** 32
(This allows 8x g5.xlarge instances = plenty of capacity)

**Use case description:**
```
We are training custom AI models for the HeySalad platform, an open-source
workflow automation system. We need GPU instances (g5.xlarge) for:

1. Training custom 7B parameter language models
2. Fine-tuning with LoRA (Low-Rank Adaptation)
3. Periodic retraining based on user feedback

Expected usage:
- 2-4 training runs per week
- 2-3 hours per training run
- Instances terminated after training completes

This is for production AI service development, not experimentation.
We expect to scale to multiple instances as our platform grows.
```

### Step 4: Submit

AWS will email you within 24-48 hours with approval.

---

## 🔄 What to Do While Waiting

### 1. Test with HuggingFace API (5 min)

```bash
cd ~/heysalad-ai
export HF_API_KEY="hf_your_token"
./GET_STARTED.sh
```

### 2. Prepare Training Data (1-2 hours)

```bash
cd ~/heysalad-ai/model-training
python3 collect_training_data.py
```

Generate 1,000-2,000 training examples:
- 500 HeySalad Q&A examples
- 300 API integration examples
- 200 workflow automation examples

### 3. Build Your Application

Start building your app with HF API while waiting for quota:

```javascript
const { HeySaladAI } = require('./packages/core/dist/client');

const client = new HeySaladAI();
client.configureProvider('huggingface', {
  apiKey: process.env.HF_API_KEY
});

// Start building!
const response = await client.chat({
  model: 'meta-llama/Llama-3.2-3B-Instruct',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### 4. Read Documentation

- `QUICK_START.md` - Setup guide
- `DEPLOYMENT_MASTER_PLAN.md` - Full roadmap
- `docs/FINE_TUNING.md` - Training guide

---

## 📊 Timeline

| Day | Activity | Status |
|-----|----------|--------|
| **Day 0 (Today)** | Request GPU quota | 📝 Submit request |
| **Day 0 (Today)** | Start using HF API | ✅ Works now! |
| **Day 0-1** | Prepare training data | 🔄 Can do now |
| **Day 1-2** | AWS reviews request | ⏳ Waiting |
| **Day 2** | AWS approves quota | ✅ Approved! |
| **Day 2** | Launch GPU instance | 🚀 Ready! |
| **Day 2** | Train HeySalad-7B | 🎯 2-3 hours |
| **Day 2** | Deploy to production | ✅ Live! |

**Total time from today to custom model:** 2-3 days
**(But you can use HF API starting today!)**

---

## 💰 Cost Comparison

| Option | Cost | When Available |
|--------|------|----------------|
| **HF API** | $0.60 per 1M tokens | **NOW** |
| **g5.xlarge training** | $5 per training run | After quota (2 days) |
| **g5.xlarge 24/7** | $500/month | After quota (2 days) |
| **OpenAI GPT-4** | $30 per 1M tokens | Now (but expensive!) |

---

## ✅ Next Steps

1. **Right now (5 minutes):**
   ```bash
   cd ~/heysalad-ai
   export HF_API_KEY="hf_your_token"
   ./GET_STARTED.sh
   ```

2. **Right now (5 minutes):**
   - Visit: https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/L-DB2E81BA
   - Request quota increase to 32 vCPUs
   - Submit request

3. **Today (1-2 hours):**
   ```bash
   cd ~/heysalad-ai/model-training
   python3 collect_training_data.py
   ```

4. **In 2 days (when approved):**
   ```bash
   cd ~/heysalad-ai
   ./scripts/execute-all-tasks.sh
   ```

---

## ❓ Questions?

**"How long does AWS take to approve?"**
→ Usually 24-48 hours for GPU quotas. Sometimes same day.

**"Can I use the platform before approval?"**
→ YES! Use HuggingFace API (works immediately, no quota needed)

**"Will I be charged while waiting?"**
→ NO! Security group is free. No instances running = $0 cost.

**"What if AWS denies the request?"**
→ Rare, but you can appeal or use HF API long-term (still 80% cheaper than GPT-4)

**"Do I need to keep instances running 24/7?"**
→ NO! Only run for training (2-3 hours), then terminate. Or use spot instances.

---

## 🎉 Bottom Line

**Where we are:**
- ✅ All code complete
- ✅ AWS account configured
- ✅ Security group created
- ✅ SSH key imported
- ⚠️ GPU quota = 0 (need increase)

**What to do:**
1. ✅ Request GPU quota (5 min)
2. ✅ Use HF API today (5 min)
3. ⏳ Wait 1-2 days for approval
4. 🚀 Train custom model

**You can be productive TODAY while waiting for AWS!**

---

**Status:** Not blocked, just need to request quota increase
