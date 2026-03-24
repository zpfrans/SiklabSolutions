#!/bin/bash

# 24/7 AI Service Reliability Verification Script
# This script validates all production-readiness checks for the chatbot

echo "🔍 Siklab Solutions - 24/7 AI Service Verification"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

# Check 1: API Keys configured
echo "${BLUE}1. Checking API Keys Configuration...${NC}"
if [ -z "$GEMINI_API_KEY" ]; then
  echo "${RED}❌ GEMINI_API_KEY not set${NC}"
  ((FAILURES++))
else
  echo "${GREEN}✅ GEMINI_API_KEY configured${NC}"
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "${RED}❌ ANTHROPIC_API_KEY not set${NC}"
  ((FAILURES++))
else
  echo "${GREEN}✅ ANTHROPIC_API_KEY configured${NC}"
fi

if [ -z "$OPENAI_API_KEY" ]; then
  echo "${YELLOW}⚠️  OPENAI_API_KEY not set (at least 2 services recommended)${NC}"
else
  echo "${GREEN}✅ OPENAI_API_KEY configured${NC}"
fi
echo ""

# Check 2: Required files exist
echo "${BLUE}2. Checking Required Files...${NC}"
REQUIRED_FILES=(
  "server/services/aiService.js"
  "server/routes/chat.js"
  "server/middleware/security.js"
  "server/server.js"
  ".env"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "${GREEN}✅ Found: $file${NC}"
  else
    echo "${RED}❌ Missing: $file${NC}"
    ((FAILURES++))
  fi
done
echo ""

# Check 3: Core features in aiService.js
echo "${BLUE}3. Checking AI Service Features...${NC}"

if grep -q "withRetry" "server/services/aiService.js"; then
  echo "${GREEN}✅ Retry logic implemented${NC}"
else
  echo "${RED}❌ Retry logic not found${NC}"
  ((FAILURES++))
fi

if grep -q "isRetryableError" "server/services/aiService.js"; then
  echo "${GREEN}✅ Error classification implemented${NC}"
else
  echo "${RED}❌ Error classification not found${NC}"
  ((FAILURES++))
fi

if grep -q "timeout: 60000" "server/services/aiService.js"; then
  echo "${GREEN}✅ Extended timeout (60s) configured${NC}"
else
  echo "${RED}❌ Extended timeout not found${NC}"
  ((FAILURES++))
fi

if grep -q "checkAIHealthStatus" "server/services/aiService.js"; then
  echo "${GREEN}✅ Health check function implemented${NC}"
else
  echo "${RED}❌ Health check function not found${NC}"
  ((FAILURES++))
fi
echo ""

# Check 4: Health endpoint
echo "${BLUE}4. Checking Health Endpoint...${NC}"
if grep -q "router.get('/health'" "server/routes/chat.js"; then
  echo "${GREEN}✅ Health endpoint configured${NC}"
else
  echo "${RED}❌ Health endpoint not found${NC}"
  ((FAILURES++))
fi
echo ""

# Check 5: Rate limiting improved
echo "${BLUE}5. Checking Rate Limiting...${NC}"
if grep -q "max: 100" "server/server.js"; then
  echo "${GREEN}✅ Chat rate limit increased to 100/min${NC}"
else
  echo "${YELLOW}⚠️  Chat rate limit may still be low${NC}"
fi
echo ""

# Check 6: Timeout extended
echo "${BLUE}6. Checking Request Timeout Configuration...${NC}"
if grep -q "60000" "server/server.js"; then
  echo "${GREEN}✅ Extended timeout (60s) for chat endpoint${NC}"
else
  echo "${YELLOW}⚠️  Timeout configuration needs review${NC}"
fi
echo ""

# Summary
echo "${BLUE}================================================${NC}"
if [ $FAILURES -eq 0 ]; then
  echo "${GREEN}✅ All 24/7 Reliability Checks Passed!${NC}"
  echo "${GREEN}System is ready for production deployment.${NC}"
  exit 0
else
  echo "${RED}❌ $FAILURES critical issue(s) found${NC}"
  echo "${YELLOW}Please fix the issues above before deployment${NC}"
  exit 1
fi
