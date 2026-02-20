#!/bin/bash

###############################################################################
# CheriML API Endpoints Test Script
# Tests all CheriML endpoints after deployment
###############################################################################

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BASE_URL="${1:-https://heysalad-ai.pages.dev}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         CheriML API Endpoints Test                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Testing API at: $BASE_URL${NC}"
echo ""

# Test 1: Health Check
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 1: Health Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/cheriml/health")
echo "$HEALTH_RESPONSE" | jq '.'

if echo "$HEALTH_RESPONSE" | jq -e '.status == "healthy"' > /dev/null; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
fi
echo ""

# Test 2: Generate Function
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 2: Generate Function (T1)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

FUNCTION_REQUEST='{
  "title": "Generate add function",
  "description": "Create a function that adds two numbers",
  "language": "typescript",
  "functionName": "add",
  "returnType": "number",
  "parameters": [
    {"name": "a", "type": "number"},
    {"name": "b", "type": "number"}
  ],
  "constraints": ["Must be a pure function"],
  "acceptanceCriteria": ["Returns sum of two numbers"]
}'

FUNCTION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cheriml/generate-function" \
  -H "Content-Type: application/json" \
  -d "$FUNCTION_REQUEST")

echo "$FUNCTION_RESPONSE" | jq '.output.code' -r
echo ""

if echo "$FUNCTION_RESPONSE" | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Function generation passed${NC}"
else
    echo -e "${RED}✗ Function generation failed${NC}"
    echo "$FUNCTION_RESPONSE" | jq '.'
fi
echo ""

# Test 3: Generate Component
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 3: Generate Component (T2)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

COMPONENT_REQUEST='{
  "title": "Generate Button component",
  "description": "Create a simple button component",
  "language": "typescript",
  "componentName": "Button",
  "framework": "react",
  "props": [
    {"name": "children", "type": "React.ReactNode", "required": true},
    {"name": "onClick", "type": "() => void", "required": false}
  ],
  "constraints": ["Use TypeScript"],
  "acceptanceCriteria": ["Renders children"]
}'

COMPONENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cheriml/generate-component" \
  -H "Content-Type: application/json" \
  -d "$COMPONENT_REQUEST")

echo "$COMPONENT_RESPONSE" | jq '.output.code' -r
echo ""

if echo "$COMPONENT_RESPONSE" | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Component generation passed${NC}"
else
    echo -e "${RED}✗ Component generation failed${NC}"
    echo "$COMPONENT_RESPONSE" | jq '.'
fi
echo ""

# Test 4: Generate Test
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 4: Generate Test Suite (T3)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

TEST_REQUEST='{
  "title": "Generate tests",
  "description": "Create test suite for add function",
  "language": "typescript",
  "code": "export function add(a: number, b: number) { return a + b; }",
  "targetFunction": "add",
  "testFramework": "vitest",
  "coverageTarget": 80,
  "constraints": ["Test edge cases"],
  "acceptanceCriteria": ["80% coverage"]
}'

TEST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cheriml/generate-test" \
  -H "Content-Type: application/json" \
  -d "$TEST_REQUEST")

echo "$TEST_RESPONSE" | jq '.output.code' -r
echo ""

if echo "$TEST_RESPONSE" | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Test generation passed${NC}"
else
    echo -e "${RED}✗ Test generation failed${NC}"
    echo "$TEST_RESPONSE" | jq '.'
fi
echo ""

# Test 5: Generate Endpoint
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 5: Generate API Endpoint (T4)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

ENDPOINT_REQUEST='{
  "title": "Generate GET endpoint",
  "description": "Create endpoint to get user by ID",
  "language": "typescript",
  "method": "GET",
  "path": "/api/users/:id",
  "authentication": "none",
  "constraints": ["Validate user ID"],
  "acceptanceCriteria": ["Returns user data"]
}'

ENDPOINT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cheriml/generate-endpoint" \
  -H "Content-Type: application/json" \
  -d "$ENDPOINT_REQUEST")

echo "$ENDPOINT_RESPONSE" | jq '.output.code' -r
echo ""

if echo "$ENDPOINT_RESPONSE" | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Endpoint generation passed${NC}"
else
    echo -e "${RED}✗ Endpoint generation failed${NC}"
    echo "$ENDPOINT_RESPONSE" | jq '.'
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}All CheriML endpoints tested!${NC}"
echo ""
echo "API URL: $BASE_URL"
echo ""
echo "Endpoints:"
echo "  GET  /api/cheriml/health"
echo "  POST /api/cheriml/generate-function"
echo "  POST /api/cheriml/generate-component"
echo "  POST /api/cheriml/generate-test"
echo "  POST /api/cheriml/generate-endpoint"
echo ""
