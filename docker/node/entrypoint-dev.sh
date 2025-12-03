#!/bin/sh
set -e

echo "🚀 Starting Nuxt development server..."

# Install dependencies if node_modules does not exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  # Use --legacy-peer-deps to handle Vite 7 vs Storybook peer dependency conflict
  npm install --legacy-peer-deps
fi

# Run Nuxt dev server
echo "🔥 Starting npm run dev..."
npm run dev
