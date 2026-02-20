#!/bin/bash

echo "Setting GEMINI_API_KEY for Cloudflare Pages..."
echo ""
echo "This will prompt you to enter your Gemini API key."
echo "The key will be securely stored in Cloudflare Pages secrets."
echo ""

cd packages/web
npx wrangler pages secret put GEMINI_API_KEY --project-name=heysalad-ai
