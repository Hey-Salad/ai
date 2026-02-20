#!/bin/bash

# HeySalad AI Database Setup Script
# This script creates and initializes the Cloudflare D1 database

echo "🥗 HeySalad AI Database Setup"
echo "=============================="
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Please install it first:"
    echo "   npm install -g wrangler"
    exit 1
fi

echo "📦 Creating D1 database..."
wrangler d1 create heysalad-ai-db

echo ""
echo "✅ Database created!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the database_id from the output above"
echo "2. Update wrangler.toml with the database_id"
echo "3. Run: wrangler d1 execute heysalad-ai-db --file=schema.sql"
echo "4. Set JWT secret: wrangler secret put JWT_SECRET"
echo "5. Deploy: npm run deploy"
echo ""
