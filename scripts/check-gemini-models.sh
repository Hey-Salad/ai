#!/bin/bash

# Check available Gemini models
# Usage: ./scripts/check-gemini-models.sh YOUR_API_KEY

API_KEY="${1:-$GEMINI_API_KEY}"

if [ -z "$API_KEY" ]; then
  echo "Error: API key required"
  echo "Usage: ./scripts/check-gemini-models.sh YOUR_API_KEY"
  echo "Or set GEMINI_API_KEY environment variable"
  exit 1
fi

echo "Fetching available Gemini models..."
echo ""

curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$API_KEY" | jq -r '.models[] | select(.name | contains("gemini")) | "\(.name) - \(.displayName)"'

echo ""
echo "Testing gemini-1.5-pro..."
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "role": "user",
      "parts": [{"text": "Say hello"}]
    }]
  }' | jq '.'
