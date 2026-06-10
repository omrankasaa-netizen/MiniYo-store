#!/bin/bash
# ── Prepare Miniyo for Deployment ──
# Usage: bash scripts/prepare-deploy.sh

set -e

echo "=========================================="
echo "  Miniyo Deployment Preparation"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Run this from the project root."
    exit 1
fi

echo ""
echo "Step 1: Cleaning old builds..."
rm -rf dist/

echo ""
echo "Step 2: Installing dependencies..."
npm install

echo ""
echo "Step 3: Building application..."
npm run build

echo ""
echo "Step 4: Verifying build output..."
if [ ! -f "dist/boot.js" ]; then
    echo "Error: Backend build output (dist/boot.js) not found!"
    exit 1
fi
if [ ! -f "dist/public/index.html" ]; then
    echo "Error: Frontend build output (dist/public/index.html) not found!"
    exit 1
fi
echo "  Frontend: dist/public/index.html"
echo "  Backend:  dist/boot.js"

echo ""
echo "Step 5: Checking critical files..."
for file in "src/providers/trpc.tsx" "api/boot.ts" "db/schema.ts" "railway.json"; do
    if [ -f "$file" ]; then
        echo "  Found: $file"
    else
        echo "  MISSING: $file"
    fi
done

echo ""
echo "=========================================="
echo "  Build Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. For Railway: git push origin main"
echo "  2. For manual upload: zip the project folder"
echo ""
