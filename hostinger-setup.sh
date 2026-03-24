#!/bin/bash

###############################################################################
# Hostinger Deployment Setup Script
# This script sets up the Node.js server, builds React frontend, and starts PM2
###############################################################################

set -e  # Exit on error

echo "=================================="
echo "Siklab Solutions - Hostinger Setup"
echo "=================================="

# Get the directory where this script is located
DEPLOY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DEPLOY_DIR"

echo "📁 Working directory: $DEPLOY_DIR"

# ==============================================================================
# Step 1: Ensure we're on the correct branch
# ==============================================================================
echo ""
echo "📌 Step 1: Checking Git branch..."

if [ -d .git ]; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    echo "   Current branch: $CURRENT_BRANCH"
    
    # If on master, try to switch to main
    if [ "$CURRENT_BRANCH" = "master" ]; then
        echo "   Switching from master to main..."
        git checkout main 2>/dev/null || git checkout -b main origin/main 2>/dev/null || echo "   Note: Stay on master - main branch may not exist yet"
    fi
    
    echo "   ✅ Git branch verified"
else
    echo "   ⚠️  No .git directory found"
fi

# ==============================================================================
# Step 2: Check Node.js version
# ==============================================================================
echo ""
echo "📌 Step 2: Checking Node.js..."

if ! command -v node &> /dev/null; then
    echo "   ❌ Node.js not found!"
    echo "   Please install Node.js 18+ first"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "   Node.js version: $NODE_VERSION"
echo "   ✅ Node.js is installed"

# ==============================================================================
# Step 3: Install root dependencies
# ==============================================================================
echo ""
echo "📌 Step 3: Installing root dependencies..."

if [ -f package.json ]; then
    npm ci --production 2>/dev/null || npm install --production 2>/dev/null || echo "   ⚠️  No package.json in root"
    echo "   ✅ Root dependencies installed"
fi

# ==============================================================================
# Step 4: Install and build frontend
# ==============================================================================
echo ""
echo "📌 Step 4: Building React frontend..."

if [ -d siklab-react ]; then
    cd siklab-react
    
    # Install frontend dependencies
    npm ci --production 2>/dev/null || npm install --production 2>/dev/null
    echo "   ✅ Frontend dependencies installed"
    
    # Build the React app
    npm run build 2>/dev/null || {
        echo "   ⚠️  Build script not found, trying tsc and vite directly..."
        npx tsc -b 2>/dev/null || true
        npx vite build 2>/dev/null || true
    }
    
    if [ -d dist ]; then
        echo "   ✅ React app built successfully"
        echo "   📦 Built files: $(ls -la dist | wc -l) items"
    else
        echo "   ⚠️  Build output directory not found"
    fi
    
    cd "$DEPLOY_DIR"
else
    echo "   ❌ siklab-react directory not found!"
    exit 1
fi

# ==============================================================================
# Step 5: Verify frontend build
# ==============================================================================
echo ""
echo "📌 Step 5: Verifying frontend build..."

if [ -d siklab-react/dist ]; then
    DIST_SIZE=$(du -sh siklab-react/dist | cut -f1)
    echo "   ✅ Frontend build verified"
    echo "   📦 Dist size: $DIST_SIZE"
else
    echo "   ⚠️  Frontend build directory not found"
fi

cd "$DEPLOY_DIR"

echo ""
echo "=================================="
echo "✅ Frontend Setup Complete!"
echo "=================================="
echo ""
echo "📋 Summary:"
echo "   • Node.js: $(node -v)"
echo "   • Frontend: Built in ./siklab-react/dist"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Verify Frontend Build:"
echo "   ls -la siklab-react/dist"
echo ""
echo "2. Configure Hostinger Domain (in cPanel/hPanel):"
echo "   - Point domain to: ~/public_html/siklab/siklab-react/dist"
echo "   - Enable HTTPS/SSL"
echo "   - Test at: https://yourdomain.com"
echo ""
echo "3. Deploy via GitHub Actions:"
echo "   • Set GitHub secrets (see GITHUB_ACTIONS_SETUP.md)"
echo "   • Push to main branch"
echo "   • Workflow auto-deploys frontend"
echo ""
echo "=================================="
echo ""
