#!/bin/bash
# Validate Complete HeySalad AI Platform Deployment
# Tests all components and provides health report

set -e

echo "🔍 HeySalad AI Platform Validation"
echo "===================================="
echo ""

PASSED=0
FAILED=0
WARNINGS=0

pass() {
    echo "✅ $1"
    ((PASSED++))
}

fail() {
    echo "❌ $1"
    ((FAILED++))
}

warn() {
    echo "⚠️  $1"
    ((WARNINGS++))
}

# Test 1: Check instance info
echo "📋 Test 1: Instance Configuration"
echo "-----------------------------------"
if [ -f "instance-info.txt" ]; then
    source instance-info.txt
    pass "Instance info found"
    echo "   Instance ID: $INSTANCE_ID"
    echo "   Public IP: $PUBLIC_IP"
    echo "   Region: $REGION"
else
    fail "Instance info not found (instance-info.txt missing)"
fi
echo ""

# Test 2: Check SSH connectivity
echo "🔌 Test 2: SSH Connectivity"
echo "-----------------------------------"
if ssh -i ~/.ssh/$KEY_NAME.pem -o ConnectTimeout=10 -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP 'echo "connected"' &>/dev/null; then
    pass "SSH connection successful"
else
    fail "Cannot SSH to instance"
fi
echo ""

# Test 3: Check GPU availability
echo "🎮 Test 3: GPU Availability"
echo "-----------------------------------"
GPU_CHECK=$(ssh -i ~/.ssh/$KEY_NAME.pem -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP 'nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null || echo "NONE"')
if [ "$GPU_CHECK" != "NONE" ]; then
    pass "GPU detected: $GPU_CHECK"
else
    warn "No GPU detected (training will be very slow)"
fi
echo ""

# Test 4: Check model service
echo "🤖 Test 4: Model Service Status"
echo "-----------------------------------"
SERVICE_STATUS=$(ssh -i ~/.ssh/$KEY_NAME.pem -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP 'systemctl is-active heysalad-model 2>/dev/null || echo "inactive"')
if [ "$SERVICE_STATUS" == "active" ]; then
    pass "Model service is running"
else
    fail "Model service is not running"
    echo "   Run: ssh ubuntu@$PUBLIC_IP 'sudo systemctl status heysalad-model'"
fi
echo ""

# Test 5: Check model endpoint
echo "🌐 Test 5: Model Endpoint Health"
echo "-----------------------------------"
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://$PUBLIC_IP:8000/health 2>/dev/null || echo "000")
if [ "$HEALTH_CHECK" == "200" ]; then
    pass "Model endpoint is healthy"
elif [ "$HEALTH_CHECK" == "000" ]; then
    warn "Model endpoint not reachable (may still be loading)"
else
    fail "Model endpoint returned error: $HEALTH_CHECK"
fi
echo ""

# Test 6: Test actual inference
echo "🧪 Test 6: Model Inference"
echo "-----------------------------------"
INFERENCE_TEST=$(curl -s -X POST http://$PUBLIC_IP:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{"model":"heysalad-7b","messages":[{"role":"user","content":"Hi"}],"max_tokens":10}' \
    --connect-timeout 30 2>/dev/null || echo "FAILED")

if [[ $INFERENCE_TEST == *"content"* ]]; then
    pass "Model inference working"
    echo "   Sample response: $(echo $INFERENCE_TEST | jq -r '.choices[0].message.content' 2>/dev/null | head -c 50)..."
else
    fail "Model inference failed"
    echo "   Response: $INFERENCE_TEST"
fi
echo ""

# Test 7: Check training artifacts
echo "📦 Test 7: Training Artifacts"
echo "-----------------------------------"
MODEL_EXISTS=$(ssh -i ~/.ssh/$KEY_NAME.pem -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP 'ls ~/heysalad-ai/model-training/heysalad-7b-*/adapter_model.bin 2>/dev/null | wc -l')
if [ "$MODEL_EXISTS" -gt "0" ]; then
    pass "Trained model found ($MODEL_EXISTS version(s))"
else
    warn "No trained model found yet"
fi
echo ""

# Test 8: Check logs
echo "📝 Test 8: System Logs"
echo "-----------------------------------"
ERROR_COUNT=$(ssh -i ~/.ssh/$KEY_NAME.pem -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP 'sudo journalctl -u heysalad-model --since "1 hour ago" 2>/dev/null | grep -i error | wc -l')
if [ "$ERROR_COUNT" -eq "0" ]; then
    pass "No errors in service logs"
else
    warn "$ERROR_COUNT errors found in logs"
    echo "   Check with: ssh ubuntu@$PUBLIC_IP 'sudo journalctl -u heysalad-model -n 50'"
fi
echo ""

# Test 9: Check disk space
echo "💾 Test 9: Disk Space"
echo "-----------------------------------"
DISK_USAGE=$(ssh -i ~/.ssh/$KEY_NAME.pem -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP 'df -h / | tail -1 | awk "{print \$5}" | sed "s/%//"')
if [ "$DISK_USAGE" -lt "80" ]; then
    pass "Sufficient disk space (${DISK_USAGE}% used)"
else
    warn "Disk usage high: ${DISK_USAGE}%"
fi
echo ""

# Test 10: Check Hugging Face publication
echo "🤗 Test 10: Hugging Face Publication"
echo "-----------------------------------"
if [ -n "$HF_TOKEN" ]; then
    HF_CHECK=$(curl -s "https://huggingface.co/api/models/heysalad/heysalad-7b" | jq -r '.id' 2>/dev/null || echo "NOT_FOUND")
    if [ "$HF_CHECK" == "heysalad/heysalad-7b" ]; then
        pass "Model published on Hugging Face"
        echo "   URL: https://huggingface.co/heysalad/heysalad-7b"
    else
        warn "Model not yet published on Hugging Face"
    fi
else
    warn "HF_TOKEN not set, cannot check publication"
fi
echo ""

# Test 11: Test HeySalad AI client integration
echo "💻 Test 11: HeySalad AI Client"
echo "-----------------------------------"
if [ -f "examples/complete-platform.ts" ]; then
    pass "Example code found"
    echo "   Test with: node examples/complete-platform.ts"
else
    warn "Example code not found"
fi
echo ""

# Test 12: Check AWS resources
echo "☁️  Test 12: AWS Resources"
echo "-----------------------------------"
if command -v aws &> /dev/null; then
    INSTANCE_STATE=$(aws ec2 describe-instances --region $REGION --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].State.Name' --output text 2>/dev/null || echo "unknown")
    if [ "$INSTANCE_STATE" == "running" ]; then
        pass "EC2 instance is running"
    else
        fail "EC2 instance state: $INSTANCE_STATE"
    fi
else
    warn "AWS CLI not available, cannot check instance state"
fi
echo ""

# Summary
echo "===================================="
echo "📊 Validation Summary"
echo "===================================="
echo ""
echo "✅ Passed:   $PASSED"
echo "❌ Failed:   $FAILED"
echo "⚠️  Warnings: $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All critical tests passed!"
    echo ""
    echo "🚀 Your platform is ready to use!"
    echo ""
    echo "Quick Test:"
    echo '  curl -X POST http://'"$PUBLIC_IP"':8000/v1/chat/completions \'
    echo '    -H "Content-Type: application/json" \'
    echo '    -d "{\"model\":\"heysalad-7b\",\"messages\":[{\"role\":\"user\",\"content\":\"What is HeySalad?\"}]}"'
    echo ""
    exit 0
else
    echo "❌ Some tests failed. Please review the output above."
    echo ""
    echo "Common issues:"
    echo "  - Model still loading (wait 5-10 minutes)"
    echo "  - Service not started (run: ssh ubuntu@$PUBLIC_IP 'sudo systemctl start heysalad-model')"
    echo "  - Port 8000 not accessible (check security group)"
    echo ""
    echo "Debug commands:"
    echo "  ssh ubuntu@$PUBLIC_IP 'sudo systemctl status heysalad-model'"
    echo "  ssh ubuntu@$PUBLIC_IP 'sudo journalctl -u heysalad-model -n 100'"
    echo "  ssh ubuntu@$PUBLIC_IP 'nvidia-smi'"
    echo ""
    exit 1
fi
