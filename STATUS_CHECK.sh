#!/bin/bash
# HeySalad AI - Status Check
# Verify everything is ready to use

echo "🔍 HeySalad AI - System Status Check"
echo "====================================="
echo ""

# Check directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from heysalad-ai directory"
    exit 1
fi

echo "✅ In correct directory: $(pwd)"
echo ""

# Check core package build
echo "📦 Checking packages..."
if [ -f "packages/core/dist/client.js" ]; then
    echo "  ✅ Core package built"
else
    echo "  ❌ Core package not built"
    exit 1
fi

if [ -f "packages/grocery-rag/dist/index.js" ]; then
    echo "  ✅ Grocery RAG package built"
else
    echo "  ❌ Grocery RAG package not built"
    exit 1
fi

echo ""

# Check scripts
echo "🔧 Checking scripts..."
if [ -f "quick-test.js" ]; then
    echo "  ✅ Quick test script available"
else
    echo "  ❌ Quick test script missing"
    exit 1
fi

if [ -f "GET_STARTED.sh" ] && [ -x "GET_STARTED.sh" ]; then
    echo "  ✅ Setup script ready"
else
    echo "  ❌ Setup script not executable"
    exit 1
fi

echo ""

# Check documentation
echo "📚 Checking documentation..."
docs=("QUICK_START.md" "CURRENT_STATUS.md" "DEPLOYMENT_MASTER_PLAN.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ⚠️  $doc missing"
    fi
done

echo ""

# Check deployment scripts
echo "🚀 Checking deployment scripts..."
scripts=("launch-gpu-instance.sh" "deploy-model-production.sh" "execute-all-tasks.sh")
for script in "${scripts[@]}"; do
    if [ -f "scripts/$script" ] && [ -x "scripts/$script" ]; then
        echo "  ✅ $script"
    else
        echo "  ⚠️  $script missing or not executable"
    fi
done

echo ""

# Check HF API key
echo "🔑 Checking environment..."
if [ -n "$HF_API_KEY" ]; then
    echo "  ✅ HF_API_KEY is set"
    echo ""
    echo "🎉 READY TO TEST!"
    echo ""
    echo "Run: node quick-test.js"
else
    echo "  ⚠️  HF_API_KEY not set"
    echo ""
    echo "📝 Next step: Get your Hugging Face API token"
    echo ""
    echo "1. Visit: https://huggingface.co"
    echo "2. Go to Settings → Access Tokens"
    echo "3. Create new token (Read permission)"
    echo "4. Run: export HF_API_KEY='your_token'"
    echo "5. Run: ./GET_STARTED.sh"
fi

echo ""
echo "====================================="
echo "System Status: ✅ Ready"
echo "====================================="
