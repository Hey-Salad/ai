# HeySalad AI Scripts

This directory contains deployment scripts, test utilities, and automation tools for the HeySalad AI platform.

## 🚀 Quick Start

### Option 1: Execute Everything (Recommended)

Run the master script to execute all tasks:

```bash
chmod +x scripts/*.sh
./scripts/execute-all-tasks.sh
```

This will:
1. Launch GPU training instance (g5.xlarge)
2. Set up training environment
3. Collect training data
4. Train HeySalad-7B model
5. Deploy model to production
6. Publish to Hugging Face
7. Set up production infrastructure

**Time:** 4-6 hours (mostly training)
**Cost:** $170 one-time + $560/month

### Option 2: Execute Individual Tasks

Run scripts individually for more control:

```bash
# 1. Launch GPU instance
./scripts/launch-gpu-instance.sh

# 2. Deploy trained model
./scripts/deploy-model-production.sh /path/to/model

# 3. Publish to Hugging Face
cd model-training
python3 push_to_hub.py --model /path/to/model

# 4. Set up production infrastructure
./scripts/setup-production-infrastructure.sh

# 5. Validate everything
./scripts/validate-deployment.sh
```

## 🧪 Test Scripts

### Gemini API Tests
- `test-gemini-api.js` - Test all Gemini 3 models (3.1-pro, 3-flash, 3-pro)
- `test-gemini-flash.js` - Focused tests for Gemini Flash model
- `test-gemini-audio.js` - Test audio/multimodal capabilities
- `test-gemini-coding.js` - Test code completion and generation capabilities

### Platform Tests
- `quick-test.js` - Quick platform functionality test

**Usage:**
```bash
# Test Gemini coding capabilities
node scripts/test-gemini-coding.js

# Test all Gemini models
node scripts/test-gemini-api.js

# Quick platform test
node scripts/quick-test.js
```

## 🛠️ Setup Scripts

- `GET_STARTED.sh` - Quick start setup script
- `STATUS_CHECK.sh` - Check system status and health

## 📋 Deployment Scripts Overview

### launch-gpu-instance.sh

Launches and configures EC2 g5.xlarge instance for training.

**What it does:**
- Creates security group
- Launches g5.xlarge instance
- Configures networking
- Saves instance info

**Usage:**
```bash
./scripts/launch-gpu-instance.sh
```

**Output:**
- `instance-info.txt` - Instance details
- Public IP for SSH access

**Cost:** ~$1.50/hour ($500/month if 24/7)

### deploy-model-production.sh

Deploys trained model with vLLM, systemd, and optional HTTPS.

**What it does:**
- Installs vLLM
- Creates systemd service
- Starts model server
- Sets up Nginx reverse proxy (optional)
- Configures SSL with Let's Encrypt (optional)

**Usage:**
```bash
# Run on GPU instance
./deploy-model-production.sh /path/to/model [port] [domain]

# Examples:
./deploy-model-production.sh ./heysalad-7b-20250219 8000
./deploy-model-production.sh ./heysalad-7b-20250219 8000 model.heysalad.app
```

**Requirements:**
- Trained model directory
- vLLM installed
- Sudo access

### push_to_hub.py

Publishes model to Hugging Face Hub.

**What it does:**
- Creates repository on Hugging Face
- Generates comprehensive model card
- Uploads model files
- Sets up model page

**Usage:**
```bash
# Set token
export HF_TOKEN="your_huggingface_token"

# Push model
python3 model-training/push_to_hub.py \
  --model ./heysalad-7b-XXXXXXXX \
  --repo heysalad/heysalad-7b \
  --version v0.1.0 \
  --private  # or omit for public
```

**Time:** 10-30 minutes (upload time)

### setup-production-infrastructure.sh

Sets up AWS production infrastructure.

**What it does:**
- Creates CloudWatch dashboard
- Sets up alarms (CPU, errors)
- Creates launch template
- Sets up target group
- Creates application load balancer
- Configures auto-scaling (optional)

**Usage:**
```bash
# Set region
export AWS_REGION=eu-west-2

# Run script
./scripts/setup-production-infrastructure.sh
```

**Creates:**
- CloudWatch dashboard
- ALB with target group
- Launch template for auto-scaling
- Security groups
- Monitoring alarms

**Cost:** ~$20/month (ALB) + instance costs

### execute-all-tasks.sh

Master orchestration script that runs everything in order.

**What it does:**
1. Launches GPU instance
2. Installs dependencies
3. Collects training data
4. Trains model
5. Deploys to production
6. Publishes to Hugging Face
7. Sets up infrastructure

**Usage:**
```bash
./scripts/execute-all-tasks.sh
```

**Monitors:**
- Training progress
- Instance health
- Service status
- Creates deployment log

**Time:** 4-6 hours total

### validate-deployment.sh

Comprehensive validation of entire platform.

**What it does:**
- Tests SSH connectivity
- Checks GPU availability
- Validates model service
- Tests endpoint health
- Tests inference
- Checks disk space
- Validates HF publication
- Provides health report

**Usage:**
```bash
./scripts/validate-deployment.sh
```

**Output:**
```
✅ Passed:   10
❌ Failed:   0
⚠️  Warnings: 2
```

## 🔧 Prerequisites

### Required

- **AWS Account** with EC2 access
- **AWS CLI** configured (`aws configure`)
- **SSH key pair** (yumi-builder-2026.pem or similar)
- **Git** installed

### Optional

- **Hugging Face account** (for model publication)
- **Domain name** (for HTTPS setup)
- **HF_TOKEN** environment variable

## 🎯 Execution Order

### Full Deployment (4-6 hours)

```
Day 1:
09:00 - Launch instance (15 min)
09:15 - Setup environment (30 min)
09:45 - Collect training data (1 hour)
10:45 - Start training (2-4 hours) ← Wait here
14:45 - Deploy model (15 min)
15:00 - Publish to HF (30 min)
15:30 - Setup infrastructure (30 min)
16:00 - Validate deployment (10 min)
16:10 - DONE! 🎉
```

### Quick Start (1 hour)

```
Skip training, use HF API:
09:00 - Get HF API token
09:05 - Test examples/complete-platform.ts
09:10 - Deploy RAG system
09:30 - Launch to production
10:00 - DONE! 🎉
```

## 💰 Cost Breakdown

### One-Time Costs
```
EC2 setup & testing:          $20
Initial training (2-4 hours): $3-6
Failed experiments (2-3):     $10-20
DNS & SSL setup:              $20
-----------------------------------
Total One-Time:               ~$70
```

### Monthly Recurring
```
Single instance (MVP):
  - g5.xlarge (training): $500
  - Monitoring:           $30
  - Total:                $530/month

Production (3 instances):
  - 3x g5.xlarge:         $1,500
  - ALB:                  $20
  - Monitoring:           $50
  - Total:                $1,570/month
```

## 🐛 Troubleshooting

### Instance won't start

```bash
# Check instance state
aws ec2 describe-instances --instance-ids i-xxx

# Check security group
aws ec2 describe-security-groups --group-ids sg-xxx
```

### Can't SSH to instance

```bash
# Check key permissions
chmod 400 ~/.ssh/yumi-builder-2026.pem

# Test connectivity
ssh -vvv -i ~/.ssh/yumi-builder-2026.pem ubuntu@<ip>

# Check security group allows SSH (port 22)
```

### Model won't start

```bash
# SSH to instance
ssh -i ~/.ssh/yumi-builder-2026.pem ubuntu@<ip>

# Check service status
sudo systemctl status heysalad-model

# View logs
sudo journalctl -u heysalad-model -n 100

# Check GPU
nvidia-smi

# Restart service
sudo systemctl restart heysalad-model
```

### Training fails

```bash
# Check logs
ssh ubuntu@<ip> 'cat ~/heysalad-ai/model-training/training.log'

# Check GPU memory
ssh ubuntu@<ip> 'nvidia-smi'

# Check disk space
ssh ubuntu@<ip> 'df -h'
```

### Out of memory during training

Reduce batch size in `train_heysalad.py`:
```python
CONFIG = {
    "batch_size": 2,  # instead of 4
    "gradient_accumulation_steps": 8,  # instead of 4
}
```

### Model endpoint not responding

```bash
# Check if service is running
ssh ubuntu@<ip> 'sudo systemctl status heysalad-model'

# Check port 8000 is open
curl http://<ip>:8000/health

# Check security group allows port 8000
aws ec2 describe-security-groups
```

## 📊 Monitoring

### View CloudWatch Dashboard

```bash
# Get dashboard URL
echo "https://console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION#dashboards:name=heysalad-production"
```

### Check Instance Health

```bash
# CPU usage
ssh ubuntu@<ip> 'top -bn1 | head -20'

# GPU usage
ssh ubuntu@<ip> 'nvidia-smi'

# Disk usage
ssh ubuntu@<ip> 'df -h'

# Memory usage
ssh ubuntu@<ip> 'free -h'
```

### Monitor Service Logs

```bash
# Real-time logs
ssh ubuntu@<ip> 'sudo journalctl -u heysalad-model -f'

# Recent errors
ssh ubuntu@<ip> 'sudo journalctl -u heysalad-model | grep ERROR | tail -20'
```

## 🔄 Updates & Maintenance

### Deploy New Model Version

```bash
# Train new version
python train_heysalad.py

# Deploy with blue-green
./deploy-model-production.sh ./heysalad-7b-NEW 8001

# Test new version
curl http://<ip>:8001/v1/chat/completions -d '...'

# Switch traffic (update ALB target group port)

# Stop old version
sudo systemctl stop heysalad-model
```

### Update Training Data

```bash
# Add new examples to data/training_data.jsonl
# Retrain model
python train_heysalad.py

# Deploy new version
```

### Scale Infrastructure

```bash
# Launch additional instances
aws ec2 run-instances --launch-template LaunchTemplateName=heysalad-template --count 2

# Add to target group
aws elbv2 register-targets --target-group-arn <arn> --targets Id=<instance-id>
```

## 📞 Support

- **Documentation:** See `docs/` directory
- **Issues:** GitHub Issues
- **Email:** dev@heysalad.app

## ⚖️ License

MIT License - See LICENSE for details

---

**Ready to deploy? Run `./scripts/execute-all-tasks.sh` to get started!** 🚀
