#!/bin/bash

# Test Live CheriML API on Cloudflare Pages
# Usage: ./scripts/test-live-api.sh [base-url]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL (default to production)
BASE_URL="${1:-https://heysalad-ai.pages.dev}"

echo -e "${BLUE}🧪 Testing CheriML API at: ${BASE_URL}${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
echo "GET ${BASE_URL}/api/cheriml/health"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/cheriml/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Health check passed${NC}"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo -e "${RED}✗ Health check failed (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
  exit 1
fi

echo ""

# Test 2: Generate Function (T1)
echo -e "${YELLOW}Test 2: Generate Function (T1)${NC}"
echo "POST ${BASE_URL}/api/cheriml/generate-function"
FUNC_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/cheriml/generate-function" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Calculate factorial of a number",
    "language": "typescript"
  }')
HTTP_CODE=$(echo "$FUNC_RESPONSE" | tail -n1)
BODY=$(echo "$FUNC_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Generate function passed${NC}"
  echo "$BODY" | jq '.code' 2>/dev/null || echo "$BODY"
else
  echo -e "${RED}✗ Generate function failed (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
fi

echo ""

# Test 3: Generate Component (T2)
echo -e "${YELLOW}Test 3: Generate Component (T2)${NC}"
echo "POST ${BASE_URL}/api/cheriml/generate-component"
COMP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/cheriml/generate-component" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Loading spinner component",
    "framework": "react"
  }')
HTTP_CODE=$(echo "$COMP_RESPONSE" | tail -n1)
BODY=$(echo "$COMP_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Generate component passed${NC}"
  echo "$BODY" | jq '.code' 2>/dev/null || echo "$BODY"
else
  echo -e "${RED}✗ Generate component failed (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
fi

echo ""

# Test 4: Generate Test (T3)
echo -e "${YELLOW}Test 4: Generate Test (T3)${NC}"
echo "POST ${BASE_URL}/api/cheriml/generate-test"
TEST_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/cheriml/generate-test" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function multiply(a, b) { return a * b; }",
    "framework": "vitest"
  }')
HTTP_CODE=$(echo "$TEST_RESPONSE" | tail -n1)
BODY=$(echo "$TEST_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Generate test passed${NC}"
  echo "$BODY" | jq '.code' 2>/dev/null || echo "$BODY"
else
  echo -e "${RED}✗ Generate test failed (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
fi

echo ""

# Test 5: Generate Endpoint (T4)
echo -e "${YELLOW}Test 5: Generate Endpoint (T4)${NC}"
echo "POST ${BASE_URL}/api/cheriml/generate-endpoint"
ENDPOINT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/cheriml/generate-endpoint" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Get user profile by ID",
    "method": "GET",
    "framework": "express"
  }')
HTTP_CODE=$(echo "$ENDPOINT_RESPONSE" | tail -n1)
BODY=$(echo "$ENDPOINT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Generate endpoint passed${NC}"
  echo "$BODY" | jq '.code' 2>/dev/null || echo "$BODY"
else
  echo -e "${RED}✗ Generate endpoint failed (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
fi

echo ""
echo -e "${BLUE}🎉 API testing complete!${NC}"
