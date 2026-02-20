#!/bin/bash
# Execute All Remaining Tasks for HeySalad AI Platform
# This script orchestrates the complete deployment

set -e

echo "🚀 HeySalad AI - Complete Platform Deployment"
echo "=============================================="
echo ""
echo "This script will execute ALL remaining tasks:"
echo "  ✅ Launch GPU training instance"
echo "  ✅ Deploy model to production"
echo "  ✅ Publish to Hugging Face"
echo "  ✅ Set up production infrastructure"
echo ""
echo "⏱️  Estimated time: 4-6 hours (mostly training)"
echo "💰 Estimated cost: $170 one-time + $560/month"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 0
fi

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Task tracking
TASK_LOG="deployment-progress.log"
echo "$(date): Starting deployment" > $TASK_LOG

log_task() {
    echo "$(date): $1" | tee -a $TASK_LOG
}

# =============================================================================
# TASK 1: Launch GPU Training Instance
# =============================================================================
echo ""
echo "=========================================="
echo "TASK 1: Launch GPU Training Instance"
echo "=========================================="

log_task "Task 1: Starting GPU instance launch"

if [ ! -f "instance-info.txt" ]; then
    chmod +x scripts/launch-gpu-instance.sh
    ./scripts/launch-gpu-instance.sh

    log_task "Task 1: GPU instance launched successfully"

    # Wait for instance to be ready
    source instance-info.txt
    echo ""
    echo "⏳ Waiting 2 minutes for instance to fully boot..."
    sleep 120

    echo ""
    echo "📦 Copying setup script to instance..."
    scp -i ~/.ssh/$KEY_NAME.pem \
        -o StrictHostKeyChecking=no \
        model-training/setup_training_instance.sh \
        ubuntu@$PUBLIC_IP:~/

    echo "🔧 Running setup script on instance..."
    ssh -i ~/.ssh/$KEY_NAME.pem \
        -o StrictHostKeyChecking=no \
        ubuntu@$PUBLIC_IP \
        'chmod +x setup_training_instance.sh && ./setup_training_instance.sh'

    log_task "Task 1: Instance setup complete"
else
    echo "✅ Instance already launched (instance-info.txt exists)"
    source instance-info.txt
    log_task "Task 1: Using existing instance"
fi

# =============================================================================
# TASK 2: Collect Training Data & Train Model
# =============================================================================
echo ""
echo "=========================================="
echo "TASK 2: Training HeySalad-7B Model"
echo "=========================================="

log_task "Task 2: Starting model training"

echo "📊 Copying training files to instance..."
scp -i ~/.ssh/$KEY_NAME.pem \
    -o StrictHostKeyChecking=no \
    -r model-training/* ubuntu@$PUBLIC_IP:~/heysalad-ai/model-training/

echo "📝 Generating training data..."
ssh -i ~/.ssh/$KEY_NAME.pem \
    -o StrictHostKeyChecking=no \
    ubuntu@$PUBLIC_IP \
    'cd ~/heysalad-ai/model-training && python3 collect_training_data.py'

echo ""
echo "🏋️  Starting training..."
echo "⏱️  This will take 2-4 hours. You can monitor with:"
echo "    ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
echo "    watch -n 1 nvidia-smi"
echo ""

# Start training in background
ssh -i ~/.ssh/$KEY_NAME.pem \
    -o StrictHostKeyChecking=no \
    ubuntu@$PUBLIC_IP \
    'cd ~/heysalad-ai/model-training && nohup python3 train_heysalad.py > training.log 2>&1 &'

echo "✅ Training started in background"
log_task "Task 2: Training started"

# Wait for training to complete
echo "⏳ Waiting for training to complete..."
echo "   Checking every 5 minutes..."

while true; do
    TRAINING_STATUS=$(ssh -i ~/.ssh/$KEY_NAME.pem \
        -o StrictHostKeyChecking=no \
        ubuntu@$PUBLIC_IP \
        'pgrep -f "train_heysalad.py" > /dev/null && echo "RUNNING" || echo "DONE"')

    if [ "$TRAINING_STATUS" == "DONE" ]; then
        echo "✅ Training complete!"
        log_task "Task 2: Training completed"
        break
    else
        echo "   Still training... ($(date))"
        sleep 300  # Check every 5 minutes
    fi
done

# Get model path
MODEL_PATH=$(ssh -i ~/.ssh/$KEY_NAME.pem \
    -o StrictHostKeyChecking=no \
    ubuntu@$PUBLIC_IP \
    'ls -td ~/heysalad-ai/model-training/heysalad-7b-* 2>/dev/null | head -1 || echo ""')

if [ -z "$MODEL_PATH" ]; then
    echo "❌ No model found! Training may have failed."
    echo "   Check logs: ssh ubuntu@$PUBLIC_IP 'cat ~/heysalad-ai/model-training/training.log'"
    exit 1
fi

echo "✅ Model trained: $MODEL_PATH"

# =============================================================================
# TASK 3: Deploy Model to Production
# =============================================================================
echo ""
echo "=========================================="
echo "TASK 3: Deploy Model to Production"
echo "=========================================="

log_task "Task 3: Starting model deployment"

echo "📦 Copying deployment script..."
scp -i ~/.ssh/$KEY_NAME.pem \
    -o StrictHostKeyChecking=no \
    scripts/deploy-model-production.sh \
    ubuntu@$PUBLIC_IP:~/

echo "🚀 Deploying model..."
ssh -i ~/.ssh/$KEY_NAME.pem \
    -o StrictHostKeyChecking=no \
    ubuntu@$PUBLIC_IP \
    "chmod +x deploy-model-production.sh && ./deploy-model-production.sh $MODEL_PATH"

log_task "Task 3: Model deployed to production"

# =============================================================================
# TASK 4: Publish to Hugging Face
# =============================================================================
echo ""
echo "=========================================="
echo "TASK 4: Publish to Hugging Face"
echo "=========================================="

log_task "Task 4: Starting Hugging Face publication"

echo "🤗 Publishing model to Hugging Face..."

if [ -z "$HF_TOKEN" ]; then
    echo "⚠️  HF_TOKEN not set. Skipping Hugging Face publication."
    echo "   To publish later, run:"
    echo "   export HF_TOKEN=your_token"
    echo "   ssh ubuntu@$PUBLIC_IP 'cd ~/heysalad-ai/model-training && python3 push_to_hub.py --model $MODEL_PATH'"
    log_task "Task 4: Skipped (no HF_TOKEN)"
else
    ssh -i ~/.ssh/$KEY_NAME.pem \
        -o StrictHostKeyChecking=no \
        ubuntu@$PUBLIC_IP \
        "export HF_TOKEN=$HF_TOKEN && cd ~/heysalad-ai/model-training && python3 push_to_hub.py --model $MODEL_PATH --repo heysalad/heysalad-7b"

    log_task "Task 4: Published to Hugging Face"
fi

# =============================================================================
# TASK 5: Set Up Production Infrastructure
# =============================================================================
echo ""
echo "=========================================="
echo "TASK 5: Production Infrastructure"
echo "=========================================="

log_task "Task 5: Setting up production infrastructure"

chmod +x scripts/setup-production-infrastructure.sh
./scripts/setup-production-infrastructure.sh

log_task "Task 5: Production infrastructure setup complete"

# =============================================================================
# COMPLETION
# =============================================================================
echo ""
echo "=============================================="
echo "✅ ALL TASKS COMPLETED SUCCESSFULLY!"
echo "=============================================="
echo ""
echo "📊 Deployment Summary:"
echo ""
grep "Task" $TASK_LOG
echo ""
echo "🎉 Your HeySalad AI Platform is LIVE!"
echo ""
echo "🌐 Model Endpoint:"
echo "   http://$PUBLIC_IP:8000/v1/chat/completions"
echo ""
echo "🧪 Test Command:"
echo '   curl -X POST http://'"$PUBLIC_IP"':8000/v1/chat/completions \'
echo '     -H "Content-Type: application/json" \'
echo '     -d "{\"model\":\"heysalad-7b\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}"'
echo ""
echo "💻 Use in Code:"
echo "   import { HeySaladAI } from '@heysalad/ai';"
echo "   client.configureProvider('huggingface', {"
echo "     baseURL: 'http://$PUBLIC_IP:8000/v1/models'"
echo "   });"
echo ""
echo "📝 Next Steps:"
echo "   1. Test the deployed model"
echo "   2. Set up custom domain with HTTPS"
echo "   3. Configure monitoring alerts"
echo "   4. Load grocery data into RAG"
echo "   5. Deploy web dashboard"
echo "   6. Invite beta users"
echo ""
echo "💰 Monthly Costs:"
echo "   - Training instance: $500 (g5.xlarge 24/7)"
echo "   - Monitoring: $30"
echo "   - Total: ~$530/month"
echo ""
echo "📚 Documentation:"
echo "   - Deployment Plan: DEPLOYMENT_MASTER_PLAN.md"
echo "   - Model Strategy: docs/HEYSALAD_MODEL.md"
echo "   - Self-Hosting: docs/SELF_HOSTING.md"
echo ""
echo "🆘 Need Help?"
echo "   - Check logs: $TASK_LOG"
echo "   - SSH to instance: ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
echo "   - Contact: dev@heysalad.app"
echo ""
echo "🎊 Congratulations! You've built a complete AI platform!"
