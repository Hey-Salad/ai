#!/bin/bash
# HeySalad AI - Quick Start Script
# This script guides you through getting started

echo "🥗 HeySalad AI - Quick Start"
echo "=============================="
echo ""

# Check if HF_API_KEY is set
if [ -z "$HF_API_KEY" ]; then
    echo "❌ HF_API_KEY not set"
    echo ""
    echo "Follow these steps:"
    echo ""
    echo "1. Visit https://huggingface.co"
    echo "2. Sign up or log in"
    echo "3. Go to Settings → Access Tokens"
    echo "4. Create a new token (Read permission)"
    echo "5. Copy the token"
    echo ""
    echo "Then run:"
    echo "  export HF_API_KEY='your_token_here'"
    echo "  $0"
    echo ""
    exit 1
fi

echo "✅ HF_API_KEY is set"
echo ""

# Check if packages are built
if [ ! -d "packages/core/dist" ]; then
    echo "📦 Building packages..."
    npm run build --workspace=packages/core --workspace=packages/grocery-rag
    echo ""
fi

echo "🧪 Running tests..."
echo ""
node quick-test.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! Your HeySalad AI platform is ready!"
    echo ""
    echo "See QUICK_START.md for next steps"
fi
