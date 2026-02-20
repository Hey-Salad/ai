#!/bin/bash

###############################################################################
# Cloudflare Secrets Setup Script
# Interactive script to set up all required secrets for HeySalad AI
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_NAME="heysalad-ai"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     HeySalad AI - Cloudflare Secrets Setup                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if logged in
echo -e "${BLUE}Checking Wrangler authentication...${NC}"
if ! npx wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Wrangler${NC}"
    echo -e "${BLUE}Opening browser for authentication...${NC}"
    npx wrangler login
fi
echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# Function to set a secret
set_secret() {
    local secret_name=$1
    local description=$2
    local required=$3
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Setting: $secret_name${NC}"
    echo -e "${YELLOW}$description${NC}"
    echo ""
    
    # Check if already set
    if npx wrangler pages secret list --project-name="$PROJECT_NAME" 2>/dev/null | grep -q "$secret_name"; then
        echo -e "${GREEN}✓ Already set${NC}"
        read -p "Update this secret? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}Skipping...${NC}"
            echo ""
            return
        fi
    fi
    
    # Set the secret
    if [ "$required" = "true" ]; then
        echo -e "${RED}REQUIRED${NC}"
    else
        echo -e "${YELLOW}Optional${NC}"
        read -p "Set this secret? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}Skipping...${NC}"
            echo ""
            return
        fi
    fi
    
    npx wrangler pages secret put "$secret_name" --project-name="$PROJECT_NAME"
    echo -e "${GREEN}✓ Secret set successfully${NC}"
    echo ""
}

# Required secrets
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  REQUIRED SECRETS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

set_secret "GEMINI_API_KEY" \
    "Google Gemini API key for CheriML code generation
Get it at: https://makersuite.google.com/app/apikey" \
    "true"

set_secret "JWT_SECRET" \
    "Secret key for signing JWT tokens (use a strong random string)
Generate with: openssl rand -base64 32" \
    "true"

# Optional provider secrets
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  OPTIONAL AI PROVIDER SECRETS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

set_secret "OPENAI_API_KEY" \
    "OpenAI API key for GPT models
Get it at: https://platform.openai.com/api-keys" \
    "false"

set_secret "ANTHROPIC_API_KEY" \
    "Anthropic API key for Claude models
Get it at: https://console.anthropic.com/" \
    "false"

set_secret "HUGGINGFACE_API_KEY" \
    "HuggingFace API key for open source models
Get it at: https://huggingface.co/settings/tokens" \
    "false"

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}Secrets configured for project: $PROJECT_NAME${NC}"
echo ""
echo "To view all secrets:"
echo "  npx wrangler pages secret list --project-name=$PROJECT_NAME"
echo ""
echo "To update a secret:"
echo "  npx wrangler pages secret put SECRET_NAME --project-name=$PROJECT_NAME"
echo ""
echo "To delete a secret:"
echo "  npx wrangler pages secret delete SECRET_NAME --project-name=$PROJECT_NAME"
echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: ./scripts/deploy-cloudflare.sh"
echo "  2. Or manually: cd packages/web && npm run deploy"
echo ""
