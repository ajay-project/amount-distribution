#!/bin/bash

# Create a shareable zip file of the project
echo "📦 Creating distribution package..."

# Create zip file with only necessary files
zip -r amount-distribution-simulator.zip \
  src/ \
  public/ \
  package.json \
  vite.config.js \
  eslint.config.js \
  index.html \
  README.md \
  quick-start.sh \
  -x "node_modules/*" "dist/*" ".git/*" ".gitignore"

if [ $? -eq 0 ]; then
    echo "✅ Package created: amount-distribution-simulator.zip"
    echo ""
    echo "📊 Package contents:"
    unzip -l amount-distribution-simulator.zip | head -30
    echo ""
    echo "💾 Package size: $(du -h amount-distribution-simulator.zip | cut -f1)"
    echo ""
    echo "🚀 To share:"
    echo "1. Upload amount-distribution-simulator.zip"
    echo "2. Recipient extracts the zip"
    echo "3. Runs: chmod +x quick-start.sh && ./quick-start.sh"
    echo "4. Then: npm run dev"
else
    echo "❌ Failed to create package"
    exit 1
fi
