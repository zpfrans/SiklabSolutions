#!/bin/bash

# Siklab Solutions - Production Build & Deployment Script
# This script optimizes and prepares files for Hostinger deployment

echo "🚀 Starting optimized production build for Hostinger..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean previous builds
echo -e "${YELLOW}Step 1: Cleaning previous builds...${NC}"
rm -rf dist/
rm -rf build/
rm -rf server/node_modules/.cache

# Step 2: Install production dependencies only
echo -e "${YELLOW}Step 2: Installing optimized dependencies...${NC}"
npm install --production
npm audit fix --force

# Step 3: Type check and lint
echo -e "${YELLOW}Step 3: Running type checking and linting...${NC}"
npm run lint

# Step 4: Build optimized React bundle
echo -e "${YELLOW}Step 4: Building optimized React production bundle...${NC}"
npm run build

# Step 5: Generate size report
echo -e "${YELLOW}Step 5: Analyzing bundle size...${NC}"
echo "Frontend build size:" 
du -sh dist/

# Step 6: Move to deployment directory
echo -e "${YELLOW}Step 6: Preparing deployment files...${NC}"
mkdir -p deployment
cp -r dist deployment/
cp -r server deployment/
cp package.json deployment/
cp .env.example deployment/.env

# Step 7: Security check
echo -e "${YELLOW}Step 7: Running security audit...${NC}"
npm audit

# Step 8: Create deployment archive
echo -e "${YELLOW}Step 8: Creating deployment archive...${NC}"
tar -czf siklab-production.tar.gz deployment/

echo -e "${GREEN}✅ Build complete! Deployment files ready in:${NC}"
echo -e "${GREEN}   - Production build: ./dist${NC}"
echo -e "${GREEN}   - Archive: ./siklab-production.tar.gz${NC}"
echo -e "${GREEN}   - Deployment folder: ./deployment${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Download siklab-production.tar.gz"
echo "2. Upload to Hostinger via FTP"
echo "3. Extract: tar -xzf siklab-production.tar.gz"
echo "4. Configure .env file"
echo "5. Start server: npm start"
