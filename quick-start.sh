#!/bin/bash

# Amount Distribution Simulator - Quick Start Script
# This script helps you get started with the application

echo "🚀 Amount Distribution Simulator - Quick Start"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
    echo ""
    echo "🎯 Next steps:"
    echo "1. To start the development server, run: npm run dev"
    echo "2. To build for production, run: npm run build"
    echo "3. To preview production build, run: npm run preview"
    echo ""
    echo "📖 For more information, see README.md"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
