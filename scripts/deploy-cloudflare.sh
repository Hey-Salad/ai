#!/bin/bash

###############################################################################
# Cloudflare Pages Deployment Script
# Automated deployment for HeySalad AI to Cloudflare Pages
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="heysalad-ai"
WEB_DIR="packages/web"
BUILD_DIR="dist"

###############################################################################
# Helper Functions
###############################################################################

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

section() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

###############################################################################
# Pre-flight Checks
###############################################################################

section "Pre-flight Checks"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "Must run from project root directory"
    exit 1
fi
log_success "Running from project root"

# Check if web directory exists
if [ ! -d "$WEB_DIR" ]; then
    log_error "Web directory not found: $WEB_DIR"
    exit 1
fi
log_success "Web directory found"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed"
    exit 1
fi
log_success "Node.js installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed"
    exit 1
fi
log_success "npm installed: $(npm --version)"

# Check if wrangler is available
if ! command -v npx &> /dev/null; then
    log_error "npx is not available"
    exit 1
fi
log_success "npx available"

# Check Wrangler authentication
log_info "Checking Wrangler authentication..."
if ! npx wrangler whoami &> /dev/null; then
    log_warning "Not logged in to Wrangler"
    log_info "Running: npx wrangler login"
    npx wrangler login
else
    log_success "Wrangler authenticated"
fi

###############################################################################
# Environment Setup
###############################################################################

section "Environment Setup"

# Check for required secrets
log_info "Checking for required environment variables..."

REQUIRED_SECRETS=("GEMINI_API_KEY" "JWT_SECRET")
MISSING_SECRETS=()

for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! npx wrangler pages secret list --project-name="$PROJECT_NAME" 2>/dev/null | grep -q "$secret"; then
        MISSING_SECRETS+=("$secret")
    fi
done

if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
    log_warning "Missing required secrets:"
    for secret in "${MISSING_SECRETS[@]}"; do
        echo "  - $secret"
    done
    echo ""
    read -p "Would you like to set these secrets now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for secret in "${MISSING_SECRETS[@]}"; do
            log_info "Setting $secret..."
            npx wrangler pages secret put "$secret" --project-name="$PROJECT_NAME"
        done
    else
        log_error "Required secrets not set. Deployment may fail."
        exit 1
    fi
else
    log_success "All required secrets are set"
fi

###############################################################################
# Install Dependencies
###############################################################################

section "Installing Dependencies"

cd "$WEB_DIR"

log_info "Installing dependencies..."
npm install
log_success "Dependencies installed"

###############################################################################
# Run Tests
###############################################################################

section "Running Tests"

cd ../..  # Back to root

log_info "Running core package tests..."
if npm test -w packages/core; then
    log_success "All tests passed"
else
    log_warning "Some tests failed"
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Deployment cancelled"
        exit 1
    fi
fi

###############################################################################
# Build Project
###############################################################################

section "Building Project"

cd "$WEB_DIR"

log_info "Building web application..."
if npm run build; then
    log_success "Build completed successfully"
else
    log_error "Build failed"
    exit 1
fi

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    log_error "Build directory not found: $BUILD_DIR"
    exit 1
fi
log_success "Build directory created"

# Show build size
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
log_info "Build size: $BUILD_SIZE"

###############################################################################
# Deploy to Cloudflare
###############################################################################

section "Deploying to Cloudflare Pages"

log_info "Deploying to Cloudflare Pages..."
log_info "Project: $PROJECT_NAME"
log_info "Directory: $BUILD_DIR"

if npx wrangler pages deploy "$BUILD_DIR" --project-name="$PROJECT_NAME" --commit-dirty=true; then
    log_success "Deployment successful!"
else
    log_error "Deployment failed"
    exit 1
fi

###############################################################################
# Post-Deployment
###############################################################################

section "Post-Deployment"

# Get deployment URL
log_info "Fetching deployment URL..."
DEPLOYMENT_URL=$(npx wrangler pages deployment list --project-name="$PROJECT_NAME" 2>/dev/null | head -n 2 | tail -n 1 | awk '{print $4}')

if [ -n "$DEPLOYMENT_URL" ]; then
    log_success "Deployment URL: $DEPLOYMENT_URL"
else
    log_warning "Could not fetch deployment URL"
    log_info "Check: https://dash.cloudflare.com"
fi

# Show next steps
echo ""
log_info "Next steps:"
echo "  1. Visit your deployment: $DEPLOYMENT_URL"
echo "  2. Test the application"
echo "  3. Monitor in Cloudflare Dashboard"
echo "  4. Set up custom domain (if needed)"
echo ""

###############################################################################
# Summary
###############################################################################

section "Deployment Summary"

echo "✓ Pre-flight checks passed"
echo "✓ Dependencies installed"
echo "✓ Tests completed"
echo "✓ Build successful ($BUILD_SIZE)"
echo "✓ Deployed to Cloudflare Pages"
echo ""
log_success "Deployment completed successfully!"
echo ""
log_info "View your deployment:"
echo "  Dashboard: https://dash.cloudflare.com"
echo "  URL: $DEPLOYMENT_URL"
echo ""

exit 0
