#!/bin/sh
set -e

echo "🚀 Starting Nuxt development server..."

# Install dependencies if node_modules does not exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run Nuxt dev server
echo "🔥 Starting npm run dev..."
npm run dev
